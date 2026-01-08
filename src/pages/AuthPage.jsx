import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Input, Form, Checkbox, message, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { FaGoogle, FaFacebook, FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { login, signup, error, clearError } = useAuth();
  const location = useLocation();

  // Show redirect message if any
  const redirectMessage = location.state?.message;

  // Clear error when switching forms
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  const handleToggle = (newState) => {
    if (isAnimating || isLogin === newState) return;
    setIsAnimating(true);
    setIsLogin(newState);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleLoginSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        message.success("Login successful! Redirecting...");
        // Redirect is handled by AuthProvider
      } else {
        message.error(result.error || "Login failed");
      }
    } catch (err) {
      message.error("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (values) => {
    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = values;
      const result = await signup(signupData);
      if (result.success) {
        message.success(result.message || "Signup successful! Please login.");
        setIsLogin(true);
        signupForm.resetFields();
      } else {
        message.error(result.error || "Signup failed");
      }
    } catch (err) {
      message.error("Signup error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Staggered animation for form fields
  const getFieldDelay = (index) => ({
    animationDelay: `${index * 30}ms`,
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-6xl">
        {/* Desktop View - Sliding Panel Animation */}
        <div className="hidden md:block relative h-200 bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Container for sliding panels */}
          <div className="relative h-full w-full">
            {/* Left Panel - Info Panel */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full bg-indigo-600 text-white flex flex-col justify-center p-12 z-10"
              style={{
                transform: isLogin ? "translateX(0%)" : "translateX(100%)",
                opacity: 1,
                transition:
                  "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform, opacity",
              }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-6">
                  <FaGraduationCap className="text-2xl text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">SSMS</div>
                  <div className="text-sm opacity-90">Smart School System</div>
                </div>
              </div>

              {/* Shared illustration */}
              <div className="mb-8">
                <img
                  src="https://thumbs.dreamstime.com/b/print-161837181.jpg"
                  alt="School children playing"
                  className="w-full h-96 object-cover rounded-2xl shadow-xl border border-white/20"
                />
              </div>

              {/* Content with crossfade */}
              <div className="relative">
                {/* Login Panel Content */}
                <div
                  className="absolute inset-0 space-y-6"
                  style={{
                    opacity: isLogin ? 1 : 0,
                    transform: isLogin ? "translateY(0)" : "translateY(-20px)",
                    transition:
                      "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms, transform 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                    pointerEvents: isLogin ? "auto" : "none",
                  }}>
                  <h2 className="text-4xl font-bold">Welcome Back!</h2>
                  <button
                    onClick={() => handleToggle(false)}
                    disabled={isAnimating}
                    className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold transform transition-all duration-300 hover:bg-white hover:text-indigo-600 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50">
                    Sign Up
                  </button>
                </div>

                {/* Signup Panel Content */}
                <div
                  style={{
                    opacity: !isLogin ? 1 : 0,
                    transform: !isLogin ? "translateY(0)" : "translateY(-20px)",
                    transition:
                      "opacity 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms, transform 400ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                    pointerEvents: !isLogin ? "auto" : "none",
                  }}>
                  <h2 className="text-4xl font-bold">Hello, Friend!</h2>
                  <p className="text-lg opacity-90">
                    Enter your personal details and start your journey with us
                  </p>
                  <button
                    onClick={() => handleToggle(true)}
                    disabled={isAnimating}
                    className="mt-6 px-8 py-3 border-2 border-white text-white rounded-xl font-semibold transform transition-all duration-300 hover:bg-white hover:text-indigo-600 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50">
                    Login
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full bg-white flex items-center justify-center p-12"
              style={{
                transform: isLogin ? "translateX(0%)" : "translateX(-100%)",
                opacity: isLogin ? 1 : 0,
                transition:
                  "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform, opacity",
                pointerEvents: isLogin ? "auto" : "none",
              }}>
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Login to SSMS
                </h2>
                <p className="text-gray-600 mb-8">
                  Welcome back! Please login to your account
                </p>

                <div className="flex gap-3 mb-6">
                  {[
                    { Icon: FaGoogle, color: "text-red-500", label: "Google" },
                    {
                      Icon: FaFacebook,
                      color: "text-blue-600",
                      label: "Facebook",
                    },
                  ].map(({ Icon, color, label }, idx) => (
                    <button
                      key={idx}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl transform transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50 hover:scale-105 hover:shadow-lg active:scale-95"
                      style={getFieldDelay(idx)}>
                      <Icon className={`text-xl ${color}`} />
                      <span className="font-medium text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <Form
                  form={loginForm}
                  onFinish={handleLoginSubmit}
                  layout="vertical"
                  requiredMark={false}>
                  <div className="space-y-4">
                    {[
                      {
                        name: "email",
                        icon: MailOutlined,
                        placeholder: "Email Address",
                        type: "email",
                        rules: [
                          {
                            required: true,
                            message: "Please enter your email",
                          },
                          {
                            type: "email",
                            message: "Please enter a valid email",
                          },
                        ],
                      },
                      {
                        name: "password",
                        icon: LockOutlined,
                        placeholder: "Password",
                        type: "password",
                        rules: [
                          {
                            required: true,
                            message: "Please enter your password",
                          },
                        ],
                      },
                    ].map((field, idx) => (
                      <Form.Item
                        key={field.name}
                        name={field.name}
                        rules={field.rules}
                        style={getFieldDelay(idx + 2)}>
                        {field.type === "password" ? (
                          <Input.Password
                            prefix={<field.icon className="text-gray-400" />}
                            placeholder={field.placeholder}
                            size="large"
                            className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                          />
                        ) : (
                          <Input
                            prefix={<field.icon className="text-gray-400" />}
                            placeholder={field.placeholder}
                            size="large"
                            className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                          />
                        )}
                      </Form.Item>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between mb-6 mt-4"
                    style={getFieldDelay(4)}>
                    <Link
                      to="/forgot-password"
                      className="text-indigo-600 hover:text-indigo-700 font-medium transform transition-all duration-200 hover:scale-105">
                      Forgot password?
                    </Link>
                  </div>

                  <Form.Item style={getFieldDelay(5)}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full rounded-xl h-12 text-base font-semibold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                      Login
                    </Button>
                  </Form.Item>
                </Form>

                <p
                  className="text-center text-gray-600 mt-6"
                  style={getFieldDelay(6)}>
                  Don't have an account?{" "}
                  <button
                    onClick={() => handleToggle(false)}
                    disabled={isAnimating}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transform transition-all duration-200 hover:scale-105 disabled:opacity-50">
                    Sign Up
                  </button>
                </p>
              </div>
            </div>

            {/* Left Panel - Signup Form */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full bg-white flex items-center justify-center p-12"
              style={{
                transform: !isLogin ? "translateX(0%)" : "translateX(-100%)",
                opacity: !isLogin ? 1 : 0,
                transition:
                  "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform, opacity",
                pointerEvents: !isLogin ? "auto" : "none",
              }}>
              <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600 mb-8">
                  Create your SSMS account to manage student, parent and teacher
                  access.
                </p>

                <Form
                  form={signupForm}
                  onFinish={handleSignupSubmit}
                  layout="vertical"
                  requiredMark={false}>
                  <div className="space-y-4">
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name",
                        },
                      ]}
                      style={getFieldDelay(2)}>
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Full Name"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label="Account Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select your account type",
                        },
                      ]}
                      style={getFieldDelay(3)}>
                      <select
                        className="w-full rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 py-3 px-4 text-base text-gray-700 bg-white shadow-sm transition-all duration-300"
                        defaultValue="">
                       <option value="" disabled>
                          Continue as Student/Parent/Teacher/admin
                        </option>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </Form.Item>

                    <div
                      className="text-xs text-gray-500 mb-2 pl-1"
                      style={getFieldDelay(3.5)}>
                      Admin accounts are created internally.
                    </div>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                      style={getFieldDelay(4)}>
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Email Address"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your mobile number",
                        },
                      ]}
                      style={getFieldDelay(5)}>
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        placeholder="Mobile Number"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters",
                        },
                      ]}
                      style={getFieldDelay(6)}>
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}
                      style={getFieldDelay(7)}>
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm Password"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item style={getFieldDelay(9)}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full rounded-xl h-12 text-base font-semibold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>

                <p
                  className="text-center text-gray-600 mt-6"
                  style={getFieldDelay(8)}>
                  Already have an account?{" "}
                  <button
                    onClick={() => handleToggle(true)}
                    disabled={isAnimating}
                    className="text-indigo-600 font-semibold hover:text-indigo-700 transform transition-all duration-200 hover:scale-105 disabled:opacity-50">
                    Login
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Vertical Slide Animation */}
        <div className="md:hidden bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center gap-3 mb-8 transform transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">SSMS</div>
                <div className="text-sm text-gray-600">Smart School System</div>
              </div>
            </div>

            <div className="flex border-b border-gray-200 mb-8">
              <button
                onClick={() => handleToggle(true)}
                disabled={isAnimating}
                className={`flex-1 pb-4 text-center font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                  isLogin
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}>
                Login
              </button>
              <button
                onClick={() => handleToggle(false)}
                disabled={isAnimating}
                className={`flex-1 pb-4 text-center font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                  !isLogin
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}>
                Sign Up
              </button>
            </div>

            {/* Mobile Forms Container */}
            <div className="relative overflow-hidden">
              {/* Login Form */}
              <div
                style={{
                  transform: isLogin ? "translateY(0)" : "translateY(-20px)",
                  opacity: isLogin ? 1 : 0,
                  transition:
                    "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                  pointerEvents: isLogin ? "auto" : "none",
                  position: isLogin ? "relative" : "absolute",
                  width: "100%",
                }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Welcome Back!
                </h2>

                <div className="flex gap-3 mb-6">
                  {[FaGoogle, FaFacebook].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl transform transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50 hover:scale-105 active:scale-95">
                      <Icon
                        className={`text-lg ${
                          idx === 0 ? "text-red-500" : "text-blue-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Form
                  form={loginForm}
                  onFinish={handleLoginSubmit}
                  layout="vertical"
                  requiredMark={false}>
                  <div className="space-y-4">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}>
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Email Address"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                      ]}>
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>
                  </div>

                  <div className="flex items-center justify-between mb-6 mt-4">
                    <Link
                      to="/forgot-password"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      Forgot?
                    </Link>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full rounded-xl h-12 text-base font-semibold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                      Login
                    </Button>
                  </Form.Item>
                </Form>
              </div>

              {/* Signup Form */}
              <div
                style={{
                  transform: !isLogin ? "translateY(0)" : "translateY(-20px)",
                  opacity: !isLogin ? 1 : 0,
                  transition:
                    "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                  pointerEvents: !isLogin ? "auto" : "none",
                  position: !isLogin ? "relative" : "absolute",
                  width: "100%",
                  top: 0,
                }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Create Account
                </h2>

                <div className="flex gap-3 mb-6">
                  {[FaGoogle, FaFacebook].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl transform transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-50 hover:scale-105 active:scale-95">
                      <Icon
                        className={`text-lg ${
                          idx === 0 ? "text-red-500" : "text-blue-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or register with
                    </span>
                  </div>
                </div>

                <Form
                  form={signupForm}
                  onFinish={handleSignupSubmit}
                  layout="vertical"
                  requiredMark={false}>
                  <div className="space-y-4">
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your full name",
                        },
                      ]}>
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Full Name"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="role"
                      label="Account Type"
                      rules={[
                        {
                          required: true,
                          message: "Please select your account type",
                        },
                      ]}>
                      <select
                        className="w-full rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 py-3 px-4 text-base text-gray-700 bg-white shadow-sm transition-all duration-300"
                        defaultValue="">
                        <option value="" disabled>
                          Continue as Student/Parent/Teacher/admin
                        </option>
                        <option value="student">Student</option>
                        <option value="parent">Parent</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">admin</option>
                      </select>
                    </Form.Item>

                    <div className="text-xs text-gray-500 mb-2 pl-1">
                      Admin accounts are created internally.
                    </div>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        {
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}>
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Email Address"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your mobile number",
                        },
                      ]}>
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        placeholder="Mobile Number"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters",
                        },
                      ]}>
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Password"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Passwords do not match")
                            );
                          },
                        }),
                      ]}>
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm Password"
                        size="large"
                        className="rounded-xl transform transition-all duration-300 focus:scale-[1.02]"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      className="w-full rounded-xl h-12 text-base font-semibold transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95">
                      Sign Up
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-all duration-300 transform hover:scale-105">
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
