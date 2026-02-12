/**
 * Class Subject Assignment Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for managing class-teacher and subject-teacher assignments
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
  Dropdown,
  Skeleton,
  Input,
} from "antd";
import {
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
  BookOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  getAllTeachers,
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
  const [searchQuery, setSearchQuery] = useState("");
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
        getAllTeachers(),
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

  const getClassActionItems = (classRecord) => [
    {
      key: "assign",
      label: "Assign Class Teacher",
      icon: <UserSwitchOutlined />,
      onClick: () => handleOpenAssignTeacher(classRecord),
    },
  ];

  const getSubjectActionItems = (subject) => [
    {
      key: "assign",
      label: "Assign Teacher",
      icon: <UserSwitchOutlined />,
      onClick: () => handleOpenAssignSubjectTeacher(subject),
    },
  ];

  const filteredClasses = classes.filter((cls) =>
    `${cls.name} ${cls.section}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const filteredSubjects = subjects.filter((sub) =>
    `${sub.name} ${sub.code}`.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tabItems = [
    {
      key: "classes",
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined /> Classes
          <Badge count={classes.length} showZero className="ml-2" />
        </span>
      ),
      children: (
        <div>
          <div className="mb-6">
            <Input.Search
              placeholder="Search classes..."
              size="large"
              allowClear
              value={activeTab === "classes" ? searchQuery : ""}
              onChange={(e) =>
                activeTab === "classes" && setSearchQuery(e.target.value)
              }
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-slate-200">
                  <Skeleton avatar active />
                </Card>
              ))}
            </div>
          ) : filteredClasses.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No classes found"
              className="my-12"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((cls) => (
                <Card
                  key={cls._id}
                  className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                  bodyStyle={{ padding: "20px" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <BookOutlined className="text-2xl text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-base">
                          {cls.name} - {cls.section}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {cls.academicYear}
                        </p>
                      </div>
                    </div>
                    <Dropdown
                      menu={{ items: getClassActionItems(cls) }}
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
                    {cls.classTeacher ? (
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
                          {cls.classTeacher.userId?.name || "N/A"}
                        </span>
                      </div>
                    ) : (
                      <Tag color="default">No Class Teacher</Tag>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      <Tag color="blue" style={{ fontWeight: 500 }}>
                        {cls.subjects?.length || 0} Subjects
                      </Tag>
                      <Tag
                        color={cls.isActive ? "success" : "default"}
                        style={{ fontWeight: 500 }}>
                        {cls.isActive ? "Active" : "Inactive"}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "subjects",
      label: (
        <span className="flex items-center gap-2">
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
        <div>
          <div className="mb-6">
            <Input.Search
              placeholder="Search subjects..."
              size="large"
              allowClear
              value={activeTab === "subjects" ? searchQuery : ""}
              onChange={(e) =>
                activeTab === "subjects" && setSearchQuery(e.target.value)
              }
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-slate-200">
                  <Skeleton avatar active />
                </Card>
              ))}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No subjects found"
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
                      menu={{ items: getSubjectActionItems(subject) }}
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
                      {subject.classId ? (
                        <Tag color="purple" style={{ fontWeight: 500 }}>
                          {subject.classId.name} - {subject.classId.section}
                        </Tag>
                      ) : (
                        <Tag color="default">No Class</Tag>
                      )}
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
                        <Tag color="default">No Teacher</Tag>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "teachers",
      label: (
        <span className="flex items-center gap-2">
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
                className="border border-slate-200 hover:shadow-md transition-all"
                onClick={() => handleViewTeacherAssignments(teacher)}>
                <div className="flex items-center gap-3">
                  <Avatar
                    size="large"
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#2563eb",
                    }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">
                      {teacher.userId?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {teacher.userId?.email || ""}
                    </div>
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
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Class & Subject Assignment
              </h1>
              <p className="text-slate-500 mt-1">
                Assign teachers to classes and subjects
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                className="hover:border-blue-500 hover:text-blue-500">
                Refresh
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
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">With Class Teacher</p>
              <p className="text-2xl font-bold text-green-600">
                {classesWithTeacher}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOutlined className="text-2xl text-blue-600" />
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
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <TeamOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Teachers</p>
              <p className="text-2xl font-bold text-slate-900">
                {teachers.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setSearchQuery("");
          }}
          items={tabItems}
          size="large"
        />
      </Card>

      {/* Assign Class Teacher Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            Assign Class Teacher - {selectedClass?.name}{" "}
            {selectedClass?.section}
          </div>
        }
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
            label={<span className="font-medium">Select Teacher</span>}
            rules={[{ required: true, message: "Please select a teacher" }]}>
            <Select
              size="large"
              placeholder="Select teacher"
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
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700">
                Assign Teacher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Subject Teacher Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            Assign Teacher - {selectedSubject?.name}
          </div>
        }
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
                  {(() => {
                    const linked = Array.isArray(selectedSubject?.classIds)
                      ? selectedSubject.classIds
                      : selectedSubject?.classId
                        ? [selectedSubject.classId]
                        : [];
                    const label = linked.length
                      ? linked.length === 1
                        ? `${linked[0]?.name || "N/A"}${linked[0]?.section ? `-${linked[0].section}` : ""}`
                        : `${linked.length} classes`
                      : "N/A";

                    return (
                      <>
                        Code: {selectedSubject?.code} | Classes: {label}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <Form.Item
            name="teacherId"
            label={<span className="font-medium">Select Teacher</span>}
            rules={[{ required: true, message: "Please select a teacher" }]}>
            <Select
              size="large"
              placeholder="Select teacher"
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
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-600 hover:bg-blue-700">
                Assign Teacher
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Teacher Assignments Modal */}
      <Modal
        title={`Assignments - ${selectedTeacher?.userId?.name || "N/A"}`}
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
                        {(() => {
                          const linked = Array.isArray(subject?.classIds)
                            ? subject.classIds
                            : subject?.classId
                              ? [subject.classId]
                              : [];
                          if (!linked.length) return <>Classes: N/A</>;
                          if (linked.length === 1)
                            return <>Classes: {linked[0]?.name || "N/A"}</>;
                          return <>Classes: {linked.length}</>;
                        })()}
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
