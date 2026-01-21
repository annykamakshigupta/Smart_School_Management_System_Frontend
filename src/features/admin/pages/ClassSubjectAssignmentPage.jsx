/**
 * Class Subject Assignment Page
 * Admin page for managing class-teacher and subject-teacher assignments
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Select,
  Tag,
  Space,
  message,
  Avatar,
  Card,
  Tooltip,
  Tabs,
  Row,
  Col,
  Divider,
  List,
  Empty,
  Badge,
} from "antd";
import {
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
  BookOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
import {
  getUsersByRole,
  assignClassTeacher,
  assignTeacherToSubject,
  getTeacherAssignments,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";
import { getAllSubjects } from "../../../services/subject.service";

const ClassSubjectAssignmentPage = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("classes");
  const [isAssignTeacherModalOpen, setIsAssignTeacherModalOpen] =
    useState(false);
  const [isAssignSubjectTeacherModalOpen, setIsAssignSubjectTeacherModalOpen] =
    useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherAssignments, setTeacherAssignments] = useState(null);
  const [form] = Form.useForm();
  const [subjectForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesRes, subjectsRes, teachersRes] = await Promise.all([
        getAllClasses(),
        getAllSubjects(),
        getUsersByRole("teacher"),
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const classColumns = [
    {
      title: "Class",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOutlined className="text-purple-600" />
          </div>
          <div>
            <div className="font-medium">
              {text} - {record.section}
            </div>
            <div className="text-xs text-gray-500">{record.academicYear}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Class Teacher",
      dataIndex: "classTeacher",
      key: "classTeacher",
      render: (teacher) =>
        teacher ? (
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-blue-100"
            />
            <span>
              {teacher.firstName} {teacher.lastName}
            </span>
          </div>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        ),
    },
    {
      title: "Subjects",
      dataIndex: "subjects",
      key: "subjects",
      render: (subjects) => (
        <Badge count={subjects?.length || 0} showZero>
          <Tag color="blue">Subjects</Tag>
        </Badge>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Tooltip title="Assign Class Teacher">
          <Button
            type="primary"
            size="small"
            icon={<UserSwitchOutlined />}
            onClick={() => handleOpenAssignTeacher(record)}>
            Assign Teacher
          </Button>
        </Tooltip>
      ),
    },
  ];

  const subjectColumns = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <BookOutlined className="text-green-600" />
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-500">Code: {record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Class",
      dataIndex: "classId",
      key: "class",
      render: (classData) =>
        classData ? (
          <Tag color="purple">
            {classData.name} - {classData.section}
          </Tag>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        ),
    },
    {
      title: "Assigned Teacher",
      dataIndex: "assignedTeacher",
      key: "teacher",
      render: (teacher) =>
        teacher ? (
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-blue-100"
            />
            <span>
              {teacher.firstName} {teacher.lastName}
            </span>
          </div>
        ) : (
          <Tag color="default">Not Assigned</Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Tooltip title="Assign Teacher">
          <Button
            type="primary"
            size="small"
            icon={<UserSwitchOutlined />}
            onClick={() => handleOpenAssignSubjectTeacher(record)}>
            Assign Teacher
          </Button>
        </Tooltip>
      ),
    },
  ];

  const handleOpenAssignTeacher = (classRecord) => {
    setSelectedClass(classRecord);
    form.setFieldsValue({
      teacherId: classRecord.classTeacher?._id,
    });
    setIsAssignTeacherModalOpen(true);
  };

  const handleOpenAssignSubjectTeacher = (subject) => {
    setSelectedSubject(subject);
    subjectForm.setFieldsValue({
      teacherId: subject.assignedTeacher?._id,
    });
    setIsAssignSubjectTeacherModalOpen(true);
  };

  const handleAssignClassTeacher = async (values) => {
    try {
      await assignClassTeacher(selectedClass._id, values.teacherId);
      message.success("Class teacher assigned successfully");
      setIsAssignTeacherModalOpen(false);
      setSelectedClass(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error assigning class teacher");
    }
  };

  const handleAssignSubjectTeacher = async (values) => {
    try {
      await assignTeacherToSubject(selectedSubject._id, values.teacherId);
      message.success("Teacher assigned to subject successfully");
      setIsAssignSubjectTeacherModalOpen(false);
      setSelectedSubject(null);
      subjectForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error assigning teacher to subject");
    }
  };

  const handleViewTeacherAssignments = async (teacher) => {
    try {
      const response = await getTeacherAssignments(teacher._id);
      setTeacherAssignments(response.data);
      setSelectedTeacher(teacher);
    } catch (error) {
      message.error(error.message || "Error fetching teacher assignments");
    }
  };

  // Stats
  const classesWithTeacher = classes.filter((c) => c.classTeacher).length;
  const subjectsWithTeacher = subjects.filter((s) => s.assignedTeacher).length;

  const tabItems = [
    {
      key: "classes",
      label: (
        <span>
          <BookOutlined /> Classes
          <Badge count={classes.length} showZero className="ml-2" />
        </span>
      ),
      children: (
        <DataTable
          columns={classColumns}
          data={classes}
          loading={loading}
          showSearch
          searchPlaceholder="Search classes..."
          rowKey="_id"
        />
      ),
    },
    {
      key: "subjects",
      label: (
        <span>
          <BookOutlined /> Subjects
          <Badge
            count={subjects.length}
            showZero
            className="ml-2"
            style={{ backgroundColor: "#22c55e" }}
          />
        </span>
      ),
      children: (
        <DataTable
          columns={subjectColumns}
          data={subjects}
          loading={loading}
          showSearch
          searchPlaceholder="Search subjects..."
          rowKey="_id"
        />
      ),
    },
    {
      key: "teachers",
      label: (
        <span>
          <TeamOutlined /> Teachers
          <Badge
            count={teachers.length}
            showZero
            className="ml-2"
            style={{ backgroundColor: "#3b82f6" }}
          />
        </span>
      ),
      children: (
        <Row gutter={[16, 16]}>
          {teachers.map((teacher) => (
            <Col key={teacher._id} xs={24} sm={12} lg={8}>
              <Card
                size="small"
                hoverable
                onClick={() => handleViewTeacherAssignments(teacher)}>
                <div className="flex items-center gap-3">
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    className="bg-blue-100 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {teacher.firstName} {teacher.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{teacher.email}</div>
                  </div>
                  <Button size="small">View</Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Class & Subject Assignment"
        subtitle="Assign teachers to classes and subjects"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "Academics", path: "/admin/academics/classes" },
          { label: "Assignments" },
        ]}
        actions={
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Refresh
          </Button>
        }
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{classes.length}</div>
                <div className="text-xs text-gray-500">Total Classes</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{classesWithTeacher}</div>
                <div className="text-xs text-gray-500">With Class Teacher</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{subjects.length}</div>
                <div className="text-xs text-gray-500">Total Subjects</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-yellow-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{teachers.length}</div>
                <div className="text-xs text-gray-500">Total Teachers</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      {/* Assign Class Teacher Modal */}
      <Modal
        title={`Assign Class Teacher - ${selectedClass?.name} ${selectedClass?.section}`}
        open={isAssignTeacherModalOpen}
        onCancel={() => {
          setIsAssignTeacherModalOpen(false);
          setSelectedClass(null);
          form.resetFields();
        }}
        footer={null}
        width={500}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAssignClassTeacher}
          className="mt-4">
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-purple-600" />
              </div>
              <div>
                <div className="font-medium">
                  {selectedClass?.name} - {selectedClass?.section}
                </div>
                <div className="text-xs text-gray-500">
                  {selectedClass?.academicYear}
                </div>
              </div>
            </div>
          </div>

          <Form.Item
            name="teacherId"
            label="Select Teacher"
            rules={[{ required: true, message: "Please select a teacher" }]}>
            <Select
              placeholder="Select teacher"
              showSearch
              optionFilterProp="children">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName} ({teacher.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsAssignTeacherModalOpen(false);
                  setSelectedClass(null);
                  form.resetFields();
                }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Assign Teacher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Subject Teacher Modal */}
      <Modal
        title={`Assign Teacher - ${selectedSubject?.name}`}
        open={isAssignSubjectTeacherModalOpen}
        onCancel={() => {
          setIsAssignSubjectTeacherModalOpen(false);
          setSelectedSubject(null);
          subjectForm.resetFields();
        }}
        footer={null}
        width={500}>
        <Form
          form={subjectForm}
          layout="vertical"
          onFinish={handleAssignSubjectTeacher}
          className="mt-4">
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-green-600" />
              </div>
              <div>
                <div className="font-medium">{selectedSubject?.name}</div>
                <div className="text-xs text-gray-500">
                  Code: {selectedSubject?.code} | Class:{" "}
                  {selectedSubject?.classId?.name || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <Form.Item
            name="teacherId"
            label="Select Teacher"
            rules={[{ required: true, message: "Please select a teacher" }]}>
            <Select
              placeholder="Select teacher"
              showSearch
              optionFilterProp="children">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName} ({teacher.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button
                onClick={() => {
                  setIsAssignSubjectTeacherModalOpen(false);
                  setSelectedSubject(null);
                  subjectForm.resetFields();
                }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Assign Teacher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Teacher Assignments Modal */}
      <Modal
        title={`Assignments - ${selectedTeacher?.name}`}
        open={!!teacherAssignments}
        onCancel={() => {
          setTeacherAssignments(null);
          setSelectedTeacher(null);
        }}
        footer={null}
        width={600}>
        {teacherAssignments && (
          <div className="mt-4">
            <Divider orientation="left">Assigned Classes</Divider>
            {teacherAssignments.assignedClasses?.length > 0 ? (
              <List
                size="small"
                dataSource={teacherAssignments.assignedClasses}
                renderItem={(cls) => (
                  <List.Item>
                    <Tag color="purple">
                      {cls.name} - {cls.section} ({cls.academicYear})
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No classes assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}

            <Divider orientation="left">Assigned Subjects</Divider>
            {teacherAssignments.assignedSubjects?.length > 0 ? (
              <List
                size="small"
                dataSource={teacherAssignments.assignedSubjects}
                renderItem={(subject) => (
                  <List.Item>
                    <div className="flex items-center gap-2">
                      <Tag color="green">{subject.name}</Tag>
                      <span className="text-gray-500 text-xs">
                        Class: {subject.classId?.name || "N/A"}
                      </span>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No subjects assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ClassSubjectAssignmentPage;
