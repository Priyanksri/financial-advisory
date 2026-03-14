import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import api from "../../services/api";

const AIInsights = () => {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    setLoading(true);
    setError("");
    setInsights("");

    try {
      const res = await api.post("/ai/insights");
      setInsights(res.data.insights);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const formatInsights = (text) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h3 key={index} className="text-purple-400 font-bold text-lg mt-6 mb-2">
            {line.replace(/\*\*/g, "")}
          </h3>
        );
      }
      if (line.match(/^\d\./)) {
        return (
          <p key={index} className="text-white font-semibold mt-4 mb-1">
            {line}
          </p>
        );
      }
      if (line.startsWith("*")) {
        return (
          <li key={index} className="text-gray-300 ml-4 mb-1 list-disc">
            {line.replace(/^\*\s?/, "")}
          </li>
        );
      }
      if (line.trim() === "") return <br key={index} />;
      return (
        <p key={index} className="text-gray-300 mb-1">
          {line}
        </p>
      );
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">AI Insights 🤖</h1>
          <p className="text-gray-400 mt-1">
            Get personalized financial advice powered by AI
          </p>
        </motion.div>

        {/* Analyze Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6 text-center"
        >
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-white font-bold text-xl mb-2">
            Analyze My Finances
          </h2>
          <p className="text-gray-400 mb-6">
            Our AI will analyze your transactions and give you personalized tips
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchInsights}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚙️
                </motion.span>
                Analyzing...
              </span>
            ) : (
              "✨ Get AI Insights"
            )}
          </motion.button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    className={`h-4 bg-white/10 rounded-full ${
                      i % 3 === 0 ? "w-3/4" : i % 3 === 1 ? "w-full" : "w-1/2"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights Result */}
        <AnimatePresence>
          {insights && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <p className="text-white font-bold">AI Financial Advisor</p>
                  <p className="text-gray-400 text-sm">Powered by Groq AI</p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                {formatInsights(insights)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
};

export default AIInsights;
