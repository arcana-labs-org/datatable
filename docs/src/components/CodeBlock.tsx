import { useState, type ReactNode } from "react";
import { useLang } from "../i18n";

const TOKEN_RE = /(\/\/[^\n]*|<!--[\s\S]*?-->)|(#[^\n]*)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")|(\b(?:import|from|export|const|let|var|function|return|async|await|new|true|false|null|setup|lang)\b)|([A-Za-z_$][\w$]*)(?=\s*:)/g;

const CSS_TOKEN_RE = /(\/\*[\s\S]*?\*\/)|([.#@][-\w]+(?:[^{}\n]*?)?(?=\s*\{))|(--[\w-]+|\b[a-z][a-z-]*(?=\s*:))|(#[0-9a-fA-F]{3,8}\b|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g;

function highlight(source: string, lang: "ts" | "css" = "ts"): ReactNode[] {
  const re = lang === "css" ? CSS_TOKEN_RE : TOKEN_RE;
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  re.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    if (match.index > last) nodes.push(source.slice(last, match.index));
    const [text, comment, second, third, fourth] = match;
    if (lang === "css") {
      if (comment) nodes.push(<span key={key++} className="tok-com">{text}</span>);
      else if (second) nodes.push(<span key={key++} className="tok-kw">{text}</span>);
      else if (third) nodes.push(<span key={key++} className="tok-prop">{text}</span>);
      else if (fourth) nodes.push(<span key={key++} className="tok-str">{text}</span>);
      else nodes.push(text);
    } else {
      if (comment || second) nodes.push(<span key={key++} className="tok-com">{text}</span>);
      else if (third) nodes.push(<span key={key++} className="tok-str">{text}</span>);
      else if (fourth) nodes.push(<span key={key++} className="tok-kw">{text}</span>);
      else nodes.push(<span key={key++} className="tok-prop">{text}</span>);
    }
    last = re.lastIndex;
  }
  if (last < source.length) nodes.push(source.slice(last));
  return nodes;
}

export function CodeBlock({ file, code, lang = "ts" }: { file: string; code: string; lang?: "ts" | "css" }) {
  const { msg } = useLang();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(done, done);
    } else {
      done();
    }
  };

  return <figure className="code-block">
    <div className="code-head">
      <span className="code-file">{file}</span>
      <button type="button" className={copied ? "copy-btn copied" : "copy-btn"} onClick={copy}>{copied ? msg.codeBlock.copied : msg.codeBlock.copy}</button>
    </div>
    <pre><code>{highlight(code, lang)}</code></pre>
  </figure>;
}
