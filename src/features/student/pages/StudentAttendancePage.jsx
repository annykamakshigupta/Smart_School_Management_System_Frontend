/**
 * Student Attendance Page
 * View personal attendance records
 */

import { useState } from "react";
import {
  Card,
  Calendar,
  Tag,
  Progress,
  Select,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import dayjs from "dayjs";

const StudentAttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  // Mock attendance data
  const attendanceData = {
    "2026-01-02": "present",
    "2026-01-03": "present",
    "2026-01-06": "present",
    "2026-01-07": "absent",
    "2026-01-08": "present",
  };

  const monthlyStats = {
    totalDays: 22,
    present: 18,
    absent: 2,
    late: 2,
    percentage: 91,
  };

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const status = attendanceData[dateStr];

    if (!status) return null;

    const colors = {
      present: "bg-green-500",
      absent: "bg-red-500",
      late: "bg-yellow-500",
    };

    return (
      <div className="flex justify-center">
        <div className={`w-2 h-2 rounded-full ${colors[status]}`} />
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="My Attendance"
        subtitle="Track your attendance record"
        breadcrumbs={[
          { label: "Student", path: "/student/dashboard" },
          { label: "Attendance" },
        ]}
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Days"
              value={monthlyStats.totalDays}
              prefix={<CalendarOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Present"
              value={monthlyStats.present}
              valueStyle={{ color: "#22c55e" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Absent"
              value={monthlyStats.absent}
              valueStyle={{ color: "#ef4444" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Late"
              value={monthlyStats.late}
              valueStyle={{ color: "#f59e0b" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Attendance Progress */}
        <Col xs={24} lg={8}>
          <Card title="Attendance Rate" className="h-full">
            <div className="text-center mb-6">
              <Progress
                type="circle"
                percent={monthlyStats.percentage}
                size={150}
                strokeColor={{
                  "0%": "#6366f1",
                  "100%": "#22c55e",
                }}
                format={(percent) => (
                  <div>
                    <div className="text-3xl font-bold">{percent}%</div>
                    <div className="text-sm text-gray-500">This Month</div>
                  </div>
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Present</span>
                </div>
                <span className="font-medium">{monthlyStats.present} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Absent</span>
                </div>
                <span className="font-medium">{monthlyStats.absent} days</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Late</span>
                </div>
                <span className="font-medium">{monthlyStats.late} days</span>
              </div>
            </div>

            {monthlyStats.percentage < 75 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">
                  ⚠️ Your attendance is below 75%. Please improve your
                  attendance.
                </p>
              </div>
            )}
          </Card>
        </Col>

        {/* Calendar */}
        <Col xs={24} lg={16}>
          <Card title="Attendance Calendar">
            <Calendar
              fullscreen={false}
              value={selectedMonth}
              onChange={setSelectedMonth}
              dateCellRender={dateCellRender}
            />
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Late</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentAttendancePage;

// Need to import CalendarOutlined for the component
import { CalendarOutlined } from "@ant-design/icons";
