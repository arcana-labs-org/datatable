import type { DataTableApi, DataTableColumn, DataTableRow } from "./types";
import { computeLiveReorderTarget, type HeaderRect } from "./view";

/**
 * Shared column drag-reorder session (AG Grid-style), used by all four
 * adapters so the gesture behaves identically everywhere:
 *
 * - a floating ghost chip (`.arcana-drag-ghost`, portaled to `<body>`)
 *   follows the pointer while the source header keeps `.arcana-col-dragging`;
 * - the order changes LIVE: crossing a neighbour's midpoint applies
 *   `moveColumn` immediately (body cells follow), the column's own gap is the
 *   drop indicator — there is no drop line anymore;
 * - displaced headers animate with a FLIP transition
 *   (`.arcana-header-flip`, ~150ms ease-out; disabled under
 *   `prefers-reduced-motion`);
 * - Escape cancels the gesture and restores the order it started with;
 * - dragging near the horizontal edges of the scroll container auto-scrolls.
 *
 * The target computation respects pin groups: only headers with the same pin
 * ("left" / "right" / none) as the dragged column are reorder candidates, so
 * an unpinned column can never land inside a frozen group.
 */

/** Pixels the pointer must travel before a header drag starts. */
const DRAG_THRESHOLD = 5;
/** Extra pixels past a neighbour midpoint before a live move fires. */
const MOVE_HYSTERESIS = 8;
/** Cooldown between live moves so the FLIP transition settles first (ms). */
const MOVE_COOLDOWN = 160;
/** Keep in sync with the `.arcana-header-flip` transition duration. */
const FLIP_DURATION = 150;
/** Distance from the container edge that triggers auto-scroll (px). */
const AUTO_SCROLL_ZONE = 48;
const AUTO_SCROLL_MAX_STEP = 18;
/** Ghost offset from the pointer, so the chip never sits under the cursor. */
const GHOST_OFFSET_X = 12;
const GHOST_OFFSET_Y = 14;

/** Adapter-side hooks: state the session cannot own (classes, click guard). */
export interface ColumnDragHost {
  /** Theme class repeated on the body-portaled ghost so tokens resolve. */
  ghostClassName?: string;
  /** Adapter applies/removes `.arcana-col-dragging` on the named column. */
  setDraggingColumn(name: string | null): void;
  /** A real drag happened — adapters suppress the click-after-drag. */
  markDidDrag(): void;
}

/**
 * Starts a drag session from a header `pointerdown`. The caller has already
 * checked `isColumnReorderable` and the mouse button; everything else —
 * threshold, ghost, live moves, FLIP, Escape, auto-scroll, cleanup — is
 * handled here.
 */
export function startColumnDrag<Row extends DataTableRow>(
  event: { clientX: number; clientY: number },
  column: DataTableColumn<Row>,
  grid: DataTableApi<Row>,
  headerEl: HTMLElement,
  host: ColumnDragHost
): void {
  const headerRow = headerEl.closest<HTMLElement>(".grid-header");
  if (!headerRow) return;
  const scroller = headerEl.closest<HTMLElement>(".arcana-grid-body");
  const initialOrder = grid.getColumns().map((item) => item.name);
  const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startX = event.clientX;
  const startY = event.clientY;
  let lastX = startX;
  let lastY = startY;
  let dragging = false;
  let ghost: HTMLElement | null = null;
  let lockUntil = 0;
  let scrollRaf = 0;

  const headerCells = () => Array.from(headerRow.querySelectorAll<HTMLElement>(".grid-header-cell[data-col-name]"));

  /** Rects of the dragged column's pin group, in visual order. */
  const groupRects = (): HeaderRect[] => {
    const pin = grid.getColumnPin(column.name);
    const rects: HeaderRect[] = [];
    for (const cell of headerCells()) {
      const name = cell.getAttribute("data-col-name");
      if (!name || grid.getColumnPin(name) !== pin) continue;
      const rect = cell.getBoundingClientRect();
      rects.push({ name, left: rect.left, width: rect.width });
    }
    return rects;
  };

  const captureLefts = (): Map<string, number> => {
    const lefts = new Map<string, number>();
    for (const cell of headerCells()) {
      const name = cell.getAttribute("data-col-name");
      if (name) lefts.set(name, cell.getBoundingClientRect().left);
    }
    return lefts;
  };

  /**
   * FLIP on the header row only (body cells snap along — animating every row
   * would be too costly): positions measured before the move are replayed as
   * an inverse transform that transitions back to zero.
   *
   * The adapter commits the reorder to the DOM asynchronously (React schedules
   * a render, Angular a change-detection pass, …), so a single `rAF` can fire
   * *before* the new layout exists — then every delta is 0 and nothing
   * animates. We instead poll for a few frames until the headers have actually
   * moved, and only then play the FLIP; this makes the timing framework-proof.
   */
  const animateShift = (before: Map<string, number>): void => {
    let frames = 0;
    const play = (): void => {
      frames += 1;
      const moves: Array<{ cell: HTMLElement; delta: number }> = [];
      for (const cell of headerCells()) {
        const name = cell.getAttribute("data-col-name");
        if (!name || name === column.name) continue;
        const previous = before.get(name);
        if (previous == null) continue;
        const delta = previous - cell.getBoundingClientRect().left;
        if (Math.abs(delta) >= 1) moves.push({ cell, delta });
      }
      // Nothing shifted yet → the framework hasn't committed; try next frame.
      if (!moves.length) { if (frames < 8) requestAnimationFrame(play); return; }
      for (const { cell, delta } of moves) {
        // Prefer the Web Animations API (self-clearing, immune to the adapter
        // re-rendering the cell's inline style mid-transition); fall back to a
        // CSS transition where WAAPI is unavailable.
        if (typeof cell.animate === "function") {
          cell.classList.add("arcana-header-flip");
          const animation = cell.animate(
            [{ transform: `translateX(${delta}px)` }, { transform: "translateX(0)" }],
            { duration: FLIP_DURATION, easing: "ease-out" }
          );
          const done = () => cell.classList.remove("arcana-header-flip");
          animation.addEventListener?.("finish", done);
          animation.addEventListener?.("cancel", done);
          window.setTimeout(done, FLIP_DURATION + 100);
        } else {
          cell.classList.remove("arcana-header-flip");
          cell.style.transition = "none";
          cell.style.transform = `translateX(${delta}px)`;
          void cell.getBoundingClientRect(); // reflow so the inverse position sticks
          cell.classList.add("arcana-header-flip");
          cell.style.transition = "";
          cell.style.transform = "";
          window.setTimeout(() => { cell.classList.remove("arcana-header-flip"); cell.style.transition = ""; }, FLIP_DURATION + 100);
        }
      }
    };
    requestAnimationFrame(play);
  };

  const applyOrderChange = (apply: () => void): void => {
    const before = reducedMotion ? null : captureLefts();
    apply();
    if (before) animateShift(before);
  };

  const positionGhost = (): void => {
    if (ghost) ghost.style.transform = `translate3d(${lastX + GHOST_OFFSET_X}px, ${lastY + GHOST_OFFSET_Y}px, 0)`;
  };

  const createGhost = (): void => {
    ghost = document.createElement("div");
    ghost.className = `arcana-drag-ghost${host.ghostClassName ? ` ${host.ghostClassName}` : ""}`;
    ghost.setAttribute("aria-hidden", "true");
    const chip = document.createElement("span");
    chip.className = "arcana-drag-ghost__chip";
    chip.textContent = column.label ?? column.name;
    ghost.appendChild(chip);
    document.body.appendChild(ghost);
    positionGhost();
  };

  /** Nudges the scroll container while the pointer hovers near its edges. */
  const startAutoScroll = (): void => {
    if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
    const step = (): void => {
      const rect = scroller.getBoundingClientRect();
      let delta = 0;
      if (lastX < rect.left + AUTO_SCROLL_ZONE) delta = -Math.min(AUTO_SCROLL_MAX_STEP, Math.ceil((rect.left + AUTO_SCROLL_ZONE - lastX) / 4));
      else if (lastX > rect.right - AUTO_SCROLL_ZONE) delta = Math.min(AUTO_SCROLL_MAX_STEP, Math.ceil((lastX - (rect.right - AUTO_SCROLL_ZONE)) / 4));
      if (delta) scroller.scrollLeft += delta;
      scrollRaf = requestAnimationFrame(step);
    };
    scrollRaf = requestAnimationFrame(step);
  };

  const teardown = (): void => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("keydown", onKey);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    scrollRaf = 0;
    ghost?.remove();
    ghost = null;
    if (dragging) host.setDraggingColumn(null);
  };

  const onMove = (move: PointerEvent): void => {
    lastX = move.clientX;
    lastY = move.clientY;
    if (!dragging) {
      if (Math.abs(lastX - startX) < DRAG_THRESHOLD && Math.abs(lastY - startY) < DRAG_THRESHOLD) return;
      dragging = true;
      host.setDraggingColumn(column.name);
      createGhost();
      startAutoScroll();
    }
    positionGhost();
    const now = Date.now();
    if (now < lockUntil) return; // let the previous FLIP settle (anti-flicker)
    const target = computeLiveReorderTarget(lastX, column.name, groupRects(), MOVE_HYSTERESIS);
    if (!target) return;
    lockUntil = now + (reducedMotion ? 0 : MOVE_COOLDOWN);
    applyOrderChange(() => grid.moveColumn(column.name, target.target, target.position));
  };

  const onUp = (): void => {
    const moved = dragging;
    teardown();
    if (moved) host.markDidDrag();
  };

  const onKey = (key: KeyboardEvent): void => {
    if (key.key !== "Escape" || !dragging) return;
    applyOrderChange(() => grid.setColumnOrder(initialOrder));
    teardown();
    // The pointer is still down: swallow the click that follows its release.
    window.addEventListener("pointerup", () => host.markDidDrag(), { once: true });
  };

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("keydown", onKey);
}
