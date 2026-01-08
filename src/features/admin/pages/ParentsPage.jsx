/**
 * Parents Management Page
 * Admin page for managing parents
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

const ParentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const [parents] = useState([
    {
      id: 1,
      name: "Mr. Robert Johnson",
      email: "r.johnson@email.com",
      phone: "555-2001",
      children: ["Alice Johnson"],
      status: "active",
    },
    {
      id: 2,
      name: "Mrs. Linda Williams",
      email: "l.williams@email.com",
      phone: "555-2002",
      children: ["Bob Williams"],
      status: "active",
    },
    {
      id: 3,
      name: "Mr. James Davis",
      email: "j.davis@email.com",
      phone: "555-2003",
      children: ["Carol Davis"],
      status: "active",
    },
    {
      id: 4,
      name: "Mrs. Patricia Brown",
      email: "p.brown@email.com",
      phone: "555-2004",
      children: ["David Brown"],
      status: "inactive",
    },
  ]);

  const columns = [
    {
      title: "Parent",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-purple-100 text-purple-600"
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
      title: "Children",
      dataIndex: "children",
      key: "children",
      render: (children) => (
        <div className="flex flex-wrap gap-1">
          {children.map((child, index) => (
            <Tag key={index} color="blue">
              {child}
            </Tag>
          ))}
        </div>
      ),
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

  const handleEdit = (parent) => {
    setEditingParent(parent);
    form.setFieldsValue(parent);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete Parent",
      content: "Are you sure you want to delete this parent?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        message.success("Parent deleted successfully");
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      if (editingParent) {
        message.success("Parent updated successfully");
      } else {
        message.success("Parent added successfully");
      }
      setIsModalOpen(false);
      setEditingParent(null);
      form.resetFields();
    } catch (error) {
      message.error("Operation failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Parents"
        subtitle="Manage all parents in the system"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Parents" },
        ]}
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingParent(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>
            Add Parent
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={parents}
        showSearch
        searchPlaceholder="Search parents..."
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingParent ? "Edit Parent" : "Add New Parent"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingParent(null);
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
            rules={[{ required: true, message: "Please enter parent name" }]}>
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

          <Form.Item name="status" label="Status" initialValue="active">
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingParent ? "Update" : "Add"} Parent
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ParentsPage;
