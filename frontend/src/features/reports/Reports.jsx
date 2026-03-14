import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import api from "../../services/api";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const downloadReport = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.get("/reports/pdf", {
        responseType: "blob", 
      });

  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `finance-report-${new Date().getMonth() + 1}-${new Date().getFullYear()}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Reports 📄</h1>
          <p className="text-gray-400 mt-1">
            Download your monthly financial report
          </p>
        </motion.div>

        {/* Report Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center text-3xl">
              📊
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">
                {currentMonth} {currentYear} Report
              </h2>
              <p className="text-gray-400 mt-1">
                Complete overview of your finances this month
              </p>
            </div>
          </div>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6"
        >
          <h3 className="text-white font-bold text-lg mb-4">
            What's included in your report:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: "💰", text: "Total income & expenses summary" },
              { icon: "📋", text: "Complete transaction list" },
              { icon: "🎯", text: "Budget vs actual spending" },
              { icon: "💾", text: "Total savings for the month" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-300">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-2xl mb-6"
          >
            ✅ Report downloaded successfully!
          </motion.div>
        )}

        {/* Download Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadReport}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⚙️
              </motion.span>
              Generating PDF...
            </span>
          ) : (
            "⬇️ Download PDF Report"
          )}
        </motion.button>

      </div>
    </Layout>
  );
};

export default Reports;