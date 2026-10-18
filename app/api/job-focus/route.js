const angleDefinitions = [
  {
    id: "analysis",
    label: "Analysis",
    terms: ["analysis", "analytics", "data", "insight", "report", "metric", "survey", "research", "trend", "evaluate", "dashboard"],
    resumeCue: "Show how you turned information into decisions, recommendations, reports, or measurable findings.",
  },
  {
    id: "service",
    label: "Customer Service",
    terms: ["customer", "client", "visitor", "service", "support", "resolve", "empathy", "satisfaction", "outreach"],
    resumeCue: "Emphasize people helped, questions resolved, feedback, satisfaction, responsiveness, and trust.",
  },
  {
    id: "operations",
    label: "Operations",
    terms: ["operation", "coordinate", "schedule", "process", "logistics", "workflow", "organize", "timeline"],
    resumeCue: "Highlight scheduling, workflows, documentation, process improvement, and reliable execution.",
  },
  {
    id: "communication",
    label: "Communication",
    terms: ["communication", "present", "write", "stakeholder", "partner", "collaborate", "explain", "phone"],
    resumeCue: "Show writing, speaking, stakeholder updates, cross-team collaboration, and clear explanations.",
  },
  {
    id: "research",
    label: "Research",
    terms: ["research", "policy", "literature", "interview", "qualitative", "source", "evidence"],
    resumeCue: "Point to evidence gathering, source synthesis, interviews, experiments, and written conclusions.",
  },
  {
    id: "leadership",
    label: "Leadership",
    terms: ["lead", "leader", "train", "mentor", "supervise", "ownership", "initiative", "team"],
    resumeCue: "Feature ownership, initiative, team coordination, mentoring, and decisions you drove.",
  },
  {
    id: "technical",
    label: "Technical Skills",
    terms: ["software", "python", "sql", "excel", "tableau", "system", "platform", "tool", "automation"],
    resumeCue: "Name tools, systems, methods, technical outputs, and the practical result of using them.",
  },
  {
    id: "sales",
    label: "Sales & Growth",
    terms: ["sales", "revenue", "growth", "buyer", "market", "campaign", "lead", "conversion", "pipeline"],
    resumeCue: "Show outreach, persuasion, pipeline support, campaign impact, revenue context, or audience growth.",
  },
  {
    id: "finance",
    label: "Financial Judgment",
    terms: ["finance", "financial", "budget", "forecast", "cash", "cost", "variance", "investment", "accounting"],
    resumeCue: "Emphasize budgets, costs, cash flow, forecasting, variance, financial reporting, and business tradeoffs.",
  },
  {
    id: "creative",
    label: "Creative Output",
    terms: ["design", "brand", "content", "creative", "social", "media", "visual", "copy", "portfolio"],
    resumeCue: "Show audience, creative process, content shipped, brand judgment, and performance of the work.",
  },
];

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return Response.json({ error: "Missing job link." }, { status: 400 });
    }

    const fetched = await fetchJobText(url);
    const signalText = `${url} ${fetched.text}`;
    const focus = detectAngles(signalText);

    return Response.json({
      focus,
      source: fetched.ok ? "job-link" : "link-fallback",
      message: fetched.ok
        ? "Focus skills were extracted from the job page text."
        : "The job page could not be fully read, so focus skills are inferred from the link. Some job boards require login or block server-side fetching.",
      extractedTextPreview: fetched.text.slice(0, 500),
    });
  } catch (error) {
    return Response.json(
      {
        error: "Unable to analyze this job link.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function fetchJobText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return { ok: false, text: "" };
    }

    const html = await response.text();
    return { ok: true, text: htmlToText(html) };
  } catch {
    return { ok: false, text: "" };
  }
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20000);
}

function detectAngles(text) {
  const lower = text.toLowerCase();
  const scored = angleDefinitions
    .map((angle) => ({
      ...angle,
      score: angle.terms.reduce((total, term) => total + (lower.includes(term) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((angle) => angle.score > 0);
  const fallback = chooseFallbackAngles(lower)
    .map((id) => angleDefinitions.find((angle) => angle.id === id))
    .filter(Boolean);

  return [...matched, ...fallback]
    .filter((angle, index, list) => list.findIndex((item) => item.id === angle.id) === index)
    .slice(0, 6)
    .map(({ id, label, resumeCue, score }) => ({ id, label, resumeCue, score }));
}

function chooseFallbackAngles(text) {
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

  return (
    domainPatterns.find((pattern) => pattern.terms.some((term) => text.includes(term)))?.ids ||
    ["communication", "operations", "analysis", "service", "leadership", "technical"]
  );
}
