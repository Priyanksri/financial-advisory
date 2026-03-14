import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import Layout from "../../components/Layout";
import api from "../../services/api";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
} from "recharts";

const COLORS = ["#7C3AED", "#4F46E5", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

const categoryIcons = {
  food: "🍔", rent: "🏠", salary: "💼",
  transport: "🚗", health: "💊",
  entertainment: "🎮", shopping: "🛍️", other: "💰"
};

const StatCard = ({ title, amount, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>
      ₹{amount.toLocaleString()}
    </p>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTransactions();
  }, []);

  // Stat calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const recentTransactions = transactions.slice(0, 5);

  // Pie chart data — spending by category
  const pieData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, []);

  // Bar chart data — income vs expenses by month
  const barData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      if (t.type === "income") existing.income += t.amount;
      else existing.expenses += t.amount;
    } else {
      acc.push({
        month,
        income: t.type === "income" ? t.amount : 0,
        expenses: t.type === "expense" ? t.amount : 0,
      });
    }
    return acc;
  }, []);

  // Line chart data — spending trend
  const lineData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.amount += t.amount;
      } else {
        acc.push({ date, amount: t.amount });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Here's your financial overview</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Income" amount={totalIncome} icon="💰" color="text-green-400" delay={0.1} />
          <StatCard title="Total Expenses" amount={totalExpenses} icon="💸" color="text-red-400" delay={0.2} />
          <StatCard title="Total Savings" amount={savings} icon="🏦" color="text-purple-400" delay={0.3} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">
              Spending by Category
            </h2>
            {pieData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No expense data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Legend */}
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-400 text-xs capitalize">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-white font-bold text-lg mb-4">
              Income vs Expenses
            </h2>
            {barData.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                  <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`]}
                  />
                  <Legend wrapperStyle={{ color: "#6b7280" }} />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-white font-bold text-lg mb-4">
            Spending Trend
          </h2>
          {lineData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No expense data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                <YAxis stroke="#6b7280" tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Spent"]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ fill: "#7C3AED", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-white font-bold text-xl mb-6">
            Recent Transactions
          </h2>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No transactions yet. Add your first one!
            </p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((t, index) => (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                      {categoryIcons[t.category] || "💰"}
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{t.category}</p>
                      <p className="text-gray-400 text-sm">{t.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                      {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </Layout>
  );
};

export default Dashboard;