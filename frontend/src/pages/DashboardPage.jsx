import { useEffect, useState } from "react";
import api from "../api/client";
import RecommendationCard from "../components/RecommendationCard";
import StatCard from "../components/StatCard";

export default function DashboardPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [advisor, setAdvisor] = useState(null);
  const [resumeTips, setResumeTips] = useState([]);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [statsSource, setStatsSource] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [
        recommendationResponse,
        trendingResponse,
        userResponse,
        advisorResponse,
        tipsResponse,
        interviewResponse,
      ] = await Promise.all([
        api.get("/internships/recommendations"),
        api.get("/internships/trending"),
        api.get("/users/me"),
        api.get("/assistant/career-advice"),
        api.get("/assistant/resume-tips"),
        api.get("/assistant/interview-questions"),
      ]);
      setRecommendations(recommendationResponse.data);
      setTrending(trendingResponse.data);
      setStatsSource(userResponse.data);
      setAdvisor(advisorResponse.data);
      setResumeTips(tipsResponse.data.tips || []);
      setInterviewQuestions(interviewResponse.data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="glass-panel rounded-[2rem] p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2.5rem] p-8">
        <p className="chip">Student Career Dashboard</p>
        <h1 className="mt-5 font-display text-4xl font-bold text-white">Personalized internship recommendations</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          The engine combines skill similarity, interest alignment, popularity, collaborative behavior, and your own
          interactions to rank internships.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Recommended roles" value={recommendations.length} helper="Ranked using the hybrid formula" />
        <StatCard label="Saved internships" value={statsSource?.saved_internships?.length || 0} helper="Tracked as feedback" />
        <StatCard label="Applications" value={statsSource?.applied_internships?.length || 0} helper="Used for behavior learning" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Best matches</h2>
            <p className="mt-2 text-slate-300">Why each match appears and which skills you still need.</p>
          </div>
          {recommendations.map((item) => (
            <RecommendationCard key={item.internship._id} item={item} onTracked={loadDashboard} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-white">Trending internships</h2>
          {trending.map((item) => (
            <div key={item._id} className="glass-panel rounded-[1.75rem] p-5">
              <p className="text-sm text-accent">{item.company}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.location}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.skills_required.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-fog">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {advisor && (
            <div className="glass-panel rounded-[1.75rem] p-5">
              <h3 className="font-display text-xl font-semibold text-white">Career advisor</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{advisor.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(advisor.focus_areas || []).map((area) => (
                  <span key={area} className="rounded-full bg-mint/10 px-3 py-1 text-xs text-mint">
                    {area}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                {(advisor.next_steps || []).map((step) => (
                  <p key={step}>- {step}</p>
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel rounded-[1.75rem] p-5">
            <h3 className="font-display text-xl font-semibold text-white">Resume suggestions</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {resumeTips.map((tip) => (
                <p key={tip}>- {tip}</p>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-5">
            <h3 className="font-display text-xl font-semibold text-white">Mock interview prep</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {interviewQuestions.map((question) => (
                <p key={question}>- {question}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
