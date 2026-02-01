/**
 * Classes Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing school classes
 */

import React, { useState, useEffect } from "react";
import * as classService from "../../../services/class.service";
import { getAllTeachers } from "../../../services/admin.service";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Card,
  Avatar,
  Tag,
  Dropdown,
  Empty,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classService.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleOpenModal = (classItem = null) => {
    if (classItem) {
      setEditingClass(classItem);
      form.setFieldsValue({
        name: classItem.name,
        section: classItem.section,
        academicYear: classItem.academicYear,
        classTeacher: classItem.classTeacher?._id || "",
      });
    } else {
      setEditingClass(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.classTeacher) delete payload.classTeacher;

    try {
      if (editingClass) {
        await classService.updateClass(editingClass._id, payload);
        message.success("Class updated successfully!");
      } else {
        await classService.createClass(payload);
        message.success("Class created successfully!");
      }
      handleCloseModal();
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
      message.error(error.message);
    }
  };

  const handleDelete = async (classId) => {
    Modal.confirm({
      title: "Delete Class",
      content: "Are you sure you want to delete this class?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await classService.deleteClass(classId);
          message.success("Class deleted successfully!");
          fetchClasses();
        } catch (error) {
          console.error("Error deleting class:", error);
          message.error(error.message);
        }
      },
    });
  };

  const getActionItems = (classItem) => [
    {
      key: "edit",
      label: "Edit Class",
      icon: <EditOutlined />,
      onClick: () => handleOpenModal(classItem),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Class",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(classItem._id),
    },
  ];

  const filteredClasses = classes.filter((cls) =>
    `${cls.name} ${cls.section} ${cls.academicYear}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Class Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage school classes, sections, and class teachers
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchClasses}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                Add Class
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Classes</p>
              <p className="text-2xl font-bold text-slate-900">
                {classes.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">With Teachers</p>
              <p className="text-2xl font-bold text-blue-600">
                {classes.filter((c) => c.classTeacher).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Teachers</p>
              <p className="text-2xl font-bold text-slate-900">
                {teachers.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Active Classes</p>
              <p className="text-2xl font-bold text-orange-600">
                {classes.filter((c) => c.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm">
        {/* Search Bar */}
        <div className="mb-6">
          <Input.Search
            placeholder="Search classes by name, section, or year..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Class Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-slate-200">
                <Skeleton avatar active />
              </Card>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                {searchQuery
                  ? "No classes found matching your search"
                  : "No classes found. Create your first class to get started."}
              </span>
            }
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((classItem) => (
              <Card
                key={classItem._id}
                className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                bodyStyle={{ padding: "20px" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                      <BookOutlined className="text-2xl text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">
                        {classItem.name} - {classItem.section}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {classItem.academicYear}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    menu={{ items: getActionItems(classItem) }}
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
                  {classItem.classTeacher ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor: "#dbeafe",
                          color: "#2563eb",
                        }}
                      />
                      <span className="text-sm text-slate-700">
                        {classItem.classTeacher.userId?.name || "Not Assigned"}
                      </span>
                    </div>
                  ) : (
                    <Tag color="default">No Class Teacher</Tag>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <Tag color="blue" style={{ fontWeight: 500 }}>
                      {classItem.subjects?.length || 0} subjects
                    </Tag>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Create/Edit Class Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingClass ? "Edit Class" : "Add New Class"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4">
          <Form.Item
            name="name"
            label={<span className="font-medium">Class Name</span>}
            rules={[{ required: true, message: "Class name is required" }]}>
            <Input size="large" placeholder="e.g., Grade 10" />
          </Form.Item>

          <Form.Item
            name="section"
            label={<span className="font-medium">Section</span>}
            rules={[{ required: true, message: "Section is required" }]}>
            <Input size="large" placeholder="e.g., A, B, C" />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label={<span className="font-medium">Academic Year</span>}
            rules={[{ required: true, message: "Academic year is required" }]}>
            <Input size="large" placeholder="e.g., 2024-2025" />
          </Form.Item>

          <Form.Item
            name="classTeacher"
            label={
              <span className="font-medium">Class Teacher (Optional)</span>
            }>
            <Select
              size="large"
              placeholder="Select a teacher"
              allowClear
              showSearch
              optionFilterProp="children">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.userId?.name || "N/A"} ({teacher.userId?.email || ""}
                  )
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700">
              {editingClass ? "Update" : "Create"} Class
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassesPage;
