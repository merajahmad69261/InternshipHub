import { useParams, Link } from "react-router-dom";

export default function LearnPage() {
  const { skill } = useParams();
  const skillName = decodeURIComponent(skill);

  const content = {
    "Machine Learning": {
      intro:
        "Machine Learning is a field of AI that allows systems to learn from data and make predictions.",
      topics: [
        "Supervised vs Unsupervised Learning",
        "Regression & Classification",
        "Model Evaluation",
        "Neural Networks Basics",
      ],
      roadmap: [
        "Learn Python basics",
        "Understand statistics & probability",
        "Learn ML algorithms",
        "Build projects (spam detection, prediction models)",
      ],
      resources: [
        "YouTube: Andrew Ng ML Course",
        "Docs: scikit-learn.org",
      ],
    },

    "React.js": {
      intro:
        "React is a JavaScript library for building modern user interfaces.",
      topics: [
        "Components & JSX",
        "State & Props",
        "Hooks (useState, useEffect)",
        "Routing with react-router",
      ],
      roadmap: [
        "Learn JavaScript (ES6)",
        "Understand components",
        "Build small apps",
        "Learn API integration",
      ],
      resources: [
        "YouTube: CodeWithHarry React",
        "Docs: react.dev",
      ],
    },

    "Data Visualization": {
      intro:
        "Data Visualization helps present data in graphical format for better understanding.",
      topics: [
        "Charts (Bar, Line, Pie)",
        "Dashboards",
        "Tools (Chart.js, D3.js)",
        "Data storytelling",
      ],
      roadmap: [
        "Learn basic charts",
        "Use Chart.js",
        "Build dashboard projects",
        "Work with real datasets",
      ],
      resources: [
        "YouTube: DataViz tutorials",
        "Docs: chartjs.org",
      ],
    },

    "SQL": {
      intro:
        "SQL is used to manage and query databases.",
      topics: [
        "SELECT queries",
        "JOINs",
        "Indexes",
        "Database design",
      ],
      roadmap: [
        "Learn basic queries",
        "Practice joins",
        "Work with real databases",
        "Optimize queries",
      ],
      resources: [
        "YouTube: SQL Full Course",
        "Docs: w3schools SQL",
      ],
    },
  };

  const data = content[skillName];

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        <h1>No content available</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link to="/skill-gap" className="text-purple-300">← Back</Link>

        {/* Title */}
        <h1 className="text-5xl font-bold mt-6">{skillName}</h1>

        {/* Intro */}
        <p className="mt-4 text-slate-300 text-lg">{data.intro}</p>

        {/* Topics */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">📚 Topics to Learn</h2>
          <ul className="space-y-2">
            {data.topics.map((topic, i) => (
              <li key={i} className="bg-white/5 p-3 rounded-lg">
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Roadmap */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">🗺️ Learning Roadmap</h2>
          <ol className="space-y-2 list-decimal list-inside">
            {data.roadmap.map((step, i) => (
              <li key={i} className="bg-white/5 p-3 rounded-lg">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Resources */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">🎥 Resources</h2>
          <ul className="space-y-2">
            {data.resources.map((res, i) => (
              <li key={i} className="bg-white/5 p-3 rounded-lg">
                {res}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}