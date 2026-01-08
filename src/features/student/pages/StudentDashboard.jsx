/**
 * Student Dashboard
 * Main dashboard view for students
 */

import { Row, Col, Card, Progress, List, Tag, Calendar, Timeline } from "antd";
import {
  CheckCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BellOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";

const StudentDashboard = () => {
  // Mock data
  const stats = {
    attendanceRate: 92,
    currentGPA: 3.6,
    pendingAssignments: 4,
    upcomingExams: 2,
  };

  const todayClasses = [
    {
      id: 1,
      subject: "Mathematics",
      time: "8:00 AM",
      teacher: "Mr. Smith",
      room: "101",
    },
    {
      id: 2,
      subject: "Science",
      time: "9:00 AM",
      teacher: "Ms. Johnson",
      room: "203",
    },
    {
      id: 3,
      subject: "English",
      time: "10:00 AM",
      teacher: "Mrs. Brown",
      room: "105",
    },
    {
      id: 4,
      subject: "History",
      time: "11:00 AM",
      teacher: "Mr. Wilson",
      room: "302",
    },
    {
      id: 5,
      subject: "Physics",
      time: "1:00 PM",
      teacher: "Dr. Lee",
      room: "Lab 1",
    },
  ];

  const pendingAssignments = [
    {
      id: 1,
      subject: "Mathematics",
      title: "Chapter 5 Problems",
      due: "Tomorrow",
      status: "pending",
    },
    {
      id: 2,
      subject: "Science",
      title: "Lab Report",
      due: "Jan 10",
      status: "pending",
    },
    {
      id: 3,
      subject: "English",
      title: "Essay Draft",
      due: "Jan 12",
      status: "in-progress",
    },
    {
      id: 4,
      subject: "History",
      title: "Research Paper",
      due: "Jan 15",
      status: "pending",
    },
  ];

  const notifications = [
    {
      id: 1,
      message: "Math test scheduled for Jan 15",
      time: "2 hours ago",
      type: "exam",
    },
    {
      id: 2,
      message: "New assignment posted in Science",
      time: "5 hours ago",
      type: "assignment",
    },
    { id: 3, message: "Fee payment reminder", time: "Yesterday", type: "fee" },
    {
      id: 4,
      message: "Parent-teacher meeting on Jan 20",
      time: "2 days ago",
      type: "event",
    },
  ];

  const grades = [
    { subject: "Mathematics", grade: "A", score: 92 },
    { subject: "Science", grade: "A-", score: 88 },
    { subject: "English", grade: "B+", score: 85 },
    { subject: "History", grade: "A", score: 90 },
    { subject: "Physics", grade: "B+", score: 84 },
  ];

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "success";
    if (grade.startsWith("B")) return "processing";
    if (grade.startsWith("C")) return "warning";
    return "error";
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your academic overview."
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={CheckCircleOutlined}
            iconColor="bg-green-100 text-green-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Current GPA"
            value={stats.currentGPA}
            icon={TrophyOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            icon={FileTextOutlined}
            iconColor="bg-blue-100 text-blue-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Upcoming Exams"
            value={stats.upcomingExams}
            icon={CalendarOutlined}
            iconColor="bg-red-100 text-red-600"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Today's Schedule */}
        <Col xs={24} lg={8}>
          <Card
            title="Today's Classes"
            extra={
              <Link to="/student/timetable" className="text-indigo-600">
                Full Schedule
              </Link>
            }
            className="h-full">
            <Timeline
              items={todayClasses.map((item, index) => ({
                color: index === 0 ? "green" : "blue",
                children: (
                  <div className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.subject}</span>
                      <Tag color="blue">{item.room}</Tag>
                    </div>
                    <div className="text-xs text-gray-500">
                      <ClockCircleOutlined className="mr-1" />
                      {item.time} • {item.teacher}
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* Assignments */}
        <Col xs={24} lg={8}>
          <Card
            title="Pending Assignments"
            extra={
              <Link
                to="/student/academics/assignments"
                className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={pendingAssignments}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    avatar={
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOutlined className="text-blue-600" />
                      </div>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        <Tag
                          color={
                            item.status === "in-progress"
                              ? "processing"
                              : "warning"
                          }>
                          {item.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        {item.subject} • Due: {item.due}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={8}>
          <Card
            title="Notifications"
            extra={
              <Link to="/student/notifications" className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    avatar={
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === "exam"
                            ? "bg-red-100"
                            : item.type === "assignment"
                            ? "bg-blue-100"
                            : item.type === "fee"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                        }`}>
                        <BellOutlined
                          className={
                            item.type === "exam"
                              ? "text-red-600"
                              : item.type === "assignment"
                              ? "text-blue-600"
                              : item.type === "fee"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }
                        />
                      </div>
                    }
                    title={<span className="text-sm">{item.message}</span>}
                    description={
                      <span className="text-xs text-gray-500">{item.time}</span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Grades Overview */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card
            title="Current Grades"
            extra={
              <Link to="/student/academics/grades" className="text-indigo-600">
                View Details
              </Link>
            }>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {grades.map((item) => (
                <div
                  key={item.subject}
                  className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-2">
                    {item.subject}
                  </div>
                  <Tag
                    color={getGradeColor(item.grade)}
                    className="text-lg font-bold px-4 py-1">
                    {item.grade}
                  </Tag>
                  <div className="mt-2">
                    <Progress
                      percent={item.score}
                      showInfo={false}
                      size="small"
                      strokeColor="#6366f1"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {item.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/student/attendance">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                  <CheckCircleOutlined className="text-2xl text-green-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    View Attendance
                  </div>
                </div>
              </Link>
              <Link to="/student/academics/assignments">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <FileTextOutlined className="text-2xl text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Assignments
                  </div>
                </div>
              </Link>
              <Link to="/student/timetable">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                  <CalendarOutlined className="text-2xl text-purple-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Timetable
                  </div>
                </div>
              </Link>
              <Link to="/student/fees">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                  <TrophyOutlined className="text-2xl text-yellow-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Fee Status
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
