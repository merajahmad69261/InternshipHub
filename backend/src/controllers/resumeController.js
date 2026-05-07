import { parseResume, extractTextFromPdf } from "../utils/resumeParser.js";

export async function uploadResume(request, response, next) {
  try {
    if (!request.file) {
      response.status(400).json({ detail: "Resume file is required" });
      return;
    }

    const resumeText = await extractTextFromPdf(request.file.buffer);
    const parsedData = parseResume(resumeText);

    request.user.profile.skills = [...new Set([...(request.user.profile.skills || []), ...parsedData.skills])];
    request.user.profile.education = parsedData.education;
    request.user.profile.projects = parsedData.projects;
    request.user.profile.extracted_resume_text = parsedData.raw_text;
    await request.user.save();

    response.json({
      message: "Resume parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    next(error);
  }
}
