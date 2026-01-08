/**
 * Sidebar Component
 * Role-based responsive sidebar navigation
 */

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { getNavigationByRole } from "./navigation.config";

/**
 * Role theme colors
 */
const ROLE_THEMES = {
  admin: {
    primary: "bg-red-600",
    hover: "hover:bg-red-700",
    active: "bg-red-700",
    accent: "text-red-400",
  },
  teacher: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    active: "bg-blue-700",
    accent: "text-blue-400",
  },
  student: {
    primary: "bg-green-600",
    hover: "hover:bg-green-700",
    active: "bg-green-700",
    accent: "text-green-400",
  },
  parent: {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-700",
    active: "bg-purple-700",
    accent: "text-purple-400",
  },
};

/**
 * NavItem Component
 * Single navigation item with optional submenu
 */
const NavItem = ({ item, collapsed, theme, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const Icon = item.icon;

  // Check if current path matches this item or its children
  const isActive = item.path === location.pathname;
  const hasActiveChild = item.children?.some((child) =>
    location.pathname.startsWith(child.path)
  );

  // Auto-expand if child is active
  useEffect(() => {
    if (hasActiveChild) {
      setExpanded(true);
    }
  }, [hasActiveChild, location.pathname]);

  // Toggle submenu
  const handleToggle = (e) => {
    if (item.children) {
      e.preventDefault();
      setExpanded(!expanded);
    }
  };

  // Render link or button
  const content = (
    <>
      {Icon && (
        <span
          className={`shrink-0 ${
            collapsed && level === 0 ? "mx-auto" : ""
          }`}>
          <Icon className="text-lg" />
        </span>
      )}
      {(!collapsed || level > 0) && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.children && (
            <span
              className={`transition-transform duration-200 ${
                expanded ? "rotate-90" : ""
              }`}>
              <RightOutlined className="text-xs" />
            </span>
          )}
        </>
      )}
    </>
  );

  const baseClasses = `
    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
    transition-all duration-200 w-full text-left
    ${level > 0 ? "pl-12" : ""}
  `;

  const activeClasses =
    isActive || hasActiveChild
      ? `${theme.active} text-white`
      : `text-gray-300 ${theme.hover} hover:text-white`;

  if (item.children) {
    return (
      <div>
        <button
          onClick={handleToggle}
          className={`${baseClasses} ${activeClasses}`}
          aria-expanded={expanded}>
          {collapsed && level === 0 ? (
            <Tooltip title={item.label} placement="right">
              {content}
            </Tooltip>
          ) : (
            content
          )}
        </button>

        {/* Submenu */}
        <div
          className={`overflow-hidden transition-all duration-200 ${
            expanded && !collapsed
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}>
          <div className="mt-1 space-y-1">
            {item.children.map((child) => (
              <NavItem
                key={child.key}
                item={child}
                collapsed={collapsed}
                theme={theme}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => `
        ${baseClasses}
        ${
          isActive
            ? `${theme.active} text-white`
            : `text-gray-300 ${theme.hover} hover:text-white`
        }
      `}>
      {collapsed && level === 0 ? (
        <Tooltip title={item.label} placement="right">
          {content}
        </Tooltip>
      ) : (
        content
      )}
    </NavLink>
  );
};

/**
 * Sidebar Component
 * @param {object} props
 * @param {boolean} props.collapsed - Collapsed state
 * @param {boolean} props.mobileOpen - Mobile menu open state
 * @param {function} props.onClose - Close handler for mobile
 * @param {string} props.userRole - Current user role
 */
const Sidebar = ({ collapsed, mobileOpen, onClose, userRole }) => {
  const navigation = getNavigationByRole(userRole);
  const theme = ROLE_THEMES[userRole] || ROLE_THEMES.admin;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col fixed top-0 left-0 h-full bg-gray-900
          transition-all duration-300 z-30
          ${collapsed ? "w-20" : "w-64"}
        `}>
        {/* Logo */}
        <div
          className={`
          flex items-center h-16 px-4 border-b border-gray-800
          ${collapsed ? "justify-center" : "gap-3"}
        `}>
          <div
            className={`${theme.primary} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
            <FaGraduationCap className="text-white text-xl" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-lg font-bold text-white">SSMS</div>
              <div className="text-xs text-gray-400 truncate">
                Smart School System
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {navigation.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              theme={theme}
            />
          ))}
        </nav>

        {/* Footer */}
        <div
          className={`
          p-4 border-t border-gray-800 text-xs text-gray-500
          ${collapsed ? "text-center" : ""}
        `}>
          {collapsed ? "©" : "© 2026 SSMS"}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`
          md:hidden fixed top-0 left-0 h-full w-72 bg-gray-900 z-60
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div
              className={`${theme.primary} w-10 h-10 rounded-xl flex items-center justify-center`}>
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">SSMS</div>
              <div className="text-xs text-gray-400">Smart School System</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close menu">
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={false}
              theme={theme}
            />
          ))}
        </nav>

        {/* Mobile Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          © 2026 SSMS - Smart School Management System
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
