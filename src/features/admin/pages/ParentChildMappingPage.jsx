/**
 * Parent Child Mapping Page - Redesigned Modern UI
 * Professional SaaS-style admin interface for linking parents to students
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
  List,
  Empty,
  Row,
  Col,
  Divider,
  Popconfirm,
  Dropdown,
  Skeleton,
  Input,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  ReloadOutlined,
  TeamOutlined,
  LinkOutlined,
  DisconnectOutlined,
  MailOutlined,
  PhoneOutlined,
  MoreOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {
  getAllParents,
  getAllStudents,
  linkChildToParent,
  unlinkChildFromParent,
} from "../../../services/admin.service";

const ParentChildMappingPage = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isQuickAssignModalOpen, setIsQuickAssignModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();
  const [quickAssignForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [parentsRes, studentsRes] = await Promise.all([
        getAllParents(),
        getAllStudents(),
      ]);

      setParents(parentsRes.data || []);
      setStudents(studentsRes.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLinkModal = (parent) => {
    setSelectedParent(parent);
    form.resetFields();
    setIsLinkModalOpen(true);
  };

  const handleViewDetails = (parent) => {
    Modal.info({
      title: `Children of ${parent.userId?.name}`,
      width: 600,
      content: (
        <div className="mt-4">
          {parent.children && parent.children.length > 0 ? (
            <List
              dataSource={parent.children}
              renderItem={(child) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      key="unlink"
                      title="Unlink this child?"
                      onConfirm={() =>
                        handleUnlinkChild(parent._id, child._id)
                      }>
                      <Button size="small" danger icon={<DisconnectOutlined />}>
                        Unlink
                      </Button>
                    </Popconfirm>,
                  ]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-green-100"
                      />
                    }
                    title={child?.userId?.name || "Unknown"}
                    description={
                      <div>
                        <div>
                          Class: {child?.classId?.name || "N/A"} -{" "}
                          {child?.section}
                        </div>
                        <div>Roll: {child?.rollNumber}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No children linked to this parent" />
          )}
        </div>
      ),
    });
  };

  const handleLinkChild = async (values) => {
    try {
      setAssignLoading(true);
      const studentIds = Array.isArray(values.studentIds)
        ? values.studentIds
        : [values.studentIds];

      // Link multiple students to parent
      for (const studentId of studentIds) {
        await linkChildToParent(selectedParent._id, studentId);
      }

      message.success(
        `${studentIds.length} student(s) linked to parent successfully`,
      );
      setIsLinkModalOpen(false);
      setSelectedParent(null);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error linking child");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleQuickAssign = (student) => {
    setSelectedStudent(student);
    quickAssignForm.resetFields();
    setIsQuickAssignModalOpen(true);
  };

  const handleQuickAssignSubmit = async (values) => {
    try {
      setAssignLoading(true);
      await linkChildToParent(values.parentId, selectedStudent._id);
      message.success("Student assigned to parent successfully");
      setIsQuickAssignModalOpen(false);
      setSelectedStudent(null);
      quickAssignForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || "Error assigning student");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnlinkChild = async (parentId, studentId) => {
    try {
      await unlinkChildFromParent(parentId, studentId);
      message.success("Child unlinked from parent successfully");
      fetchData();
    } catch (error) {
      message.error(error.message || "Error unlinking child");
    }
  };

  // Stats
  const parentsWithChildren = parents.filter(
    (p) => p.children && p.children.length > 0,
  ).length;
  const parentsWithoutChildren = parents.length - parentsWithChildren;
  const studentsWithParent = students.filter((s) => s.parentId).length;
  const studentsWithoutParent = students.length - studentsWithParent;

  const getActionItems = (parent) => [
    {
      key: "assign",
      label: "Assign Children",
      icon: <PlusOutlined />,
      onClick: () => handleOpenLinkModal(parent),
    },
    {
      key: "view",
      label: "View Children",
      icon: <TeamOutlined />,
      onClick: () => handleViewDetails(parent),
    },
  ];

  const filteredParents = parents.filter(
    (parent) =>
      parent.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Parent-Child Mapping
              </h1>
              <p className="text-slate-500 mt-1">
                Link parents to their children for attendance and academic
                tracking
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
              <TeamOutlined className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Parents</p>
              <p className="text-2xl font-bold text-slate-900">
                {parents.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <LinkOutlined className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">With Children</p>
              <p className="text-2xl font-bold text-green-600">
                {parentsWithChildren}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <DisconnectOutlined className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Without Children</p>
              <p className="text-2xl font-bold text-orange-600">
                {parentsWithoutChildren}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <UserOutlined className="text-2xl text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Students No Parent</p>
              <p className="text-2xl font-bold text-red-600">
                {studentsWithoutParent}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="border-0 shadow-sm mb-6">
        {/* Search Bar */}
        <div className="mb-6">
          <Input.Search
            placeholder="Search parents by name or email..."
            size="large"
            allowClear
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Parent Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-slate-200">
                <Skeleton avatar active />
              </Card>
            ))}
          </div>
        ) : filteredParents.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-slate-500">
                {searchQuery
                  ? "No parents found matching your search"
                  : "No parents registered yet"}
              </span>
            }
            className="my-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParents.map((parent) => (
              <Card
                key={parent._id}
                className="border border-slate-200 hover:shadow-md transition-all hover:border-blue-300"
                bodyStyle={{ padding: "20px" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={48}
                      icon={<TeamOutlined />}
                      style={{
                        backgroundColor: "#f3e8ff",
                        color: "#9333ea",
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">
                        {parent.userId?.name || "N/A"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {parent.userId?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    menu={{ items: getActionItems(parent) }}
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
                    <span>{parent.userId?.phone || "N/A"}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">Children:</p>
                    <div className="flex flex-wrap gap-1">
                      {parent.children && parent.children.length > 0 ? (
                        parent.children.map((child, idx) => (
                          <Tag
                            key={idx}
                            icon={<UserOutlined />}
                            color="green"
                            style={{ fontWeight: 500 }}>
                            {child?.userId?.name || "Unknown"}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="default">No children assigned</Tag>
                      )}
                    </div>
                  </div>

                  {parent.children && parent.children.length > 0 && (
                    <div className="text-xs text-slate-400 mt-2">
                      <TeamOutlined className="mr-1" />
                      {parent.children.length} child
                      {parent.children.length !== 1 ? "ren" : ""}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Students Without Parent Section */}
      {studentsWithoutParent > 0 && (
        <Card
          className="border-0 shadow-sm"
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-orange-600" />
              <span>Students Without Parent ({studentsWithoutParent})</span>
            </div>
          }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {students
              .filter((s) => !s.parentId)
              .map((student) => (
                <Card
                  key={student._id}
                  size="small"
                  className="border border-orange-200 hover:shadow-md transition-all hover:border-orange-400">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#f97316", color: "white" }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {student.userId?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {student.userId?.email || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Tag color="blue" className="text-xs">
                      {student.classId?.name || "No Class"}
                    </Tag>
                    {student.section && (
                      <Tag color="green" className="text-xs">
                        {student.section}
                      </Tag>
                    )}
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    block
                    icon={<LinkOutlined />}
                    onClick={() => handleQuickAssign(student)}
                    className="bg-orange-600 hover:bg-orange-700">
                    Assign Parent
                  </Button>
                </Card>
              ))}
          </div>
        </Card>
      )}

      {/* Assign Children Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <TeamOutlined className="text-purple-600" />
            Assign Students to Parent
          </div>
        }
        open={isLinkModalOpen}
        onCancel={() => {
          setIsLinkModalOpen(false);
          setSelectedParent(null);
          form.resetFields();
        }}
        footer={null}
        width={600}>
        <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              icon={<TeamOutlined />}
              className="bg-purple-500"
              style={{ backgroundColor: "#9333ea" }}
            />
            <div>
              <div className="font-semibold text-lg">
                {selectedParent?.userId?.name}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <MailOutlined />
                {selectedParent?.userId?.email}
              </div>
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <PhoneOutlined />
                {selectedParent?.userId?.phone || "N/A"}
              </div>
            </div>
          </div>
          {selectedParent?.children?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="text-xs text-gray-600 mb-1">
                Current Children:
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedParent.children.map((child, idx) => (
                  <Tag key={idx} color="purple" className="text-xs">
                    {child?.userId?.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        <Divider className="my-4">Select Students to Assign</Divider>

        <Form form={form} layout="vertical" onFinish={handleLinkChild}>
          <Form.Item
            name="studentIds"
            label={<span className="font-medium">Students (Multi-select)</span>}
            rules={[
              { required: true, message: "Please select at least one student" },
            ]}
            extra="You can select multiple students to assign at once">
            <Select
              mode="multiple"
              size="large"
              placeholder="Search and select students..."
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              maxTagCount="responsive"
              options={students
                .filter(
                  (s) =>
                    !selectedParent?.children?.find((c) => c._id === s._id),
                )
                .map((student) => {
                  const name = student.userId?.name || "Unknown Student";
                  const className = student.classId?.name || "No Class";
                  const section = student.section || "N/A";
                  const rollNumber = student.rollNumber || "N/A";
                  const hasParent = student.parentId ? " [Has Parent]" : "";

                  return {
                    label: `${name} (${className} - ${section}, Roll: ${rollNumber})${hasParent}`,
                    value: student._id,
                    disabled: false,
                  };
                })}
              className="w-full"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setSelectedParent(null);
                  form.resetFields();
                }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LinkOutlined />}
                loading={assignLoading}
                className="bg-blue-600 hover:bg-blue-700">
                Assign Children
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Quick Assign Modal (from student to parent) */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UserOutlined className="text-green-600" />
            Assign Student to Parent
          </div>
        }
        open={isQuickAssignModalOpen}
        onCancel={() => {
          setIsQuickAssignModalOpen(false);
          setSelectedStudent(null);
          quickAssignForm.resetFields();
        }}
        footer={null}
        width={500}>
        {selectedStudent && (
          <>
            <div className="mb-4 p-4 bg-linear-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-green-500"
                  style={{ backgroundColor: "#16a34a" }}
                />
                <div>
                  <div className="font-semibold text-lg">
                    {selectedStudent.userId?.name || "Unknown Student"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {selectedStudent.classId?.name || "No Class"} -{" "}
                    {selectedStudent.section || "N/A"} | Roll:{" "}
                    {selectedStudent.rollNumber || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">
                    <MailOutlined className="mr-1" />
                    {selectedStudent.userId?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-4">Select Parent</Divider>

            <Form
              form={quickAssignForm}
              layout="vertical"
              onFinish={handleQuickAssignSubmit}>
              <Form.Item
                name="parentId"
                label={<span className="font-medium">Parent</span>}
                rules={[{ required: true, message: "Please select a parent" }]}>
                <Select
                  size="large"
                  placeholder="Search and select parent..."
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={parents.map((parent) => ({
                    label: `${parent.userId?.name} (${parent.userId?.email}) - ${parent.children?.length || 0} children`,
                    value: parent._id,
                  }))}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      setIsQuickAssignModalOpen(false);
                      setSelectedStudent(null);
                      quickAssignForm.resetFields();
                    }}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<LinkOutlined />}
                    loading={assignLoading}
                    className="bg-blue-600 hover:bg-blue-700">
                    Assign to Parent
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ParentChildMappingPage;
