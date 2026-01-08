/**
 * Admin Dashboard
 * Main dashboard view for administrators
 */

import { Row, Col, Card, Progress, List, Avatar, Tag, Button } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  BellOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";

/**
 * AdminDashboard Component
 */
const AdminDashboard = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalStudents: 1245,
    totalTeachers: 86,
    totalClasses: 42,
    feeCollection: 125000,
    studentChange: 12.5,
    teacherChange: 3.2,
    classChange: 0,
    feeChange: 8.7,
  };

  const recentActivities = [
    {
      id: 1,
      action: "New student enrolled",
      user: "John Doe",
      time: "5 min ago",
      type: "student",
    },
    {
      id: 2,
      action: "Fee payment received",
      user: "Jane Smith",
      time: "15 min ago",
      type: "fee",
    },
    {
      id: 3,
      action: "Teacher added",
      user: "Mike Johnson",
      time: "1 hour ago",
      type: "teacher",
    },
    {
      id: 4,
      action: "Class schedule updated",
      user: "Admin",
      time: "2 hours ago",
      type: "class",
    },
    {
      id: 5,
      action: "New parent registered",
      user: "Sarah Wilson",
      time: "3 hours ago",
      type: "parent",
    },
  ];

  const upcomingEvents = [
    { id: 1, title: "Staff Meeting", date: "Jan 10, 2026", time: "10:00 AM" },
    {
      id: 2,
      title: "Parent-Teacher Conference",
      date: "Jan 15, 2026",
      time: "2:00 PM",
    },
    {
      id: 3,
      title: "Mid-term Exams Begin",
      date: "Jan 20, 2026",
      time: "9:00 AM",
    },
    { id: 4, title: "Sports Day", date: "Jan 25, 2026", time: "8:00 AM" },
  ];

  const attendanceData = {
    present: 85,
    absent: 10,
    late: 5,
  };

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
            change={stats.studentChange}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={UserOutlined}
            iconColor="bg-green-100 text-green-600"
            change={stats.teacherChange}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
            icon={BookOutlined}
            iconColor="bg-purple-100 text-purple-600"
            change={stats.classChange}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Fee Collection"
            value={`$${stats.feeCollection.toLocaleString()}`}
            icon={DollarOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
            change={stats.feeChange}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Attendance Overview */}
        <Col xs={24} lg={8}>
          <Card title="Today's Attendance" className="h-full">
            <div className="flex justify-center mb-6">
              <Progress
                type="circle"
                percent={attendanceData.present}
                strokeColor="#22c55e"
                format={(percent) => (
                  <div className="text-center">
                    <div className="text-2xl font-bold">{percent}%</div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present</span>
                <Tag color="success">{attendanceData.present}%</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent</span>
                <Tag color="error">{attendanceData.absent}%</Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Late</span>
                <Tag color="warning">{attendanceData.late}%</Tag>
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={8}>
          <Card
            title="Recent Activity"
            extra={
              <Link to="/admin/activity" className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.type === "student" ? (
                            <TeamOutlined />
                          ) : item.type === "teacher" ? (
                            <UserOutlined />
                          ) : item.type === "fee" ? (
                            <DollarOutlined />
                          ) : (
                            <BookOutlined />
                          )
                        }
                        className={
                          item.type === "student"
                            ? "bg-blue-100 text-blue-600"
                            : item.type === "teacher"
                            ? "bg-green-100 text-green-600"
                            : item.type === "fee"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-purple-100 text-purple-600"
                        }
                      />
                    }
                    title={
                      <span className="text-sm font-medium">{item.action}</span>
                    }
                    description={
                      <span className="text-xs text-gray-500">
                        {item.user} • {item.time}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} lg={8}>
          <Card
            title="Upcoming Events"
            extra={
              <Link to="/admin/events" className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={upcomingEvents}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    avatar={
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex flex-col items-center justify-center">
                        <CalendarOutlined className="text-indigo-600 text-lg" />
                      </div>
                    }
                    title={
                      <span className="text-sm font-medium">{item.title}</span>
                    }
                    description={
                      <span className="text-xs text-gray-500">
                        {item.date} at {item.time}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/admin/users/students">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <TeamOutlined className="text-2xl text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Add Student
                  </div>
                </div>
              </Link>
              <Link to="/admin/users/teachers">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                  <UserOutlined className="text-2xl text-green-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Add Teacher
                  </div>
                </div>
              </Link>
              <Link to="/admin/academics/classes">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                  <BookOutlined className="text-2xl text-purple-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Create Class
                  </div>
                </div>
              </Link>
              <Link to="/admin/fees/structure">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                  <DollarOutlined className="text-2xl text-yellow-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Fee Setup
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

export default AdminDashboard;
