/**
 * Student Enrollment Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing student enrollment
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
  Divider,
  Row,
  Col,
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
  BookOutlined,
  SwapOutlined,
  CopyOutlined,
  MoreOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import {
  getAllStudents,
  getAllParents,
  createStudent,
  updateStudent,
  generatePassword,
  changeStudentClass,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

const StudentEnrollmentPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeClassModalOpen, setIsChangeClassModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const [changeClassForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes, parentsRes] = await Promise.all([
        getAllStudents(),
        getAllClasses(),
        getAllParents(),
      ]);

      setStudents(studentsRes.data || []);
      setClasses(classesRes.data || []);
      setParents(parentsRes.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      name: student.userId?.name,
      email: student.userId?.email,
      phone: student.userId?.phone,
      classId: student.classId?._id,
      section: student.section,
      rollNumber: student.rollNumber,
      parentId: student.parentId?._id || null,
      academicYear: student.academicYear,
    });
    setIsModalOpen(true);
  };

  const handleChangeClass = (student) => {
    setSelectedStudent(student);
    changeClassForm.setFieldsValue({
      currentClass: student.classId
        ? `${student.classId?.name} - ${student.classId?.section}`
        : "Not assigned",
      newClassId: null,
      newSection: student.section,
      newRollNumber: "",
    });
    setIsChangeClassModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      // Soft delete - just deactivate
      message.success("Student deleted successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error deleting student");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, {
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId,
          academicYear: values.academicYear,
        });
        message.success("Student updated successfully");
      } else {
        await createStudent({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          classId: values.classId,
          section: values.section,
          rollNumber: values.rollNumber,
          parentId: values.parentId || null,
          academicYear: values.academicYear,
        });
        message.success("Student enrolled successfully");
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Operation failed");
    }
  };

  const handleChangeClassSubmit = async (values) => {
    try {
      await changeStudentClass(
        selectedStudent._id,
        values.newClassId,
        values.newSection,
        values.newRollNumber,
      );
      message.success("Student class changed successfully");
      setIsChangeClassModalOpen(false);
      setSelectedStudent(null);
      changeClassForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error changing class");
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

  const getActionItems = (student) => [
    {
      key: "edit",
      label: "Edit Student",
      icon: <EditOutlined />,
      onClick: () => handleEdit(student),
    },
    {
      key: "changeClass",
      label: "Change Class",
      icon: <SwapOutlined />,
      onClick: () => handleChangeClass(student),
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      label: "Delete Student",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => {
        Modal.confirm({
          title: "Delete Student",
          content: `Are you sure you want to delete ${student.userId?.name}? This will deactivate the student account.`,
          okText: "Delete",
          okType: "danger",
          onOk: () => handleDelete(student._id),
        });
      },
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.userId?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Student Enrollment
              </h1>
              <p className="text-slate-500 mt-1">
                Enroll students and manage class assignments
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingStudent(null);
                  form.resetFields();
                  setGeneratedPassword("");
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                Enroll Student
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
              <UserOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-slate-900">
                {students.length}
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
                {classes.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Parents</p>
              <p className="text-2xl font-bold text-slate-900">
                {parents.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <SwapOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Without Parent</p>
              <p className="text-2xl font-bold text-orange-600">
                {students.filter((s) => !s.parentId).length}
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
            placeholder="Search by name, email, or roll number..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Student Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-slate-200">
                <Skeleton avatar active />
              </Card>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                {searchQuery
                  ? "No students found matching your search"
                  : "No students enrolled yet"}
              </span>
            }
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card
                key={student._id}
                className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                bodyStyle={{ padding: "20px" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={48}
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: "#dcfce7",
                        color: "#16a34a",
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">
                        {student.userId?.name || "N/A"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {student.userId?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    menu={{ items: getActionItems(student) }}
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
                    <Tag
                      icon={<IdcardOutlined />}
                      color="blue"
                      style={{ fontWeight: 500 }}>
                      Roll: {student.rollNumber || "N/A"}
                    </Tag>
                    {student.classId && (
                      <Tag
                        icon={<BookOutlined />}
                        color="purple"
                        style={{ fontWeight: 500 }}>
                        {student.classId?.name} - {student.classId?.section}
                      </Tag>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {student.parentId ? (
                      <Tag
                        icon={<TeamOutlined />}
                        color="green"
                        style={{ fontWeight: 500 }}>
                        Has Parent
                      </Tag>
                    ) : (
                      <Tag color="orange" style={{ fontWeight: 500 }}>
                        No Parent
                      </Tag>
                    )}
                    <Tag color="cyan" style={{ fontWeight: 500 }}>
                      {student.academicYear || "2025-2026"}
                    </Tag>
                  </div>

                  {student.parentId && (
                    <div className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                      <TeamOutlined className="mr-1" />
                      Parent: {student.parentId.userId?.name || "N/A"}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Enroll/Edit Student Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingStudent ? "Edit Student" : "Enroll New Student"}
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        footer={null}
        width={700}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4">
          <Divider orientation="left">Personal Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={<span className="font-medium">Full Name</span>}
                rules={[
                  { required: true, message: "Please enter student name" },
                ]}>
                <Input
                  size="large"
                  prefix={<UserOutlined className="text-slate-400" />}
                  placeholder="Enter full name"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label={<span className="font-medium">Email</span>}
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}>
                <Input
                  size="large"
                  prefix={<MailOutlined className="text-slate-400" />}
                  placeholder="Enter email"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span className="font-medium">Phone Number</span>}
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}>
                <Input
                  size="large"
                  prefix={<PhoneOutlined className="text-slate-400" />}
                  placeholder="Enter phone number"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
            {!editingStudent && (
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={<span className="font-medium">Password</span>}
                  rules={[
                    { required: true, message: "Please enter password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}>
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="text-slate-400" />}
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
              </Col>
            )}
          </Row>

          {generatedPassword && !editingStudent && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <LockOutlined className="text-blue-600 mt-1" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 mb-2">
                    Generated Password
                  </p>
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
                </div>
              </div>
            </div>
          )}

          <Divider orientation="left">Academic Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classId"
                label={<span className="font-medium">Class</span>}
                rules={[{ required: true, message: "Please select class" }]}>
                <Select size="large" placeholder="Select class">
                  {classes.map((c) => (
                    <Select.Option key={c._id} value={c._id}>
                      {c.name} - {c.section}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="section"
                label={<span className="font-medium">Section</span>}
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input
                  size="large"
                  placeholder="Enter section (e.g., A, B, C)"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rollNumber"
                label={<span className="font-medium">Roll Number</span>}
                rules={[
                  { required: true, message: "Please enter roll number" },
                ]}>
                <Input size="large" placeholder="Enter roll number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="academicYear"
                label={<span className="font-medium">Academic Year</span>}
                rules={[
                  { required: true, message: "Please enter academic year" },
                ]}
                initialValue="2025-2026">
                <Input size="large" placeholder="e.g., 2025-2026" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Parent Assignment (Optional)</Divider>

          <Form.Item
            name="parentId"
            label={<span className="font-medium">Assign Parent</span>}>
            <Select
              size="large"
              placeholder="Select parent (optional)"
              allowClear
              showSearch
              optionFilterProp="children">
              {parents.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.userId?.name || "N/A"} ({p.userId?.email || "N/A"})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingStudent(null);
                  form.resetFields();
                }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700">
                {editingStudent ? "Update Student" : "Enroll Student"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Class Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            Change Class for {selectedStudent?.userId?.name}
          </div>
        }
        open={isChangeClassModalOpen}
        onCancel={() => {
          setIsChangeClassModalOpen(false);
          setSelectedStudent(null);
          changeClassForm.resetFields();
        }}
        footer={null}
        width={500}>
        <Form
          form={changeClassForm}
          layout="vertical"
          onFinish={handleChangeClassSubmit}
          className="mt-4">
          <Form.Item
            name="currentClass"
            label={<span className="font-medium">Current Class</span>}>
            <Input size="large" disabled />
          </Form.Item>

          <Form.Item
            name="newClassId"
            label={<span className="font-medium">New Class</span>}
            rules={[{ required: true, message: "Please select new class" }]}>
            <Select size="large" placeholder="Select new class">
              {classes.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name} - {c.section}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="newSection"
                label={<span className="font-medium">Section</span>}
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input size="large" placeholder="Enter section" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newRollNumber"
                label={<span className="font-medium">New Roll Number</span>}
                rules={[
                  { required: true, message: "Please enter new roll number" },
                ]}>
                <Input size="large" placeholder="Enter new roll number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsChangeClassModalOpen(false);
                  setSelectedStudent(null);
                  changeClassForm.resetFields();
                }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700">
                Change Class
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentEnrollmentPage;
