/**
 * Parent Dashboard
 * Main dashboard view for parents - Shows real data from API
 * Enhanced with alerts and comparison visualizations
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  List,
  Avatar,
  Tag,
  Statistic,
  Timeline,
  Spin,
  Empty,
  Select,
  Badge,
  message,
  Tabs,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BellOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import {
  getMyChildren,
  getChildAttendance,
} from "../../../services/parent.service";
import scheduleService from "../../../services/schedule.service";
import { ScheduleView } from "../../../components/Schedule";

const ParentDashboard = () => {
  const EMPTY_GROUPED = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  };

  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childAttendance, setChildAttendance] = useState([]);
  const [childScheduleData, setChildScheduleData] = useState({
    items: [],
    groupedByDay: EMPTY_GROUPED,
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDetails();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      message.error("Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async () => {
    if (!selectedChild) return;

    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const [attendanceRes, timetableRes] = await Promise.all([
        getChildAttendance(selectedChild._id, {
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }).catch(() => ({ data: [] })),
        scheduleService
          .getParentSchedules()
          .catch(() => ({ data: { children: [] } })),
      ]);

      setChildAttendance(attendanceRes.data || []);
      const childrenSchedules = timetableRes.data?.children || [];
      const match = childrenSchedules.find(
        (c) => c?.student?._id === selectedChild._id,
      );
      if (match) {
        setChildScheduleData({
          items: match.items || [],
          groupedByDay: match.groupedByDay || EMPTY_GROUPED,
        });
      } else {
        setChildScheduleData({ items: [], groupedByDay: EMPTY_GROUPED });
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (!childAttendance || childAttendance.length === 0) return 0;
    const presentDays = childAttendance.filter(
      (a) => a.status === "present",
    ).length;
    return Math.round((presentDays / childAttendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Parent Dashboard 👨‍👩‍👧‍👦</h1>
              <p className="text-indigo-100 text-lg">
                Monitor your children's academic progress
              </p>
            </div>
          </div>
        </div>
        <Card className="shadow-lg rounded-2xl border-0">
          <Empty
            description="No children linked to your account yet. Please contact the school administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 -m-6 bg-linear-to-br from-purple-50 via-white to-purple-50 min-h-screen">
      {/* Welcome Header - Enhanced */}
      <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl border border-purple-400/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Parent Dashboard 👨‍👩‍👧‍👦
            </h1>
            <p className="text-purple-100 text-lg">
              Monitor and support your children's academic journey
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20 text-center">
              <p className="text-sm text-purple-100">Total Children</p>
              <p className="text-4xl font-bold">{children.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-600">Select Child:</span>
            <Select
              value={selectedChild?._id}
              onChange={(value) => {
                const child = children.find((c) => c._id === value);
                setSelectedChild(child);
              }}
              style={{ width: 300 }}
              size="large">
              {children.map((child) => (
                <Select.Option key={child._id} value={child._id}>
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      className="bg-indigo-100"
                    />
                    <span>{child.userId?.name}</span>
                    <Tag color="blue" size="small">
                      {child.classId?.name} - {child.section}
                    </Tag>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </Card>
      )}

      {/* Children Overview Tabs */}
      <Card className="mb-6">
        <Tabs
          activeKey={selectedChild?._id}
          onChange={(key) => {
            const child = children.find((c) => c._id === key);
            setSelectedChild(child);
          }}
          items={children.map((child) => ({
            key: child._id,
            label: (
              <span className="flex items-center gap-2">
                <Avatar size="small" icon={<UserOutlined />} />
                {child.userId?.name}
              </span>
            ),
            children: (
              <div>
                {/* Child Profile Card */}
                <div className="bg-indigo-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-start gap-6">
                    <Avatar
                      size={80}
                      icon={<UserOutlined />}
                      className="bg-white/20 border-2 border-white/30"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">
                        {child.userId?.name}
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-white/70 text-xs">Class</div>
                          <div className="font-semibold">
                            {child.classId?.name} - {child.section}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">
                            Roll Number
                          </div>
                          <div className="font-semibold">
                            {child.rollNumber}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">
                            Academic Year
                          </div>
                          <div className="font-semibold">
                            {child.academicYear}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">Status</div>
                          <Badge
                            status={
                              child.userId?.status === "active"
                                ? "success"
                                : "warning"
                            }
                            text={
                              <span className="text-white">
                                {child.userId?.status || "Active"}
                              </span>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={12} md={6}>
                    <div className="bg-green-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <CheckCircleOutlined className="text-2xl" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          {calculateAttendanceRate()}%
                        </div>
                        <div className="text-green-100 text-sm">Attendance</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="bg-blue-500 rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <BookOutlined className="text-2xl" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-1">
                          {child.classId?.subjects?.length || 0}
                        </div>
                        <div className="text-blue-100 text-sm">Subjects</div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="bg-purple-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <TeamOutlined className="text-2xl" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold mb-1 truncate">
                          {child.classId?.classTeacher?.userId?.name ||
                            "Not Assigned"}
                        </div>
                        <div className="text-purple-100 text-xs">
                          Class Teacher
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="bg-amber-600 rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <CalendarOutlined className="text-2xl" />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold mb-1">
                          {child.admissionDate
                            ? new Date(child.admissionDate).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )
                            : "N/A"}
                        </div>
                        <div className="text-amber-100 text-xs">
                          Admission Date
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Attendance Summary */}
                {childAttendance.length > 0 && (
                  <div className="mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                        <CheckCircleOutlined className="text-purple-600" />
                      </div>
                      <span className="font-bold text-slate-800">
                        This Month's Attendance
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-green-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            childAttendance.filter(
                              (a) => a.status === "present",
                            ).length
                          }
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Present
                        </div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-red-500">
                          {
                            childAttendance.filter((a) => a.status === "absent")
                              .length
                          }
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Absent
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-blue-600">
                          {calculateAttendanceRate()}%
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Rate</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timetable */}
                <Card
                  className="mb-6 shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0"
                  title={
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <ClockCircleOutlined className="text-indigo-600" />
                      </div>
                      <span className="font-bold">Timetable</span>
                    </div>
                  }
                  extra={
                    <div className="flex items-center gap-3">
                      <Link to={`/parent/children/${child._id}`}>
                        View Profile
                      </Link>
                      <Link to={`/parent/child-schedule?child=${child._id}`}>
                        View Full Schedule
                      </Link>
                    </div>
                  }>
                  <ScheduleView
                    groupedByDay={childScheduleData.groupedByDay}
                    showTeacher={true}
                    showClass={false}
                    emptyTitle="No timetable published"
                    emptySubtitle="This child’s class schedule will appear once the admin publishes it."
                  />
                </Card>

                <Row gutter={[16, 16]}>
                  {/* Class Teacher Info */}
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span className="flex items-center gap-2">
                          <TeamOutlined className="text-indigo-600" />
                          Class Teacher
                        </span>
                      }
                      className="h-full">
                      {child.classId?.classTeacher ? (
                        <div className="flex items-center gap-4">
                          <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            className="bg-indigo-100 text-indigo-600"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">
                              {child.classId.classTeacher.userId?.name ||
                                "Not Assigned"}
                            </h4>
                            <div className="text-gray-500 text-sm flex items-center gap-1">
                              <MailOutlined />
                              {child.classId.classTeacher.userId?.email ||
                                "N/A"}
                            </div>
                            {child.classId.classTeacher.userId?.phone && (
                              <div className="text-gray-500 text-sm flex items-center gap-1">
                                <PhoneOutlined />
                                {child.classId.classTeacher.userId?.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Empty
                          description="No class teacher assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>

                  {/* Child Contact Info */}
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span className="flex items-center gap-2">
                          <IdcardOutlined className="text-indigo-600" />
                          Student Information
                        </span>
                      }
                      className="h-full">
                      <List size="small">
                        <List.Item>
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">
                            {child.userId?.name || "N/A"}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium">
                            {child.userId?.email || "N/A"}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Phone:</span>
                          <span className="font-medium">
                            {child.userId?.phone || "N/A"}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Section:</span>
                          <span className="font-medium">{child.section}</span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Admission No:</span>
                          <span className="font-medium">
                            {child.admissionNumber || "N/A"}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Academic Year:</span>
                          <span className="font-medium">
                            {child.academicYear}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium">
                            {child.enrollmentStatus || "active"}
                          </span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Blood Group:</span>
                          <span className="font-medium">
                            {child.bloodGroup || "N/A"}
                          </span>
                        </List.Item>
                      </List>
                    </Card>
                  </Col>

                  {/* Recent Attendance */}
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span className="flex items-center gap-2">
                          <CheckCircleOutlined className="text-green-600" />
                          Recent Attendance
                        </span>
                      }
                      extra={
                        <Link
                          to="/parent/attendance"
                          className="text-indigo-600">
                          View All
                        </Link>
                      }
                      loading={attendanceLoading}>
                      {childAttendance.length > 0 ? (
                        <List
                          size="small"
                          dataSource={childAttendance.slice(0, 5)}
                          renderItem={(record) => (
                            <List.Item>
                              <div className="flex items-center justify-between w-full">
                                <span className="text-gray-600">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <Tag
                                  color={
                                    record.status === "present"
                                      ? "success"
                                      : record.status === "absent"
                                        ? "error"
                                        : "warning"
                                  }>
                                  {record.status?.charAt(0).toUpperCase() +
                                    record.status?.slice(1)}
                                </Tag>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty
                          description="No attendance records found"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>

                  {/* Subjects */}
                  <Col xs={24} md={12}>
                    <Card
                      title={
                        <span className="flex items-center gap-2">
                          <BookOutlined className="text-blue-400" />
                          Class Subjects
                        </span>
                      }>
                      {child.classId?.subjects?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {child.classId.subjects.map((subject, index) => {
                            const name = subject?.name || String(subject);
                            const code = subject?.code || null;

                            return (
                              <div
                                key={subject?._id || index}
                                className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                    <BookOutlined className="text-blue-500" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 truncate">
                                      {name}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                      {code ? `Code: ${code}` : ""}
                                    </div>
                                  </div>
                                </div>

                                {code ? (
                                  <Tag
                                    color="blue"
                                    className="m-0 font-semibold">
                                    {code}
                                  </Tag>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <Empty
                          description="No subjects assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          }))}
        />
      </Card>

      {/* Quick Actions */}
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-xl text-indigo-600" />
            </div>
            <span className="font-bold text-lg">Quick Actions</span>
          </div>
        }
        className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Link to="/parent/attendance">
              <div className="group p-6 bg-green-50 rounded-2xl text-center hover:bg-green-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                <div className="w-14 h-14 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircleOutlined className="text-2xl text-white" />
                </div>
                <div className="font-bold text-slate-800 mb-1">
                  View Attendance
                </div>
                <div className="text-xs text-slate-600">
                  Check attendance records
                </div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/children">
              <div className="group p-6 bg-purple-50 rounded-2xl text-center hover:bg-purple-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                <div className="w-14 h-14 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TeamOutlined className="text-2xl text-white" />
                </div>
                <div className="font-bold text-slate-800 mb-1">My Children</div>
                <div className="text-xs text-slate-600">
                  View all children details
                </div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/performance/grades">
              <div className="group p-6 bg-blue-50 rounded-2xl text-center hover:bg-blue-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                <div className="w-14 h-14 mx-auto mb-4 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TrophyOutlined className="text-2xl text-white" />
                </div>
                <div className="font-bold text-slate-800 mb-1">Grades</div>
                <div className="text-xs text-slate-600">
                  View academic performance
                </div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/fees/status">
              <div className="group p-6 bg-amber-50 rounded-2xl text-center hover:bg-amber-100 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                <div className="w-14 h-14 mx-auto mb-4 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <CalendarOutlined className="text-2xl text-white" />
                </div>
                <div className="font-bold text-slate-800 mb-1">Fee Status</div>
                <div className="text-xs text-slate-600">
                  Check payment status
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ParentDashboard;
