/**
 * User Management Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing system users
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
  Avatar,
  Card,
  Tooltip,
  Popconfirm,
  Badge,
  Dropdown,
  Empty,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  ReloadOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BookOutlined,
  UserSwitchOutlined,
  CopyOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  SafetyOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
import {
  getAllUsers,
  createUser,
  updateUser,
  resetUserPassword,
  deleteUser,
  generatePassword,
  getDashboardStats,
} from "../../../services/admin.service";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({});
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeTab !== "all") {
        filters.role = activeTab;
      }
      const response = await getAllUsers(filters);
      setUsers(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getRoleConfig = (role) => {
    const configs = {
      admin: {
        color: "#dc2626",
        bgColor: "#fee2e2",
        label: "Admin",
        icon: <SafetyOutlined />,
      },
      teacher: {
        color: "#2563eb",
        bgColor: "#dbeafe",
        label: "Teacher",
        icon: <BookOutlined />,
      },
      student: {
        color: "#16a34a",
        bgColor: "#dcfce7",
        label: "Student",
        icon: <UserOutlined />,
      },
      parent: {
        color: "#9333ea",
        bgColor: "#f3e8ff",
        label: "Parent",
        icon: <TeamOutlined />,
      },
    };
    return configs[role] || configs.student;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: "#16a34a",
        bgColor: "#dcfce7",
        label: "Active",
        icon: <CheckCircleOutlined />,
      },
      suspended: {
        color: "#ea580c",
        bgColor: "#ffedd5",
        label: "Suspended",
        icon: <StopOutlined />,
      },
      inactive: {
        color: "#6b7280",
        bgColor: "#f3f4f6",
        label: "Inactive",
        icon: <CloseCircleOutlined />,
      },
    };
    return configs[status] || configs.active;
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setIsPasswordModalOpen(true);
  };

  const handleSetNewPassword = (user) => {
    setSelectedUser(user);
    setGeneratedPassword("");
    setIsPasswordModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
      fetchStats();
    } catch (error) {
      message.error(error.message || "Error deleting user");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, values);
        message.success("User updated successfully");
      } else {
        const passwordToUse = generatedPassword || generatePassword();
        if (!generatedPassword) {
          setGeneratedPassword(passwordToUse);
        }
        await createUser({ ...values, password: passwordToUse });
        message.success("User created successfully");
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      setGeneratedPassword("");
      fetchUsers();
      fetchStats();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!selectedUser?._id || !generatedPassword) {
        message.error("Missing user or generated password");
        return;
      }

      await resetUserPassword(selectedUser._id, generatedPassword);
      message.success("Password reset successfully");
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setGeneratedPassword("");
    } catch (error) {
      message.error(error.message || "Error resetting password");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    form.setFieldsValue({ password: newPassword });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  const getActionItems = (user) => [
    {
      key: "edit",
      label: "Edit User",
      icon: <EditOutlined />,
      onClick: () => handleEdit(user),
    },
    {
      key: "reset",
      label: "Reset Password",
      icon: <LockOutlined />,
      onClick: () => handleResetPassword(user),
    },
    {
      key: "set-password",
      label: "Set New Password",
      icon: <LockOutlined />,
      onClick: () => handleSetNewPassword(user),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete User",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Delete User",
          content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          okText: "Delete",
          okType: "danger",
          onOk: () => handleDelete(user._id),
        });
      },
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabs = [
    { key: "all", label: "All Users", count: stats.totalUsers || 0 },
    { key: "admin", label: "Admins", count: null },
    { key: "teacher", label: "Teachers", count: stats.totalTeachers || 0 },
    { key: "student", label: "Students", count: stats.totalStudents || 0 },
    { key: "parent", label: "Parents", count: stats.totalParents || 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                User Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage all system users, roles, and permissions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingUser(null);
                  form.resetFields();
                  setGeneratedPassword("");
                  handleGeneratePassword();
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Active</p>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.activeUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <StopOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.suspendedUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Classes</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalClasses || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {tab.label}
              {tab.count !== null && (
                <span
                  style={{
                    marginLeft: 8,
                    display: "inline-flex",
                    alignItems: "center",
                  }}>
                  <Badge
                    count={tab.count}
                    style={{
                      backgroundColor:
                        activeTab === tab.key ? "white" : "#e2e8f0",
                      color: activeTab === tab.key ? "#2563eb" : "#475569",
                    }}
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input.Search
            placeholder="Search by name or email..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-slate-200">
                <Skeleton avatar active />
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                {searchQuery
                  ? "No users found matching your search"
                  : "No users in this category"}
              </span>
            }
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const roleConfig = getRoleConfig(user.role);
              const statusConfig = getStatusConfig(user.status || "active");

              return (
                <Card
                  key={user._id}
                  className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size={48}
                        icon={roleConfig.icon}
                        style={{
                          backgroundColor: roleConfig.bgColor,
                          color: roleConfig.color,
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base">
                          {user.name}
                        </h3>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <Dropdown
                      menu={{ items: getActionItems(user) }}
                      trigger={["click"]}
                      placement="bottomRight">
                      <Button
                        type="text"
                        icon={<MoreOutlined />}
                        className="hover:bg-slate-100"
                      />
                    </Dropdown>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <PhoneOutlined className="text-slate-400" />
                      <span>{user.phone || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag
                        icon={roleConfig.icon}
                        style={{
                          backgroundColor: roleConfig.bgColor,
                          color: roleConfig.color,
                          border: "none",
                          fontWeight: 500,
                        }}>
                        {roleConfig.label}
                      </Tag>
                      <Tag
                        icon={statusConfig.icon}
                        style={{
                          backgroundColor: statusConfig.bgColor,
                          color: statusConfig.color,
                          border: "none",
                          fontWeight: 500,
                        }}>
                        {statusConfig.label}
                      </Tag>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                      <IdcardOutlined />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingUser ? "Edit User" : "Create New User"}
          </div>
        }
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setGeneratedPassword("");
        }}
        width={700}
        okText={editingUser ? "Update User" : "Create User"}
        okButtonProps={{
          className: "bg-blue-600 hover:bg-blue-700",
        }}
        confirmLoading={loading}>
        <Form
          form={form}
          layout="vertical"
          className="mt-6"
          autoComplete="off"
          onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={<span className="font-medium">Full Name</span>}
              rules={[{ required: true, message: "Please enter user's name" }]}>
              <Input
                size="large"
                placeholder="Enter full name"
                prefix={<UserOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={<span className="font-medium">Email Address</span>}
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}>
              <Input
                size="large"
                placeholder="user@example.com"
                prefix={<MailOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="font-medium">Phone Number</span>}
              rules={[
                { required: true, message: "Please enter phone number" },
              ]}>
              <Input
                size="large"
                placeholder="Enter phone number"
                prefix={<PhoneOutlined className="text-slate-400" />}
              />
            </Form.Item>

            <Form.Item
              name="role"
              label={<span className="font-medium">Role</span>}
              rules={[{ required: true, message: "Please select a role" }]}>
              <Select
                size="large"
                placeholder="Select role"
                suffixIcon={<TeamOutlined className="text-slate-400" />}>
                <Select.Option value="admin">
                  <UserSwitchOutlined /> Admin
                </Select.Option>
                <Select.Option value="teacher">
                  <BookOutlined /> Teacher
                </Select.Option>
                <Select.Option value="student">
                  <UserOutlined /> Student
                </Select.Option>
                <Select.Option value="parent">
                  <TeamOutlined /> Parent
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              label={<span className="font-medium">Address</span>}
              className="col-span-2">
              <Input.TextArea
                size="large"
                placeholder="Enter address"
                rows={2}
              />
            </Form.Item>
          </div>

          {!editingUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <LockOutlined className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-2">
                    Auto-Generated Password
                  </p>
                  {generatedPassword ? (
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-sm font-mono text-blue-700 font-semibold">
                          {generatedPassword}
                        </code>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(generatedPassword)}
                          className="hover:bg-blue-100 text-blue-600">
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        ⚠️ Save this password - it will only be shown once!
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-700">
                      A secure password will be generated automatically when you
                      create the user.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            <LockOutlined className="mr-2" />
            Set New Password
          </div>
        }
        open={isPasswordModalOpen}
        onOk={handlePasswordReset}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
          setGeneratedPassword("");
        }}
        okText="Update Password"
        okButtonProps={{
          className: "bg-orange-600 hover:bg-orange-700",
        }}
        confirmLoading={loading}>
        <div className="py-4">
          <p className="text-slate-600 mb-4">
            Set a new password for{" "}
            <span className="font-semibold text-slate-900">
              {selectedUser?.name}
            </span>
            .
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <LockOutlined className="text-orange-600 mt-1" />
              <div className="flex-1">
                <p className="font-medium text-orange-900 mb-2">
                  Set New Password
                </p>
                <div className="bg-white rounded-lg p-3 border border-orange-200">
                  <div className="flex flex-col gap-3">
                    <Input.Password
                      size="large"
                      placeholder="Enter new password (min 6 characters)"
                      value={generatedPassword}
                      onChange={(e) => setGeneratedPassword(e.target.value)}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setGeneratedPassword(generatePassword())}
                        className="hover:border-orange-500 hover:text-orange-600">
                        Generate
                      </Button>
                      <Button
                        type="text"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(generatedPassword)}
                        disabled={!generatedPassword}
                        className="hover:bg-orange-100 text-orange-600">
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-orange-600">
                      Password must be at least 6 characters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
