/**
 * Admin Attendance Page - Modern & Classy Design
 * Manage all attendance records with beautiful interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  message,
  Modal,
  Form,
  Select,
  Input,
  Empty,
  Table,
  Tag,
  DatePicker,
  Spin,
  Statistic,
  Tooltip,
  Row,
  Col,
  Space,
  Avatar,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TeamOutlined,
  BookOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import {
  getAttendanceByClass,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../../../services/attendance.service";
import { getAllClasses } from "../../../services/class.service";
import { getAllSubjects } from "../../../services/subject.service";
import dayjs from "dayjs";

const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const AdminAttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [summary, setSummary] = useState(null);
  const [editModal, setEditModal] = useState({ visible: false, record: null });
  const [form] = Form.useForm();

  // Filters
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes] = await Promise.all([
        getAllClasses(),
        getAllSubjects(),
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      message.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      const params = {
        classId: selectedClass,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const [attendanceRes, summaryRes] = await Promise.all([
        getAttendanceByClass(params),
        getAttendanceSummary(params).catch(() => null),
      ]);

      setAttendance(attendanceRes.data || []);
      setSummary(summaryRes?.data || null);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSubject, dateRange]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedSubject, dateRange, fetchAttendance]);

  // Handle edit
  const handleEdit = (record) => {
    setEditModal({ visible: true, record });
    form.setFieldsValue({
      status: record.status,
      remarks: record.remarks,
    });
  };

  // Handle edit submit
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateAttendance(editModal.record._id, values);
      message.success("Attendance updated successfully");
      setEditModal({ visible: false, record: null });
      form.resetFields();
      fetchAttendance();
    } catch (error) {
      message.error(error.message || "Error updating attendance");
    }
  };

  // Handle delete
  const handleDelete = (record) => {
    const student = record.studentId;
    const studentName =
      student?.userId?.name || student?.user?.name || "this student";

    confirm({
      title: "Delete Attendance Record",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: `Are you sure you want to delete this attendance record for ${studentName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteAttendance(record._id);
          message.success("Attendance deleted successfully");
          fetchAttendance();
        } catch (error) {
          message.error(error.message || "Error deleting attendance");
        }
      },
    });
  };

  // Calculate local summary
  const localSummary = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    localSummary.total > 0
      ? Math.round((localSummary.present / localSummary.total) * 100)
      : 0;

  // Filter subjects by selected class
  const filteredSubjects = subjects.filter(
    (s) =>
      !selectedClass ||
      s.classId === selectedClass ||
      s.classId?._id === selectedClass,
  );

  // Table columns with modern design
  const columns = [
    {
      title: (
        <Space>
          <CalendarOutlined />
          <span>Date</span>
        </Space>
      ),
      dataIndex: "date",
      key: "date",
      width: 140,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <div className="text-xs text-blue-600 font-semibold">
              {dayjs(date).format("MMM")}
            </div>
            <div className="text-sm font-bold text-blue-900">
              {dayjs(date).format("DD")}
            </div>
          </div>
          <div>
            <div className="font-medium text-slate-700">
              {dayjs(date).format("ddd")}
            </div>
            <div className="text-xs text-slate-500">
              {dayjs(date).format("YYYY")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <UserOutlined />
          <span>Student</span>
        </Space>
      ),
      dataIndex: "studentId",
      key: "student",
      render: (studentId) => {
        const student = studentId;
        const userName =
          student?.userId?.name || student?.user?.name || "Unknown Student";
        const rollNumber = student?.rollNumber || "N/A";

        return (
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              className="bg-blue-500 shrink-0"
              icon={<UserOutlined />}>
              {userName?.[0]?.toUpperCase()}
            </Avatar>
            <div>
              <div className="font-semibold text-slate-900">{userName}</div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <TeamOutlined className="text-[10px]" />
                Roll: {rollNumber}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: (
        <Space>
          <TeamOutlined />
          <span>Class</span>
        </Space>
      ),
      dataIndex: "classId",
      key: "class",
      render: (cls, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <TeamOutlined className="text-indigo-600" />
          </div>
          <span className="font-medium text-slate-700">
            {(cls?.name || record?.class?.name) ?? "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <BookOutlined />
          <span>Subject</span>
        </Space>
      ),
      dataIndex: "subjectId",
      key: "subject",
      render: (subject, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <BookOutlined className="text-purple-600" />
          </div>
          <span className="font-medium text-slate-700">
            {(subject?.name || record?.subject?.name) ?? "N/A"}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      filters: [
        { text: "Present", value: "present" },
        { text: "Absent", value: "absent" },
        { text: "Late", value: "late" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = {
          present: {
            icon: <CheckCircleOutlined />,
            label: "Present",
            className: "border-emerald-200 bg-emerald-50 text-emerald-700",
          },
          absent: {
            icon: <CloseCircleOutlined />,
            label: "Absent",
            className: "border-red-200 bg-red-50 text-red-700",
          },
          late: {
            icon: <ClockCircleOutlined />,
            label: "Late",
            className: "border-amber-200 bg-amber-50 text-amber-700",
          },
        };
        const statusConfig = config[status] || config.present;
        return (
          <Tag
            icon={statusConfig.icon}
            className={`px-3 py-1 font-medium border ${statusConfig.className}`}>
            {statusConfig.label}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-blue-600" />}
              onClick={() => handleEdit(record)}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined className="text-red-600" />}
              onClick={() => handleDelete(record)}
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle="Manage all attendance records across the institution"
      />

      {/* Filter Card */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <div className="mb-4">
          <Title level={5} className="mb-0 flex items-center gap-2">
            <FilterOutlined className="text-blue-600" />
            Filter Attendance Records
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <TeamOutlined className="mr-2" />
              Class
            </label>
            <Select
              placeholder="Select Class"
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                setSelectedSubject(null);
              }}
              className="w-full"
              size="large"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {classes.map((cls) => (
                <Select.Option key={cls._id} value={cls._id}>
                  {cls.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <BookOutlined className="mr-2" />
              Subject
            </label>
            <Select
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              size="large"
              disabled={!selectedClass}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {filteredSubjects.map((subject) => (
                <Select.Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <CalendarOutlined className="mr-2" />
              Date Range
            </label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
              size="large"
              format="MMM DD, YYYY"
            />
          </Col>

          <Col xs={24} sm={12} lg={2}>
            <label className="block text-sm font-semibold text-slate-700 mb-2 opacity-0">
              Action
            </label>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAttendance}
              loading={loading}
              disabled={!selectedClass}
              size="large"
              className="w-full">
              Refresh
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Cards */}
      {selectedClass && (
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-slate-600 flex items-center gap-2">
                    <TeamOutlined />
                    Total Records
                  </Text>
                }
                value={localSummary.total}
                valueStyle={{ color: "#475569", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-emerald-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-emerald-700 flex items-center gap-2 font-semibold">
                    <CheckCircleOutlined />
                    Present
                  </Text>
                }
                value={localSummary.present}
                valueStyle={{ color: "#059669", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-red-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-red-700 flex items-center gap-2 font-semibold">
                    <CloseCircleOutlined />
                    Absent
                  </Text>
                }
                value={localSummary.absent}
                valueStyle={{ color: "#dc2626", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={12} sm={12} md={6} lg={6}>
            <Card className="border-0 shadow-md rounded-xl bg-amber-50 hover:shadow-lg transition-shadow">
              <Statistic
                title={
                  <Text className="text-amber-700 flex items-center gap-2 font-semibold">
                    <ClockCircleOutlined />
                    Late
                  </Text>
                }
                value={localSummary.late}
                valueStyle={{ color: "#d97706", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Attendance Rate Progress */}
      {selectedClass && localSummary.total > 0 && (
        <Card className="border-0 shadow-md rounded-xl">
          <Row align="middle" gutter={24}>
            <Col xs={24} md={4}>
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-28 h-28">
                    <circle
                      cx="56"
                      cy="56"
                      r="52"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="52"
                      stroke={
                        attendanceRate >= 75
                          ? "#10b981"
                          : attendanceRate >= 50
                            ? "#f59e0b"
                            : "#ef4444"
                      }
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${attendanceRate * 3.27} 327`}
                      strokeLinecap="round"
                      transform="rotate(-90 56 56)"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Text className="text-2xl font-bold text-slate-900">
                      {attendanceRate}%
                    </Text>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={20}>
              <Title level={4} className="mb-2 flex items-center gap-2">
                <TrophyOutlined className="text-blue-600" />
                Overall Attendance Rate
              </Title>
              <Text className="text-slate-600">
                {attendanceRate >= 75
                  ? "Excellent attendance across the institution!"
                  : attendanceRate >= 50
                    ? "Good attendance. Some classes need improvement."
                    : "Low attendance. Immediate intervention required."}
              </Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* Attendance Table */}
      <Card
        className="border-0 shadow-lg rounded-2xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarOutlined className="text-blue-600 text-lg" />
            </div>
            <div>
              <Title level={4} className="mb-0">
                Attendance Records
              </Title>
              <Text className="text-slate-500 text-sm">
                Manage and monitor student attendance
              </Text>
            </div>
          </div>
        }>
        {!selectedClass ? (
          <Empty
            description={
              <div>
                <Text className="text-slate-600">
                  Please select a class to view attendance records
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={attendance}
            rowKey="_id"
            loading={loading}
            rowClassName={(record) => {
              const status = record?.status;
              if (status === "present") return "bg-emerald-50";
              if (status === "absent") return "bg-red-50";
              if (status === "late") return "bg-amber-50";
              return "";
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} records`,
              className: "px-4",
            }}
            locale={{
              emptyText: (
                <Empty
                  description="No attendance records found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
            className="modern-table"
            scroll={{ x: 1000 }}
          />
        )}
      </Card>

      {/* Edit Attendance Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <EditOutlined className="text-blue-600" />
            </div>
            <span className="text-lg font-semibold">Edit Attendance</span>
          </div>
        }
        open={editModal.visible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModal({ visible: false, record: null });
          form.resetFields();
        }}
        okText="Update"
        okButtonProps={{ className: "bg-blue-600" }}
        width={500}>
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}>
            <Select size="large">
              <Select.Option value="present">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-emerald-500" />
                  <span>Present</span>
                </div>
              </Select.Option>
              <Select.Option value="absent">
                <div className="flex items-center gap-2">
                  <CloseCircleOutlined className="text-red-500" />
                  <span>Absent</span>
                </div>
              </Select.Option>
              <Select.Option value="late">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-amber-500" />
                  <span>Late</span>
                </div>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea
              rows={4}
              maxLength={500}
              placeholder="Add any remarks or notes..."
              showCount
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAttendancePage;
