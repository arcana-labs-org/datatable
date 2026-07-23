<script lang="ts">
  /**
   * Resolves `expandedRowRenderer` for one expanded row: sync results render
   * immediately; Promises show the (replaceable) loading state until they
   * settle. Re-runs whenever the row is expanded again, like React/Vue.
   */
  import { resolveArcanaMessages } from "../core/locale";
  import { expandedRowLoadingContent } from "../core/view";
  import type { DataTableApi, DataTableRow, Renderable } from "../core/types";
  import Content from "./Content.svelte";

  let { row, grid }: { row: DataTableRow; grid: DataTableApi } = $props();

  const msg = $derived(resolveArcanaMessages(grid.config));

  let detail = $state.raw<{ status: "loading" | "ready" | "error"; content?: Renderable }>({ status: "loading" });

  $effect(() => {
    let active = true;
    detail = { status: "loading" };
    try {
      const result = grid.config.expandedRowRenderer?.(row, grid);
      if (result && typeof (result as Promise<Renderable>).then === "function") {
        (result as Promise<Renderable>).then(
          (content) => { if (active) detail = { status: "ready", content }; },
          (error) => { console.error(error); if (active) detail = { status: "error" }; }
        );
      } else {
        detail = { status: "ready", content: result };
      }
    } catch (error) {
      console.error(error);
      detail = { status: "error" };
    }
    return () => { active = false; };
  });
</script>

{#if detail.status === "loading"}
  <Content value={grid.config.expandedRowLoadingRenderer?.(row, grid) ?? expandedRowLoadingContent(msg)} html />
{:else if detail.status === "error"}
  <div class="grid-detail-error">{msg.expandedError}</div>
{:else}
  <Content value={detail.content} html />
{/if}
