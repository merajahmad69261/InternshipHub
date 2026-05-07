function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function termFrequency(tokens) {
  const counts = new Map();
  tokens.forEach((token) => {
    counts.set(token, (counts.get(token) || 0) + 1);
  });
  return counts;
}

function cosineSimilarity(vectorA, vectorB) {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  const keys = new Set([...vectorA.keys(), ...vectorB.keys()]);

  keys.forEach((key) => {
    const a = vectorA.get(key) || 0;
    const b = vectorB.get(key) || 0;
    dot += a * b;
    magnitudeA += a * a;
    magnitudeB += b * b;
  });

  if (!magnitudeA || !magnitudeB) return 0;
  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function buildTfidfVector(tokens, idfMap) {
  const tf = termFrequency(tokens);
  const vector = new Map();
  const tokenCount = tokens.length || 1;

  tf.forEach((count, token) => {
    const tfValue = count / tokenCount;
    const idfValue = idfMap.get(token) || 0;
    vector.set(token, tfValue * idfValue);
  });

  return vector;
}

function computeIdf(documents) {
  const totalDocs = documents.length || 1;
  const docFrequency = new Map();

  documents.forEach((tokens) => {
    const uniqueTokens = new Set(tokens);
    uniqueTokens.forEach((token) => {
      docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
    });
  });

  const idfMap = new Map();
  docFrequency.forEach((frequency, token) => {
    idfMap.set(token, Math.log((totalDocs + 1) / (frequency + 1)) + 1);
  });

  return idfMap;
}

function buildUserText(profile) {
  return [
    ...(profile.skills || []),
    ...(profile.interests || []),
    profile.preferred_role || "",
    profile.location_preference || "",
  ].join(" ");
}

function buildInternshipText(internship) {
  return [
    ...(internship.skills_required || []),
    ...(internship.interests || []),
    internship.role_category || "",
    internship.description || "",
  ].join(" ");
}

function calculateCollaborativeScore(user, allUsers, internshipId) {
  const currentSkills = new Set((user.profile.skills || []).map((item) => item.toLowerCase()));
  let total = 0;

  allUsers.forEach((otherUser) => {
    if (String(otherUser._id) === String(user._id)) return;
    const otherSkills = new Set((otherUser.profile.skills || []).map((item) => item.toLowerCase()));
    const union = new Set([...currentSkills, ...otherSkills]);
    const overlap = [...currentSkills].filter((item) => otherSkills.has(item)).length;
    const similarity = union.size ? overlap / union.size : 0;

    let engagement = 0;
    if ((otherUser.saved_internships || []).includes(internshipId)) engagement += 0.6;
    if ((otherUser.applied_internships || []).includes(internshipId)) engagement += 1.0;
    if ((otherUser.clicks || []).includes(internshipId)) engagement += 0.3;

    if (engagement) {
      total += similarity * engagement;
    }
  });

  return Math.min(total, 1);
}

function calculateSkillGap(profile, internship) {
  const userSkills = new Set((profile.skills || []).map((item) => item.toLowerCase()));
  return (internship.skills_required || [])
    .map((item) => item.toLowerCase())
    .filter((item) => !userSkills.has(item));
}

function explainRecommendation(profile, internship, missingSkills) {
  const sharedSkills = (profile.skills || []).filter((skill) =>
    (internship.skills_required || []).map((item) => item.toLowerCase()).includes(skill.toLowerCase())
  );

  let reason = sharedSkills.length
    ? `Recommended because you match ${sharedSkills.slice(0, 3).join(", ")}`
    : `Recommended because it aligns with your interest in ${profile.preferred_role || "internships"}`;

  if (missingSkills.length) {
    reason += `. To improve fit, learn ${missingSkills.slice(0, 2).join(", ")}`;
  }
  return reason;
}

export function buildRecommendations(user, internships, allUsers) {
  const userTokens = tokenize(buildUserText(user.profile));
  const internshipTokens = internships.map((internship) => tokenize(buildInternshipText(internship)));
  const idfMap = computeIdf([userTokens, ...internshipTokens]);
  const userVector = buildTfidfVector(userTokens, idfMap);
  const userInterests = new Set((user.profile.interests || []).map((item) => item.toLowerCase()));
  const activityCounts = (user.activities || []).reduce((accumulator, activity) => {
    accumulator[activity.internship_id] = (accumulator[activity.internship_id] || 0) + 1;
    return accumulator;
  }, {});

  const recommendations = internships.map((internship, index) => {
    const internshipVector = buildTfidfVector(internshipTokens[index], idfMap);
    const skillMatch = cosineSimilarity(userVector, internshipVector);
    const internshipInterests = new Set((internship.interests || []).map((item) => item.toLowerCase()));
    const interestMatch = internshipInterests.size
      ? [...internshipInterests].filter((item) => userInterests.has(item)).length / internshipInterests.size
      : 0;
    const popularityScore = Number(internship.popularity || 0.5);
    const collaborativeScore = calculateCollaborativeScore(user, allUsers, String(internship._id));
    const behaviorBoost = Math.min((activityCounts[String(internship._id)] || 0) * 0.05, 0.15);
    const missingSkills = calculateSkillGap(user.profile, internship);
    const explanation = explainRecommendation(user.profile, internship, missingSkills);

    const score =
      skillMatch * 0.5 +
      interestMatch * 0.3 +
      popularityScore * 0.2 +
      collaborativeScore * 0.15 +
      behaviorBoost;

    return {
      internship,
      score: Number(score.toFixed(4)),
      skill_match: Number(skillMatch.toFixed(4)),
      interest_match: Number(interestMatch.toFixed(4)),
      popularity_score: Number(popularityScore.toFixed(4)),
      collaborative_score: Number(collaborativeScore.toFixed(4)),
      explanation,
      missing_skills: missingSkills.slice(0, 5),
    };
  });

  return recommendations.sort((a, b) => b.score - a.score).slice(0, 10);
}
