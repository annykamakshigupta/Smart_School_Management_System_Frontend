/**
 * Parent Dashboard
 * Main dashboard view for parents
 */

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
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
  BellOutlined,
  BookOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";

const ParentDashboard = () => {
  // Mock data - in production, this would be fetched from API
  const children = [
    {
      id: 1,
      name: "Alice Johnson",
      class: "10A",
      rollNo: "001",
      attendance: 92,
      gpa: 3.8,
      pendingFees: 500,
      photo: null,
    },
    {
      id: 2,
      name: "Bob Johnson",
      class: "8B",
      rollNo: "015",
      attendance: 88,
      gpa: 3.5,
      pendingFees: 0,
      photo: null,
    },
  ];

  const recentNotifications = [
    {
      id: 1,
      message: "Alice's Math test score: 92%",
      time: "2 hours ago",
      type: "grade",
    },
    {
      id: 2,
      message: "Bob was absent today",
      time: "5 hours ago",
      type: "attendance",
    },
    {
      id: 3,
      message: "Fee payment reminder for January",
      time: "Yesterday",
      type: "fee",
    },
    {
      id: 4,
      message: "Parent-teacher meeting on Jan 20",
      time: "2 days ago",
      type: "event",
    },
  ];

  const upcomingEvents = [
    {
      date: "Jan 10",
      event: "Alice's Science Project Due",
      type: "assignment",
    },
    { date: "Jan 15", event: "Bob's Math Test", type: "exam" },
    { date: "Jan 20", event: "Parent-Teacher Meeting", type: "meeting" },
    { date: "Jan 25", event: "School Annual Day", type: "event" },
  ];

  const feeStatus = {
    totalDue: 500,
    lastPayment: "Dec 15, 2025",
    nextDue: "Jan 31, 2026",
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "grade":
        return {
          icon: <TrophyOutlined />,
          color: "bg-yellow-100 text-yellow-600",
        };
      case "attendance":
        return {
          icon: <CheckCircleOutlined />,
          color: "bg-blue-100 text-blue-600",
        };
      case "fee":
        return {
          icon: <DollarOutlined />,
          color: "bg-green-100 text-green-600",
        };
      case "event":
        return {
          icon: <CalendarOutlined />,
          color: "bg-purple-100 text-purple-600",
        };
      default:
        return { icon: <BellOutlined />, color: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor your children's academic progress"
      />

      {/* Children Overview Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        {children.map((child) => (
          <Col xs={24} md={12} key={child.id}>
            <Card className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-indigo-100 text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {child.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Class {child.class} • Roll No: {child.rollNo}
                      </p>
                    </div>
                    <Link to={`/parent/children/${child.id}`}>
                      <Tag color="blue" className="cursor-pointer">
                        View Details
                      </Tag>
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {child.attendance}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {child.gpa}
                      </div>
                      <div className="text-xs text-gray-500">GPA</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          child.pendingFees > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}>
                        ${child.pendingFees}
                      </div>
                      <div className="text-xs text-gray-500">Pending Fees</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Fee Status */}
        <Col xs={24} lg={8}>
          <Card title="Fee Status" className="h-full">
            <div className="text-center mb-6">
              <Statistic
                title="Total Due"
                value={feeStatus.totalDue}
                prefix="$"
                valueStyle={{
                  color: feeStatus.totalDue > 0 ? "#ef4444" : "#22c55e",
                  fontSize: "2rem",
                }}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Payment</span>
                <span className="font-medium">{feeStatus.lastPayment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Next Due Date</span>
                <span className="font-medium text-red-600">
                  {feeStatus.nextDue}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/parent/fees/status">
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  View Payment Details
                </button>
              </Link>
            </div>
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={8}>
          <Card
            title="Recent Updates"
            extra={
              <Link to="/parent/notifications" className="text-indigo-600">
                View All
              </Link>
            }
            className="h-full">
            <List
              itemLayout="horizontal"
              dataSource={recentNotifications}
              renderItem={(item) => {
                const { icon, color } = getNotificationIcon(item.type);
                return (
                  <List.Item className="px-0!">
                    <List.Item.Meta
                      avatar={
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                          {icon}
                        </div>
                      }
                      title={<span className="text-sm">{item.message}</span>}
                      description={
                        <span className="text-xs text-gray-500">
                          {item.time}
                        </span>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        {/* Upcoming Events */}
        <Col xs={24} lg={8}>
          <Card title="Upcoming Events" className="h-full">
            <Timeline
              items={upcomingEvents.map((item) => ({
                color:
                  item.type === "exam"
                    ? "red"
                    : item.type === "meeting"
                    ? "blue"
                    : "green",
                children: (
                  <div>
                    <div className="font-medium text-sm">{item.event}</div>
                    <div className="text-xs text-gray-500">{item.date}</div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/parent/performance/attendance">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors cursor-pointer">
                  <CheckCircleOutlined className="text-2xl text-green-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    View Attendance
                  </div>
                </div>
              </Link>
              <Link to="/parent/performance/grades">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors cursor-pointer">
                  <TrophyOutlined className="text-2xl text-blue-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    View Grades
                  </div>
                </div>
              </Link>
              <Link to="/parent/fees/status">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-colors cursor-pointer">
                  <DollarOutlined className="text-2xl text-yellow-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Pay Fees
                  </div>
                </div>
              </Link>
              <Link to="/parent/communication">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors cursor-pointer">
                  <MessageOutlined className="text-2xl text-purple-600 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    Message Teacher
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

export default ParentDashboard;
