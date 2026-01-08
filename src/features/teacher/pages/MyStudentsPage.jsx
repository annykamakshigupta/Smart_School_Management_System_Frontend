/**
 * My Students Page
 * Teacher page for viewing and managing assigned students
 */

import { useState } from "react";
import { Card, Avatar, Tag, Input, Select, Progress, Tabs } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/UI";

const { Search } = Input;

const MyStudentsPage = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      class: "10A",
      rollNo: "001",
      attendance: 95,
      avgGrade: 88,
      status: "excellent",
    },
    {
      id: 2,
      name: "Bob Williams",
      class: "10A",
      rollNo: "002",
      attendance: 82,
      avgGrade: 75,
      status: "good",
    },
    {
      id: 3,
      name: "Carol Davis",
      class: "10B",
      rollNo: "003",
      attendance: 90,
      avgGrade: 92,
      status: "excellent",
    },
    {
      id: 4,
      name: "David Brown",
      class: "9A",
      rollNo: "004",
      attendance: 68,
      avgGrade: 65,
      status: "needs-attention",
    },
    {
      id: 5,
      name: "Eva Miller",
      class: "9B",
      rollNo: "005",
      attendance: 88,
      avgGrade: 78,
      status: "good",
    },
    {
      id: 6,
      name: "Frank Wilson",
      class: "10A",
      rollNo: "006",
      attendance: 92,
      avgGrade: 85,
      status: "excellent",
    },
    {
      id: 7,
      name: "Grace Lee",
      class: "10B",
      rollNo: "007",
      attendance: 75,
      avgGrade: 70,
      status: "average",
    },
    {
      id: 8,
      name: "Henry Taylor",
      class: "9A",
      rollNo: "008",
      attendance: 60,
      avgGrade: 55,
      status: "needs-attention",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "success";
      case "good":
        return "processing";
      case "average":
        return "warning";
      case "needs-attention":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    return status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const classStats = {
    "10A": { total: 3, excellent: 2, needsAttention: 0 },
    "10B": { total: 2, excellent: 1, needsAttention: 0 },
    "9A": { total: 2, excellent: 0, needsAttention: 2 },
    "9B": { total: 1, excellent: 0, needsAttention: 0 },
  };

  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="View and track all students assigned to your classes"
        breadcrumbs={[
          { label: "Teacher", path: "/teacher/dashboard" },
          { label: "My Students" },
        ]}
      />

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Search
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
            allowClear
          />
          <Select
            value={selectedClass}
            onChange={setSelectedClass}
            className="w-32"
            options={[
              { value: "all", label: "All Classes" },
              { value: "9A", label: "9A" },
              { value: "9B", label: "9B" },
              { value: "10A", label: "10A" },
              { value: "10B", label: "10B" },
            ]}
          />
          <div className="flex-1" />
          <div className="text-sm text-gray-500">
            Showing {filteredStudents.length} students
          </div>
        </div>
      </Card>

      {/* Class Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(classStats).map(([className, stats]) => (
          <Card
            key={className}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedClass === className ? "ring-2 ring-indigo-500" : ""
            }`}
            onClick={() => setSelectedClass(className)}>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{className}</div>
              <div className="text-2xl font-bold text-indigo-600">
                {stats.total}
              </div>
              <div className="text-xs text-gray-500">students</div>
              {stats.needsAttention > 0 && (
                <Tag color="error" className="mt-2">
                  {stats.needsAttention} need attention
                </Tag>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="hover:shadow-md transition-shadow"
            actions={[
              <Link to={`/teacher/students/${student.id}`} key="view">
                View Details
              </Link>,
            ]}>
            <div className="text-center mb-4">
              <Avatar
                size={64}
                icon={<UserOutlined />}
                className="bg-indigo-100 text-indigo-600 mb-3"
              />
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              <div className="text-sm text-gray-500">
                Class {student.class} • Roll No: {student.rollNo}
              </div>
              <Tag color={getStatusColor(student.status)} className="mt-2">
                {getStatusLabel(student.status)}
              </Tag>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    <CheckCircleOutlined className="mr-1" />
                    Attendance
                  </span>
                  <span className="font-medium">{student.attendance}%</span>
                </div>
                <Progress
                  percent={student.attendance}
                  showInfo={false}
                  strokeColor={student.attendance >= 75 ? "#22c55e" : "#ef4444"}
                  size="small"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    <TrophyOutlined className="mr-1" />
                    Avg. Grade
                  </span>
                  <span className="font-medium">{student.avgGrade}%</span>
                </div>
                <Progress
                  percent={student.avgGrade}
                  showInfo={false}
                  strokeColor={student.avgGrade >= 70 ? "#3b82f6" : "#f59e0b"}
                  size="small"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyStudentsPage;
