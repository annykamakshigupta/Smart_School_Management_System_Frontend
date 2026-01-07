import { Button, Tag } from "antd";
import { ArrowRightOutlined, RocketOutlined } from "@ant-design/icons";
import { FaBrain, FaShieldAlt, FaChartLine } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center bg-gray-50 py-20"
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-6">
            <Tag color="purple" className="inline-flex items-center gap-1 mb-2">
              <RocketOutlined /> Final Year Academic Project
            </Tag>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart School Management System
            </h1>
            
            <p className="text-xl text-indigo-600 font-semibold">
              An Intelligent Platform for Smarter Education Management
            </p>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              A secure, AI-powered web platform designed to automate academic,
              administrative, financial, and communication processes in
              educational institutions.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
              >
                Get Started
              </Button>
              <Button size="large">Request Demo</Button>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="glass-card text-center p-4">
                <FaShieldAlt className="text-3xl text-indigo-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-700">Secure</div>
              </div>
              <div className="glass-card text-center p-4">
                <FaChartLine className="text-3xl text-indigo-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-700">Analytics</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="glass-card p-4 max-w-md">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop"
                alt="School Management Dashboard"
                className="rounded-xl w-full h-auto"
              />
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-indigo-600 text-white rounded-xl shadow-lg p-3">
                <div className="text-2xl font-bold">AI</div>
                <div className="text-xs">Powered</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-indigo-600 text-white rounded-xl shadow-lg p-3">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
