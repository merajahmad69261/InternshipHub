import { Link } from "react-router-dom";
import { BarChart3, BrainCircuit, Sparkles, ArrowLeft } from "lucide-react";

export default function HybridRankingPage() {
  const features = [
    {
      title: "AI-Powered Matching",
      description: "Combines profile similarity, resume analysis, and preference scoring.",
      icon: <BrainCircuit className="h-8 w-8 text-orange-300" />,
    },
    {
      title: "Smart Ranking",
      description: "Ranks internship opportunities based on compatibility score.",
      icon: <BarChart3 className="h-8 w-8 text-orange-300" />,
    },
    {
      title: "Personalized Insights",
      description: "Explains recommendations in simple language.",
      icon: <Sparkles className="h-8 w-8 text-orange-300" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-orange-500/10 to-slate-900 p-10 shadow-2xl">
          <p className="inline-flex rounded-full bg-orange-400/20 px-4 py-1 text-sm font-medium text-orange-200">
            Hybrid AI Recommendation System
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
            Hybrid Ranking Engine
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Our intelligent ranking engine combines AI-based recommendation algorithms,
            profile similarity matching, and skill analysis to suggest the best internship
            opportunities for students.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-orange-400/20 bg-orange-400/10 p-8">
            <h2 className="text-2xl font-semibold">How It Works</h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                "Analyze student profile and resume",
                "Compare with internship requirements",
                "Generate ranked recommendations",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl bg-slate-900/70 p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-black font-bold">
                    {index + 1}
                  </div>

                  <p className="text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}