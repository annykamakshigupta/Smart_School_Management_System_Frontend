/**
 * Admin Dashboard
 * Main dashboard view for administrators - Shows real data from API
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
  Button,
  Spin,
  Empty,
  message,
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
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getAllUsers,
  getAllClassesWithTeachers,
} from "../../../services/admin.service";
import { getAllClasses } from "../../../services/class.service";

/**
 * AdminDashboard Component
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

      // Fetch all counts in parallel
      const [studentsRes, teachersRes, parentsRes, classesRes] =
        await Promise.all([
          getAllUsers({ role: "student" }).catch(() => ({ data: [] })),
          getAllUsers({ role: "teacher" }).catch(() => ({ data: [] })),
          getAllUsers({ role: "parent" }).catch(() => ({ data: [] })),
          getAllClassesWithTeachers().catch(() =>
            getAllClasses().catch(() => ({ data: [] })),
          ),
        ]);

      const students = (studentsRes.data || []).map((user) => ({
        _id: user._id,
        userId: user,
        classId: null,
        section: null,
        rollNumber: null,
      }));
      const teachers = teachersRes.data || [];
      const parents = parentsRes.data || [];
      const classes = classesRes.data || [];

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalParents: parents.length,
      });

      // Get 5 most recent students
      setRecentStudents(students.slice(0, 5));

      // Get classes with teacher info
      setClassesWithTeachers(classes.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening in your school today."
      />

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents.toLocaleString()}
            icon={TeamOutlined}
            iconColor="bg-blue-100 text-blue-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={UserOutlined}
            iconColor="bg-green-100 text-green-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={BookOutlined}
            iconColor="bg-purple-100 text-purple-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Parents"
            value={stats.totalParents}
            icon={UsergroupAddOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Classes with Teachers */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <HomeOutlined className="text-purple-600" />
                Class Teacher Assignments
              </span>
            }
            extra={
              <Link to="/admin/assignments" className="text-indigo-600">
                Manage
              </Link>
            }>
            {classesWithTeachers.length > 0 ? (
              <List
                dataSource={classesWithTeachers}
                renderItem={(cls) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Avatar
                          icon={<BookOutlined />}
                          className="bg-purple-100 text-purple-600"
                        />
                        <div>
                          <div className="font-medium">{cls.name}</div>
                          <div className="text-xs text-gray-500">
                            {cls.students?.length || 0} students
                          </div>
                        </div>
                      </div>
                      <div>
                        {cls.classTeacher ? (
                          <Tag
                            color="success"
                            className="flex items-center gap-1">
                            <UserOutlined />
                            {cls.classTeacher.name}
                          </Tag>
                        ) : (
                          <Tag color="warning">No Teacher</Tag>
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
            title={
              <span className="flex items-center gap-2">
                <TeamOutlined className="text-blue-600" />
                Recent Students
              </span>
            }
            extra={
              <Link to="/admin/users/students" className="text-indigo-600">
                View All
              </Link>
            }>
            {recentStudents.length > 0 ? (
              <List
                dataSource={recentStudents}
                renderItem={(student) => (
                  <List.Item>
                    <div className="flex items-center gap-3 w-full">
                      <Avatar
                        icon={<UserOutlined />}
                        className="bg-blue-100 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {student.userId?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.classId?.name || "No class"} • Roll:{" "}
                          {student.rollNumber || "N/A"}
                        </div>
                      </div>
                      <div>
                        {student.parentId ? (
                          <Tag color="success">Parent Linked</Tag>
                        ) : (
                          <Tag color="warning">No Parent</Tag>
                        )}
                      </div>
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
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/admin/users/students">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-all hover:shadow-md cursor-pointer">
                  <TeamOutlined className="text-3xl text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    Manage Students
                  </div>
                  <div className="text-xs text-gray-500">
                    Add / Edit students
                  </div>
                </div>
              </Link>
              <Link to="/admin/users/teachers">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-all hover:shadow-md cursor-pointer">
                  <UserOutlined className="text-3xl text-green-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    Manage Teachers
                  </div>
                  <div className="text-xs text-gray-500">
                    Add / Edit teachers
                  </div>
                </div>
              </Link>
              <Link to="/admin/users/parents">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-all hover:shadow-md cursor-pointer">
                  <UsergroupAddOutlined className="text-3xl text-yellow-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    Manage Parents
                  </div>
                  <div className="text-xs text-gray-500">
                    Link parents to children
                  </div>
                </div>
              </Link>
              <Link to="/admin/assignments">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-all hover:shadow-md cursor-pointer">
                  <BookOutlined className="text-3xl text-purple-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    Class Assignments
                  </div>
                  <div className="text-xs text-gray-500">
                    Assign teachers to classes
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary Quick Actions */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24}>
          <Card>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/admin/academics/classes">
                <div className="p-4 bg-indigo-50 rounded-xl text-center hover:bg-indigo-100 transition-all hover:shadow-md cursor-pointer">
                  <HomeOutlined className="text-3xl text-indigo-600 mb-2" />
                  <div className="font-medium text-gray-900">Classes</div>
                  <div className="text-xs text-gray-500">Manage classes</div>
                </div>
              </Link>
              <Link to="/admin/academics/subjects">
                <div className="p-4 bg-pink-50 rounded-xl text-center hover:bg-pink-100 transition-all hover:shadow-md cursor-pointer">
                  <BookOutlined className="text-3xl text-pink-600 mb-2" />
                  <div className="font-medium text-gray-900">Subjects</div>
                  <div className="text-xs text-gray-500">Manage subjects</div>
                </div>
              </Link>
              <Link to="/admin/academics/schedule">
                <div className="p-4 bg-cyan-50 rounded-xl text-center hover:bg-cyan-100 transition-all hover:shadow-md cursor-pointer">
                  <CalendarOutlined className="text-3xl text-cyan-600 mb-2" />
                  <div className="font-medium text-gray-900">Schedule</div>
                  <div className="text-xs text-gray-500">Manage timetables</div>
                </div>
              </Link>
              <Link to="/admin/attendance">
                <div className="p-4 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition-all hover:shadow-md cursor-pointer">
                  <RiseOutlined className="text-3xl text-orange-600 mb-2" />
                  <div className="font-medium text-gray-900">Attendance</div>
                  <div className="text-xs text-gray-500">View reports</div>
                </div>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
