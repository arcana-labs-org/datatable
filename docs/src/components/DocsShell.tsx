import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";
import { LangSwitcher } from "./LangSwitcher";
import { FrameworkSwitcher } from "./FrameworkSwitcher";
import { Playground } from "./Playground";
import { fmt, useLang } from "../i18n";
import arcanaLogo from "../assets/arcana-logo-light.png";

export type Framework = "react" | "vue" | "angular" | "svelte";

export interface SectionCode {
  file: string;
  code: string;
}

export interface DocsSection {
  id: string;
  title: string;
  body: ReactNode;
  preview?: ReactNode;
  previewLabel?: string;
  code: Record<Framework, SectionCode>;
}

export interface DocsGroup {
  label: string;
  sections: DocsSection[];
}

const FW_KEY = "arcana-docs-framework";
const GITHUB_URL = "https://github.com/arcana-labs-org/datatable";

const FRAMEWORKS: Framework[] = ["react", "vue", "angular", "svelte"];

export const FW_BADGE: Record<Framework, string> = {
  react: "React",
  vue: "Vue 3",
  angular: "Angular",
  svelte: "Svelte"
};

type DocsView = "docs" | "playground";

/** `#/playground` é a rota do playground; qualquer outro hash (âncoras de seção) é docs. */
function readView(): DocsView {
  return window.location.hash.startsWith("#/playground") ? "playground" : "docs";
}

function readStoredFramework(): Framework {
  try {
    const stored = localStorage.getItem(FW_KEY);
    return FRAMEWORKS.includes(stored as Framework) ? (stored as Framework) : "react";
  } catch {
    return "react";
  }
}

const STARS_KEY = "arcana-docs-stars";
const STARS_TTL = 6 * 60 * 60 * 1000; // 6h

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

/**
 * GitHub star count next to the topbar link. Cache-first: reads a cached
 * `{count, ts}` from localStorage and only calls the GitHub API when it's
 * stale (TTL 6h), so each visitor makes at most one request per window —
 * avoiding the unauthenticated 60 req/h/IP rate limit. Any failure keeps the
 * cached value (or renders nothing); the link itself never breaks.
 */
function GithubStars() {
  const { msg } = useLang();
  const [stars, setStars] = useState<number | null>(() => {
    try {
      const raw = localStorage.getItem(STARS_KEY);
      if (raw) { const parsed = JSON.parse(raw); if (typeof parsed.count === "number") return parsed.count; }
    } catch { /* ignore */ }
    return null;
  });

  useEffect(() => {
    let fresh = false;
    try {
      const raw = localStorage.getItem(STARS_KEY);
      if (raw) { const parsed = JSON.parse(raw); if (typeof parsed.ts === "number" && Date.now() - parsed.ts < STARS_TTL) fresh = true; }
    } catch { /* ignore */ }
    if (fresh) return;
    const controller = new AbortController();
    fetch("https://api.github.com/repos/arcana-labs-org/datatable", { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("gh"))))
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
          try { localStorage.setItem(STARS_KEY, JSON.stringify({ count: data.stargazers_count, ts: Date.now() })); } catch { /* ignore */ }
        }
      })
      .catch(() => { /* rate-limited/offline: keep the cached value, if any */ });
    return () => controller.abort();
  }, []);

  if (stars == null) return null;
  return <span className="gh-stars" aria-label={fmt(msg.shell.githubStars, { count: String(stars) })}>
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" /></svg>
    {formatStars(stars)}
  </span>;
}

function SectionWorkbench({ section, framework }: { section: DocsSection; framework: Framework }) {
  const { msg } = useLang();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const id = useId();
  const activeCode = section.code[framework];

  if (!section.preview) {
    return <div className="section-code-only">
      <div className="section-code-label">{msg.shell.codeOnlyLabel}</div>
      <CodeBlock key={`${section.id}-${framework}`} file={activeCode.file} code={activeCode.code} />
    </div>;
  }

  return <div className="section-workbench">
    <div className="section-workbench-header">
      <span className="section-preview-caption">{section.previewLabel ?? msg.shell.defaultPreviewCaption}</span>
      <div className="section-seg" role="tablist" aria-label={fmt(msg.shell.sectionExampleAria, { title: section.title })}>
        <button
          id={`${id}-preview-tab`}
          type="button"
          role="tab"
          aria-selected={tab === "preview"}
          aria-controls={`${id}-panel`}
          onClick={() => setTab("preview")}
        >
          <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
          {msg.shell.previewTab}
        </button>
        <button
          id={`${id}-code-tab`}
          type="button"
          role="tab"
          aria-selected={tab === "code"}
          aria-controls={`${id}-panel`}
          onClick={() => setTab("code")}
        >
          <svg className="seg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          {msg.shell.codeTab}
          <span className="seg-fw-badge">{FW_BADGE[framework]}</span>
        </button>
      </div>
    </div>
    <div id={`${id}-panel`} className={`section-panel section-panel--${tab}`} role="tabpanel" aria-labelledby={`${id}-${tab}-tab`}>
      {tab === "preview"
        ? <div className="section-preview-body">{section.preview}</div>
        : <CodeBlock key={`${section.id}-${framework}`} file={activeCode.file} code={activeCode.code} />}
    </div>
  </div>;
}

export function DocsShell({ groups }: { groups: DocsGroup[] }) {
  const { msg } = useLang();
  const allSections = useMemo(() => groups.flatMap((group) => group.sections), [groups]);
  const [framework, setFramework] = useState<Framework>(readStoredFramework);
  const [view, setView] = useState<DocsView>(readView);
  const [activeId, setActiveId] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    return allSections.some((section) => section.id === hash) ? hash : allSections[0]?.id ?? "";
  });
  const [navOpen, setNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Hash routing: `#/playground` ⇄ âncoras de seção; back/forward do browser funcionam.
  useEffect(() => {
    const onHashChange = () => {
      const nextView = readView();
      setView(nextView);
      setNavOpen(false);
      if (nextView === "docs") {
        const hash = window.location.hash.replace("#", "");
        if (allSections.some((section) => section.id === hash)) setActiveId(hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [allSections]);

  // Vindo do playground, a âncora do hash ainda não existia no DOM — rola após o render.
  useEffect(() => {
    if (view !== "docs") return;
    const hash = window.location.hash.replace("#", "");
    if (allSections.some((section) => section.id === hash)) document.getElementById(hash)?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem(FW_KEY, framework);
    } catch {
      /* modo privado */
    }
  }, [framework]);

  useEffect(() => {
    if (view !== "docs") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".doc-section"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, { rootMargin: "-80px 0px -62% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));

    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 8 && sections.length) {
        setActiveId(sections[sections.length - 1].id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [allSections, view]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase(msg.meta.locale);
  const visibleGroups = useMemo(() => {
    if (!normalizedQuery) return groups;
    return groups
      .map((group) => ({ ...group, sections: group.sections.filter((section) => section.title.toLocaleLowerCase(msg.meta.locale).includes(normalizedQuery)) }))
      .filter((group) => group.sections.length > 0);
  }, [groups, normalizedQuery, msg.meta.locale]);

  const closeNav = () => setNavOpen(false);

  return <>
    <header className="topbar">
      <button className="menu-btn" type="button" aria-label={navOpen ? (view === "playground" ? msg.shell.closeSettings : msg.shell.closeNav) : (view === "playground" ? msg.shell.openSettings : msg.shell.openNav)} aria-expanded={navOpen} aria-controls={view === "playground" ? "playground-panel" : "docs-sidebar"} onClick={() => setNavOpen((open) => !open)}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
      </button>
      <a className="brand" href="#instalacao">
        <img className="brand-logo" src={arcanaLogo} alt="Arcana" />
        <span className="brand-lib">DataTable</span>
      </a>
      <nav className="top-nav" aria-label={msg.shell.topNavAria}>
        <a className={view === "docs" ? "top-nav-link is-active" : "top-nav-link"} aria-current={view === "docs" ? "page" : undefined} href="#instalacao">{msg.shell.navDocs}</a>
        <a className={view === "playground" ? "top-nav-link is-active" : "top-nav-link"} aria-current={view === "playground" ? "page" : undefined} href="#/playground">{msg.shell.navPlayground}</a>
      </nav>
      {view === "docs" ? <div className="topbar-search" role="search">
        <input ref={searchRef} type="search" placeholder={msg.shell.searchPlaceholder} aria-label={msg.shell.searchAria} value={query} onChange={(event) => setQuery(event.target.value)} />
      </div> : null}
      <div className="topbar-right">
        <FrameworkSwitcher framework={framework} setFramework={setFramework} label={msg.shell.chooseFramework} />
        <LangSwitcher />
        <a className="gh-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
          <span>GitHub</span>
          <GithubStars />
        </a>
      </div>
    </header>

    {navOpen ? <button className="nav-scrim" type="button" aria-label={view === "playground" ? msg.shell.closeSettings : msg.shell.closeNav} onClick={closeNav} /> : null}

    {view === "playground" ? <Playground framework={framework} panelOpen={navOpen} /> : <div className="layout">
      <nav className={navOpen ? "sidebar is-open" : "sidebar"} id="docs-sidebar" aria-label={msg.shell.sidebarAria}>
        {visibleGroups.length === 0 ? <p className="nav-empty">{msg.shell.noSectionsFound}</p> : null}
        {visibleGroups.map((group) => <div className="nav-group" key={group.label}>
          <div className="nav-group-title">{group.label}</div>
          <ul>
            {group.sections.map((section) => <li key={section.id}>
              <a
                className={section.id === activeId ? "nav-link is-active" : "nav-link"}
                aria-current={section.id === activeId ? "true" : undefined}
                href={`#${section.id}`}
                onClick={() => { setActiveId(section.id); closeNav(); }}
              >{section.title}</a>
            </li>)}
          </ul>
        </div>)}
      </nav>

      <main className="content">
        <div className="content-inner">
          <div className="doc-kicker">{msg.shell.kicker}</div>
          <h1 className="doc-title">Arcana DataTable</h1>
          <p className="doc-lead">{msg.shell.lead}</p>

          {groups.map((group) => <div key={group.label}>
            <div className="group-divider">{group.label}</div>
            {group.sections.map((section) => <section className="doc-section" id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {section.body}
              <SectionWorkbench section={section} framework={framework} />
            </section>)}
          </div>)}

          <footer className="doc-footer">
            Arcana DataTable · MIT · <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">github.com/arcana-labs-org/datatable</a>
          </footer>
        </div>
      </main>

    </div>}
  </>;
}
