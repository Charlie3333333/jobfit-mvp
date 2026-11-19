import test from "node:test";
import assert from "node:assert/strict";
import { parseResume, experienceKey } from "../lib/resume/parse.mjs";

test("keeps separate roles, dates, achievements and excludes education", () => {
  const result = parseResume(`EDUCATION\nExample College\n2020 - 2024\nWORK EXPERIENCE\nAcme | New York, NY | Jun 2024 - Present\nCustomer Service Associate\n• Assisted 50 customers daily.\n• Resolved customer questions.\nCity School | Sep 2023 - May 2024\nTeaching Assistant\n• Prepared classroom materials.\nSKILLS\nCommunication, Excel`);
  assert.equal(result.length, 2);
  assert.equal(result[0].organization, "Acme");
  assert.equal(result[0].role, "Customer Service Associate");
  assert.equal(result[0].location, "New York, NY");
  assert.equal(result[0].end, "Present");
  assert.match(result[0].description, /50 customers/);
  assert.equal(result[1].role, "Teaching Assistant");
  assert.doesNotMatch(result[1].description, /Communication/);
});
test("recognizes role and organization before a standalone date", () => {
  const [entry] = parseResume(`EXPERIENCE\nDesign Intern\nStudio North\n06/2023 - 08/2023\n• Designed exhibition materials.`);
  assert.equal(entry.role, "Design Intern");
  assert.equal(entry.organization, "Studio North");
  assert.match(entry.description, /exhibition/);
});
test("supports Chinese sections and dates without inventing facts", () => {
  const [entry] = parseResume(`实习经历\n活动助理 | 示例公司 | 2024年6月 至 2024年8月\n• 协助活动筹备。\n教育背景\n示例大学`);
  assert.equal(entry.role, "活动助理");
  assert.equal(entry.start, "2024年6月");
  assert.doesNotMatch(entry.description, /大学/);
});
test("undated resumes require manual review rather than fabricated entries", () => {
  assert.deepEqual(parseResume("Summary\nI am a motivated professional.\nSkills\nCommunication"), []);
});
test("duplicate keys ignore case and whitespace, but preserve distinct dates", () => {
  assert.equal(experienceKey({ role: "Teacher", description: "Helped students" }), experienceKey({ role: " teacher ", description: "HELPED  students" }));
  assert.notEqual(experienceKey({ role: "Teacher", start: "2023" }), experienceKey({ role: "Teacher", start: "2024" }));
});
