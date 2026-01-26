/**
 * User Management Page
 * Comprehensive admin page for managing all users in the system
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
  Tabs,
  Card,
  Tooltip,
  Popconfirm,
  Badge,
  Divider,
  Row,
  Col,
  Statistic,
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
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

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

  const getRoleColor = (role) => {
    const colors = {
      admin: "red",
      teacher: "blue",
      student: "green",
      parent: "purple",
    };
    return colors[role] || "default";
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className={`bg-${getRoleColor(record.role)}-100 text-${getRoleColor(
              record.role,
            )}-600`}
            style={{
              backgroundColor:
                record.role === "admin"
                  ? "#fee2e2"
                  : record.role === "teacher"
                    ? "#dbeafe"
                    : record.role === "student"
                      ? "#dcfce7"
                      : "#f3e8ff",
              color:
                record.role === "admin"
                  ? "#dc2626"
                  : record.role === "teacher"
                    ? "#2563eb"
                    : record.role === "student"
                      ? "#16a34a"
                      : "#9333ea",
            }}
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Reset Password">
            <Button
              type="text"
              icon={<LockOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this user?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Delete"
              okType="danger"
              cancelText="Cancel">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

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
    passwordForm.setFieldsValue({ newPassword });
    setIsPasswordModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
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
        await createUser(values);
        message.success("User created successfully");
      }
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
      fetchStats();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  const handlePasswordReset = async (values) => {
    try {
      await resetUserPassword(selectedUser._id, values.newPassword);
      message.success("Password reset successfully");
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      passwordForm.resetFields();
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
    message.success("Password copied to clipboard");
  };

  const tabItems = [
    {
      key: "all",
      label: (
        <span>
          <TeamOutlined /> All Users
          <Badge count={stats.totalUsers} showZero className="ml-2" />
        </span>
      ),
    },
    {
      key: "admin",
      label: (
        <span>
          <UserSwitchOutlined /> Admins
        </span>
      ),
    },
    {
      key: "teacher",
      label: (
        <span>
          <BookOutlined /> Teachers
          <Badge
            count={stats.totalTeachers}
            showZero
            className="ml-2"
            style={{ backgroundColor: "#3b82f6" }}
          />
        </span>
      ),
    },
    {
      key: "student",
      label: (
        <span>
          <UserOutlined /> Students
          <Badge
            count={stats.totalStudents}
            showZero
            className="ml-2"
            style={{ backgroundColor: "#22c55e" }}
          />
        </span>
      ),
    },
    {
      key: "parent",
      label: (
        <span>
          <TeamOutlined /> Parents
          <Badge
            count={stats.totalParents}
            showZero
            className="ml-2"
            style={{ backgroundColor: "#a855f7" }}
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Create, manage, and configure all system users"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management" },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingUser(null);
                form.resetFields();
                setGeneratedPassword("");
                setIsModalOpen(true);
              }}>
              Add User
            </Button>
          </Space>
        }
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Total Users"
              value={stats.totalUsers || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Active"
              value={stats.activeUsers || 0}
              valueStyle={{ color: "#22c55e" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Suspended"
              value={stats.suspendedUsers || 0}
              valueStyle={{ color: "#f59e0b" }}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Classes"
              value={stats.totalClasses || 0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          showSearch
          searchPlaceholder="Search users by name or email..."
          rowKey="_id"
        />
      </Card>

      {/* Create/Edit User Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Create New User"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
          form.resetFields();
        }}
        footer={null}
        width={600}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}>
            <Input prefix={<UserOutlined />} placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}>
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter email address"
              disabled={!!editingUser}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}>
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}>
              <Select placeholder="Select role" disabled={!!editingUser}>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="teacher">Teacher</Select.Option>
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="parent">Parent</Select.Option>
              </Select>
            </Form.Item>
          </div>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                addonAfter={
                  <Tooltip title="Generate Password">
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={handleGeneratePassword}
                    />
                  </Tooltip>
                }
              />
            </Form.Item>
          )}

          {generatedPassword && !editingUser && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm">
                Generated: <strong>{generatedPassword}</strong>
              </span>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(generatedPassword)}>
                Copy
              </Button>
            </div>
          )}

          <Divider />

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                  form.resetFields();
                }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password for ${selectedUser?.name}`}
        open={isPasswordModalOpen}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
          passwordForm.resetFields();
        }}
        footer={null}
        width={450}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordReset}
          className="mt-4">
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter new password"
            />
          </Form.Item>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm">
              Generated: <strong>{generatedPassword}</strong>
            </span>
            <Space>
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => {
                  const newPass = generatePassword();
                  setGeneratedPassword(newPass);
                  passwordForm.setFieldsValue({ newPassword: newPass });
                }}>
                New
              </Button>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(generatedPassword)}>
                Copy
              </Button>
            </Space>
          </div>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setSelectedUser(null);
                  passwordForm.resetFields();
                }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
