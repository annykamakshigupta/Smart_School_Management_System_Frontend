/**
 * Students Management Page
 * Admin page for managing students
 */

import { useState } from "react";
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
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  // Mock data - replace with API calls
  const [students] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@ssms.edu",
      phone: "555-1001",
      class: "10A",
      rollNo: "001",
      status: "active",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@ssms.edu",
      phone: "555-1002",
      class: "10A",
      rollNo: "002",
      status: "active",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.d@ssms.edu",
      phone: "555-1003",
      class: "10B",
      rollNo: "003",
      status: "active",
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.b@ssms.edu",
      phone: "555-1004",
      class: "9A",
      rollNo: "004",
      status: "inactive",
    },
    {
      id: 5,
      name: "Eva Miller",
      email: "eva.m@ssms.edu",
      phone: "555-1005",
      class: "9B",
      rollNo: "005",
      status: "active",
    },
  ]);

  const columns = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">
              Roll No: {record.rollNo}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Student",
      content: "Are you sure you want to delete this student?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        message.success("Student deleted successfully");
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        message.success("Student updated successfully");
      } else {
        message.success("Student added successfully");
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage all students in the system"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Students" },
        ]}
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingStudent(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>
            Add Student
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={students}
        showSearch
        showFilters
        filterOptions={[
          {
            key: "class",
            label: "Class",
            options: [
              { value: "9A", label: "9A" },
              { value: "9B", label: "9B" },
              { value: "10A", label: "10A" },
              { value: "10B", label: "10B" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ],
          },
        ]}
        searchPlaceholder="Search students..."
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
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
            rules={[{ required: true, message: "Please enter student name" }]}>
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
              name="class"
              label="Class"
              rules={[{ required: true, message: "Please select class" }]}>
              <Select placeholder="Select class">
                <Select.Option value="9A">9A</Select.Option>
                <Select.Option value="9B">9B</Select.Option>
                <Select.Option value="10A">10A</Select.Option>
                <Select.Option value="10B">10B</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="rollNo"
              label="Roll Number"
              rules={[{ required: true, message: "Please enter roll number" }]}>
              <Input placeholder="Enter roll number" />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingStudent ? "Update" : "Add"} Student
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
