/**
 * AuthPage - Login Only
 * Modern, clean authentication page
 * SIGNUP REMOVED: All user creation is done by Admin only
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, Form, message, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const location = useLocation();

  // Show redirect message if any
  const redirectMessage = location.state?.message;

  const handleSubmit = async (values) => {
    setLoading(true);
    clearError();
    try {
      const result = await login(values);
      if (result.success) {
        message.success("Login successful! Redirecting...");
      } else {
        message.error(result.error || "Login failed");
      }
    } catch (err) {
      message.error("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-100 h-100 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-5xl">
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl shadow-gray-200/60 overflow-hidden">
          {/* Left Panel - Branding */}
          <div className="lg:w-1/2 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/30 transform transition-transform duration-300 hover:scale-105 hover:rotate-3">
                  <FaGraduationCap className="text-3xl text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">SSMS</h1>
                  <p className="text-indigo-200 text-sm font-medium">
                    Smart School Management System
                  </p>
                </div>
              </div>

              {/* Illustration */}
              <div className="my-8 hidden lg:block">
                <div className="relative bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-lg">📚</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Student Management
                        </div>
                        <div className="text-xs text-indigo-200">
                          Track student progress
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-lg">👨‍🏫</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Teacher Portal
                        </div>
                        <div className="text-xs text-indigo-200">
                          Manage classes & attendance
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-lg">👪</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Parent Access
                        </div>
                        <div className="text-xs text-indigo-200">
                          Monitor child's education
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Welcome Text */}
              <div className="space-y-3">
                <h2 className="text-2xl lg:text-3xl font-bold">
                  Welcome Back!
                </h2>
                <p className="text-indigo-200 text-sm lg:text-base leading-relaxed">
                  Sign in to access your personalized dashboard and manage your
                  school activities efficiently.
                </p>
              </div>

              {/* Info Badge */}
              <div className="mt-8 hidden lg:flex items-center gap-2 text-xs text-indigo-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure authentication with role-based access</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <FaGraduationCap className="text-2xl text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">SSMS</div>
                  <div className="text-xs text-gray-500">
                    Smart School System
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-500">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Alert Messages */}
              {redirectMessage && (
                <Alert
                  message={redirectMessage}
                  type="info"
                  showIcon
                  className="mb-6 rounded-xl"
                />
              )}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  closable
                  onClose={clearError}
                  className="mb-6 rounded-xl"
                />
              )}

              {/* Login Form */}
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                requiredMark={false}
                className="space-y-1">
                <Form.Item
                  name="email"
                  label={
                    <span className="text-gray-700 font-medium">
                      Email Address
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}>
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="name@school.edu"
                    size="large"
                    className="rounded-xl h-12 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span className="text-gray-700 font-medium">Password</span>
                  }
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}>
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Enter your password"
                    size="large"
                    className="rounded-xl h-12 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-colors"
                  />
                </Form.Item>

                <div className="flex items-center justify-end mb-6">
                  <Link
                    to="/forgot-password"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="w-full h-12 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300">
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  <span className="font-medium text-gray-700">
                    Need an account?
                  </span>{" "}
                  Contact your school administrator to get access credentials.
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors">
                  <span>←</span>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SSMS - Smart School Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
