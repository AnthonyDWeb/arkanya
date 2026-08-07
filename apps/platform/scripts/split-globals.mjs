import fs from "node:fs"
import path from "node:path"

const root = "apps/platform"
const src = path.join(root, "app/globals.css")
const css = fs.readFileSync(src, "utf8")
const lines = css.split(/\r?\n/)

const outDir = path.join(root, "styles")
fs.mkdirSync(outDir, { recursive: true })

const themeStart = lines.findIndex((l) => l.startsWith("@theme"))
const themeEnd = lines.findIndex((l, i) => i > themeStart && l === "}")
fs.writeFileSync(
  path.join(outDir, "tokens.css"),
  `${lines.slice(themeStart, themeEnd + 1).join("\n")}\n`,
  "utf8",
)

const baseStart = lines.findIndex((l) => l.startsWith("*,"))
const chassisComment = lines.findIndex((l) => l.includes("Chassis Instrument"))
fs.writeFileSync(
  path.join(outDir, "base.css"),
  `${lines.slice(baseStart, chassisComment).join("\n").trimEnd()}\n`,
  "utf8",
)

const markers = [
  { file: "chassis.css", start: "Chassis Instrument", end: "Well — denser" },
  { file: "forms.css", start: "Well — denser", end: "Compact page chrome" },
  { file: "layout.css", start: "Compact page chrome", end: "Slab — soft primary" },
  { file: "controls.css", start: "Slab — soft primary", end: "@keyframes shimmer-sweep" },
  { file: "motion.css", start: "@keyframes shimmer-sweep", end: null },
]

for (const m of markers) {
  const start = lines.findIndex((l) => l.includes(m.start))
  if (start < 0) throw new Error(`Missing marker: ${m.start}`)
  const end = m.end
    ? lines.findIndex((l, i) => i > start && l.includes(m.end))
    : lines.length
  fs.writeFileSync(
    path.join(outDir, m.file),
    `${lines.slice(start, end < 0 ? lines.length : end).join("\n").trimEnd()}\n`,
    "utf8",
  )
}

const globals = `@import "tailwindcss";

@import "../styles/tokens.css";
@import "../styles/base.css";
@import "../styles/chassis.css";
@import "../styles/forms.css";
@import "../styles/layout.css";
@import "../styles/controls.css";
@import "../styles/motion.css";
`

fs.writeFileSync(src, globals, "utf8")

for (const f of fs.readdirSync(outDir)) {
  const n = fs.readFileSync(path.join(outDir, f), "utf8").split(/\n/).length
  console.log(`${f}\t${n}`)
}
console.log(`globals.css\t${globals.split(/\n/).length}`)
