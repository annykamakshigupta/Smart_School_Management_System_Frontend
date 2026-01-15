/**
 * Premium Sidebar Component
 * Modern SaaS-grade sidebar with role-based navigation
 */

import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Settings,
  ClipboardCheck,
  FileText,
  TrendingUp,
  MessageSquare,
  Calendar,
  Award,
  UserCircle,
  CreditCard,
  GraduationCap,
  ChevronRight,
  Menu,
  X,
  Book,
} from "lucide-react";

/**
 * Navigation Configuration by Role
 */
const NAVIGATION_CONFIG = {
  admin: [
    {
      section: "Main",
      items: [
        { key: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { key: "users", label: "User Management", path: "/admin/users", icon: Users },
      ],
    },
    {
      section: "Academics",
      items: [
        { key: "classes", label: "Classes", path: "/admin/academics/classes", icon: BookOpen },
        { key: "subjects", label: "Subjects", path: "/admin/academics/subjects", icon: Book },
        { key: "fees", label: "Fees & Finance", path: "/admin/fees", icon: DollarSign },
      ],
    },
    {
      section: "Analytics",
      items: [
        { key: "reports", label: "Reports & Analytics", path: "/admin/reports", icon: BarChart3 },
      ],
    },
    {
      section: "Settings",
      items: [
        { key: "settings", label: "System Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ],
  teacher: [
    {
      section: "Main",
      items: [
        { key: "dashboard", label: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
        { key: "attendance", label: "Attendance", path: "/teacher/attendance", icon: ClipboardCheck },
      ],
    },
    {
      section: "Academics",
      items: [
        { key: "assignments", label: "Assignments", path: "/teacher/assignments", icon: FileText },
        { key: "performance", label: "Student Performance", path: "/teacher/performance", icon: TrendingUp },
      ],
    },
    {
      section: "Communication",
      items: [
        { key: "messages", label: "Messages", path: "/teacher/messages", icon: MessageSquare },
      ],
    },
  ],
  student: [
    {
      section: "Main",
      items: [
        { key: "dashboard", label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
        { key: "classes", label: "My Classes", path: "/student/classes", icon: BookOpen },
      ],
    },
    {
      section: "Academics",
      items: [
        { key: "attendance", label: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
        { key: "results", label: "Results", path: "/student/results", icon: Award },
        { key: "timetable", label: "Timetable", path: "/student/timetable", icon: Calendar },
      ],
    },
  ],
  parent: [
    {
      section: "Main",
      items: [
        { key: "dashboard", label: "Dashboard", path: "/parent/dashboard", icon: LayoutDashboard },
        { key: "child", label: "Child Overview", path: "/parent/child", icon: UserCircle },
      ],
    },
    {
      section: "Academics",
      items: [
        { key: "attendance", label: "Attendance", path: "/parent/attendance", icon: ClipboardCheck },
        { key: "fees", label: "Fees", path: "/parent/fees", icon: CreditCard },
      ],
    },
    {
      section: "Communication",
      items: [
        { key: "messages", label: "Messages", path: "/parent/messages", icon: MessageSquare },
      ],
    },
  ],
};

/**
 * Role Theme Configuration
 */
const ROLE_THEMES = {
  admin: {
    accent: "#ef4444",
    accentRgb: "239, 68, 68",
  },
  teacher: {
    accent: "#3b82f6",
    accentRgb: "59, 130, 246",
  },
  student: {
    accent: "#10b981",
    accentRgb: "16, 185, 129",
  },
  parent: {
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
  },
};

/**
 * Navigation Item Component
 */
const NavItem = ({ item, collapsed, accentColor, accentRgb, onNavigate }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = location.pathname === item.path;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className="group relative block"
      style={{
        "--accent-color": accentColor,
        "--accent-rgb": accentRgb,
      }}
    >
      <div
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-300 ease-out
          ${
            isActive
              ? "bg-linear-to-r shadow-sm"
              : "hover:bg-gray-50/80"
          }
        `}
        style={
          isActive
            ? {
                background: `linear-gradient(135deg, rgba(var(--accent-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.05) 100%)`,
                borderLeft: `3px solid var(--accent-color)`,
              }
            : {}
        }
      >
        {/* Active Indicator */}
        {isActive && (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {/* Icon */}
        <div
          className={`
            flex items-center justify-center shrink-0 transition-all duration-300
            ${collapsed ? "mx-auto" : ""}
            ${isActive ? "" : "group-hover:scale-110"}
          `}
        >
          <Icon
            size={20}
            strokeWidth={2}
            className="transition-colors duration-300"
            style={{
              color: isActive ? accentColor : "#64748b",
            }}
          />
        </div>

        {/* Label */}
        {!collapsed && (
          <span
            className={`
              text-sm font-medium transition-colors duration-300
              ${isActive ? "font-semibold" : "text-gray-600 group-hover:text-gray-900"}
            `}
            style={isActive ? { color: accentColor } : {}}
          >
            {item.label}
          </span>
        )}

        {/* Hover Effect */}
        {!isActive && (
          <div className="absolute inset-0 rounded-xl bg-gray-100/0 group-hover:bg-gray-100/50 transition-colors duration-300 -z-10" />
        )}
      </div>

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          {item.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
        </div>
      )}
    </NavLink>
  );
};

/**
 * Navigation Section Component
 */
const NavSection = ({ section, collapsed, accentColor, accentRgb, onNavigate }) => {
  return (
    <div className="space-y-1">
      {/* Section Header */}
      {!collapsed && section.section && (
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {section.section}
        </div>
      )}

      {/* Section Items */}
      <div className="space-y-0.5">
        {section.items.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            collapsed={collapsed}
            accentColor={accentColor}
            accentRgb={accentRgb}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main Sidebar Component
 */
const Sidebar = ({ collapsed, mobileOpen, onClose, userRole = "admin" }) => {
  const navigation = NAVIGATION_CONFIG[userRole] || NAVIGATION_CONFIG.admin;
  const theme = ROLE_THEMES[userRole] || ROLE_THEMES.admin;
  const navigate = useNavigate();

  // Get schedule route based on user role
  const getScheduleRoute = () => {
    switch (userRole) {
      case "admin":
        return "/admin/academics/timetable";
      case "teacher":
        return "/teacher/schedule";
      case "student":
        return "/student/timetable";
      case "parent":
        return "/parent/timetable";
      default:
        return "/";
    }
  };

  const handleScheduleClick = () => {
    navigate(getScheduleRoute());
    if (onClose) onClose(); // Close mobile sidebar if open
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 h-full
          bg-white border-r border-gray-200/80
          transition-all duration-500 ease-out z-40
          ${collapsed ? "w-20" : "w-64"}
        `}
        style={{
          backdropFilter: "blur(10px)",
          background: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
        }}
      >
        {/* Logo Section */}
        <div
          className={`
            flex items-center h-16 px-4 border-b border-gray-200/80
            transition-all duration-500
            ${collapsed ? "justify-center px-0" : "gap-3"}
          `}
        >
          <div
            className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl shadow-sm transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
            }}
          >
            <GraduationCap size={22} strokeWidth={2.5} className="text-white" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Smart School System
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={collapsed}
              accentColor={theme.accent}
              accentRgb={theme.accentRgb}
            />
          ))}
        </nav>

        {/* Schedule Button */}
        <div className={`px-4 pb-4 ${collapsed ? "px-2" : ""}`}>
          <button
            onClick={handleScheduleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
            }}
            title="View Schedule"
          >
            <Calendar size={20} strokeWidth={2.5} />
            {!collapsed && <span>Schedule</span>}
          </button>
        </div>

        {/* Footer */}
        <div
          className={`
            px-4 py-4 border-t border-gray-200/80
            transition-all duration-500
            ${collapsed ? "text-center px-2" : ""}
          `}
        >
          <div className="text-xs text-gray-400 font-medium">
            {collapsed ? "©" : "© 2026 SSMS"}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50
          transform transition-transform duration-500 ease-out
          shadow-2xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)",
        }}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
              }}
            >
              <GraduationCap size={22} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Smart School System
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 active:scale-95"
            aria-label="Close menu"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={false}
              accentColor={theme.accent}
              accentRgb={theme.accentRgb}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Schedule Button (Mobile) */}
        <div className="px-4 pb-4">
          <button
            onClick={handleScheduleClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}dd 100%)`,
            }}
          >
            <Calendar size={20} strokeWidth={2.5} />
            <span>Schedule</span>
          </button>
        </div>

        {/* Mobile Footer */}
        <div className="px-4 py-4 border-t border-gray-200/80">
          <div className="text-xs text-gray-400 font-medium">
            © 2026 SSMS - Smart School System
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;