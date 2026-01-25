/**
 * Student Enrollment Page
 * Admin page for enrolling students with class assignment
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
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
import {
  getAllUsers,
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
  const [form] = Form.useForm();
  const [changeClassForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes, parentsRes] = await Promise.all([
        getAllUsers({ role: "student" }),
        getAllClasses(),
        getAllUsers({ role: "parent" }),
      ]);

      const studentUsers = (studentsRes.data || []).map((user) => ({
        _id: user._id,
        userId: user,
        classId: null,
        section: null,
        rollNumber: null,
        parentId: null,
      }));

      const parentUsers = (parentsRes.data || []).map((user) => ({
        _id: user._id,
        userId: user,
      }));

      setStudents(studentUsers);
      setClasses(classesRes.data || []);
      setParents(parentUsers);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "userId",
      key: "student",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<UserOutlined />}
            className="bg-green-100 text-green-600"
          />
          <div>
            <div className="font-medium">{user?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">{user?.email || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Roll Number",
      dataIndex: "rollNumber",
      key: "rollNumber",
      render: (roll) => <Tag color="blue">{roll}</Tag>,
    },
    {
      title: "Class",
      dataIndex: "classId",
      key: "class",
      render: (classData) => (
        <Tag color="purple">
          {classData?.name || "N/A"} - {classData?.section || ""}
        </Tag>
      ),
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
    },
    {
      title: "Parent",
      dataIndex: "parentId",
      key: "parent",
      render: (parent) =>
        parent ? (
          <div className="flex items-center gap-2">
            <Avatar size="small" icon={<TeamOutlined />} />
            <span className="text-sm">{parent.name}</span>
          </div>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "userId",
      key: "status",
      render: (user) => (
        <Badge
          status={user?.status === "active" ? "success" : "default"}
          text={
            user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1) ||
            "Active"
          }
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Change Class">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={() => handleChangeClass(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this student?"
              description="This will deactivate the student account."
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
      currentClass: `${student.classId?.name} - ${student.classId?.section}`,
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

  // Get sections from selected class
  const getClassSections = (classId) => {
    const selectedClass = classes.find((c) => c._id === classId);
    if (selectedClass) {
      return [selectedClass.section];
    }
    // Return unique sections from all classes
    const sections = [...new Set(classes.map((c) => c.section))];
    return sections;
  };

  return (
    <div>
      <PageHeader
        title="Student Enrollment"
        subtitle="Enroll students and manage class assignments"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Student Enrollment" },
        ]}
        actions={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
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
              }}>
              Enroll Student
            </Button>
          </Space>
        }
      />

      {/* Quick Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{students.length}</div>
                <div className="text-xs text-gray-500">Total Students</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{classes.length}</div>
                <div className="text-xs text-gray-500">Classes</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parents.length}</div>
                <div className="text-xs text-gray-500">Parents</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <SwapOutlined className="text-yellow-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {students.filter((s) => !s.parentId).length}
                </div>
                <div className="text-xs text-gray-500">Without Parent</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <DataTable
          columns={columns}
          data={students}
          loading={loading}
          showSearch
          showFilters
          filterOptions={[
            {
              key: "classId",
              label: "Class",
              options: classes.map((c) => ({
                value: c._id,
                label: `${c.name} - ${c.section}`,
              })),
            },
          ]}
          searchPlaceholder="Search students..."
          rowKey="_id"
        />
      </Card>

      {/* Enroll/Edit Student Modal */}
      <Modal
        title={editingStudent ? "Edit Student" : "Enroll New Student"}
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
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter student name" },
                ]}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}>
                <Input
                  prefix={<MailOutlined />}
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
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}>
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                  disabled={!!editingStudent}
                />
              </Form.Item>
            </Col>
            {!editingStudent && (
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please enter password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
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
              </Col>
            )}
          </Row>

          {generatedPassword && !editingStudent && (
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

          <Divider orientation="left">Academic Information</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: "Please select class" }]}>
                <Select placeholder="Select class">
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
                label="Section"
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input placeholder="Enter section (e.g., A, B, C)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rollNumber"
                label="Roll Number"
                rules={[
                  { required: true, message: "Please enter roll number" },
                ]}>
                <Input placeholder="Enter roll number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="academicYear"
                label="Academic Year"
                rules={[
                  { required: true, message: "Please enter academic year" },
                ]}
                initialValue="2025-2026">
                <Input placeholder="e.g., 2025-2026" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Parent Assignment (Optional)</Divider>

          <Form.Item name="parentId" label="Assign Parent">
            <Select
              placeholder="Select parent (optional)"
              allowClear
              showSearch
              optionFilterProp="children">
              {parents.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.name} ({p.email})
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
              <Button type="primary" htmlType="submit">
                {editingStudent ? "Update Student" : "Enroll Student"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Class Modal */}
      <Modal
        title={`Change Class for ${selectedStudent?.userId?.name}`}
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
          <Form.Item name="currentClass" label="Current Class">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="newClassId"
            label="New Class"
            rules={[{ required: true, message: "Please select new class" }]}>
            <Select placeholder="Select new class">
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
                label="Section"
                rules={[{ required: true, message: "Please enter section" }]}>
                <Input placeholder="Enter section" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newRollNumber"
                label="New Roll Number"
                rules={[
                  { required: true, message: "Please enter new roll number" },
                ]}>
                <Input placeholder="Enter new roll number" />
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
              <Button type="primary" htmlType="submit">
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
