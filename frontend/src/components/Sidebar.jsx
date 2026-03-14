import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/transactions", icon: "💳", label: "Transactions" },
  { path: "/budgets", icon: "🎯", label: "Budgets" },
  { path: "/ai", icon: "🤖", label: "AI Insights" },
  { path: "/reports", icon: "📄", label: "Reports" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">FinanceAI</h1>
            <p className="text-gray-400 text-xs">Smart Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600/30 to-violet-600/30 border border-purple-500/30 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-purple-400 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.username}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Sidebar;