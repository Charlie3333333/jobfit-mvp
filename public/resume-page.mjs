export const PAGE_WIDTH = 816;
export const PAGE_HEIGHT = 1056;

export function conciseText(value, max = 240) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const head = text.slice(0, max - 3);
  const boundary = head.lastIndexOf(" ");
  return `${boundary > max * .6 ? head.slice(0, boundary) : head}...`;
}

export function pageStyles() {
  return `
    html body .resume-document.one-page {
      box-sizing: border-box; width: 816px; max-width: none; height: 1056px; min-height: 1056px;
      padding: 40px 48px 42px; margin: 0 auto; background: white; color: #111;
      font-family: "Times New Roman", Times, serif; font-size: var(--resume-font, 14.667px);
      line-height: 1.16; overflow-wrap: anywhere; display: block; text-align: left;
    }
    .one-page * { box-sizing: border-box; }
    .one-page .resume-template-header { text-align: center; border-bottom: 0; padding-bottom: 0; margin-bottom: 12px; }
    .one-page .resume-template-header h3 { font-size: 25px; line-height: 1.05; margin: 0 0 3px; }
    .one-page .resume-template-header p { font-size: 12.667px; line-height: 1.16; margin: 0; }
    .one-page .resume-template-section { display: block; margin-top: 10px; }
    .one-page .resume-template-section h4 { font-size: 14.667px; line-height: 1.15; margin: 0 0 4px; padding-bottom: 1px; text-transform: uppercase; border-bottom: 1px solid #777; width: 100%; }
    .one-page .resume-entry { display: block; margin: 0; }
    .one-page .resume-entry + .resume-entry { margin-top: 9px; }
    .one-page .resume-entry-top, .one-page .resume-entry-sub { display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: baseline; gap: 12px; font-size: inherit; line-height: 1.16; }
    .one-page .resume-entry-top strong { font-size: inherit; min-width: 0; }
    .one-page .resume-entry-top span, .one-page .resume-entry-sub span { flex-shrink: 0; max-width: 40%; font-size: inherit; }
    .one-page .resume-entry-sub em { min-width: 0; }
    .one-page .resume-major-line { font-size: inherit; margin: 1px 0; }
    .one-page p { margin: 0; font-size: inherit; line-height: 1.16; }
    html body .one-page .resume-bullets { display: grid; gap: 1px; margin: 2px 0 0; padding-left: 19px; font-size: inherit; line-height: 1.16; }
    html body .one-page .education-bullets { margin-top: 2px; }
    html body .one-page .resume-bullets strong { font-size: inherit; display: inline; }
    .one-page .resume-bullets span { margin-left: 4px; }
    .paper-stage .one-page { zoom: var(--paper-scale, 1); }
    .one-page.is-overflow { outline: 2px solid #a83939; }
    @page { size: Letter; margin: 0; }
    @media print {
      html, body { margin: 0 !important; padding: 0 !important; width: 8.5in; height: 11in; background: white; }
      body > * { display: none !important; }
      body > #print-resume-page { display: block !important; visibility: visible !important; position: static !important; border: 0 !important; box-shadow: none; zoom: 1 !important; margin: 0 !important; }
      #print-resume-page * { visibility: visible !important; }
    }
  `;
}

export function measurePage(element) {
  const clone = element.cloneNode(true);
  clone.removeAttribute("id");
  clone.classList.add("one-page");
  clone.classList.remove("is-editing", "is-overflow");
  clone.contentEditable = "false";
  Object.assign(clone.style, { position: "fixed", left: "-10000px", top: "0", zoom: "1", visibility: "hidden", border: "0" });
  document.body.appendChild(clone);
  try {
    const bounds = clone.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(clone);
    const bottom = Math.max(bounds.top, range.getBoundingClientRect().bottom, ...Array.from(clone.querySelectorAll("*"), node => node.getBoundingClientRect().bottom));
    const fits = bottom <= bounds.bottom - 42 + .5 && clone.scrollWidth <= PAGE_WIDTH && clone.scrollHeight <= PAGE_HEIGHT;
    return { fits, contentBottom: bottom - bounds.top, availableBottom: PAGE_HEIGHT - 42 };
  } finally { clone.remove(); }
}

export function fitGeneratedPage(element) {
  element.classList.add("one-page");
  element.style.setProperty("--resume-font", "14.667px");
  const entries = () => [...element.querySelectorAll("[data-experience-id]")];
  const allBullets = new Map(entries().map(entry => [entry, [...entry.querySelectorAll("li")]]));
  const courses = element.querySelector("[data-core-courses]");
  const coursesParent = courses?.parentNode;
  const trimBullet = minimum => {
    const candidates = entries().reverse().filter(entry => entry.querySelectorAll("li").length > minimum);
    if (!candidates.length) return false;
    candidates[0].querySelector("li:last-child").remove();
    return true;
  };
  for (const [entry, bullets] of allBullets) bullets.slice(2).forEach(bullet => bullet.remove());
  if (!measurePage(element).fits) element.style.setProperty("--resume-font", "14px");
  if (!measurePage(element).fits && entries().length > 3) {
    entries().at(-1).remove();
    element.style.setProperty("--resume-font", "14.667px");
  }
  if (!measurePage(element).fits) element.style.setProperty("--resume-font", "14px");
  while (!measurePage(element).fits && trimBullet(1)) {}
  if (!measurePage(element).fits) element.querySelector("[data-core-courses]")?.remove();
  if (!measurePage(element).fits) element.style.setProperty("--resume-font", "14px");
  // Refill with real source evidence instead of leaving space after coarse cuts.
  if (measurePage(element).fits) {
    for (let index = 0; index < 4; index++) {
      for (const entry of entries()) {
        const bullet = allBullets.get(entry)[index];
        if (!bullet || bullet.parentNode) continue;
        const list = entry.querySelector("ul");
        const next = allBullets.get(entry).slice(index + 1).find(candidate => candidate.parentNode === list);
        list.insertBefore(bullet, next || null);
        if (!measurePage(element).fits) bullet.remove();
      }
    }
    if (courses && !courses.isConnected) {
      coursesParent.appendChild(courses);
      if (!measurePage(element).fits) courses.remove();
    }
  }
  return { ...measurePage(element), ids: entries().map(entry => Number(entry.dataset.experienceId)) };
}

export function exportPage(element) {
  const clone = element.cloneNode(true);
  clone.id = "print-resume-page";
  clone.contentEditable = "false";
  clone.classList.remove("is-editing", "is-overflow");
  return `<!doctype html><html><head><meta charset="UTF-8"><title>BestFit Resume</title><style>${pageStyles()}</style></head><body>${clone.outerHTML}</body></html>`;
}
