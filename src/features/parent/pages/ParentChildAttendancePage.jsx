/**
 * Parent Child Attendance Page - Modern & Classy Design
 * Monitor child's attendance with beautiful interface
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  message,
  DatePicker,
  Select,
  Empty,
  Table,
  Tag,
  Spin,
  Statistic,
  Avatar,
  Row,
  Col,
  Space,
  Typography,
  Alert,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BookOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import {
  getAttendanceForChild,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import { getAllSubjects } from "../../../services/subject.service";
import { getMyChildren } from "../../../services/parent.service";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const ParentChildAttendancePage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const range = getCurrentMonthRange();
    return [dayjs(range.startDate), dayjs(range.endDate)];
  });

  // Fetch children
  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const list = response.data || [];
      setChildren(list);

      const preselected = searchParams.get("child");
      const hasPreselected =
        preselected && list.some((c) => c._id === preselected);
      if (hasPreselected) {
        setSelectedChild(preselected);
      } else if (list.length > 0) {
        setSelectedChild(list[0]._id);
      }
    } catch (error) {
      message.error("Error fetching children");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    if (!selectedChild) return;

    try {
      setLoading(true);
      const params = {
        childId: selectedChild,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getAttendanceForChild(params);
      setAttendance(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedChild, selectedSubject, dateRange]);

  useEffect(() => {
    fetchChildren();
    fetchSubjects();
  }, [fetchChildren, fetchSubjects]);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance();
    }
  }, [selectedChild, fetchAttendance]);

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // Get selected child info
  const selectedChildInfo = children.find(
    (child) => child._id === selectedChild,
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
          <div className="w-10 h-10 bg-violet-50 rounded-lg flex flex-col items-center justify-center">
            <div className="text-xs text-violet-600 font-semibold">
              {dayjs(date).format("MMM")}
            </div>
            <div className="text-sm font-bold text-violet-900">
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
  ];

  if (loading && children.length === 0) {
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
        title="Child's Attendance"
        subtitle="Monitor your child's attendance records and academic performance"
      />

      {/* Child Selector Card */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <div className="mb-4">
          <Title level={5} className="mb-0 flex items-center gap-2">
            <UserOutlined className="text-blue-600" />
            Select Your Child
          </Title>
        </div>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Select
              placeholder="Select a child"
              value={selectedChild}
              onChange={setSelectedChild}
              className="w-full"
              size="large">
              {children.map((child) => (
                <Select.Option key={child._id} value={child._id}>
                  <div className="flex items-center gap-2">
                    <UserOutlined />
                    {child.userId?.name ||
                      child.user?.name ||
                      child.name ||
                      "Student"}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Col>

          {selectedChildInfo && (
            <Col xs={24} md={12}>
              <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-xl">
                <Avatar
                  size={56}
                  icon={<UserOutlined />}
                  className="bg-violet-600 shrink-0">
                  {(selectedChildInfo.userId?.name ||
                    selectedChildInfo.user?.name)?.[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <div className="font-bold text-lg text-slate-900">
                    {selectedChildInfo.userId?.name ||
                      selectedChildInfo.user?.name ||
                      "Student"}
                  </div>
                  <div className="text-sm text-slate-600 flex items-center gap-1">
                    <TeamOutlined />
                    Class:{" "}
                    {selectedChildInfo.classId?.name ||
                      selectedChildInfo.class?.name ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Card>

      {selectedChild ? (
        <>
          {/* Statistics Cards */}
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card className="border-0 shadow-md rounded-xl hover:shadow-lg transition-shadow">
                <Statistic
                  title={
                    <Text className="text-slate-600 flex items-center gap-2">
                      <CalendarOutlined />
                      Total Days
                    </Text>
                  }
                  value={stats.total}
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
                  value={stats.present}
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
                  value={stats.absent}
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
                  value={stats.late}
                  valueStyle={{ color: "#d97706", fontWeight: "bold" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Attendance Rate Card */}
          {stats.total > 0 && (
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
                              ? "#8b5cf6"
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
                    <TrophyOutlined className="text-violet-600" />
                    Child's Attendance Rate
                  </Title>
                  <Text className="text-slate-600 block mb-3">
                    {attendanceRate >= 95
                      ? "Outstanding! Your child maintains excellent attendance."
                      : attendanceRate >= 75
                        ? "Good attendance record. Keep encouraging regular attendance."
                        : attendanceRate >= 50
                          ? "Moderate attendance. Please ensure more regular school attendance."
                          : "Low attendance detected. Please prioritize daily school attendance."}
                  </Text>

                  {attendanceRate >= 95 && (
                    <Alert
                      message="Excellent Performance!"
                      description={`Your child has an outstanding attendance rate of ${attendanceRate}%. This dedication to regular attendance contributes significantly to academic success!`}
                      type="success"
                      icon={<StarOutlined />}
                      showIcon
                      className="mt-2"
                    />
                  )}

                  {attendanceRate < 75 && (
                    <Alert
                      message="Attendance Below Target (75%)"
                      description={`Your child needs ${Math.max(0, Math.ceil((75 * stats.total - stats.present * 100) / 25))} more present days to reach the recommended 75% attendance rate. Regular attendance is crucial for academic success.`}
                      type="warning"
                      icon={<ExclamationCircleOutlined />}
                      showIcon
                      className="mt-2"
                    />
                  )}
                </Col>
              </Row>
            </Card>
          )}

          {/* Filters */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <div className="mb-4">
              <Title level={5} className="mb-0 flex items-center gap-2">
                <CalendarOutlined className="text-blue-600" />
                Filter Attendance Records
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <CalendarOutlined className="mr-2" />
                  Date Range
                </label>
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="MMM DD, YYYY"
                  className="w-full"
                  size="large"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Col>

              <Col xs={24} sm={12}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <BookOutlined className="mr-2" />
                  Subject
                </label>
                <Select
                  placeholder="All Subjects"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  allowClear
                  className="w-full"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option?.children
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }>
                  {subjects.map((subject) => (
                    <Select.Option key={subject._id} value={subject._id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Attendance Table */}
          <Card
            className="border-0 shadow-lg rounded-2xl"
            title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-violet-600 text-lg" />
                </div>
                <div>
                  <Title level={4} className="mb-0">
                    Attendance Records
                  </Title>
                  <Text className="text-slate-500 text-sm">
                    Daily attendance history
                  </Text>
                </div>
              </div>
            }>
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
            />
          </Card>
        </>
      ) : (
        <Card className="border-0 shadow-lg rounded-2xl">
          <Empty
            description={
              <div>
                <Text className="text-slate-600">
                  Please select a child to view attendance records
                </Text>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  );
};

export default ParentChildAttendancePage;
