import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { LANG_ORDER, MESSAGES, useLang, type Lang } from "../i18n";

/* Simplified inline flag SVGs (no emoji — they don't render everywhere).
   Rectangles with the essential colors/elements of each flag. */

const STAR_POINTS = "0,-1 0.235,-0.324 0.951,-0.309 0.38,0.124 0.588,0.809 0,0.4 -0.588,0.809 -0.38,0.124 -0.951,-0.309 -0.235,-0.324";

function FlagUS() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#fff" />
    {[0, 2, 4, 6].map((y) => <rect key={y} y={y * 16 / 7} width="24" height={16 / 7} fill="#b22234" />)}
    <rect width="10" height={16 * 4 / 7} fill="#3c3b6e" />
  </svg>;
}

function FlagBR() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#009c3b" />
    <polygon points="12,1.8 22,8 12,14.2 2,8" fill="#ffdf00" />
    <circle cx="12" cy="8" r="4" fill="#002776" />
  </svg>;
}

function FlagES() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#aa151b" />
    <rect y="4" width="24" height="8" fill="#f1bf00" />
  </svg>;
}

function FlagIT() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="8" height="16" fill="#009246" />
    <rect x="8" width="8" height="16" fill="#fff" />
    <rect x="16" width="8" height="16" fill="#ce2b37" />
  </svg>;
}

function FlagCN() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#de2910" />
    <g fill="#ffde00">
      <g transform="translate(4.5,4.5) scale(2.4)"><polygon points={STAR_POINTS} /></g>
      <g transform="translate(9,1.8) scale(0.8)"><polygon points={STAR_POINTS} /></g>
      <g transform="translate(10.5,3.9) scale(0.8)"><polygon points={STAR_POINTS} /></g>
      <g transform="translate(10.5,6.3) scale(0.8)"><polygon points={STAR_POINTS} /></g>
      <g transform="translate(9,8.2) scale(0.8)"><polygon points={STAR_POINTS} /></g>
    </g>
  </svg>;
}

function FlagJP() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="16" fill="#fff" />
    <circle cx="12" cy="8" r="4.6" fill="#bc002d" />
  </svg>;
}

function FlagDE() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="5.33" fill="#000" />
    <rect y="5.33" width="24" height="5.34" fill="#dd0000" />
    <rect y="10.67" width="24" height="5.33" fill="#ffce00" />
  </svg>;
}

function FlagRU() {
  return <svg className="lang-flag" viewBox="0 0 24 16" aria-hidden="true">
    <rect width="24" height="5.33" fill="#fff" />
    <rect y="5.33" width="24" height="5.34" fill="#0039a6" />
    <rect y="10.67" width="24" height="5.33" fill="#d52b1e" />
  </svg>;
}

const FLAGS: Record<Lang, ComponentType> = {
  en: FlagUS,
  "pt-BR": FlagBR,
  es: FlagES,
  it: FlagIT,
  zh: FlagCN,
  ja: FlagJP,
  de: FlagDE,
  ru: FlagRU
};

const LANG_CODE: Record<Lang, string> = {
  en: "EN",
  "pt-BR": "PT-BR",
  es: "ES",
  it: "IT",
  zh: "ZH",
  ja: "JA",
  de: "DE",
  ru: "RU"
};

export function LangSwitcher() {
  const { lang, msg, setLang } = useLang();
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

  // Focus the active option when the listbox opens.
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>("[aria-selected='true']");
    (active ?? listRef.current?.querySelector<HTMLElement>("[role='option']"))?.focus();
  }, [open]);

  const choose = (next: Lang) => {
    setLang(next);
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

  const ActiveFlag = FLAGS[lang];

  return <div className="lang-switcher" ref={rootRef}>
    <button
      ref={buttonRef}
      type="button"
      className="lang-btn"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={`${id}-listbox`}
      aria-label={msg.shell.chooseLanguage}
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
      <ActiveFlag />
      <span className="lang-code">{LANG_CODE[lang]}</span>
      <svg className="lang-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
    </button>
    {open ? <ul
      ref={listRef}
      id={`${id}-listbox`}
      className="lang-menu"
      role="listbox"
      aria-label={msg.shell.chooseLanguage}
      onKeyDown={onListKeyDown}
    >
      {LANG_ORDER.map((code) => {
        const Flag = FLAGS[code];
        return <li
          key={code}
          role="option"
          tabIndex={-1}
          aria-selected={code === lang}
          className={code === lang ? "lang-option is-active" : "lang-option"}
          onClick={() => choose(code)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(code);
            }
          }}
        >
          <Flag />
          <span className="lang-name">{MESSAGES[code].langName}</span>
          {code === lang ? <svg className="lang-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5l3.5 3.5L13 5" /></svg> : null}
        </li>;
      })}
    </ul> : null}
  </div>;
}
