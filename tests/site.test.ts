import { test } from "node:test";
import assert from "node:assert/strict";
import { CONTACT, FAQ, PROJECTS, SLIDES } from "../src/lib/site.ts";

test("contact email is a plausible address", () => {
  assert.match(CONTACT.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

test("outbound contact links use https", () => {
  assert.ok(CONTACT.github.startsWith("https://"));
  assert.ok(CONTACT.facebook.startsWith("https://"));
});

test("slide order drives the indicator and keyboard nav", () => {
  assert.deepEqual([...SLIDES], ["home", "about", "projects", "contact"]);
});

test("every project is complete and points at a real host", () => {
  assert.ok(PROJECTS.length > 0);
  for (const p of PROJECTS) {
    assert.ok(p.id && p.title && p.cat && p.desc, `${p.title} is missing copy`);
    assert.ok(p.highlights.length > 0, `${p.title} has no highlights`);
    assert.ok(p.tech.length > 0, `${p.title} has no tech list`);
    assert.ok(p.live.startsWith("https://"), `${p.title} live URL`);
    assert.ok(p.code.startsWith("https://github.com/"), `${p.title} code URL`);
    assert.ok(p.logo.startsWith("/"), `${p.title} logo should be a local path`);
  }
});

test("project ids are unique", () => {
  const ids = PROJECTS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("no dead asset references remain", () => {
  // these were removed in the asset pass and must not come back
  const removed = ["redwood-preview.png", "cosmicray-preview.png", "grid-bg.png", "serah.png"];
  const referenced = PROJECTS.map((p) => p.logo).join(" ");
  for (const dead of removed) {
    assert.ok(!referenced.includes(dead), `dead asset referenced: ${dead}`);
  }
});

test("faq entries are non-empty and unique", () => {
  assert.ok(FAQ.length > 0);
  for (const { q, a } of FAQ) {
    assert.ok(q.trim().length > 0);
    assert.ok(a.trim().length > 0);
  }
  const questions = FAQ.map((f) => f.q);
  assert.equal(new Set(questions).size, questions.length);
});

test("faq answers do not reference a placeholder domain", () => {
  for (const { a } of FAQ) {
    assert.ok(!a.includes("example.com"), `placeholder leaked into: ${a}`);
  }
});
