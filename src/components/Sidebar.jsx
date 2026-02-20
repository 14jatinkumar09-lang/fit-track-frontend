import { Home, Utensils, Activity, User, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveBar } from "../store/slice/layout.slice";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ className = "", onItemClick }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  return (
    <div
      className={`fixed h-screen w-64 flex flex-col justify-between
      bg-white dark:bg-[#0F172B]
      border-r border-gray-200 dark:border-[#1D293D]
      text-slate-700 dark:text-slate-300
      transition-colors ${className}`}
    >
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div
            className="
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-emerald-500 text-white font-bold
          "
          >
            🏃
          </div>
          <span className="text-xl font-semibold text-slate-900 dark:text-white">
            FitTrack
          </span>
        </div>

        {/* Nav */}
        <nav className="mt-6 space-y-1">
          <SidebarItem onItemClick={onItemClick} icon={<Home size={18} />} label="Home" />
          <SidebarItem onItemClick={onItemClick} icon={<Utensils size={18} />} label="Food" />
          <SidebarItem onItemClick={onItemClick} icon={<Activity size={18} />} label="Activity" />
          <SidebarItem onItemClick={onItemClick} icon={<User size={18} />} label="Profile" />
        </nav>
      </div>

      {/* Bottom */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-[#1D293D]">
        <button
          onClick={() => {
            document.documentElement.classList.toggle("dark");

            localStorage.setItem("theme", theme === "light" ? "dark" : "light");

            setTheme(theme === "light" ? "dark" : "light");
          }}
          className="flex items-center gap-3 text-sm hover:text-black cursor-pointer dark:hover:text-white"
        >
          {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, onItemClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeBar = useSelector((state) => state.layout.activeBar);

  return (
    <div
      onClick={() => {
        dispatch(setActiveBar(label));
        navigate(`/${label === "Home" ? "" : label}`);
        if (onItemClick) onItemClick();
      }}
      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition
      ${
        activeBar === label
          ? "bg-emerald-50 dark:bg-[#111C3A] text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500"
          : "hover:bg-gray-100 dark:hover:bg-[#111C3A] hover:text-black dark:hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
