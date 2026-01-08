/**
 * Teacher Dashboard
 * Main dashboard view for teachers
 */

import {
  Row,
  Col,
  Card,
  Progress,
  List,
  Avatar,
  Tag,
  Calendar,
  Badge,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";

const TeacherDashboard = () => {
  // Mock data
  const stats = {
    totalStudents: 156,
    classesToday: 5,
    pendingAssignments: 12,
    attendanceRate: 94,
  };

  const todaySchedule = [
    {
      id: 1,
      class: "10A",
      subject: "Mathematics",
      time: "8:00 AM - 8:45 AM",
      room: "Room 101",
    },
    {
      id: 2,
      class: "10B",
      subject: "Mathematics",
      time: "9:00 AM - 9:45 AM",
      room: "Room 102",
    },
    {
      id: 3,
      class: "9A",
      subject: "Mathematics",
      time: "10:00 AM - 10:45 AM",
      room: "Room 103",
    },
    {
      id: 4,
      class: "9B",
      subject: "Mathematics",
      time: "11:00 AM - 11:45 AM",
      room: "Room 101",
    },
    {
      id: 5,
      class: "11A",
      subject: "Mathematics",
      time: "1:00 PM - 1:45 PM",
      room: "Room 201",
    },
  ];

  const pendingTasks = [
    { id: 1, task: "Grade 10A Math Test", due: "Today", priority: "high" },
    { id: 2, task: "Submit attendance report", due: "Today", priority: "high" },
    {
      id: 3,
      task: "Prepare lesson plan for Ch. 5",
      due: "Tomorrow",
      priority: "medium",
    },
    {
      id: 4,
      task: "Parent meeting with John's parents",
      due: "Jan 10",
      priority: "medium",
    },
    {
      id: 5,
      task: "Review assignment submissions",
      due: "Jan 12",
      priority: "low",
    },
  ];

  const recentSubmissions = [
    {
      id: 1,
      student: "Alice Johnson",
      assignment: "Math Quiz 3",
      submitted: "2 hours ago",
      status: "pending",
    },
    {
      id: 2,
      student: "Bob Williams",
      assignment: "Math Quiz 3",
      submitted: "3 hours ago",
      status: "graded",
    },
    {
      id: 3,
      student: "Carol Davis",
      assignment: "Homework Ch.4",
      submitted: "5 hours ago",
      status: "pending",
    },
    {
      id: 4,
      student: "David Brown",
      assignment: "Math Quiz 3",
      submitted: "Yesterday",
      status: "pending",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your schedule and tasks for today."
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="My Students"
            value={stats.totalStudents}
            icon={TeamOutlined}
            iconColor="bg-blue-100 text-blue-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Classes Today"
            value={stats.classesToday}
            icon={CalendarOutlined}
            iconColor="bg-green-100 text-green-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Reviews"
            value={stats.pendingAssignments}
            icon={FileTextOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Attendance Rate"
            value={`${stats.attendanceRate}%`}
            icon={CheckCircleOutlined}
            iconColor="bg-purple-100 text-purple-600"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Today's Schedule */}
        <Col xs={24} lg={8}>
          <Card
            title="Today's Schedule"
            extra={
              <Link to="/teacher/schedule" className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={todaySchedule}
              renderItem={(item, index) => (
                <List.Item
                  className={`px-0! ${
                    index === 0 ? "bg-indigo-50 -mx-4 px-4 rounded-lg" : ""
                  }`}>
                  <List.Item.Meta
                    avatar={
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOutlined className="text-indigo-600" />
                      </div>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.class}</span>
                        <Tag color="blue" className="m-0!">
                          {item.subject}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        <ClockCircleOutlined className="mr-1" />
                        {item.time} • {item.room}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Pending Tasks */}
        <Col xs={24} lg={8}>
          <Card
            title="Pending Tasks"
            extra={
              <span className="text-sm text-gray-500">
                {pendingTasks.length} tasks
              </span>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    title={
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.task}</span>
                        <Tag
                          color={getPriorityColor(item.priority)}
                          className="m-0!">
                          {item.priority}
                        </Tag>
                      </div>
                    }
                    description={
                      <span className="text-xs text-gray-500">
                        Due: {item.due}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Submissions */}
        <Col xs={24} lg={8}>
          <Card
            title="Recent Submissions"
            extra={
              <Link
                to="/teacher/grades/assignments"
                className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={recentSubmissions}
              renderItem={(item) => (
                <List.Item className="px-0!">
                  <List.Item.Meta
                    avatar={
                      <Avatar className="bg-green-100 text-green-600">
                        {item.student.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {item.student}
                        </span>
                        <Tag
                          color={
                            item.status === "graded" ? "success" : "warning"
                          }>
                          {item.status}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        {item.assignment} • {item.submitted}
                      </div>
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
              <Link to="/teacher/attendance/mark">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <CheckCircleOutlined className="text-2xl text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Mark Attendance
                  </div>
                </div>
              </Link>
              <Link to="/teacher/grades/enter">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                  <FileTextOutlined className="text-2xl text-green-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Enter Grades
                  </div>
                </div>
              </Link>
              <Link to="/teacher/grades/assignments">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                  <BookOutlined className="text-2xl text-purple-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Create Assignment
                  </div>
                </div>
              </Link>
              <Link to="/teacher/communication">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                  <TeamOutlined className="text-2xl text-yellow-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Message Parents
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

export default TeacherDashboard;
