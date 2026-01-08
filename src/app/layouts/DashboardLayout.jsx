/**
 * DashboardLayout Component
 * Shared layout for all role-based dashboards
 * Includes responsive sidebar, header, and content area
 */

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout } from "antd";
import DashboardHeader from "../../components/Header/DashboardHeader";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";

const { Content } = Layout;

/**
 * DashboardLayout
 * Provides consistent layout for all dashboard pages
 * Responsive design with collapsible sidebar
 */
const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, userName } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <Layout
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}>
        {/* Header */}
        <DashboardHeader
          collapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          userName={userName}
          userRole={userRole}
        />

        {/* Content */}
        <Content className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)] mt-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </Layout>
  );
};

export default DashboardLayout;
