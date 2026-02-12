/**
 * Subjects Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing school subjects
 */

import React, { useState, useEffect } from "react";
import * as subjectService from "../../../services/subject.service";
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
  IdcardOutlined,
} from "@ant-design/icons";

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await classService.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      message.error(error.message);
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

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);

      const resolvedClassIds = Array.isArray(subject.classIds)
        ? subject.classIds.map((c) => c?._id || c).filter(Boolean)
        : subject.classId
          ? [subject.classId?._id || subject.classId]
          : [];

      form.setFieldsValue({
        name: subject.name,
        code: subject.code,
        classIds: resolvedClassIds,
        assignedTeacher: subject.assignedTeacher?._id || "",
        academicYear: subject.academicYear,
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const payload = { ...values };
    if (!Array.isArray(payload.classIds) || payload.classIds.length === 0)
      delete payload.classIds;
    if (!payload.assignedTeacher) delete payload.assignedTeacher;

    // Backward compatibility: if older parts still send classId, strip it here
    if (payload.classId) delete payload.classId;

    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, payload);
        message.success("Subject updated successfully!");
      } else {
        await subjectService.createSubject(payload);
        message.success("Subject created successfully!");
      }
      handleCloseModal();
      fetchSubjects();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = async (subjectId) => {
    Modal.confirm({
      title: "Delete Subject",
      content: "Are you sure you want to delete this subject?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await subjectService.deleteSubject(subjectId);
          message.success("Subject deleted successfully!");
          fetchSubjects();
        } catch (error) {
          message.error(error.message);
        }
      },
    });
  };

  const getActionItems = (subject) => [
    {
      key: "edit",
      label: "Edit Subject",
      icon: <EditOutlined />,
      onClick: () => handleOpenModal(subject),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Subject",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(subject._id),
    },
  ];

  const filteredSubjects = subjects.filter((sub) =>
    `${sub.name} ${sub.code} ${sub.academicYear}`
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
                Subject Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage school subjects, assign teachers, and link to classes
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchSubjects}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                Add Subject
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Subjects</p>
              <p className="text-2xl font-bold text-slate-900">
                {subjects.length}
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
                {subjects.filter((s) => s.assignedTeacher).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl text-purple-600" />
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
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <IdcardOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Assigned to Class</p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  subjects.filter((s) => {
                    const ids = Array.isArray(s.classIds)
                      ? s.classIds
                      : s.classId
                        ? [s.classId]
                        : [];
                    return ids.length > 0;
                  }).length
                }
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
            placeholder="Search subjects by name, code, or year..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Subject Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-slate-200">
                <Skeleton avatar active />
              </Card>
            ))}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                {searchQuery
                  ? "No subjects found matching your search"
                  : "No subjects found. Create your first subject to get started."}
              </span>
            }
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => (
              <Card
                key={subject._id}
                className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                bodyStyle={{ padding: "20px" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <BookOutlined className="text-2xl text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Code: {subject.code}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    menu={{ items: getActionItems(subject) }}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const linkedClasses = Array.isArray(subject.classIds)
                        ? subject.classIds
                        : subject.classId
                          ? [subject.classId]
                          : [];

                      if (!linkedClasses.length) {
                        return <Tag color="default">No Class</Tag>;
                      }

                      const visible = linkedClasses.slice(0, 2);
                      const remaining = linkedClasses.length - visible.length;

                      return (
                        <>
                          {visible.map((cls) => (
                            <Tag
                              key={cls?._id || cls}
                              icon={<BookOutlined />}
                              color="purple"
                              style={{ fontWeight: 500 }}>
                              {cls?.name || "Class"}{" "}
                              {cls?.section ? `- ${cls.section}` : ""}
                            </Tag>
                          ))}
                          {remaining > 0 ? (
                            <Tag color="purple" style={{ fontWeight: 500 }}>
                              +{remaining} more
                            </Tag>
                          ) : null}
                        </>
                      );
                    })()}
                    <Tag color="cyan" style={{ fontWeight: 500 }}>
                      {subject.academicYear}
                    </Tag>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {subject.assignedTeacher ? (
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
                          {subject.assignedTeacher.userId?.name || "N/A"}
                        </span>
                      </div>
                    ) : (
                      <Tag color="default">No Teacher Assigned</Tag>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Create/Edit Subject Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingSubject ? "Edit Subject" : "Add New Subject"}
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
            label={<span className="font-medium">Subject Name</span>}
            rules={[{ required: true, message: "Subject name is required" }]}>
            <Input size="large" placeholder="e.g., Mathematics" />
          </Form.Item>

          <Form.Item
            name="code"
            label={<span className="font-medium">Subject Code</span>}
            rules={[{ required: true, message: "Subject code is required" }]}>
            <Input size="large" placeholder="e.g., MATH101" />
          </Form.Item>

          <Form.Item
            name="academicYear"
            label={<span className="font-medium">Academic Year</span>}
            rules={[{ required: true, message: "Academic year is required" }]}>
            <Input size="large" placeholder="e.g., 2024-2025" />
          </Form.Item>

          <Form.Item
            name="classIds"
            label={<span className="font-medium">Classes (Optional)</span>}>
            <Select
              size="large"
              mode="multiple"
              placeholder="Select one or more classes"
              allowClear
              showSearch
              optionFilterProp="children">
              {classes.map((cls) => (
                <Select.Option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section} ({cls.academicYear})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assignedTeacher"
            label={
              <span className="font-medium">Assigned Teacher (Optional)</span>
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

          <Form.Item
            name="description"
            label={<span className="font-medium">Description (Optional)</span>}>
            <Input.TextArea
              rows={3}
              size="large"
              placeholder="Enter subject description"
            />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700">
              {editingSubject ? "Update" : "Create"} Subject
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectsPage;
