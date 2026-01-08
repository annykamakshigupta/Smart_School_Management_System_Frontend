/**
 * My Children Page
 * Parent page to view and select children profiles
 */

import { Card, Avatar, Tag, Progress, Row, Col } from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  DollarOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/UI";

const MyChildrenPage = () => {
  // Mock data
  const children = [
    {
      id: 1,
      name: "Alice Johnson",
      class: "10A",
      rollNo: "001",
      age: 15,
      attendance: 92,
      gpa: 3.8,
      rank: 5,
      pendingFees: 500,
      recentGrades: [
        { subject: "Math", grade: "A" },
        { subject: "Science", grade: "A-" },
        { subject: "English", grade: "B+" },
      ],
    },
    {
      id: 2,
      name: "Bob Johnson",
      class: "8B",
      rollNo: "015",
      age: 13,
      attendance: 88,
      gpa: 3.5,
      rank: 12,
      pendingFees: 0,
      recentGrades: [
        { subject: "Math", grade: "B+" },
        { subject: "Science", grade: "A" },
        { subject: "English", grade: "A-" },
      ],
    },
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
        title="My Children"
        subtitle="View and manage your children's profiles"
        breadcrumbs={[
          { label: "Parent", path: "/parent/dashboard" },
          { label: "My Children" },
        ]}
      />

      <Row gutter={[16, 16]}>
        {children.map((child) => (
          <Col xs={24} lg={12} key={child.id}>
            <Card className="hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  className="bg-indigo-100 text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {child.name}
                      </h2>
                      <p className="text-gray-500">
                        Class {child.class} • Roll No: {child.rollNo}
                      </p>
                      <p className="text-sm text-gray-400">
                        Age: {child.age} years
                      </p>
                    </div>
                    <Tag color="purple" className="text-sm">
                      Rank #{child.rank}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CheckCircleOutlined className="text-2xl text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {child.attendance}%
                  </div>
                  <div className="text-xs text-gray-500">Attendance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <TrophyOutlined className="text-2xl text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {child.gpa}
                  </div>
                  <div className="text-xs text-gray-500">GPA</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <DollarOutlined className="text-2xl text-yellow-600 mb-2" />
                  <div
                    className={`text-2xl font-bold ${
                      child.pendingFees > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                    ${child.pendingFees}
                  </div>
                  <div className="text-xs text-gray-500">Pending Fees</div>
                </div>
              </div>

              {/* Recent Grades */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Grades
                </h4>
                <div className="flex gap-2">
                  {child.recentGrades.map((grade, index) => (
                    <div
                      key={index}
                      className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500">
                        {grade.subject}
                      </div>
                      <Tag color={getGradeColor(grade.grade)} className="mt-1">
                        {grade.grade}
                      </Tag>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/parent/performance/grades?child=${child.id}`}>
                  <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    View Grades
                    <RightOutlined className="text-xs" />
                  </button>
                </Link>
                <Link to={`/parent/performance/attendance?child=${child.id}`}>
                  <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    View Attendance
                    <RightOutlined className="text-xs" />
                  </button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MyChildrenPage;
