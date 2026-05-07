export function careerAdvice(profile, recommendations) {
  const topMatch = recommendations[0];
  const skills = profile.skills || [];
  const interests = profile.interests || [];

  const summary = `You are currently strongest for ${profile.preferred_role || "internship"} roles because your profile contains ${skills.slice(0, 3).join(", ") || "early-stage skills"}.`;
  const nextSteps = [
    "Complete one focused project that matches your preferred role.",
    "Keep your profile skills and resume projects aligned.",
    "Save and apply to relevant internships so the engine learns your preferences.",
  ];

  if (topMatch) {
    nextSteps[0] = `Prioritize applying to ${topMatch.internship.title} roles with similar requirements.`;
  }

  if (topMatch?.missing_skills?.length) {
    nextSteps.push(`Learn these missing skills next: ${topMatch.missing_skills.slice(0, 3).join(", ")}.`);
  }

  return {
    summary,
    focus_areas: interests.slice(0, 4),
    next_steps: nextSteps,
  };
}

export function resumeImprovementTips(profile) {
  const tips = [];
  if ((profile.projects || []).length < 2) {
    tips.push("Add at least two project bullet points with measurable outcomes.");
  }
  if ((profile.skills || []).length < 5) {
    tips.push("List more technical skills relevant to your target internship track.");
  }
  if (!(profile.education || []).length) {
    tips.push("Include degree, institution, and graduation year in the education section.");
  }
  tips.push("Use action verbs such as built, deployed, analyzed, or optimized.");
  return tips;
}

export function mockInterviewQuestions(role) {
  const roleLower = role.toLowerCase();
  if (roleLower.includes("ai") || roleLower.includes("ml")) {
    return [
      "How would you evaluate a recommendation model beyond accuracy?",
      "Explain the difference between TF-IDF similarity and embeddings.",
      "How would you handle noisy resume text in an NLP pipeline?",
    ];
  }

  if (roleLower.includes("web")) {
    return [
      "How do you manage state in a React dashboard with multiple async data sources?",
      "What tradeoffs matter when designing a REST API for a job platform?",
      "How would you improve frontend performance for a card-heavy page?",
    ];
  }

  return [
    "How would you clean and validate a messy dataset before analysis?",
    "Which metrics would you use to evaluate a ranking or prediction system?",
    "How would you present internship trend insights to a non-technical stakeholder?",
  ];
}
