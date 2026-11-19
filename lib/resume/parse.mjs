const date = String.raw`(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{1,2}[/.]\d{4}|\d{4}(?:[/.年-]\d{1,2}月?)?)`;
const range = new RegExp(`(${date})\\s*(?:-|–|—|to|至)\\s*(${date}|Present|Current|Now|至今)`, "i");
const experienceHeading = /^(?:(?:professional|work|relevant|research|volunteer|leadership|internship|employment|project)\s+)?(?:experience|experiences|employment|projects|internships)|^(?:工作经历|实习经历|项目经历|志愿经历|科研经历|校园经历|实践经历)$/i;
const otherHeading = /^(?:education(?: background)?|academic background|skills|technical skills|core courses|certifications?|awards|honors|interests|references|summary|profile|教育背景|教育经历|技能|荣誉|个人信息)\s*[:：]?$/i;
const bullet = /^[\s•●▪◦❖\-–*]+/;
const roleWords = /\b(?:intern|analyst|manager|assistant|associate|coordinator|director|engineer|designer|teacher|nurse|consultant|representative|specialist|volunteer|researcher|lead|officer|editor|writer|server|cashier|founder|developer)\b|实习|经理|助理|专员|顾问|设计师|教师|研究员|工程师/i;

function heading(line) {
  return line.length < 65 && (experienceHeading.test(line.replace(/:$/, "")) || otherHeading.test(line));
}

export function parseResume(text) {
  const all = text.replace(/\r/g, "").split("\n").map(line => line.trim()).filter(Boolean);
  const hasSections = all.some(line => experienceHeading.test(line.replace(/:$/, "")));
  let active = !hasSections;
  const lines = [];
  for (const line of all) {
    if (heading(line)) {
      active = experienceHeading.test(line.replace(/:$/, ""));
      lines.push("");
    } else if (active) lines.push(line);
  }
  const anchors = [];
  lines.forEach((line, index) => {
    const match = line.match(range);
    if (!match) return;
    let start = index;
    for (let back = index - 1; back >= Math.max(0, index - 2); back--) {
      const before = lines[back];
      if (!before || before.match(range) || before.length > 100 || bullet.test(before) || /[.;。；]$/.test(before)) break;
      start = back;
    }
    start = Math.max(start, anchors.length ? anchors.at(-1).index + 1 : 0);
    anchors.push({ index, start, match });
  });
  return anchors.map((anchor, i) => {
    const end = anchors[i + 1]?.start ?? lines.length;
    const source = lines.slice(anchor.start, end).filter(Boolean);
    const headers = lines.slice(anchor.start, anchor.index + 1).filter(Boolean);
    let after = anchor.index + 1;
    if (headers.length < 2 && lines[after] && !bullet.test(lines[after]) && lines[after].length < 100 && !/[.;。；]$/.test(lines[after]) && after < end) {
      headers.push(lines[after++]);
    }
    const parts = headers.flatMap(line => line.replace(range, "").split(/\s*\|\s*|\s{3,}/)).map(line => line.replace(/^[,\s-]+|[,\s-]+$/g, "")).filter(Boolean);
    const role = parts.find(part => roleWords.test(part)) || "";
    const others = parts.filter(part => part !== role);
    const description = lines.slice(after, end).filter(Boolean).join("\n");
    return {
      role, organization: others[0] || "", location: others.slice(1).join(" | "),
      start: anchor.match[1], end: anchor.match[2], description,
      source: source.join("\n"),
    };
  }).filter(item => item.role || item.organization || item.description);
}

export function experienceKey(item) {
  return ["role", "organization", "location", "start", "end", "description"].map(key => String(item[key] || "").toLowerCase().replace(/\s+/g, " ").trim()).join("|");
}
