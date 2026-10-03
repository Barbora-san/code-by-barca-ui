/** Ukázkové obrázky bez sítě – SVG data URI v barvách knihovny. */
export function img(label: string, w = 800, h = 450, hue = 48): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 95% 55%)" stop-opacity=".22"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>
<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#facc15" stroke-opacity=".09"/></pattern></defs>
<rect width="100%" height="100%" fill="#111"/><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#p)"/>
<text x="50%" y="50%" fill="#facc15" font-family="ui-monospace,Menlo,monospace" font-size="${Math.round(w / 18)}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
