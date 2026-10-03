import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("demo/dist", { recursive: true });
copyFileSync("demo/index.html", "demo/dist/index.html");
console.log("✓ demo/dist/index.html");
