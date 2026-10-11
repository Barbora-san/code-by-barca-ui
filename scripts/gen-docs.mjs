// Vygeneruje demo/props.generated.json z TypeScript typů (src/index.ts).
// Tabulky parametrů v demu se tak nikdy nerozejdou se skutečným kódem.
import ts from "typescript";
import { writeFileSync } from "node:fs";
import { BY_NAME, BY_TYPE } from "./prop-docs.mjs";

const program = ts.createProgram(["src/index.ts"], {
  jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true,
  moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020,
});
const checker = program.getTypeChecker();
const sf = program.getSourceFile("src/index.ts");
const mod = checker.getSymbolAtLocation(sf);
const out = {};
const defaults = {};

// výchozí hodnoty z destrukturování parametrů: function Button({ size = "md", ... })
function collectDefaults(name, decl) {
  let fn = decl;
  if (ts.isVariableDeclaration(decl) && decl.initializer) fn = decl.initializer;
  // forwardRef((props, ref) => …) / memo(…)
  if (fn && ts.isCallExpression(fn) && fn.arguments[0]) fn = fn.arguments[0];
  if (!fn || !(ts.isFunctionDeclaration(fn) || ts.isArrowFunction(fn) || ts.isFunctionExpression(fn))) return;
  const param = fn.parameters[0];
  if (!param || !ts.isObjectBindingPattern(param.name)) return;
  const d = {};
  for (const el of param.name.elements) {
    if (el.initializer && ts.isIdentifier(el.propertyName ?? el.name)) d[(el.propertyName ?? el.name).text] = el.initializer.getText().replace(/\s+/g, " ");
  }
  if (Object.keys(d).length) defaults[name] = d;
}

// rozbalí aliasy typu "a" | "b" na výčet hodnot; undefined se zahodí (je to jen „nepovinné“)
function show(t, ctx) {
  if (t.isUnion()) {
    const parts = t.types.filter((x) => !(x.flags & ts.TypeFlags.Undefined)).map((x) => show(x, ctx));
    // boolean se v unii rozpadá na true | false
    const uniq = [...new Set(parts)];
    if (uniq.some((x) => x.startsWith("ReactElement")) && uniq.includes("string") && uniq.includes("number")) return "ReactNode";
    if (uniq.includes("symbol") && uniq.includes("object")) return "ElementType";
    if (uniq.includes("true") && uniq.includes("false")) return ["boolean", ...uniq.filter((x) => x !== "true" && x !== "false")].join(" | ");
    if (uniq.length > 14 && uniq.some((x) => x === '"div"' || x === '"span"' || x === '"section"')) return "ElementType";
    return uniq.filter((x) => x !== "string & {}").join(" | ");
  }
  return clean(checker.typeToString(t, ctx, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope));
}
const clean = (t) => t.replace(/import\("[^"]+"\)\./g, "").replace(/\s+/g, " ");

for (const sym of checker.getExportsOfModule(mod)) {
  const name = sym.getName();
  const sd = (sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym).declarations?.[0];
  // všechna rozhraní a objektové typy (MenuItem, TimelineEntry…) + *Props / *Options
  const isShape = !!sd && (ts.isInterfaceDeclaration(sd) || (ts.isTypeAliasDeclaration(sd) && ts.isTypeLiteralNode(sd.type)));
  if (!isShape && !name.endsWith("Props") && !name.endsWith("Options")) {
    const r = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
    if (r.declarations?.[0]) collectDefaults(name, r.declarations[0]);
    continue;
  }
  const real = sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym;
  const decl = real.declarations?.[0];
  if (!decl) continue;
  const type = checker.getDeclaredTypeOfSymbol(real);
  const props = [];
  for (const p of checker.getPropertiesOfType(type)) {
    const pd = p.declarations?.[0];
    // vynecháme zděděné HTML atributy (React / DOM) – zůstanou jen vlastní props
    if (pd && pd.getSourceFile().fileName.includes("node_modules")) continue;
    const t = checker.getTypeOfSymbolAtLocation(p, decl);
    props.push({
      name: p.getName(),
      type: show(t, decl),
      required: !(p.flags & ts.SymbolFlags.Optional),
      doc: ts.displayPartsToString(p.getDocumentationComment(checker)).trim() || BY_TYPE[name]?.[p.getName()] || BY_NAME[p.getName()] || "",
    });
  }
  out[name] = props;
}
writeFileSync("demo/props.generated.json", JSON.stringify({ types: out, defaults }, null, 1));
console.log("✓ demo/props.generated.json –", Object.keys(out).length, "typů");
