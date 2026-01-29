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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back, Admin! 👋</h1>
            <p className="text-indigo-100 text-lg">
              Here's what's happening in your school today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-indigo-100">Current Date</p>
              <p className="text-xl font-semibold">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TeamOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Active
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {stats.totalStudents.toLocaleString()}
            </h3>
            <p className="text-blue-100 text-sm font-medium">Total Students</p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UserOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Faculty
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{stats.totalTeachers}</h3>
            <p className="text-green-100 text-sm font-medium">Total Teachers</p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Active
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{stats.totalClasses}</h3>
            <p className="text-purple-100 text-sm font-medium">Total Classes</p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <UsergroupAddOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Linked
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{stats.totalParents}</h3>
            <p className="text-amber-100 text-sm font-medium">Total Parents</p>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Classes with Teachers */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0"
            title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <HomeOutlined className="text-xl text-purple-600" />
                </div>
                <span className="font-bold text-lg">Class Assignments</span>
              </div>
            }
            extra={
              <Link
                to="/admin/academics/teacher-assignments"
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
                Manage <ArrowRightOutlined />
              </Link>
            }>
            {classesWithTeachers.length > 0 ? (
              <List
                dataSource={classesWithTeachers}
                renderItem={(cls) => (
                  <List.Item className="hover:bg-slate-50 rounded-lg px-3 transition-colors">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                          <BookOutlined className="text-purple-600 text-xl" />
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
                            className="rounded-lg px-3 py-1 font-medium">
                            <UserOutlined className="mr-1" />
                            {cls.classTeacher.userId?.name ||
                              cls.classTeacher.name ||
                              "Teacher"}
                          </Tag>
                        ) : (
                          <Tag
                            color="warning"
                            className="rounded-lg px-3 py-1 font-medium">
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
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0"
            title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TeamOutlined className="text-xl text-blue-400" />
                </div>
                <span className="font-bold text-lg">Recent Students</span>
              </div>
            }
            extra={
              <Link
                to="/admin/users/students"
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
                View All <ArrowRightOutlined />
              </Link>
            }>
            {recentStudents.length > 0 ? (
              <List
                dataSource={recentStudents}
                renderItem={(student) => (
                  <List.Item className="hover:bg-slate-50 rounded-lg px-3 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <UserOutlined className="text-blue-400 text-xl" />
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
                        className="rounded-lg px-3 py-1 font-medium">
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
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <RiseOutlined className="text-xl text-indigo-600" />
            </div>
            <span className="font-bold text-lg">Quick Actions</span>
          </div>
        }
        className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/admin/users/students">
            <div className="group p-6 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <TeamOutlined className="text-2xl text-white" />
              </div>
              <div className="font-bold text-slate-800 mb-1">
                Manage Students
              </div>
              <div className="text-xs text-slate-600">Add & edit students</div>
            </div>
          </Link>
          <Link to="/admin/users/teachers">
            <div className="group p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl text-center hover:from-green-100 hover:to-green-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <UserOutlined className="text-2xl text-white" />
              </div>
              <div className="font-bold text-slate-800 mb-1">
                Manage Teachers
              </div>
              <div className="text-xs text-slate-600">Add & edit teachers</div>
            </div>
          </Link>
          <Link to="/admin/users/parents">
            <div className="group p-6 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl text-center hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <UsergroupAddOutlined className="text-2xl text-white" />
              </div>
              <div className="font-bold text-slate-800 mb-1">
                Manage Parents
              </div>
              <div className="text-xs text-slate-600">Link to children</div>
            </div>
          </Link>
          <Link to="/admin/academics/teacher-assignments">
            <div className="group p-6 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <BookOutlined className="text-2xl text-white" />
              </div>
              <div className="font-bold text-slate-800 mb-1">Assignments</div>
              <div className="text-xs text-slate-600">Assign to classes</div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Secondary Actions */}
      <Card
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <CalendarOutlined className="text-xl text-cyan-600" />
            </div>
            <span className="font-bold text-lg">Academic Management</span>
          </div>
        }
        className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/admin/academics/classes">
            <div className="p-5 bg-white border-2 border-indigo-100 rounded-xl text-center hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
              <HomeOutlined className="text-3xl text-indigo-600 mb-3" />
              <div className="font-semibold text-slate-800 mb-1">Classes</div>
              <div className="text-xs text-slate-500">Manage classes</div>
            </div>
          </Link>
          <Link to="/admin/academics/subjects">
            <div className="p-5 bg-white border-2 border-pink-100 rounded-xl text-center hover:border-pink-300 hover:shadow-md transition-all cursor-pointer">
              <BookOutlined className="text-3xl text-pink-600 mb-3" />
              <div className="font-semibold text-slate-800 mb-1">Subjects</div>
              <div className="text-xs text-slate-500">Manage subjects</div>
            </div>
          </Link>
          <Link to="/admin/academics/timetable">
            <div className="p-5 bg-white border-2 border-cyan-100 rounded-xl text-center hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer">
              <CalendarOutlined className="text-3xl text-cyan-600 mb-3" />
              <div className="font-semibold text-slate-800 mb-1">Schedule</div>
              <div className="text-xs text-slate-500">Manage timetables</div>
            </div>
          </Link>
          <Link to="/admin/attendance">
            <div className="p-5 bg-white border-2 border-orange-100 rounded-xl text-center hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
              <CheckCircleOutlined className="text-3xl text-orange-600 mb-3" />
              <div className="font-semibold text-slate-800 mb-1">
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
