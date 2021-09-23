import { readFile, writeFile, rename } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { randomUUID } from "node:crypto";
import { parseDocument } from "yaml";
import prettier from "prettier";

const inputfile = process.argv[2];
const ext = extname(inputfile);
if (![".yml", ".yaml"].includes(ext.toLowerCase())) {
  throw new Error("Not supported file extension")
}
const tempfile = join(dirname(inputfile), randomUUID() + ".yml");
const prettierOptions = Object.assign(
  (await prettier.resolveConfig(tempfile, {
    editorconfig: true,
  })) ?? {},
  { filepath: tempfile }
);
const content = await readFile(inputfile, "utf-8");
const doc = parseDocument(content);
const docstr = doc.toString();
const formatted = prettier.format(docstr, prettierOptions);
await writeFile(tempfile, formatted, "utf-8");
await rename(tempfile, inputfile);
