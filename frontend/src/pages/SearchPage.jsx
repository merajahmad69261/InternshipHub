import { useState } from "react";
import api from "../api/client";
import RecommendationCard from "../components/RecommendationCard";

export default function SearchPage() {
  const [query, setQuery] = useState("remote ai internship with python and nlp");
  const [results, setResults] = useState([]);
  const [intent, setIntent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get("/internships/search", { params: { q: query } });
      setResults(data.results);
      setIntent(data.intent);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2.5rem] p-8">
        <p className="chip">AI Search</p>
        <h1 className="mt-5 font-display text-4xl font-bold text-white">Search internships in natural language</h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Example: “Remote data science internship with Python and analytics” or “Frontend internship in Bengaluru with React.”
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-4 md:flex-row">
          <input className="input-field flex-1" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button type="submit" className="rounded-2xl bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
            {loading ? "Searching..." : "Run search"}
          </button>
        </form>

        {intent && (
          <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">Detected role: {intent.role || "Any"}</p>
            <p className="mt-2 text-sm text-slate-300">Detected location: {intent.location || "Any"}</p>
            <p className="mt-2 text-sm text-slate-300">Detected skills: {intent.skills?.join(", ") || "Any"}</p>
          </div>
        )}
      </section>

      <section className="space-y-5">
        {results.map((item) => (
          <RecommendationCard key={item._id} item={item} />
        ))}
      </section>
    </div>
  );
}
