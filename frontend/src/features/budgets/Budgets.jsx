import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../../components/Layout";
import api from "../../services/api";

const categories = [
  "salary", "food", "rent", "entertainment",
  "transport", "health", "shopping", "other"
];

const categoryIcons = {
  food: "🍔", rent: "🏠", salary: "💼",
  transport: "🚗", health: "💊",
  entertainment: "🎮", shopping: "🛍️", other: "💰"
};

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "food",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, transactionsRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/transactions"),
      ]);
      setBudgets(budgetsRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/budgets", form);
      setShowForm(false);
      setForm({
        category: "food",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate actual spending per category
  const getActualSpending = (category) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate progress percentage
  const getProgress = (budget, actual) => {
    return Math.min((actual / budget) * 100, 100);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Budgets</h1>
            <p className="text-gray-400 mt-1">Track your spending against budgets</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25"
          >
            {showForm ? "✕ Cancel" : "+ Set Budget"}
          </motion.button>
        </motion.div>

        {/* Add Budget Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-white font-bold text-lg mb-4">
                Set Monthly Budget
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0a0a0f] capitalize">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Budget Amount</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="0.00"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Month */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Month</label>
                  <select
                    value={form.month}
                    onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  >
                    {["January","February","March","April","May","June",
                      "July","August","September","October","November","December"
                    ].map((m, i) => (
                      <option key={m} value={i + 1} className="bg-[#0a0a0f]">{m}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Submit */}
                <div className="md:col-span-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-500/25"
                  >
                    Set Budget
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Budgets List */}
        {loading ? (
          <p className="text-gray-400 text-center py-8">Loading...</p>
        ) : budgets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
          >
            <p className="text-4xl mb-4">🎯</p>
            <p className="text-gray-400">No budgets set yet. Set your first budget!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map((budget, index) => {
              const actual = getActualSpending(budget.category);
              const progress = getProgress(budget.amount, actual);
              const isOverBudget = actual > budget.amount;

              return (
                <motion.div
                  key={budget._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
                >
                  {/* Category header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                        {categoryIcons[budget.category] || "💰"}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">
                          {budget.category}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {["January","February","March","April","May","June",
                            "July","August","September","October","November","December"
                          ][budget.month - 1]} {budget.year}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${
                      isOverBudget
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {isOverBudget ? "⚠️ Over" : "✅ On Track"}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        Spent: <span className="text-white">₹{actual.toLocaleString()}</span>
                      </span>
                      <span className="text-gray-400">
                        Budget: <span className="text-white">₹{budget.amount.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className={`h-2 rounded-full ${
                          isOverBudget
                            ? "bg-gradient-to-r from-red-500 to-red-400"
                            : "bg-gradient-to-r from-purple-600 to-violet-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Remaining */}
                  <p className={`text-sm font-medium ${
                    isOverBudget ? "text-red-400" : "text-green-400"
                  }`}>
                    {isOverBudget
                      ? `₹${(actual - budget.amount).toLocaleString()} over budget`
                      : `₹${(budget.amount - actual).toLocaleString()} remaining`
                    }
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Budgets;
