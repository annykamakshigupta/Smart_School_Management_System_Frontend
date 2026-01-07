import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  StarOutlined,
  UserOutlined,
  PhoneOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "#home", icon: HomeOutlined },
    { name: "About", path: "#about", icon: InfoCircleOutlined },
    { name: "Features", path: "#features", icon: StarOutlined },
    { name: "User Roles", path: "#userroles", icon: UserOutlined },
  ];

  const actionItems = [
    { name: "Contact", path: "#contact", icon: PhoneOutlined },
    { name: "Login", path: "#login", icon: LoginOutlined, primary: true },
  ];

  return (
    <header className="glass-navbar fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <FaGraduationCap className="text-xl text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-gray-900">SSMS</div>
              <div className="text-xs text-gray-500">Smart School System</div>
            </div>
          </Link>

          {/* Center: Navigation (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Icon className="text-base" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Right: Actions (desktop) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.primary
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <CloseOutlined className="text-xl" />
            ) : (
              <MenuOutlined className="text-xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-72 max-w-[85vw] h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="text-lg" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="h-px bg-gray-200 my-2" />
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.primary
                        ? "bg-indigo-600 text-white"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="text-lg" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
