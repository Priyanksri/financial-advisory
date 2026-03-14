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

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
        const res = await api.get("/transactions");
        setTransactions(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
        await api.delete(`/transactions/${id}`);
        setTransactions(transactions.filter((t) => t._id !== id));
        } catch (err) {
        console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await api.post("/transactions", form);
        setShowForm(false);
        setForm({
            type: "expense",
            amount: "",
            category: "food",
            description: "",
            date: new Date().toISOString().split("T")[0],
        });
        fetchTransactions();
        } catch (err) {
        console.error(err);
        }
    };



    const filtered = filter === "all"
        ? transactions
        : transactions.filter((t) => t.type === filter);
    
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
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <p className="text-gray-400 mt-1">Manage your income and expenses</p>
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25"
            >
                {showForm ? "✕ Cancel" : "+ Add Transaction"}
            </motion.button>
            </motion.div>

            {/* Add Transaction Form */}
            <AnimatePresence>
            {showForm && (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
                >
                <h2 className="text-white font-bold text-lg mb-4">
                    Add New Transaction
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                    <label className="text-gray-400 text-sm mb-2 block">Type</label>
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                        <option value="expense" className="bg-[#0a0a0f]">Expense</option>
                        <option value="income" className="bg-[#0a0a0f]">Income</option>
                    </select>
                    </div>

                    {/* Amount */}
                    <div>
                    <label className="text-gray-400 text-sm mb-2 block">Amount</label>
                    <input
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        placeholder="0.00"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    </div>

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

                    {/* Date */}
                    <div>
                    <label className="text-gray-400 text-sm mb-2 block">Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                    <label className="text-gray-400 text-sm mb-2 block">Description</label>
                    <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="What was this for?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
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
                        Add Transaction
                    </motion.button>
                    </div>
                </form>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6">
            {["all", "income", "expense"].map((f) => (
                <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl font-medium capitalize transition-all duration-200 ${
                    filter === f
                    ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
                >
                {f}
                </button>
            ))}
            </div>

            {/* Transactions List */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
            {loading ? (
                <p className="text-gray-400 text-center py-8">Loading...</p>
            ) : filtered.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                No transactions found.
                </p>
            ) : (
                <div className="space-y-3">
                <AnimatePresence>
                    {filtered.map((t) => (
                    <motion.div
                        key={t._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                    >
                        <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                            {categoryIcons[t.category] || "💰"}
                        </div>
                        <div>
                            <p className="text-white font-medium capitalize">
                            {t.category}
                            </p>
                            <p className="text-gray-400 text-sm">
                            {t.description || "No description"} •{" "}
                            {new Date(t.date).toLocaleDateString()}
                            </p>
                        </div>
                        </div>
                        <div className="flex items-center gap-4">
                        <p className={`font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                            {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(t._id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200"
                        >
                            🗑️
                        </motion.button>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}
            </motion.div>
        </div>
        </Layout>
    );
};

export default Transactions;
