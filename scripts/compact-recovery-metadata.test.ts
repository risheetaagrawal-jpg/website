import { expect, test } from "bun:test";
import { compactRecoveryMetadata } from "./compact-recovery-metadata";

test("removes only editor provenance and keeps runtime identifiers", () => {
  expect(compactRecoveryMetadata('<div data-wf-id="editor" data-w-item-id=collection data-w-id="animation" id="tab" data-wf-ignore data-eo2-src="video.mp4"></div>'))
    .toBe('<div data-w-id="animation" id="tab" data-wf-ignore data-eo2-src="video.mp4"></div>');
});

test("preserves text, styles, scripts, comments and other attribute values", () => {
  const html = `<style>[data-wf-id="editor"] { color: red; }</style><script>const html = '<div data-wf-id="editor">';</script><!-- <div data-wf-id="editor"> -->
<p title='example data-wf-id="keep" > text' data-wf-id='remove'>data-wf-id="keep"</p>`;
  expect(compactRecoveryMetadata(html)).toBe(html);
});

test("keeps IDs used by recovered grid CSS but removes unrelated provenance", () => {
  const html = `<style>[data-wf-id='["grid-id"]'] { grid-template-columns: 1fr 1fr 1fr; }</style>
<div data-wf-id='["grid-id"]' data-w-item-id="collection" class="collection-list-3 wf-grid"></div>`;
  expect(compactRecoveryMetadata(html)).toBe(html.replace(' data-w-item-id="collection"', ""));
});

test("handles multiline and uppercase attributes without changing markup", () => {
  expect(compactRecoveryMetadata('<img\nDATA-WF-ID = "editor" src="photo.jpg" alt="a > b" />'))
    .toBe('<img src="photo.jpg" alt="a > b" />');
});
