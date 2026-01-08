/**
 * DashboardHeader Component
 * Premium header for dashboard pages with glassmorphism design
 * Features: user info, navigation, and search
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Badge, Avatar, Button } from "antd";
import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

/**
 * Role display names
 */
const ROLE_DISPLAY_NAMES = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

/**
 * Role colors - Refined muted palette
 */
const ROLE_COLORS = {
  admin: "bg-rose-50 text-rose-700 border-rose-100",
  teacher: "bg-blue-50 text-blue-700 border-blue-100",
  student: "bg-emerald-50 text-emerald-700 border-emerald-100",
  parent: "bg-violet-50 text-violet-700 border-violet-100",
};

/**
 * DashboardHeader
 * @param {object} props
 * @param {boolean} props.collapsed - Sidebar collapsed state
 * @param {function} props.onToggleSidebar - Toggle sidebar callback
 * @param {string} props.userName - Current user name
 * @param {string} props.userRole - Current user role
 */
const DashboardHeader = ({
  collapsed,
  onToggleSidebar,
  userName,
  userRole,
}) => {
  const { logout, getDashboardRoute } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for subtle header transformation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to={`/${userRole}/profile`}>My Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to={`/${userRole}/settings`}>Settings</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: logout,
    },
  ];


  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get avatar background color based on role
  const getAvatarColor = (role) => {
    const colors = {
      admin: "from-rose-500 to-rose-600",
      teacher: "from-blue-500 to-blue-600",
      student: "from-emerald-500 to-emerald-600",
      parent: "from-violet-500 to-violet-600",
    };
    return colors[role] || "from-indigo-500 to-indigo-600";
  };

  return (
    <>
      {/* Premium Glassmorphism Header */}
      <header
        className={`
          fixed top-0 right-0 z-50 h-16
          bg-white/85 backdrop-blur-xl backdrop-saturate-150
          border-b border-gray-200/70
          transition-all duration-500 ease-out
          ${
            isScrolled
              ? "shadow-lg shadow-gray-200/40 bg-white/90"
              : "shadow-sm shadow-gray-100/50"
          }
          ${collapsed ? "left-0 md:left-20" : "left-0 md:left-64"}
        `}
        style={{
          willChange: "transform, box-shadow",
        }}>
        <div className="h-full flex items-center justify-between px-4 lg:px-6 max-w-full">
          {/* Left Section */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Sidebar Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className="
                w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-600 bg-gray-50/50
                hover:bg-indigo-50 hover:text-indigo-600
                active:scale-95
                transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0
                border border-gray-200/50
              "
              aria-label="Toggle menu">
              <MenuOutlined className="text-lg" />
            </button>

            {/* Brand Logo - Desktop */}
            <Link
              to={getDashboardRoute()}
              className="hidden md:flex items-center gap-2.5 group">
              <div
                className="
                  w-10 h-10 bg-linear-to-br from-indigo-600 via-indigo-600 to-indigo-700
                  rounded-xl flex items-center justify-center
                  shadow-md shadow-indigo-600/25
                  group-hover:shadow-lg group-hover:shadow-indigo-600/35
                  group-hover:scale-105
                  transition-all duration-300
                  border border-indigo-500/20
                ">
                <FaGraduationCap className="text-white text-lg" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Search (Desktop) */}
            <div className="hidden lg:flex items-center">
              <div className="relative group">
                <SearchOutlined
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400 text-sm
                    group-focus-within:text-indigo-600
                    transition-colors duration-200
                  "
                />
                <input
                  type="text"
                  placeholder="Search for anything..."
                  className="
                    w-80 pl-11 pr-4 py-2.5
                    bg-gray-50/70 border border-gray-200/70
                    rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                    hover:bg-gray-100/60 hover:border-gray-300/70
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                    focus:border-indigo-500/60 focus:bg-white
                    transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    shadow-sm
                  "
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2.5">
            {/* Current Date & Time Badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-gray-50 to-gray-100/80 rounded-lg border border-gray-200/60">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            {/* Search (Mobile) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="
                lg:hidden w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-600 bg-gray-50/50
                hover:bg-indigo-50 hover:text-indigo-600
                active:scale-95
                transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                border border-gray-200/50
              "
              aria-label="Search">
              <SearchOutlined className="text-lg" />
            </button>

            {/* User Profile Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              dropdownRender={(menu) => (
                <div
                  className="
                    bg-white rounded-xl shadow-xl shadow-gray-300/50
                    border border-gray-200/80 overflow-hidden
                    min-w-56
                    animate-in fade-in slide-in-from-top-2 duration-200
                  ">
                  {menu}
                </div>
              )}>
              <button
                className="
                  flex items-center gap-3 pl-2 pr-3 py-1.5
                  rounded-xl bg-gray-50/50 border border-gray-200/50
                  hover:bg-indigo-50/80 hover:border-indigo-200/60
                  active:scale-98
                  transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                  cursor-pointer group
                ">
                <div className="relative">
                  {/* First Letter Avatar */}
                  <div
                    className={`
                      w-9 h-9 rounded-xl
                      bg-linear-to-br ${getAvatarColor(userRole)}
                      flex items-center justify-center
                      text-white font-bold text-sm
                      shadow-md shadow-indigo-600/25
                      group-hover:shadow-lg group-hover:shadow-indigo-600/35
                      group-hover:scale-105
                      transition-all duration-300
                      border border-white/20
                    `}>
                    {getUserInitials(userName)}
                  </div>
                  {/* Online Status Indicator */}
                  <div
                    className="
                      absolute -bottom-0.5 -right-0.5
                      w-3 h-3 bg-emerald-500 rounded-full
                      border-2 border-white
                      shadow-sm
                    "
                    title="Online"
                  />
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-32 leading-tight">
                    {userName || "User"}
                  </div>
                  <div
                    className={`
                      text-[10px] font-semibold px-2 py-0.5 mt-0.5
                      rounded-md inline-block border uppercase tracking-wide
                      ${
                        ROLE_COLORS[userRole] ||
                        "bg-gray-50 text-gray-600 border-gray-100"
                      }
                    `}>
                    {ROLE_DISPLAY_NAMES[userRole] || userRole}
                  </div>
                </div>
              </button>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div
          className="
            lg:hidden fixed top-16 left-0 right-0 z-40
            bg-white/95 backdrop-blur-xl
            border-b border-gray-200/70
            px-4 py-4 shadow-lg shadow-gray-200/40
            animate-in slide-in-from-top-4 duration-300
          "
          style={{
            animation: "slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}>
          <div className="relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search for anything..."
              autoFocus
              className="
                w-full pl-11 pr-4 py-3
                bg-gray-50 border border-gray-200
                rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                focus:border-indigo-500/60 focus:bg-white
                transition-all duration-200 shadow-sm
              "
            />
          </div>
        </div>
      )}

      {/* Custom Animations & Styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .active\:scale-95:active {
          transform: scale(0.95);
        }

        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default DashboardHeader;
