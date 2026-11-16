const sampleExperiences = [
  {
    role: "Real Estate Operations Intern",
    organization: "Sample Property Group",
    location: "New York, NY",
    start: "Jun 2025",
    end: "Aug 2025",
    description:
      "Proposed data-driven strategies to improve inventory turnover and cash-flow stability. Built over 50 dashboards and spreadsheets using SQL, Excel Power Query, and Tableau to visualize property performance and listing activity across neighborhoods. Assisted clients with open-house visit scheduling and phone outreach to gather client requirements. Delivered weekly progress reports with data-insight summaries and operational updates.",
  },
  {
    role: "Marketing Club Event Coordinator",
    organization: "University Marketing Club",
    location: "Campus",
    start: "Sep 2024",
    end: "Dec 2024",
    description:
      "Planned student events, coordinated timelines, contacted campus partners, promoted events online, and managed attendee communication with a small team.",
  },
];

const sampleJob = "";

const sampleProfile = {
  fullName: "Charlie Chen",
  email: "charlie@email.com",
  phone: "(123) 456-7890",
  location: "New York, NY",
  address: "",
  school: "New York University",
  degree: "Bachelor of Science",
  major: "Data Science",
  minor: "Computer Science",
  gpa: "3.8 / 4.0",
  graduation: "May 2026",
  portfolio: "https://linkedin.com/in/charlie",
  coreCourses: "Data Analysis, Business Analytics, Python, Statistics, Database Systems, Human-Computer Interaction",
};

const angleDefinitions = [
  {
    id: "analysis",
    label: "Analysis",
    terms: ["analy", "data", "insight", "report", "metric", "survey", "research", "trend", "evaluate", "dashboard"],
    verbs: ["analyzed", "tracked", "summarized", "identified"],
    resumeCue: "Show how you turned information into decisions, recommendations, reports, or measurable findings.",
  },
  {
    id: "service",
    label: "Customer Service",
    terms: ["customer", "client", "visitor", "service", "support", "resolve", "empathy", "satisfaction", "outreach"],
    verbs: ["supported", "resolved", "assisted", "responded to"],
    resumeCue: "Emphasize people helped, questions resolved, feedback, satisfaction, responsiveness, and trust.",
  },
  {
    id: "operations",
    label: "Operations",
    terms: ["operation", "coordinate", "schedule", "process", "logistics", "workflow", "organize", "timeline"],
    verbs: ["coordinated", "organized", "managed", "documented"],
    resumeCue: "Highlight scheduling, workflows, documentation, process improvement, and reliable execution.",
  },
  {
    id: "communication",
    label: "Communication",
    terms: ["communicat", "present", "write", "stakeholder", "partner", "collaborat", "explain", "phone"],
    verbs: ["communicated", "presented", "translated", "collaborated"],
    resumeCue: "Show writing, speaking, stakeholder updates, cross-team collaboration, and clear explanations.",
  },
  {
    id: "research",
    label: "Research",
    terms: ["research", "policy", "literature", "interview", "qualitative", "source", "evidence"],
    verbs: ["researched", "synthesized", "evaluated", "documented"],
    resumeCue: "Point to evidence gathering, source synthesis, interviews, experiments, and written conclusions.",
  },
  {
    id: "leadership",
    label: "Leadership",
    terms: ["lead", "leader", "train", "mentor", "supervise", "ownership", "initiative", "team"],
    verbs: ["led", "trained", "mentored", "guided"],
    resumeCue: "Feature ownership, initiative, team coordination, mentoring, and decisions you drove.",
  },
  {
    id: "technical",
    label: "Technical Skills",
    terms: ["software", "python", "sql", "excel", "tableau", "system", "platform", "tool", "automation"],
    verbs: ["built", "implemented", "configured", "automated"],
    resumeCue: "Name tools, systems, methods, technical outputs, and the practical result of using them.",
  },
  {
    id: "sales",
    label: "Sales & Growth",
    terms: ["sales", "revenue", "growth", "buyer", "market", "campaign", "lead", "conversion", "pipeline"],
    verbs: ["supported", "generated", "improved", "promoted"],
    resumeCue: "Show outreach, persuasion, pipeline support, campaign impact, revenue context, or audience growth.",
  },
  {
    id: "finance",
    label: "Financial Judgment",
    terms: ["finance", "financial", "budget", "forecast", "cash", "cost", "variance", "investment", "accounting"],
    verbs: ["modeled", "reviewed", "forecasted", "evaluated"],
    resumeCue: "Emphasize budgets, costs, cash flow, forecasting, variance, financial reporting, and business tradeoffs.",
  },
  {
    id: "creative",
    label: "Creative Output",
    terms: ["design", "brand", "content", "creative", "social", "media", "visual", "copy", "portfolio"],
    verbs: ["created", "designed", "produced", "developed"],
    resumeCue: "Show audience, creative process, content shipped, brand judgment, and performance of the work.",
  },
];

function ensureExperienceTemplate() {
  const existingTemplate = document.querySelector("#experienceTemplate");
  if (existingTemplate?.content?.querySelector(".experience-card")) {
    return existingTemplate;
  }
  existingTemplate?.remove();

  const template = document.createElement("template");
  template.id = "experienceTemplate";
  template.innerHTML = `
    <details class="experience-card">
      <summary class="experience-card-header">
        <div class="experience-summary-copy"><strong class="experience-title">Experience</strong><span class="experience-meta"></span><p class="experience-excerpt"></p></div>
        <span class="experience-expand-label">Edit</span>
      </summary>
      <div class="experience-editor">
      <div class="form-grid">
        <label>
          <span>Position / Role</span>
          <input class="field-role" type="text" placeholder="Marketing Intern" />
        </label>
        <label>
          <span>Organization</span>
          <input class="field-organization" type="text" placeholder="Company, club, school, nonprofit..." />
        </label>
        <label>
          <span>Location</span>
          <input class="field-location" type="text" placeholder="New York, NY / Remote" />
        </label>
        <label>
          <span>Start Date</span>
          <input class="field-start" type="text" placeholder="Jun 2025" />
        </label>
        <label>
          <span>End Date</span>
          <input class="field-end" type="text" placeholder="Aug 2025 / Present" />
        </label>
      </div>

      <label class="description-label">
        <span>Experience Description</span>
        <textarea
          class="field-description"
          spellcheck="true"
          placeholder="Describe responsibilities, projects, tools, achievements, people served, results, or anything you want the system to consider."
        ></textarea>
      </label>
      <div class="experience-footer"><button class="icon-button remove-experience" type="button" aria-label="Remove experience">Remove experience</button></div>
      </div>
    </details>
  `;
  document.body.appendChild(template);
  return template;
}

const experienceList = document.querySelector("#experienceList");
const experienceTemplate = ensureExperienceTemplate();
const addExperienceBtn = document.querySelector("#addExperienceBtn");
const jobInput = document.querySelector("#jobInput");
const generateBtn = document.querySelector("#generateBtn");
const editResumeBtn = document.querySelector("#editResumeBtn");
const saveResumeBtn = document.querySelector("#saveResumeBtn");
const regenerateResumeBtn = document.querySelector("#regenerateResumeBtn");
const downloadResumeBtn = document.querySelector("#downloadResumeBtn");
const printResumeBtn = document.querySelector("#printResumeBtn");
const saveStatus = document.querySelector("#saveStatus");
const generatedResume = document.querySelector("#generatedResume");
const resumeHeader = document.querySelector("#resumeHeader");
const jobFocus = document.querySelector("#jobFocus");
const experienceSelection = document.querySelector("#experienceSelection");
const tailoredDescriptions = document.querySelector("#tailoredDescriptions");
const coverLetter = document.querySelector("#coverLetter");

jobInput.value = sampleJob;
const accountId = document.querySelector(".app-shell").dataset.account;
const storagePrefix = accountId ? `bestfit.account.${accountId}` : "bestfit";
const savedResumeKey = `${storagePrefix}.savedResumeHtml`;
const savedResumeEditedAtKey = `${storagePrefix}.savedResumeEditedAt`;
let isEditingResume = false;
let autoSaveTimer;

const profileFields = {
  fullName: document.querySelector("#fullNameInput"),
  email: document.querySelector("#emailInput"),
  phone: document.querySelector("#phoneInput"),
  location: document.querySelector("#profileLocationInput"),
  address: document.querySelector("#addressInput"),
  school: document.querySelector("#schoolInput"),
  degree: document.querySelector("#degreeInput"),
  major: document.querySelector("#majorInput"),
  minor: document.querySelector("#minorInput"),
  gpa: document.querySelector("#gpaInput"),
  graduation: document.querySelector("#graduationInput"),
  portfolio: document.querySelector("#portfolioInput"),
  coreCourses: document.querySelector("#coreCoursesInput"),
};

Object.entries(accountId ? Object.fromEntries(Object.keys(sampleProfile).map(key => [key, ""])) : sampleProfile).forEach(([key, value]) => {
  if (profileFields[key]) {
    profileFields[key].value = value;
  }
});

const targetRoleInput = document.querySelector("#targetRoleInput");
const companyInput = document.querySelector("#companyInput");
const jobDescriptionInput = document.querySelector("#jobDescriptionInput");
const workspaceStatus = document.querySelector("#workspaceStatus");
const workspaceKey = `${storagePrefix}.workspace.v1`;
let letterEdited = false;
let generationId = 0;

function persistWorkspace() {
  updateProfileSummary();
  try {
    localStorage.setItem(workspaceKey, JSON.stringify({
      profile: getProfile(), experiences: getExperiences(), job: jobInput.value,
      role: targetRoleInput.value, company: companyInput.value,
      description: jobDescriptionInput.value, letter: coverLetter.value, letterEdited,
    }));
    workspaceStatus.textContent = "Profile, experiences and letter saved in this browser.";
  } catch {
    workspaceStatus.textContent = "Browser storage is unavailable. Keep this page open and download your drafts.";
  }
}

function updateProfileSummary() {
  const profile = getProfile();
  const count = getExperiences().filter(item => item.role || item.organization || item.description).length;
  document.querySelector("#profileSummaryName").textContent = profile.fullName || "Complete your profile";
  const education = [profile.school, profile.major].filter(Boolean).join(" / ");
  document.querySelector("#profileSummaryDetails").textContent =
    [education, `${count} saved experience${count === 1 ? "" : "s"}`].filter(Boolean).join(" · ");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[char]));
}

function scoreText(text, terms) {
  const normalized = text.toLowerCase();
  return terms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
}

function getJobSignalText() {
  return jobDescriptionInput.value.trim() || [targetRoleInput.value, jobInput.value].join(" ").trim();
}

function detectAngles(jobText) {
  const scored = angleDefinitions
    .map((angle) => ({ ...angle, score: scoreText(jobText, angle.terms) }))
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((angle) => angle.score > 0);
  const fallbackIds = chooseFallbackAngles(jobText);
  const fallback = fallbackIds
    .map((id) => angleDefinitions.find((angle) => angle.id === id))
    .filter(Boolean);
  const combined = [...matched, ...fallback].filter(
    (angle, index, list) => list.findIndex((item) => item.id === angle.id) === index,
  );

  return combined.slice(0, 6);
}

async function fetchJobFocusFromApi(jobUrl) {
  if (!jobUrl) return null;

  try {
    const response = await fetch("/api/job-focus", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ url: jobUrl }),
    });

    if (!response.ok) return null;
    const payload = await response.json();
    if (!Array.isArray(payload.focus) || payload.focus.length === 0) return null;
    saveStatus.textContent = payload.message || "Analyzed job focus from the job link.";
    return payload.focus.map((focus) => ({
      ...focus,
      terms: angleDefinitions.find((angle) => angle.id === focus.id)?.terms || [],
      verbs: angleDefinitions.find((angle) => angle.id === focus.id)?.verbs || [],
    }));
  } catch {
    return null;
  }
}

function chooseFallbackAngles(jobText) {
  const lower = jobText.toLowerCase();
  const domainPatterns = [
    { terms: ["data", "analyst", "analytics", "business-intelligence", "bi"], ids: ["analysis", "technical", "communication", "operations", "research", "finance"] },
    { terms: ["finance", "financial", "accounting", "investment", "bank"], ids: ["finance", "analysis", "operations", "communication", "technical", "research"] },
    { terms: ["marketing", "brand", "content", "social", "campaign"], ids: ["creative", "sales", "communication", "analysis", "operations", "leadership"] },
    { terms: ["customer", "client", "support", "success", "service"], ids: ["service", "communication", "operations", "sales", "leadership", "analysis"] },
    { terms: ["research", "policy", "lab", "scientist"], ids: ["research", "analysis", "communication", "technical", "operations", "leadership"] },
    { terms: ["design", "ux", "ui", "product-design", "creative"], ids: ["creative", "research", "communication", "technical", "analysis", "operations"] },
    { terms: ["software", "engineer", "developer", "product"], ids: ["technical", "analysis", "operations", "communication", "leadership", "research"] },
    { terms: ["sales", "growth", "account", "business-development"], ids: ["sales", "communication", "service", "analysis", "operations", "leadership"] },
  ];
  const matched = domainPatterns.find((pattern) => pattern.terms.some((term) => lower.includes(term)));
  if (matched) return matched.ids;

  return ["communication", "operations", "analysis", "technical", "research", "service"];
}

function hashText(text) {
  return [...text].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function addExperience(data = {}) {
  const fragment = experienceTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".experience-card");
  if (!card) {
    throw new Error("Experience template could not be created.");
  }

  card.querySelector(".field-role").value = data.role || "";
  card.querySelector(".field-organization").value = data.organization || "";
  card.querySelector(".field-location").value = data.location || "";
  card.querySelector(".field-start").value = data.start || "";
  card.querySelector(".field-end").value = data.end || "";
  card.querySelector(".field-description").value = data.description || "";
  card.open = !data.role && !data.organization && !data.description;

  const updateTitle = () => {
    const role = card.querySelector(".field-role").value.trim();
    const organization = card.querySelector(".field-organization").value.trim();
    card.querySelector(".experience-title").textContent = role || organization || "New Experience";
    const dates = [card.querySelector(".field-start").value.trim(), card.querySelector(".field-end").value.trim()].filter(Boolean).join(" - ");
    card.querySelector(".experience-meta").textContent = [organization, dates].filter(Boolean).join(" | ");
    card.querySelector(".experience-excerpt").textContent = card.querySelector(".field-description").value.trim();
  };

  card.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", updateTitle);
  });

  card.querySelector(".remove-experience").addEventListener("click", () => {
    card.remove();
    if (experienceList.children.length === 0) {
      addExperience();
    }
    persistWorkspace();
    generate();
  });

  experienceList.appendChild(card);
  updateTitle();
}

function getExperiences() {
  return [...experienceList.querySelectorAll(".experience-card")]
    .map((card, index) => {
      const role = card.querySelector(".field-role").value.trim();
      const organization = card.querySelector(".field-organization").value.trim();
      const location = card.querySelector(".field-location").value.trim();
      const start = card.querySelector(".field-start").value.trim();
      const end = card.querySelector(".field-end").value.trim();
      const description = card.querySelector(".field-description").value.trim();
      const title = [role, organization].filter(Boolean).join(" at ") || `Experience ${index + 1}`;
      const dateRange = [start, end].filter(Boolean).join(" - ");

      return {
        id: index,
        title,
        role,
        organization,
        location,
        start,
        end,
        dateRange,
        description,
        raw: [title, location, dateRange, description].filter(Boolean).join(" "),
      };
    })
    .filter((experience) => experience.role || experience.organization || experience.description);
}

function getProfile() {
  return Object.fromEntries(
    Object.entries(profileFields).map(([key, field]) => [key, field.value.trim()]),
  );
}

function renderResumeHeader(profile) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.address, profile.portfolio].filter(Boolean).join(" | ");
  const educationLine = [profile.school, profile.degree, profile.major, profile.minor ? `Minor: ${profile.minor}` : ""].filter(Boolean).join(" | ");
  const detailLine = [
    profile.gpa ? `GPA: ${profile.gpa}` : "",
    profile.graduation ? `Graduation: ${profile.graduation}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  resumeHeader.innerHTML = `
    <h3>${profile.fullName || "Your Name"}</h3>
    ${contactLine ? `<p>${contactLine}</p>` : `<p class="empty-state">Add contact details above.</p>`}
    ${educationLine ? `<p class="education-line">${educationLine}</p>` : ""}
    ${detailLine ? `<p>${detailLine}</p>` : ""}
  `;
}

function renderGeneratedResume(profile, ranked, angles) {
  const contactLine = [profile.email, profile.phone, profile.location, profile.address, profile.portfolio].filter(Boolean).join(" | ");
  const majorLine = [
    profile.major ? `Major in ${profile.major}` : "",
    profile.minor ? `Minor in ${profile.minor}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  const focusSkills = angles.filter(angle => ranked.some(experience => scoreText(experience.raw, angle.terms) > 0)).map((angle) => angle.label).join(" | ");

  generatedResume.innerHTML = `
    <header class="resume-template-header">
      <h3>${profile.fullName || "Your Name"}</h3>
      ${contactLine ? `<p>${contactLine}</p>` : ""}
    </header>

    <section class="resume-template-section">
      <h4>Education Background</h4>
      <div class="resume-entry">
        <div class="resume-entry-top">
          <strong>${profile.school || "School Name"}</strong>
          <span>${profile.graduation || "Graduation Date"}</span>
        </div>
        ${majorLine ? `<p class="resume-major-line"><em>${majorLine}</em></p>` : ""}
        <ul class="resume-bullets education-bullets">
          ${profile.gpa ? `<li><strong>Overall GPA:</strong><span>${profile.gpa}</span></li>` : ""}
          ${profile.coreCourses ? `<li><strong>Core Courses:</strong><span>${profile.coreCourses}</span></li>` : ""}
        </ul>
      </div>
    </section>

    <section class="resume-template-section">
      <h4>Experience</h4>
      ${
        ranked.length
          ? ranked
              .map(
                (experience) => `
                  <div class="resume-entry">
                    <div class="resume-entry-top">
                      <strong>${experience.organization || experience.title}</strong>
                      <span>${experience.dateRange || ""}</span>
                    </div>
                    <div class="resume-entry-sub">
                      <em>${experience.role || "Role"}</em>
                      <span>${experience.location || ""}</span>
                    </div>
                    ${renderBullets(experience.bullets)}
                  </div>
                `,
              )
              .join("")
          : `<p class="empty-state">Add experiences to generate this section.</p>`
      }
    </section>

    <section class="resume-template-section">
      <h4>Targeted Skills</h4>
      <p>${focusSkills || "Add experience details to identify supported skill areas."}</p>
    </section>
  `;
  generatedResume.contentEditable = isEditingResume ? "true" : "false";
}

function setResumeEditMode(shouldEdit) {
  isEditingResume = shouldEdit;
  generatedResume.contentEditable = shouldEdit ? "true" : "false";
  generatedResume.classList.toggle("is-editing", shouldEdit);
  editResumeBtn.querySelector("span").textContent = shouldEdit ? "Done Editing" : "Edit Resume";
  saveStatus.textContent = shouldEdit
    ? "Editing is on. Click any text in the resume, revise it, then save."
    : "Editing is off. Click Edit Resume to revise the generated version.";
}

function saveResumeEdits({ silent = false } = {}) {
  localStorage.setItem(savedResumeKey, generatedResume.innerHTML);
  localStorage.setItem(savedResumeEditedAtKey, new Date().toISOString());
  if (!silent) {
    saveStatus.textContent = `Saved locally at ${formatTime(new Date())}.`;
  }
}

function restoreSavedResume() {
  const saved = localStorage.getItem(savedResumeKey);
  if (!saved) return false;
  generatedResume.innerHTML = saved;
  generatedResume.contentEditable = "false";
  const savedAt = localStorage.getItem(savedResumeEditedAtKey);
  saveStatus.textContent = savedAt
    ? `Restored your last saved resume from ${formatTime(new Date(savedAt))}.`
    : "Restored your last saved resume from this browser.";
  return true;
}

function hasSavedResume() {
  return Boolean(localStorage.getItem(savedResumeKey));
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scheduleAutoSave() {
  if (!isEditingResume) return;
  saveStatus.textContent = "Saving...";
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveResumeEdits({ silent: true });
    saveStatus.textContent = `Autosaved at ${formatTime(new Date())}.`;
  }, 500);
}

function downloadResumeHtml() {
  const documentHtml = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Generated Resume</title>
  <style>${getResumeExportStyles()}</style>
</head>
<body>${generatedResume.outerHTML}</body>
</html>`;
  const blob = new Blob([documentHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bestfit-resume.html";
  link.click();
  URL.revokeObjectURL(url);
}

function getResumeExportStyles() {
  return `
    body { margin: 0; background: #fff; }
    .resume-document { max-width: 850px; margin: 0 auto; padding: 34px 42px; color: #111; font-family: Georgia, "Times New Roman", serif; }
    .resume-template-header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 18px; }
    .resume-template-header h3 { margin: 0 0 5px; font-size: 26px; line-height: 1.1; }
    .resume-template-header p, .resume-template-section p { margin: 0; line-height: 1.35; }
    .resume-template-section { display: grid; gap: 10px; margin-top: 16px; }
    .resume-template-section h4 { margin: 0; width: fit-content; border-bottom: 2px solid #111; font-size: 21px; text-transform: uppercase; }
    .resume-entry { display: grid; gap: 5px; }
    .resume-entry + .resume-entry { margin-top: 10px; }
    .resume-entry-top, .resume-entry-sub { display: flex; justify-content: space-between; gap: 16px; }
    .resume-entry-top { align-items: baseline; }
    .resume-entry-top strong { font-size: 18px; }
    .resume-major-line { margin-top: 4px; }
    .resume-bullets { display: grid; gap: 5px; margin: 0; padding-left: 21px; font-size: 15px; line-height: 1.38; }
    .resume-bullets strong { display: inline; margin: 0; color: #111; }
    .resume-bullets span { margin-left: 4px; }
  `;
}

function selectBestAngle(experience, jobAngles) {
  const scored = jobAngles.map((angle) => ({
    ...angle,
    experienceScore: scoreText(experience.raw, angle.terms),
  }));

  return scored.sort((a, b) => b.experienceScore - a.experienceScore || b.score - a.score)[0];
}

function rewriteExperience(experience, angle) {
  const sentences = [...new Set(splitIntoSentences(experience.description.replace(/\s+/g, " ").trim()))];
  return sentences.map((sentence, index) => ({
    sentence, index, score: scoreText(sentence, angle.terms),
  })).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 4).map(({sentence}) => ({
    heading: bulletHeading(selectBestAngle({ raw: sentence }, angleDefinitions)),
    text: buildBulletText(experience, angle, sentence),
  }));
}

function renderFocusCard(angle, index) {
  return `
    <article class="focus-card">
      <div class="focus-rank">${index + 1}</div>
      <div>
        <h3>${angle.label}</h3>
        <p>${angle.resumeCue}</p>
      </div>
    </article>
  `;
}

function renderTag(angle) {
  return `<span class="tag ${angle.id}">${angle.label}</span>`;
}

function renderExperienceMeta(experience) {
  return [experience.location, experience.dateRange].filter(Boolean).join(" | ");
}

function splitIntoSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim().replace(/[.!?]$/, ""))
    .filter(Boolean);
}

function getSupportingAngles(experience, primaryAngle) {
  const scored = angleDefinitions
    .map((angle) => ({
      ...angle,
      experienceScore: scoreText(experience.raw, angle.terms),
    }))
    .filter((angle) => angle.id === primaryAngle.id || angle.experienceScore > 0)
    .sort((a, b) => {
      if (a.id === primaryAngle.id) return -1;
      if (b.id === primaryAngle.id) return 1;
      return b.experienceScore - a.experienceScore;
    });

  const fallback = [primaryAngle, ...angleDefinitions.filter((angle) => ["communication", "operations", "analysis"].includes(angle.id))];
  return [...scored, ...fallback]
    .filter((angle, index, list) => list.findIndex((item) => item.id === angle.id) === index)
    .slice(0, 4);
}

function bulletHeading(angle) {
  return {
    analysis: "Analytics & Insights",
    service: "Client Support",
    operations: "Internal Coordination",
    communication: "Communication",
    research: "Research & Synthesis",
    leadership: "Leadership",
    technical: "Tools & Systems",
    sales: "Sales & Growth",
    finance: "Financial Judgment",
    creative: "Creative Output",
  }[angle.id];
}

function buildBulletText(experience, angle, source) {
  const text = (source || experience.description || "").trim();
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/[.!?]+$/, "") + ".";
}

function renderBullets(bullets) {
  return `
    <ul class="resume-bullets">
      ${bullets
        .map(
          (bullet) => `
            <li>
              <strong>${bullet.heading}:</strong>
              <span>${bullet.text}</span>
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}

async function generate(options = {}) {
  const shouldOverwriteResume = options.overwriteResume === true || !hasSavedResume();
  const requestId = ++generationId;
  generateBtn.querySelector("span").textContent = "Generating...";
  const profile = Object.fromEntries(Object.entries(getProfile()).map(([key, value]) => [key, escapeHtml(value)]));
  const experiences = getExperiences().map(experience => Object.fromEntries(Object.entries(experience).map(([key, value]) => [key, typeof value === "string" ? escapeHtml(value) : value])));
  const jobSignalText = getJobSignalText();
  const angles = (!jobDescriptionInput.value.trim() && options.analyzeLink && jobInput.value.trim()
    ? await fetchJobFocusFromApi(jobInput.value.trim()) : null) || detectAngles(jobSignalText);
  if (requestId !== generationId) return;
  const ranked = experiences
    .map((experience) => {
      const bestAngle = selectBestAngle(experience, angles);
      const relevance = scoreText(experience.raw, [
        ...bestAngle.terms,
        ...angles.flatMap((angle) => angle.terms),
      ]);

      return {
        ...experience,
        bestAngle,
        relevance,
        bullets: rewriteExperience(experience, bestAngle),
      };
    })
    .sort((a, b) => b.relevance - a.relevance);

  renderResumeHeader(profile);
  if (shouldOverwriteResume) {
    renderGeneratedResume(profile, ranked, angles);
    setResumeEditMode(false);
    saveStatus.textContent = "Generated a new resume. Edits will autosave while editing.";
  } else {
    restoreSavedResume();
    setResumeEditMode(false);
    saveStatus.textContent = "Saved resume preserved. Click Regenerate Draft to replace it with a new draft.";
  }
  jobFocus.innerHTML = jobSignalText ? angles.map(renderFocusCard).join("") : `<p class="empty-state">Add a target role or job description to identify role focus. This is a general draft until then.</p>`;

  experienceSelection.innerHTML = ranked.length
    ? ranked
        .map(
          (experience, index) => `
            <div class="match-card">
              <strong>${index + 1}. ${experience.title}</strong>
              <div class="meta-row">
                ${renderTag(experience.bestAngle)}
                ${renderExperienceMeta(experience) ? `<span class="chip">${renderExperienceMeta(experience)}</span>` : ""}
              </div>
              <p>${experience.relevance > 0 ? "Use this experience because it contains evidence that can be framed around the role focus." : "Use only if space allows; this experience may need more specific proof to fit the role."}</p>
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">Add experiences to see which ones should lead.</p>`;

  tailoredDescriptions.innerHTML = ranked.length
    ? ranked
        .map(
          (experience) => `
            <div class="match-card">
              <strong>${experience.title}</strong>
              <div class="meta-row">${renderTag(experience.bestAngle)}</div>
              ${renderBullets(experience.bullets)}
            </div>
          `,
        )
        .join("")
    : `<p class="empty-state">Generated descriptions will appear here.</p>`;

  if (!letterEdited || options.overwriteLetter) {
    const rawProfile = getProfile();
    const rawExperiences = getExperiences();
    const evidence = ranked.slice(0, 2).map(item => rawExperiences.find(exp => exp.id === item.id)).filter(item => item?.description);
    const role = targetRoleInput.value.trim() || "[Role title]";
    const company = companyInput.value.trim() || "[Company name]";
    const paragraphs = [
      "Dear Hiring Team,",
      `I am writing to apply for the ${role} position at ${company}. I would welcome the opportunity to bring my experience to your team.`,
      ...evidence.map(item => `In my experience as ${item.role || "a team member"}${item.organization ? ` at ${item.organization}` : ""}, I worked on the following: ${item.description}`),
      evidence.length ? "I would appreciate the opportunity to discuss how this experience could support your team's priorities. Thank you for considering my application." : "[Add a relevant experience above, then regenerate this letter to include evidence of your work.]",
      `Sincerely,\n${rawProfile.fullName || "[Your name]"}`,
    ];
    coverLetter.value = paragraphs.join("\n\n");
    letterEdited = false;
    document.querySelector("#letterStatus").textContent = "Draft ready. Personalize the opening and review all details before sending.";
  }
  generateBtn.querySelector("span").textContent = "Generate application";
  persistWorkspace();
}

addExperienceBtn.addEventListener("click", () => {
  addExperience();
  persistWorkspace();
});

generateBtn.addEventListener("click", () => generate({ analyzeLink: true }));
editResumeBtn.addEventListener("click", () => {
  setResumeEditMode(!isEditingResume);
});
saveResumeBtn.addEventListener("click", saveResumeEdits);
regenerateResumeBtn.addEventListener("click", () => {
  clearTimeout(autoSaveTimer);
  localStorage.removeItem(savedResumeKey);
  localStorage.removeItem(savedResumeEditedAtKey);
  generate({ overwriteResume: true });
});
downloadResumeBtn.addEventListener("click", downloadResumeHtml);
printResumeBtn.addEventListener("click", () => window.print());
generatedResume.addEventListener("input", scheduleAutoSave);
window.addEventListener("bestfit:flush", () => {
  clearTimeout(autoSaveTimer);
  if (isEditingResume) saveResumeEdits();
  persistWorkspace();
});
window.addEventListener("pagehide", () => {
  clearTimeout(autoSaveTimer);
  if (isEditingResume) saveResumeEdits();
});
document.querySelector(".input-stack").addEventListener("input", persistWorkspace);
coverLetter.addEventListener("input", () => {
  letterEdited = true;
  persistWorkspace();
  document.querySelector("#letterStatus").textContent = "Letter edits saved in this browser. Generate preserves your edits.";
});
document.querySelector("#regenerateLetterBtn").addEventListener("click", () => generate({ overwriteLetter: true }));
document.querySelector("#downloadLetterBtn").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([coverLetter.value], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "bestfit-cover-letter.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

let workspace = null;
try { workspace = JSON.parse(localStorage.getItem(workspaceKey) || "null"); } catch {}
if (workspace && Array.isArray(workspace.experiences)) {
  Object.entries(profileFields).forEach(([key, field]) => { field.value = workspace.profile?.[key] || ""; });
  jobInput.value = workspace.job || "";
  targetRoleInput.value = workspace.role || "";
  companyInput.value = workspace.company || "";
  jobDescriptionInput.value = workspace.description || "";
  coverLetter.value = workspace.letter || "";
  letterEdited = Boolean(workspace.letterEdited);
  workspace.experiences.forEach(addExperience);
  if (!experienceList.children.length) addExperience();
} else {
  if (accountId) addExperience();
  else sampleExperiences.forEach(addExperience);
}
generate({ overwriteResume: !hasSavedResume() });
restoreSavedResume();
