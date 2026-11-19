import test from "node:test";
import assert from "node:assert/strict";
import { conciseText, PAGE_WIDTH, PAGE_HEIGHT, pageStyles } from "../public/resume-page.mjs";

test("uses a fixed US Letter page with zero print margins", () => {
  assert.equal(PAGE_WIDTH / 96, 8.5);
  assert.equal(PAGE_HEIGHT / 96, 11);
  assert.match(pageStyles(), /@page \{ size: Letter; margin: 0/);
  assert.doesNotMatch(pageStyles(), /overflow:\s*hidden/);
});
test("compacts lengthy evidence without adding facts and preserves short text", () => {
  assert.equal(conciseText("Helped 50 clients."), "Helped 50 clients.");
  const source = "Supported customers and documented recurring issues. ".repeat(20);
  const result = conciseText(source, 240);
  assert.ok(result.length <= 240);
  assert.ok(source.startsWith(result.slice(0, -3)));
  assert.ok(result.endsWith("..."));
});
test("bounds long Chinese text as well as space-separated descriptions", () => {
  assert.ok(conciseText("负责客户沟通和活动协调".repeat(100), 240).length <= 240);
});

test("uses compact traditional typesetting without stretched section gaps", () => {
  const css = pageStyles();
  assert.match(css, /font-family: "Times New Roman", Times, serif/);
  assert.match(css, /gap: 1px; margin: 2px 0 0/);
  assert.match(css, /line-height: 1\.16/);
  assert.match(css, /border-bottom: 1px solid #777; width: 100%/);
  assert.doesNotMatch(css, /space-between;[^}]*flex-direction: column/);
});
