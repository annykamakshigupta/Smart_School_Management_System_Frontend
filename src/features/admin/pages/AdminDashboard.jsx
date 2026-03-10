/**
 * Admin Dashboard
 * Enhanced modern dashboard with classy, attractive design
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  List,
  Avatar,
  Tag,
  Button,
  Spin,
  Empty,
  message,
  Statistic,
  Progress,
  Badge,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  BellOutlined,
  ArrowRightOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getAllStudents,
  getAllTeachers,
  getDashboardStats,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

/**
 * AdminDashboard Component - Modernized
 */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalParents: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [classesWithTeachers, setClassesWithTeachers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Try to get dashboard stats from API
      try {
        const statsRes = await getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setStats({
            totalStudents: statsRes.data.totalStudents || 0,
            totalTeachers: statsRes.data.totalTeachers || 0,
            totalClasses: statsRes.data.totalClasses || 0,
            totalParents: statsRes.data.totalParents || 0,
          });
        }
      } catch (error) {
        console.warn(
          "Dashboard stats API not available, fetching individually",
        );

        // Fallback: Fetch counts individually
        const [studentsRes, teachersRes, classesRes] = await Promise.all([
          getAllStudents().catch(() => ({ data: [] })),
          getAllTeachers().catch(() => ({ data: [] })),
          getAllClasses().catch(() => ({ data: [] })),
        ]);

        setStats({
          totalStudents: studentsRes.data?.length || 0,
          totalTeachers: teachersRes.data?.length || 0,
          totalClasses: classesRes.data?.length || 0,
          totalParents: 0,
        });
      }

      // Fetch recent students for display
      const studentsRes = await getAllStudents().catch(() => ({ data: [] }));
      const students = studentsRes.data || [];
      setRecentStudents(students.slice(0, 5));

      // Fetch classes
      const classesRes = await getAllClasses().catch(() => ({ data: [] }));
      setClassesWithTeachers(classesRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen p-6 -m-6 space-y-6 bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Welcome Header - Enhanced */}
      <div className="p-8 text-white border shadow-2xl bg-linear-to-r from-indigo-600 to-indigo-700 rounded-3xl border-indigo-400/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              Welcome Back, Admin! 👋
            </h1>
            <p className="text-lg text-indigo-100">
              Here's what's happening in your school today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="px-6 py-4 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
              <p className="text-sm text-indigo-100">Today</p>
              <p className="text-lg font-semibold">{currentDate}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 text-white transition-all duration-300 transform shadow-lg bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <TeamOutlined className="text-2xl" />
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
              Students
            </span>
          </div>
          <h3 className="mb-1 text-4xl font-bold">
            {stats.totalStudents.toLocaleString()}
          </h3>
          <p className="text-sm font-medium text-blue-100">Total Students</p>
        </div>

        <div className="p-6 text-white transition-all duration-300 transform shadow-lg bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <UserOutlined className="text-2xl" />
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
              Faculty
            </span>
          </div>
          <h3 className="mb-1 text-4xl font-bold">{stats.totalTeachers}</h3>
          <p className="text-sm font-medium text-emerald-100">Total Teachers</p>
        </div>

        <div className="p-6 text-white transition-all duration-300 transform shadow-lg bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <BookOutlined className="text-2xl" />
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
              Active
            </span>
          </div>
          <h3 className="mb-1 text-4xl font-bold">{stats.totalClasses}</h3>
          <p className="text-sm font-medium text-purple-100">Total Classes</p>
        </div>

        <div className="p-6 text-white transition-all duration-300 transform shadow-lg bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
              <UsergroupAddOutlined className="text-2xl" />
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
              Linked
            </span>
          </div>
          <h3 className="mb-1 text-4xl font-bold">{stats.totalParents}</h3>
          <p className="text-sm font-medium text-amber-100">Total Parents</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 p-5 bg-white border shadow-md rounded-2xl border-slate-100">
          <div className="flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl shrink-0">
            <TeamOutlined className="text-2xl text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Student–Teacher Ratio
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalTeachers > 0
                ? `${Math.round(stats.totalStudents / stats.totalTeachers)}:1`
                : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white border shadow-md rounded-2xl border-slate-100">
          <div className="flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl shrink-0">
            <BookOutlined className="text-2xl text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Avg Students / Class
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalClasses > 0
                ? Math.round(stats.totalStudents / stats.totalClasses)
                : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 bg-white border shadow-md rounded-2xl border-slate-100">
          <div className="flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl shrink-0">
            <UsergroupAddOutlined className="text-2xl text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              Parent Engagement
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {stats.totalStudents > 0
                ? `${Math.round((stats.totalParents / stats.totalStudents) * 100)}%`
                : "—"}
            </p>
          </div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {/* Classes with Teachers */}
        <Col xs={24} lg={12}>
          <Card
            className="transition-shadow border-0 shadow-md hover:shadow-lg rounded-2xl"
            title={
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
                  <HomeOutlined className="text-xl text-purple-600" />
                </div>
                <span className="text-lg font-bold">Class Assignments</span>
              </div>
            }
            extra={
              <Link
                to="/admin/academics/teacher-assignments"
                className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800">
                Manage <ArrowRightOutlined />
              </Link>
            }>
            {classesWithTeachers.length > 0 ? (
              <List
                dataSource={classesWithTeachers}
                renderItem={(cls) => (
                  <List.Item className="px-3 transition-colors rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl">
                          <BookOutlined className="text-xl text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {cls.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {cls.students?.length || 0} students enrolled
                          </div>
                        </div>
                      </div>
                      <div>
                        {cls.classTeacher ? (
                          <Tag
                            color="success"
                            className="px-3 py-1 font-medium rounded-lg">
                            <UserOutlined className="mr-1" />
                            {cls.classTeacher.userId?.name ||
                              cls.classTeacher.name ||
                              "Teacher"}
                          </Tag>
                        ) : (
                          <Tag
                            color="warning"
                            className="px-3 py-1 font-medium rounded-lg">
                            No Teacher
                          </Tag>
                        )}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No classes created yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Recent Students */}
        <Col xs={24} lg={12}>
          <Card
            className="transition-shadow border-0 shadow-md hover:shadow-lg rounded-2xl"
            title={
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl">
                  <TeamOutlined className="text-xl text-blue-400" />
                </div>
                <span className="text-lg font-bold">Recent Students</span>
              </div>
            }
            extra={
              <Link
                to="/admin/students/enroll"
                className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800">
                View All <ArrowRightOutlined />
              </Link>
            }>
            {recentStudents.length > 0 ? (
              <List
                dataSource={recentStudents}
                renderItem={(student) => (
                  <List.Item className="px-3 transition-colors rounded-lg hover:bg-slate-50">
                    <div className="flex items-center w-full gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl">
                        <UserOutlined className="text-xl text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          {student.userId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {student.classId?.name || "No class"} • Roll:{" "}
                          {student.rollNumber || "N/A"}
                        </div>
                      </div>
                      <Tag
                        color="blue"
                        className="px-3 py-1 font-medium rounded-lg">
                        {student.enrollmentStatus || "enrolled"}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No students enrolled yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl">
              <RiseOutlined className="text-xl text-indigo-600" />
            </div>
            <span className="text-lg font-bold">Quick Actions</span>
          </div>
        }
        className="transition-shadow border-0 shadow-md hover:shadow-lg rounded-2xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link to="/admin/users/students">
            <div className="p-6 text-center transition-all duration-200 transform shadow-sm cursor-pointer group bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center mx-auto mb-4 transition-transform bg-blue-400 shadow-lg w-14 h-14 rounded-2xl group-hover:scale-110">
                <TeamOutlined className="text-2xl text-white" />
              </div>
              <div className="mb-1 font-bold text-slate-800">
                Manage Students
              </div>
              <div className="text-xs text-slate-600">Add & edit students</div>
            </div>
          </Link>
          <Link to="/admin/users/teachers">
            <div className="p-6 text-center transition-all duration-200 transform shadow-sm cursor-pointer group bg-linear-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center mx-auto mb-4 transition-transform bg-green-600 shadow-lg w-14 h-14 rounded-2xl group-hover:scale-110">
                <UserOutlined className="text-2xl text-white" />
              </div>
              <div className="mb-1 font-bold text-slate-800">
                Manage Teachers
              </div>
              <div className="text-xs text-slate-600">Add & edit teachers</div>
            </div>
          </Link>
          <Link to="/admin/users/parents">
            <div className="p-6 text-center transition-all duration-200 transform shadow-sm cursor-pointer group bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl hover:from-amber-100 hover:to-amber-200 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center mx-auto mb-4 transition-transform shadow-lg w-14 h-14 bg-amber-600 rounded-2xl group-hover:scale-110">
                <UsergroupAddOutlined className="text-2xl text-white" />
              </div>
              <div className="mb-1 font-bold text-slate-800">
                Manage Parents
              </div>
              <div className="text-xs text-slate-600">Link to children</div>
            </div>
          </Link>
          <Link to="/admin/academics/teacher-assignments">
            <div className="p-6 text-center transition-all duration-200 transform shadow-sm cursor-pointer group bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center mx-auto mb-4 transition-transform bg-purple-600 shadow-lg w-14 h-14 rounded-2xl group-hover:scale-110">
                <BookOutlined className="text-2xl text-white" />
              </div>
              <div className="mb-1 font-bold text-slate-800">Assignments</div>
              <div className="text-xs text-slate-600">Assign to classes</div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Secondary Actions */}
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-xl">
              <CalendarOutlined className="text-xl text-cyan-600" />
            </div>
            <span className="text-lg font-bold">Academic Management</span>
          </div>
        }
        className="transition-shadow border-0 shadow-md hover:shadow-lg rounded-2xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link to="/admin/academics/classes">
            <div className="p-5 text-center transition-all bg-white border-2 border-indigo-100 cursor-pointer rounded-xl hover:border-indigo-300 hover:shadow-md">
              <HomeOutlined className="mb-3 text-3xl text-indigo-600" />
              <div className="mb-1 font-semibold text-slate-800">Classes</div>
              <div className="text-xs text-slate-500">Manage classes</div>
            </div>
          </Link>
          <Link to="/admin/academics/subjects">
            <div className="p-5 text-center transition-all bg-white border-2 border-pink-100 cursor-pointer rounded-xl hover:border-pink-300 hover:shadow-md">
              <BookOutlined className="mb-3 text-3xl text-pink-600" />
              <div className="mb-1 font-semibold text-slate-800">Subjects</div>
              <div className="text-xs text-slate-500">Manage subjects</div>
            </div>
          </Link>
          <Link to="/admin/academics/timetable">
            <div className="p-5 text-center transition-all bg-white border-2 cursor-pointer border-cyan-100 rounded-xl hover:border-cyan-300 hover:shadow-md">
              <CalendarOutlined className="mb-3 text-3xl text-cyan-600" />
              <div className="mb-1 font-semibold text-slate-800">Schedule</div>
              <div className="text-xs text-slate-500">Manage timetables</div>
            </div>
          </Link>
          <Link to="/admin/attendance">
            <div className="p-5 text-center transition-all bg-white border-2 border-orange-100 cursor-pointer rounded-xl hover:border-orange-300 hover:shadow-md">
              <CheckCircleOutlined className="mb-3 text-3xl text-orange-600" />
              <div className="mb-1 font-semibold text-slate-800">
                Attendance
              </div>
              <div className="text-xs text-slate-500">View reports</div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
