/**
 * DashboardHeader Component
 * Modern, responsive header with user menu and search
 * Features: Glassmorphism design, user avatar, role badge, responsive dropdown
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Avatar } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

/**
 * Role display names and styling
 */
const ROLE_CONFIG = {
  admin: {
    label: "Administrator",
    badge: "bg-red-50 text-red-700 border-red-200",
    avatar: "from-red-500 to-red-600",
  },
  teacher: {
    label: "Teacher",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    avatar: "from-blue-500 to-blue-600",
  },
  student: {
    label: "Student",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    avatar: "from-emerald-500 to-emerald-600",
  },
  parent: {
    label: "Parent",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    avatar: "from-violet-500 to-violet-600",
  },
};

/**
 * DashboardHeader Component
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

  const roleConfig = ROLE_CONFIG[userRole] || ROLE_CONFIG.admin;

  // Detect scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: "header",
      type: "group",
      label: (
        <div className="px-1 py-2">
          <div className="font-semibold text-gray-900">
            {userName || "User"}
          </div>
          <div className="text-xs text-gray-500">{roleConfig.label}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "profile",
      icon: <UserOutlined className="text-gray-500" />,
      label: <Link to={`/${userRole}/profile`}>My Profile</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined className="text-gray-500" />,
      label: <Link to={`/${userRole}/settings`}>Settings</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-red-500" />,
      label: <span className="text-red-600">Logout</span>,
      onClick: logout,
    },
  ];

  return (
    <>
      {/* Header */}
      <header
        className={`
          fixed top-0 right-0 z-50 h-16
          bg-white/90 backdrop-blur-xl
          border-b border-gray-200/80
          transition-all duration-300 ease-out
          ${isScrolled ? "shadow-md" : "shadow-sm"}
          ${collapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"}
        `}>
        <div className="h-full flex items-center justify-between px-4 lg:px-6 max-w-full">
          {/* Left Section */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="
                w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-600 bg-gray-50
                hover:bg-indigo-50 hover:text-indigo-600
                active:scale-95
                transition-all duration-200
                border border-gray-200/80
              "
              aria-label="Toggle sidebar">
              <MenuOutlined className="text-lg" />
            </button>

            {/* Brand Logo - Desktop */}
            <Link
              to={getDashboardRoute()}
              className="hidden md:flex items-center gap-2.5 group">
              <div
                className="
                  w-9 h-9 bg-linear-to-br from-indigo-600 to-indigo-700
                  rounded-xl flex items-center justify-center
                  shadow-md shadow-indigo-600/25
                  group-hover:shadow-lg group-hover:scale-105
                  transition-all duration-300
                ">
                <FaGraduationCap className="text-white text-sm" />
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Dashboard
              </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden lg:flex items-center ml-4">
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="
                    w-64 xl:w-80 pl-10 pr-4 py-2.5
                    bg-gray-50 border border-gray-200
                    rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                    hover:bg-gray-100 hover:border-gray-300
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                    focus:border-indigo-500 focus:bg-white
                    transition-all duration-200
                  "
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Date Badge - Desktop */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Search - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="
                lg:hidden w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-600 bg-gray-50
                hover:bg-indigo-50 hover:text-indigo-600
                active:scale-95
                transition-all duration-200
                border border-gray-200/80
              "
              aria-label="Search">
              <SearchOutlined className="text-lg" />
            </button>

            {/* Notifications */}
            <button
              className="
                w-10 h-10 flex items-center justify-center
                rounded-xl text-gray-600 bg-gray-50
                hover:bg-indigo-50 hover:text-indigo-600
                active:scale-95
                transition-all duration-200
                border border-gray-200/80
                relative
              "
              aria-label="Notifications">
              <BellOutlined className="text-lg" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="user-dropdown">
              <button
                className="
                  flex items-center gap-3 pl-2 pr-3 py-1.5
                  rounded-xl bg-gray-50 border border-gray-200
                  hover:bg-indigo-50 hover:border-indigo-200
                  active:scale-98
                  transition-all duration-200
                  cursor-pointer group
                ">
                {/* Avatar */}
                <div className="relative">
                  <div
                    className={`
                      w-9 h-9 rounded-xl
                      bg-linear-to-br ${roleConfig.avatar}
                      flex items-center justify-center
                      text-white font-bold text-sm
                      shadow-md
                      group-hover:shadow-lg group-hover:scale-105
                      transition-all duration-300
                    `}>
                    {getUserInitials(userName)}
                  </div>
                  {/* Online indicator */}
                  <div
                    className="
                      absolute -bottom-0.5 -right-0.5
                      w-3 h-3 bg-green-500 rounded-full
                      border-2 border-white
                    "
                    title="Online"
                  />
                </div>

                {/* User Info - Desktop */}
                <div className="hidden md:block text-left min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-28">
                    {userName || "User"}
                  </div>
                  <div
                    className={`
                      text-[10px] font-semibold px-2 py-0.5 mt-0.5
                      rounded-md inline-block border uppercase tracking-wide
                      ${roleConfig.badge}
                    `}>
                    {roleConfig.label}
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
            border-b border-gray-200
            px-4 py-4 shadow-lg
            animate-slideDown
          ">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              autoFocus
              className="
                w-full pl-10 pr-4 py-3
                bg-gray-50 border border-gray-200
                rounded-xl text-sm text-gray-900 placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/30
                focus:border-indigo-500 focus:bg-white
                transition-all duration-200
              "
            />
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
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

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }

        .user-dropdown .ant-dropdown-menu {
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .user-dropdown .ant-dropdown-menu-item {
          border-radius: 8px;
          padding: 8px 12px;
        }

        .user-dropdown .ant-dropdown-menu-item:hover {
          background-color: #f3f4f6;
        }
      `}</style>
    </>
  );
};

export default DashboardHeader;
