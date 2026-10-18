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

const sampleJob = "https://app.joinhandshake.com/job-search/11159769";

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

const experienceList = document.querySelector("#experienceList");
const experienceTemplate = document.querySelector("#experienceTemplate");
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
const savedResumeKey = "bestfit.savedResumeHtml";
const savedResumeEditedAtKey = "bestfit.savedResumeEditedAt";
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

Object.entries(sampleProfile).forEach(([key, value]) => {
  if (profileFields[key]) {
    profileFields[key].value = value;
  }
});

function scoreText(text, terms) {
  const normalized = text.toLowerCase();
  return terms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
}

function getJobSignalText() {
  return jobInput.value.trim();
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

  const fallbackSets = [
    ["communication", "operations", "analysis", "service", "leadership", "technical"],
    ["creative", "research", "sales", "communication", "operations", "analysis"],
    ["finance", "analysis", "technical", "communication", "operations", "leadership"],
    ["service", "communication", "sales", "operations", "leadership", "analysis"],
  ];
  const index = Math.abs(hashText(jobText || "default")) % fallbackSets.length;
  return fallbackSets[index];
}

function hashText(text) {
  return [...text].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function addExperience(data = {}) {
  const fragment = experienceTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".experience-card");

  card.querySelector(".field-role").value = data.role || "";
  card.querySelector(".field-organization").value = data.organization || "";
  card.querySelector(".field-location").value = data.location || "";
  card.querySelector(".field-start").value = data.start || "";
  card.querySelector(".field-end").value = data.end || "";
  card.querySelector(".field-description").value = data.description || "";

  const updateTitle = () => {
    const role = card.querySelector(".field-role").value.trim();
    const organization = card.querySelector(".field-organization").value.trim();
    card.querySelector(".experience-title").textContent = role || organization || "New Experience";
  };

  card.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", updateTitle);
  });

  card.querySelector(".remove-experience").addEventListener("click", () => {
    card.remove();
    if (experienceList.children.length === 0) {
      addExperience();
    }
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
        dateRange,
        description,
        raw: [title, location, dateRange, description].filter(Boolean).join(" "),
      };
    })
    .filter((experience) => experience.title || experience.description);
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
  const focusSkills = angles.map((angle) => angle.label).join(" | ");

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
      <p>${focusSkills || "Skills will appear after a job link is added."}</p>
    </section>
  `;
  generatedResume.contentEditable = isEditingResume ? "true" : "false";
}

function setResumeEditMode(shouldEdit) {
  isEditingResume = shouldEdit;
  generatedResume.contentEditable = shouldEdit ? "true" : "false";
  generatedResume.classList.toggle("is-editing", shouldEdit);
  editResumeBtn.textContent = shouldEdit ? "Done Editing" : "Edit Resume";
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
  const base = experience.description.replace(/\s+/g, " ").trim();
  const sourceSentences = splitIntoSentences(base);
  const supportingAngles = getSupportingAngles(experience, angle);

  return supportingAngles.map((bulletAngle, index) => ({
    heading: bulletHeading(bulletAngle),
    text: buildBulletText(experience, bulletAngle, sourceSentences[index] || sourceSentences[0] || ""),
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
  const verb = angle.verbs[0];
  const fallback = experience.description || `contributed to ${experience.role || "this role"}`;
  const sourceText = source || fallback;
  const sentence = sourceText.charAt(0).toLowerCase() + sourceText.slice(1);
  const ending = {
    analysis: "to identify patterns, clarify priorities, and support decision-making",
    service: "to resolve needs, strengthen trust, and improve the user or client experience",
    operations: "to keep workflows organized, timelines clear, and execution consistent",
    communication: "to align stakeholders, explain updates clearly, and support collaboration",
    research: "to synthesize evidence and turn findings into usable conclusions",
    leadership: "to create ownership, guide team execution, and move work forward",
    technical: "to produce practical outputs with relevant tools, systems, or technical methods",
    sales: "to support outreach, strengthen engagement, and move potential customers forward",
    finance: "to connect financial details with business judgment and clearer tradeoffs",
    creative: "to shape audience-facing work with clear messaging, quality, and intent",
  }[angle.id];

  return `${verb[0].toUpperCase()}${verb.slice(1)} ${sentence} ${ending}.`;
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

function generate(options = {}) {
  const shouldOverwriteResume = options.overwriteResume === true || !hasSavedResume();
  const profile = getProfile();
  const experiences = getExperiences();
  const jobSignalText = getJobSignalText();
  const angles = detectAngles(jobSignalText);
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
    saveStatus.textContent = "Saved resume preserved. Click Regenerate Draft to replace it with a new AI draft.";
  }
  jobFocus.innerHTML = angles.map(renderFocusCard).join("");

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

  const angleList = angles.map((angle) => angle.label.toLowerCase()).join(", ");
  const leadExperience = ranked[0]?.title || "your strongest experience";
  coverLetter.innerHTML = `
    <p>This application should present you as someone whose background already shows ${angleList}. Lead with ${leadExperience}, then connect the rest of your experience to the employer's needs. Keep the cover letter focused on proof: what you did, who it helped, and why that evidence matters for this specific role.</p>
  `;
}

addExperienceBtn.addEventListener("click", () => {
  addExperience();
});

generateBtn.addEventListener("click", () => generate());
editResumeBtn.addEventListener("click", () => {
  setResumeEditMode(!isEditingResume);
});
saveResumeBtn.addEventListener("click", saveResumeEdits);
regenerateResumeBtn.addEventListener("click", () => {
  localStorage.removeItem(savedResumeKey);
  localStorage.removeItem(savedResumeEditedAtKey);
  generate({ overwriteResume: true });
});
downloadResumeBtn.addEventListener("click", downloadResumeHtml);
printResumeBtn.addEventListener("click", () => window.print());
generatedResume.addEventListener("input", scheduleAutoSave);
Object.values(profileFields).forEach((field) => {
  field.addEventListener("input", () => generate());
});

sampleExperiences.forEach(addExperience);
generate({ overwriteResume: !hasSavedResume() });
restoreSavedResume();
