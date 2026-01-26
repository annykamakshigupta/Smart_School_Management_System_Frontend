/**
 * Sidebar Component
 * Modern, responsive sidebar with role-based navigation
 * Features: Collapsible, mobile-friendly, smooth animations
 */

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
  X,
  Book,
  UserPlus,
  Link2,
} from "lucide-react";

/**
 * Navigation Configuration by Role
 */
const NAVIGATION_CONFIG = {
  admin: [
    {
      section: "Overview",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "User Management",
      items: [
        {
          key: "users",
          label: "All Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          key: "student-enroll",
          label: "Enroll Student",
          path: "/admin/students/enroll",
          icon: UserPlus,
        },
        {
          key: "parent-mapping",
          label: "Parent-Child Link",
          path: "/admin/parents/mapping",
          icon: Link2,
        },
        {
          key: "assignments",
          label: "Teacher Assign",
          path: "/admin/assignments",
          icon: UserCircle,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "classes",
          label: "Classes",
          path: "/admin/academics/classes",
          icon: BookOpen,
        },
        {
          key: "subjects",
          label: "Subjects",
          path: "/admin/academics/subjects",
          icon: Book,
        },
        {
          key: "timetable",
          label: "Timetable",
          path: "/admin/academics/timetable",
          icon: Calendar,
        },
        {
          key: "attendance",
          label: "Attendance",
          path: "/admin/attendance",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          key: "fees",
          label: "Fees & Finance",
          path: "/admin/fees",
          icon: DollarSign,
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          key: "reports",
          label: "Analytics",
          path: "/admin/reports",
          icon: BarChart3,
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          key: "settings",
          label: "Settings",
          path: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
  teacher: [
    {
      section: "Overview",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/teacher/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Attendance",
      items: [
        {
          key: "mark-attendance",
          label: "Mark Attendance",
          path: "/teacher/attendance?mark=1",
          icon: ClipboardCheck,
        },
        {
          key: "view-attendance",
          label: "View Records",
          path: "/teacher/attendance",
          icon: FileText,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "assignments",
          label: "Assignments",
          path: "/teacher/assignments",
          icon: FileText,
        },
        {
          key: "performance",
          label: "Performance",
          path: "/teacher/performance",
          icon: TrendingUp,
        },
        {
          key: "schedule",
          label: "My Schedule",
          path: "/teacher/schedule",
          icon: Calendar,
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          key: "messages",
          label: "Messages",
          path: "/teacher/messages",
          icon: MessageSquare,
        },
      ],
    },
  ],
  student: [
    {
      section: "Overview",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/student/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Academics",
      items: [
        {
          key: "classes",
          label: "My Classes",
          path: "/student/classes",
          icon: BookOpen,
        },
        {
          key: "attendance",
          label: "Attendance",
          path: "/student/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "results",
          label: "Results",
          path: "/student/results",
          icon: Award,
        },
        {
          key: "timetable",
          label: "Timetable",
          path: "/student/timetable",
          icon: Calendar,
        },
      ],
    },
    {
      section: "Assignments",
      items: [
        {
          key: "assignments",
          label: "Assignments",
          path: "/student/assignments",
          icon: FileText,
        },
      ],
    },
  ],
  parent: [
    {
      section: "Overview",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/parent/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      section: "Children",
      items: [
        {
          key: "child",
          label: "My Children",
          path: "/parent/child",
          icon: UserCircle,
        },
        {
          key: "attendance",
          label: "Attendance",
          path: "/parent/attendance",
          icon: ClipboardCheck,
        },
        {
          key: "results",
          label: "Results",
          path: "/parent/results",
          icon: Award,
        },
      ],
    },
    {
      section: "Finance",
      items: [
        {
          key: "fees",
          label: "Fee Payments",
          path: "/parent/fees",
          icon: CreditCard,
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          key: "messages",
          label: "Messages",
          path: "/parent/messages",
          icon: MessageSquare,
        },
      ],
    },
  ],
};

/**
 * Role Theme Configuration
 */
const ROLE_THEMES = {
  admin: {
    primary: "#dc2626",
    gradient: "from-red-600 to-red-700",
    light: "bg-red-50",
    text: "text-red-600",
  },
  teacher: {
    primary: "#2563eb",
    gradient: "from-blue-600 to-blue-700",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  student: {
    primary: "#059669",
    gradient: "from-emerald-600 to-emerald-700",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  parent: {
    primary: "#7c3aed",
    gradient: "from-violet-600 to-violet-700",
    light: "bg-violet-50",
    text: "text-violet-600",
  },
};

/**
 * Navigation Item Component
 */
const NavItem = ({ item, collapsed, theme, onNavigate }) => {
  const location = useLocation();
  const Icon = item.icon;
  const isActive =
    location.pathname === item.path ||
    (item.path.includes("?") && location.pathname === item.path.split("?")[0]);

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className="group relative block">
      <div
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-200 ease-out
          ${
            isActive
              ? `${theme.light} ${theme.text} shadow-sm`
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
          ${collapsed ? "justify-center" : ""}
        `}>
        {/* Active Indicator */}
        {isActive && (
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-linear-to-b ${theme.gradient}`}
          />
        )}

        {/* Icon */}
        <Icon
          size={20}
          strokeWidth={2}
          className={`shrink-0 transition-transform duration-200 ${
            !isActive && "group-hover:scale-110"
          }`}
        />

        {/* Label */}
        {!collapsed && (
          <span
            className={`text-sm font-medium truncate ${isActive ? "font-semibold" : ""}`}>
            {item.label}
          </span>
        )}
      </div>

      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div
          className="
          absolute left-full ml-3 px-3 py-2 
          bg-gray-900 text-white text-sm font-medium 
          rounded-lg shadow-xl 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible 
          transition-all duration-200 whitespace-nowrap z-50 
          pointer-events-none
        ">
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
const NavSection = ({ section, collapsed, theme, onNavigate }) => {
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
            theme={theme}
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
    const routes = {
      admin: "/admin/academics/timetable",
      teacher: "/teacher/schedule",
      student: "/student/timetable",
      parent: "/parent/timetable",
    };
    return routes[userRole] || "/";
  };

  const handleScheduleClick = () => {
    navigate(getScheduleRoute());
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col fixed top-0 left-0 h-full
          bg-white border-r border-gray-200
          transition-all duration-300 ease-out z-40
          ${collapsed ? "w-20" : "w-64"}
        `}>
        {/* Logo Section */}
        <div
          className={`
            flex items-center h-16 px-4 border-b border-gray-200
            ${collapsed ? "justify-center px-0" : "gap-3"}
          `}>
          <div
            className={`
              flex items-center justify-center shrink-0 w-10 h-10 
              rounded-xl shadow-md
              bg-linear-to-br ${theme.gradient}
              transition-transform duration-300 hover:scale-105
            `}>
            <GraduationCap size={22} strokeWidth={2.5} className="text-white" />
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-gray-500 font-medium">
                School Management
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={collapsed}
              theme={theme}
            />
          ))}
        </nav>

        {/* Quick Action Button */}
        <div className={`px-3 pb-3 ${collapsed ? "px-2" : ""}`}>
          <button
            onClick={handleScheduleClick}
            className={`
              w-full flex items-center justify-center gap-2 
              px-4 py-3 rounded-xl font-semibold text-white 
              shadow-lg hover:shadow-xl 
              transition-all duration-300 hover:scale-[1.02] active:scale-95
              bg-linear-to-r ${theme.gradient}
            `}
            title="View Schedule">
            <Calendar size={20} strokeWidth={2.5} />
            {!collapsed && <span>Schedule</span>}
          </button>
        </div>

        {/* Footer */}
        <div
          className={`
            px-4 py-3 border-t border-gray-200
            ${collapsed ? "text-center px-2" : ""}
          `}>
          <div className="text-xs text-gray-400 font-medium">
            {collapsed ? "©" : `© ${new Date().getFullYear()} SSMS`}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50
          transform transition-transform duration-300 ease-out
          shadow-2xl
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className={`
                flex items-center justify-center w-10 h-10 
                rounded-xl shadow-md
                bg-linear-to-br ${theme.gradient}
              `}>
              <GraduationCap
                size={22}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 tracking-tight">
                SSMS
              </div>
              <div className="text-xs text-gray-500 font-medium">
                School Management
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="Close menu">
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {navigation.map((section, index) => (
            <NavSection
              key={index}
              section={section}
              collapsed={false}
              theme={theme}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* Mobile Quick Action */}
        <div className="px-3 pb-3">
          <button
            onClick={handleScheduleClick}
            className={`
              w-full flex items-center justify-center gap-2 
              px-4 py-3 rounded-xl font-semibold text-white 
              shadow-lg transition-all duration-300 active:scale-95
              bg-linear-to-r ${theme.gradient}
            `}>
            <Calendar size={20} strokeWidth={2.5} />
            <span>Schedule</span>
          </button>
        </div>

        {/* Mobile Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="text-xs text-gray-400 font-medium">
            © {new Date().getFullYear()} SSMS - Smart School System
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
