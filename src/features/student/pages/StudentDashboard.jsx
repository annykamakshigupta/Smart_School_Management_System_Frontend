/**
 * Student Dashboard
 * Main dashboard view for students - Shows real data from API
 */

import { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  List,
  Tag,
  Spin,
  Empty,
  Badge,
  Avatar,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMySubjects,
} from "../../../services/student.service";
import scheduleService from "../../../services/schedule.service";
import { getMyResults } from "../../../services/result.service";
import { getMyFees } from "../../../services/fee.service";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState({ data: [], summary: {} });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchAdditionalData = useCallback(async (profile) => {
    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const classId = profile?.class?._id || profile?.classId?._id;

      // Fetch attendance, results, fees, subjects and schedule in parallel
      const [attendanceRes, resultsRes, feesRes, scheduleRes, subjectsRes] =
        await Promise.all([
          getMyAttendance({
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          }).catch(() => ({ data: [] })),
          getMyResults().catch(() => ({ data: [] })),
          getMyFees().catch(() => ({ data: [], summary: {} })),
          scheduleService
            .getStudentSchedules()
            .catch(() => ({ data: { groupedByDay: {} } })),
          classId
            ? getMySubjects(classId).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);

      setAttendance(attendanceRes.data || []);
      setResults(resultsRes.data || []);
      setFees(feesRes);
      setSubjects(subjectsRes.data || []);

      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const grouped = scheduleRes.data?.groupedByDay || {};
      setTodaySchedule(grouped[today] || []);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      const profile = profileRes.data;
      setStudentProfile(profile);

      if (profile?._id) {
        await fetchAdditionalData(profile);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      message.error("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [fetchAdditionalData]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div>
        <PageHeader
          title="Student Dashboard"
          subtitle="Welcome to your academic portal"
        />
        <Card>
          <Empty
            description="Student profile not found. Please contact the administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const classTeacher = classInfo?.classTeacher;
  const parentInfo = studentProfile.parentId;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome Back, {studentProfile.userId?.name || "Student"}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Your academic journey continues today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-indigo-100">Current Date</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6 shadow-lg rounded-2xl border-0">
        <div className="bg-indigo-500 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="bg-white/20 border-2 border-white/30"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {studentProfile.userId?.name || "N/A"}
              </h2>
              <div className="text-white/70 mb-4">
                {studentProfile.userId?.email || "N/A"}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-white/70 text-xs">Class</div>
                  <div className="font-semibold">
                    {classInfo?.name || "N/A"} -{" "}
                    {studentProfile.section || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Roll Number</div>
                  <div className="font-semibold">
                    {studentProfile.rollNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Academic Year</div>
                  <div className="font-semibold">
                    {studentProfile.academicYear || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Status</div>
                  <Badge
                    status={
                      studentProfile.userId?.status === "active"
                        ? "success"
                        : "warning"
                    }
                    text={
                      <span className="text-white capitalize">
                        {studentProfile.userId?.status || "Active"}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CheckCircleOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Rate
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {calculateAttendanceRate()}%
            </h3>
            <p className="text-green-100 text-sm font-medium">
              Attendance Rate
            </p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-linear-to-br from-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Active
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{subjects.length || 0}</h3>
            <p className="text-blue-100 text-sm font-medium">My Subjects</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TrophyOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Avg
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {results.length > 0
                ? `${Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)}%`
                : "N/A"}
            </h3>
            <p className="text-purple-100 text-sm font-medium">Performance</p>
          </div>
        </Col>
        <Col xs={12} sm={6}>
          <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FileTextOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                ₹
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {fees.summary?.totalBalance || 0}
            </h3>
            <p className="text-amber-100 text-sm font-medium">Pending Fees</p>
          </div>
        </Col>
      </Row>

      {/* Today's Timetable */}
      <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CalendarOutlined className="text-indigo-600" />
              Today's Timetable
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}
            </div>
          </div>
          <Link
            to="/student/timetable"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View full timetable
          </Link>
        </div>

        <div className="mt-4">
          {todaySchedule.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {todaySchedule.slice(0, 6).map((s) => (
                <div
                  key={s._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {s.subjectId?.name || "Untitled"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {s.startTime} - {s.endTime}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    Teacher: {s.teacherId?.name || "-"}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    Room: {s.room || "-"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              description="No classes scheduled for today"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* Class Teacher Info */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TeamOutlined className="text-indigo-600" />
                </div>
                <span className="font-bold">Class Teacher</span>
              </div>
            }
            className="h-full shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {classTeacher ? (
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-indigo-100 text-indigo-600"
                />
                <div>
                  <h4 className="font-semibold text-lg">
                    {classTeacher.userId?.name || classTeacher.name || "N/A"}
                  </h4>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <MailOutlined />
                    {classTeacher.userId?.email || "N/A"}
                  </div>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <PhoneOutlined />
                    {classTeacher.userId?.phone || "N/A"}
                  </div>
                </div>
              </div>
            ) : (
              <Empty
                description="No class teacher assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Parent Info */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserOutlined className="text-purple-600" />
                </div>
                <span className="font-bold">Parent / Guardian</span>
              </div>
            }
            className="h-full shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {parentInfo ? (
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-purple-100 text-purple-600"
                />
                <div>
                  <h4 className="font-semibold text-lg">
                    {parentInfo.userId?.name || parentInfo.name || "N/A"}
                  </h4>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <MailOutlined />
                    {parentInfo.userId?.email || parentInfo.email || "N/A"}
                  </div>
                  {(parentInfo.userId?.phone || parentInfo.phone) && (
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <PhoneOutlined />
                      {parentInfo.userId?.phone || parentInfo.phone}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description="No parent assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Recent Attendance */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleOutlined className="text-green-600" />
                </div>
                <span className="font-bold">Recent Attendance</span>
              </div>
            }
            extra={
              <Link
                to="/student/attendance"
                className="text-indigo-600 hover:text-indigo-800 font-semibold">
                View All
              </Link>
            }
            loading={attendanceLoading}
            className="h-full shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {attendance.length > 0 ? (
              <List
                size="small"
                dataSource={attendance.slice(0, 5)}
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

        {/* Class Subjects */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOutlined className="text-blue-400" />
                </div>
                <span className="font-bold">My Subjects</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Tag
                    key={subject._id}
                    color="blue"
                    className="py-2 px-4 text-sm">
                    <BookOutlined className="mr-1" />
                    {subject.name || "Untitled"}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty
                description="No subjects assigned to your class yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Student Info */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <IdcardOutlined className="text-indigo-600" />
                </div>
                <span className="font-bold">My Information</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            <List size="small">
              <List.Item>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">
                  {studentProfile.userId?.email || "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">
                  {studentProfile.userId?.phone || "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Admission Date:</span>
                <span className="font-medium">
                  {studentProfile.admissionDate
                    ? new Date(
                        studentProfile.admissionDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Academic Year:</span>
                <span className="font-medium">
                  {studentProfile.academicYear}
                </span>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/student/attendance">
                <div className="group p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl text-center hover:from-green-100 hover:to-green-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircleOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    View Attendance
                  </div>
                  <div className="text-xs text-slate-600">
                    Check your attendance
                  </div>
                </div>
              </Link>
              <Link to="/student/assignments">
                <div className="group p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileTextOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Assignments
                  </div>
                  <div className="text-xs text-slate-600">
                    View pending tasks
                  </div>
                </div>
              </Link>
              <Link to="/student/timetable">
                <div className="group p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CalendarOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Timetable</div>
                  <div className="text-xs text-slate-600">
                    View class schedule
                  </div>
                </div>
              </Link>
              <Link to="/student/fees">
                <div className="group p-6 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl text-center hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-14 h-14 mx-auto mb-4 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TrophyOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Fee Status
                  </div>
                  <div className="text-xs text-slate-600">
                    Check payment status
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard;
