export function serializeInternship(internship) {
  return {
    _id: internship._id.toString(),
    title: internship.title,
    company: internship.company,
    skills_required: internship.skills_required || [],
    location: internship.location,
    stipend: internship.stipend,
    description: internship.description,
    role_category: internship.role_category,
    interests: internship.interests || [],
    popularity: internship.popularity ?? 0.5,
  };
}

export function serializeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    profile: {
      full_name: user.profile.full_name,
      skills: user.profile.skills || [],
      interests: user.profile.interests || [],
      experience_level: user.profile.experience_level,
      preferred_role: user.profile.preferred_role,
      location_preference: user.profile.location_preference,
      education: user.profile.education || [],
      projects: user.profile.projects || [],
      extracted_resume_text: user.profile.extracted_resume_text || null,
    },
    saved_internships: user.saved_internships || [],
    applied_internships: user.applied_internships || [],
    clicks: user.clicks || [],
  };
}
