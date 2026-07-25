import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { FW_BADGE, type Framework } from "./DocsShell";

/* Framework logos (colored). Mirrors the flag set in LangSwitcher. */

function ReactLogo() {
  return <svg className="fw-logo" viewBox="-11.5 -10.23 23 20.46" aria-hidden="true">
    <circle r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>;
}

function VueLogo() {
  return <svg className="fw-logo" viewBox="0 0 256 221" aria-hidden="true">
    <path fill="#41b883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0Z" />
    <path fill="#41b883" d="m0 0 128 220.8L256 0h-51.2L128 132.48 50.56 0Z" />
    <path fill="#35495e" d="M50.56 0 128 133.12 204.8 0h-47.36L128 51.2 97.92 0Z" />
  </svg>;
}

function AngularLogo() {
  return <svg className="fw-logo" viewBox="0 0 250 250" aria-hidden="true">
    <path fill="#dd0031" d="M125 30 31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z" />
    <path fill="#c3002f" d="M125 30v200l78.9-43.7 14.2-123.1z" />
    <path fill="#fff" d="M125 52.1 66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2h21.7L125 52.1zm17 83.3h-34l17-40.9 17 40.9z" />
  </svg>;
}

function SvelteLogo() {
  return <svg className="fw-logo" viewBox="0 0 107 128" aria-hidden="true">
    <path fill="#ff3e00" d="M94.157 22.819c-10.4-14.885-30.94-19.297-45.792-9.835L22.282 29.608A29.92 29.92 0 0 0 8.764 49.65a31.5 31.5 0 0 0 3.108 20.231 30 30 0 0 0-4.477 11.183 31.9 31.9 0 0 0 5.448 24.116c10.402 14.887 30.942 19.297 45.791 9.835l26.083-16.624A29.92 29.92 0 0 0 98.235 78.35a31.53 31.53 0 0 0-3.105-20.232 30 30 0 0 0 4.474-11.182 31.88 31.88 0 0 0-5.447-24.116" />
    <path fill="#fff" d="M45.817 106.582a20.72 20.72 0 0 1-22.237-8.243 19.17 19.17 0 0 1-3.277-14.503 18 18 0 0 1 .624-2.435l.49-1.498 1.337.981a33.6 33.6 0 0 0 10.203 5.098l.97.294-.09.968a5.85 5.85 0 0 0 1.052 3.878 6.24 6.24 0 0 0 6.695 2.485 5.8 5.8 0 0 0 1.603-.704L69.27 76.28a5.43 5.43 0 0 0 2.45-3.631 5.8 5.8 0 0 0-.987-4.371 6.24 6.24 0 0 0-6.698-2.487 5.7 5.7 0 0 0-1.6.704l-9.953 6.345a19 19 0 0 1-5.296 2.326 20.72 20.72 0 0 1-22.237-8.243 19.17 19.17 0 0 1-3.277-14.502 17.99 17.99 0 0 1 8.13-12.052l26.081-16.623a19 19 0 0 1 5.3-2.329 20.72 20.72 0 0 1 22.237 8.243 19.17 19.17 0 0 1 3.277 14.503 18 18 0 0 1-.624 2.435l-.49 1.498-1.337-.98a33.6 33.6 0 0 0-10.203-5.1l-.97-.294.09-.968a5.86 5.86 0 0 0-1.052-3.878 6.24 6.24 0 0 0-6.696-2.485 5.8 5.8 0 0 0-1.602.704L37.73 51.72a5.42 5.42 0 0 0-2.449 3.63 5.79 5.79 0 0 0 .986 4.372 6.24 6.24 0 0 0 6.698 2.486 5.8 5.8 0 0 0 1.602-.704l9.952-6.342a19 19 0 0 1 5.295-2.328 20.72 20.72 0 0 1 22.237 8.242 19.17 19.17 0 0 1 3.277 14.503 18 18 0 0 1-8.13 12.053l-26.081 16.622a19 19 0 0 1-5.3 2.328" />
  </svg>;
}

const FW_ORDER: Framework[] = ["react", "vue", "angular", "svelte"];

const FW_LOGOS: Record<Framework, ComponentType> = {
  react: ReactLogo,
  vue: VueLogo,
  angular: AngularLogo,
  svelte: SvelteLogo
};

/**
 * Framework picker for the topbar — a dropdown that mirrors {@link LangSwitcher}
 * (same `lang-*` chrome), swapping the flag for the framework logo.
 */
export function FrameworkSwitcher({
  framework,
  setFramework,
  label
}: {
  framework: Framework;
  setFramework: (next: Framework) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>("[aria-selected='true']");
    (active ?? listRef.current?.querySelector<HTMLElement>("[role='option']"))?.focus();
  }, [open]);

  const choose = (next: Framework) => {
    setFramework(next);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const options = Array.from(listRef.current?.querySelectorAll<HTMLElement>("[role='option']") ?? []);
    const index = options.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      options[Math.min(index + 1, options.length - 1)]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      options[Math.max(index - 1, 0)]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      options[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      options[options.length - 1]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const ActiveLogo = FW_LOGOS[framework];

  return <div className="lang-switcher" ref={rootRef}>
    <button
      ref={buttonRef}
      type="button"
      className="lang-btn"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={`${id}-listbox`}
      aria-label={label}
      onClick={() => setOpen((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" && !open) {
          event.preventDefault();
          setOpen(true);
        } else if (event.key === "Escape" && open) {
          setOpen(false);
        }
      }}
    >
      <ActiveLogo />
      <span className="lang-code">{FW_BADGE[framework]}</span>
      <svg className="lang-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
    </button>
    {open ? <ul
      ref={listRef}
      id={`${id}-listbox`}
      className="lang-menu"
      role="listbox"
      aria-label={label}
      onKeyDown={onListKeyDown}
    >
      {FW_ORDER.map((code) => {
        const Logo = FW_LOGOS[code];
        return <li
          key={code}
          role="option"
          tabIndex={-1}
          aria-selected={code === framework}
          className={code === framework ? "lang-option is-active" : "lang-option"}
          onClick={() => choose(code)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(code);
            }
          }}
        >
          <Logo />
          <span className="lang-name">{FW_BADGE[code]}</span>
          {code === framework ? <svg className="lang-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 5" /></svg> : null}
        </li>;
      })}
    </ul> : null}
  </div>;
}
