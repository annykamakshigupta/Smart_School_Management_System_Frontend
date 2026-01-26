/**
 * Parent Child Mapping Page
 * Admin page for linking parents to students
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
} from "@ant-design/icons";
import { PageHeader, DataTable } from "../../../components/UI";
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

  const columns = [
    {
      title: "Parent",
      dataIndex: "userId",
      key: "parent",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<TeamOutlined />}
            className="bg-purple-100 text-purple-600"
          />
          <div>
            <div className="font-medium">{user?.name || "N/A"}</div>
            <div className="text-xs text-gray-500">{user?.email || "N/A"}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "userId",
      key: "phone",
      render: (user) => user?.phone || "N/A",
    },
    {
      title: "Children",
      dataIndex: "children",
      key: "children",
      render: (children) => (
        <div className="flex flex-wrap gap-1">
          {children && children.length > 0 ? (
            children.map((child, index) => (
              <Tag key={index} color="green">
                {child?.userId?.name || "Unknown"} (
                {child?.classId?.name || "N/A"})
              </Tag>
            ))
          ) : (
            <Tag color="default">No children assigned</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Assign Children">
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleOpenLinkModal(record)}>
              Assign Child
            </Button>
          </Tooltip>
          <Tooltip title="View Children">
            <Button
              size="small"
              icon={<TeamOutlined />}
              onClick={() => handleViewDetails(record)}>
              View
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

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

  return (
    <div>
      <PageHeader
        title="Parent-Child Mapping"
        subtitle="Link parents to their children for attendance and academic tracking"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "User Management", path: "/admin/users" },
          { label: "Parent-Child Mapping" },
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
                <TeamOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parents.length}</div>
                <div className="text-xs text-gray-500">Total Parents</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <LinkOutlined className="text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">{parentsWithChildren}</div>
                <div className="text-xs text-gray-500">With Children</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DisconnectOutlined className="text-yellow-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {parentsWithoutChildren}
                </div>
                <div className="text-xs text-gray-500">Without Children</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card size="small">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-red-600 text-lg" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {studentsWithoutParent}
                </div>
                <div className="text-xs text-gray-500">Students No Parent</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Parent-Child Mapping Table */}
      <Card>
        <DataTable
          columns={columns}
          data={parents}
          loading={loading}
          rowKey="_id"
        />
      </Card>

      {/* Students Without Parent Section */}
      {studentsWithoutParent > 0 && (
        <Card
          className="mt-6"
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-orange-600" />
              <span>Students Without Parent ({studentsWithoutParent})</span>
            </div>
          }>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 6,
            }}
            dataSource={students.filter((s) => !s.parentId)}
            renderItem={(student) => (
              <List.Item>
                <Card
                  size="small"
                  hoverable
                  className="border border-orange-200"
                  actions={[
                    <Button
                      key="assign"
                      type="link"
                      icon={<LinkOutlined />}
                      onClick={() => handleQuickAssign(student)}>
                      Assign Parent
                    </Button>,
                  ]}>
                  <Card.Meta
                    avatar={
                      <Avatar
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#f97316" }}
                      />
                    }
                    title={student.userId?.name || "Unknown"}
                    description={
                      <div className="text-xs">
                        <div>{student.userId?.email || "N/A"}</div>
                        <div className="mt-1">
                          <Tag color="blue" className="text-xs">
                            {student.classId?.name || "No Class"}
                          </Tag>
                          {student.section && (
                            <Tag color="green" className="text-xs">
                              {student.section}
                            </Tag>
                          )}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Assign Children Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
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
        width={600}
        className="rounded-lg">
        <div className="mb-4 p-4 bg-linear-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-3">
            <Avatar
              size={48}
              icon={<TeamOutlined />}
              className="bg-purple-500"
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
            label="Students (Multi-select)"
            rules={[
              { required: true, message: "Please select at least one student" },
            ]}
            extra="You can select multiple students to assign at once">
            <Select
              mode="multiple"
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
                loading={assignLoading}>
                Assign Children
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Quick Assign Modal (from student to parent) */}
      <Modal
        title={
          <div className="flex items-center gap-2">
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
        width={500}
        className="rounded-lg">
        {selectedStudent && (
          <>
            <div className="mb-4 p-4 bg-linear-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-green-500"
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
                label="Parent"
                rules={[{ required: true, message: "Please select a parent" }]}>
                <Select
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
                    loading={assignLoading}>
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
