/**
 * Malý, bezpečný převodník Markdownu na HTML (bez závislostí).
 *
 * Podporuje: `#`/`##`/`###` nadpisy, **tučné**, *kurzívu*, ***obojí***, ^horní^ a ~dolní~ index,
 * `kód`, [odkazy](url), ![obrázky](url), seznamy (`- `, `1. `), citace (`> `) a odstavce.
 * Veškerý vstup se nejdřív escapuje a adresy se kontrolují (jen http, https, mailto, tel a relativní),
 * takže výstup je bezpečné vložit přes `dangerouslySetInnerHTML`.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Vrátí adresu, pokud je bezpečná, jinak `null`. Vstup je už escapovaný. */
function safeUrl(url: string, allowMail: boolean): string | null {
  const u = url
    .trim()
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  if (/^(https?:)?\/\//i.test(u) || /^[/#.]/.test(u)) return esc(u);
  if (allowMail && /^(mailto|tel):/i.test(u)) return esc(u);
  if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) return esc(u); // relativní cesta bez schématu
  return null;
}

function inline(src: string): string {
  const stash: string[] = [];
  const keep = (html: string) => `\u0000${stash.push(html) - 1}\u0000`;
  let t = esc(src);

  t = t.replace(/`([^`]+)`/g, (_, c) => keep(`<code>${c}</code>`));
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => {
    const u = safeUrl(url, false);
    return u ? keep(`<img src="${u}" alt="${alt}" loading="lazy" />`) : m;
  });
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
    const u = safeUrl(url, true);
    if (!u) return m;
    const external = /^(https?:)?\/\//i.test(url);
    return keep(`<a href="${u}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`);
  });

  t = t
    .replace(/\*\*\*([^\s*](?:[^*]*[^\s*])?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^\s*](?:[^*]*[^\s*])?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^\s*](?:[^*]*[^\s*])?)\*/g, "<em>$1</em>")
    .replace(/\^([^\s^]+)\^/g, "<sup>$1</sup>")
    .replace(/~([^\s~]+)~/g, "<sub>$1</sub>");

  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[Number(i)]);
}

/** Převede Markdown na bezpečné HTML. Prázdný vstup vrátí prázdný řetězec. */
export function markdownToHtml(source: string): string {
  const lines = (source ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let para: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inline).join("<br />")}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${quote.map(inline).join("<br />")}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => (flushPara(), flushList(), flushQuote());

  for (const line of lines) {
    let m: RegExpMatchArray | null;
    if (!line.trim()) flushAll();
    else if ((m = line.match(/^(#{1,3})\s+(.+)$/))) {
      flushAll();
      out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.+)$/)) || (m = line.match(/^\s*\d+[.)]\s+(.+)$/))) {
      const tag = /^\s*\d/.test(line) ? "ol" : "ul";
      flushPara();
      flushQuote();
      if (list && list.tag !== tag) flushList();
      (list ??= { tag, items: [] }).items.push(m[1]);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      quote.push(m[1]);
    } else {
      flushList();
      flushQuote();
      para.push(line);
    }
  }
  flushAll();
  return out.join("");
}
