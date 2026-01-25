/**
 * Student Dashboard
 * Main dashboard view for students - Shows real data from API
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  List,
  Tag,
  Spin,
  Empty,
  Badge,
  Avatar,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMyTimetable,
} from "../../../services/student.service";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      setStudentProfile(profileRes.data);

      if (profileRes.data?.classId?._id) {
        fetchAdditionalData(profileRes.data.classId._id);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      message.error("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async (classId) => {
    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const attendanceRes = await getMyAttendance({
        classId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      }).catch(() => ({ data: [] }));

      setAttendance(attendanceRes.data || []);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div>
        <PageHeader
          title="Student Dashboard"
          subtitle="Welcome to your academic portal"
        />
        <Card>
          <Empty
            description="Student profile not found. Please contact the administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  const classInfo = studentProfile.classId;
  const classTeacher = classInfo?.classTeacher;
  const parentInfo = studentProfile.parentId;

  return (
    <div>
      <PageHeader
        title="Student Dashboard"
        subtitle={`Welcome back, ${studentProfile.userId?.name}!`}
      />

      {/* Profile Header Card */}
      <Card className="mb-6">
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar
              size={80}
              icon={<UserOutlined />}
              className="bg-white/20 border-2 border-white/30"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {studentProfile.userId?.name}
              </h2>
              <div className="text-white/70 mb-4">
                {studentProfile.userId?.email}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-white/70 text-xs">Class</div>
                  <div className="font-semibold">
                    {classInfo?.name} - {studentProfile.section}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Roll Number</div>
                  <div className="font-semibold">
                    {studentProfile.rollNumber}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Academic Year</div>
                  <div className="font-semibold">
                    {studentProfile.academicYear}
                  </div>
                </div>
                <div>
                  <div className="text-white/70 text-xs">Status</div>
                  <Badge
                    status={
                      studentProfile.userId?.status === "active"
                        ? "success"
                        : "warning"
                    }
                    text={
                      <span className="text-white capitalize">
                        {studentProfile.userId?.status || "Active"}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={6}>
          <StatCard
            title="Attendance Rate"
            value={`${calculateAttendanceRate()}%`}
            icon={CheckCircleOutlined}
            iconColor="bg-green-100 text-green-600"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Subjects"
            value={classInfo?.subjects?.length || 0}
            icon={BookOutlined}
            iconColor="bg-blue-100 text-blue-600"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Class"
            value={`${classInfo?.name || "N/A"}`}
            icon={TeamOutlined}
            iconColor="bg-purple-100 text-purple-600"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Section"
            value={studentProfile.section || "N/A"}
            icon={IdcardOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Class Teacher Info */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <TeamOutlined className="text-indigo-600" />
                Class Teacher
              </span>
            }
            className="h-full">
            {classTeacher ? (
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-indigo-100 text-indigo-600"
                />
                <div>
                  <h4 className="font-semibold text-lg">{classTeacher.name}</h4>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <MailOutlined />
                    {classTeacher.email}
                  </div>
                  {classTeacher.phone && (
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <PhoneOutlined />
                      {classTeacher.phone}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description="No class teacher assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Parent Info */}
        <Col xs={24} md={12} lg={8}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <UserOutlined className="text-purple-600" />
                Parent / Guardian
              </span>
            }
            className="h-full">
            {parentInfo ? (
              <div className="flex items-center gap-4">
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  className="bg-purple-100 text-purple-600"
                />
                <div>
                  <h4 className="font-semibold text-lg">{parentInfo.name}</h4>
                  <div className="text-gray-500 text-sm flex items-center gap-1">
                    <MailOutlined />
                    {parentInfo.email}
                  </div>
                  {parentInfo.phone && (
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                      <PhoneOutlined />
                      {parentInfo.phone}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description="No parent assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Recent Attendance */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <CheckCircleOutlined className="text-green-600" />
                Recent Attendance
              </span>
            }
            extra={
              <Link to="/student/attendance" className="text-indigo-600">
                View All
              </Link>
            }
            loading={attendanceLoading}
            className="h-full">
            {attendance.length > 0 ? (
              <List
                size="small"
                dataSource={attendance.slice(0, 5)}
                renderItem={(record) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-gray-600">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <Tag
                        color={
                          record.status === "present"
                            ? "success"
                            : record.status === "absent"
                              ? "error"
                              : "warning"
                        }>
                        {record.status?.charAt(0).toUpperCase() +
                          record.status?.slice(1)}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No attendance records found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Class Subjects */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <BookOutlined className="text-blue-600" />
                My Subjects
              </span>
            }>
            {classInfo?.subjects?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {classInfo.subjects.map((subject, index) => (
                  <Tag key={index} color="blue" className="py-2 px-4 text-sm">
                    <BookOutlined className="mr-1" />
                    {subject.name || subject}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty
                description="No subjects assigned to your class yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Student Info */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <IdcardOutlined className="text-indigo-600" />
                My Information
              </span>
            }>
            <List size="small">
              <List.Item>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">
                  {studentProfile.userId?.email || "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">
                  {studentProfile.userId?.phone || "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Admission Date:</span>
                <span className="font-medium">
                  {studentProfile.admissionDate
                    ? new Date(
                        studentProfile.admissionDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </List.Item>
              <List.Item>
                <span className="text-gray-500">Academic Year:</span>
                <span className="font-medium">
                  {studentProfile.academicYear}
                </span>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/student/attendance">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-all hover:shadow-md cursor-pointer">
                  <CheckCircleOutlined className="text-3xl text-green-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    View Attendance
                  </div>
                  <div className="text-xs text-gray-500">
                    Check your attendance
                  </div>
                </div>
              </Link>
              <Link to="/student/assignments">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-all hover:shadow-md cursor-pointer">
                  <FileTextOutlined className="text-3xl text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">Assignments</div>
                  <div className="text-xs text-gray-500">
                    View pending tasks
                  </div>
                </div>
              </Link>
              <Link to="/student/timetable">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-all hover:shadow-md cursor-pointer">
                  <CalendarOutlined className="text-3xl text-purple-600 mb-2" />
                  <div className="font-medium text-gray-900">Timetable</div>
                  <div className="text-xs text-gray-500">
                    View class schedule
                  </div>
                </div>
              </Link>
              <Link to="/student/fees">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-all hover:shadow-md cursor-pointer">
                  <TrophyOutlined className="text-3xl text-yellow-600 mb-2" />
                  <div className="font-medium text-gray-900">Fee Status</div>
                  <div className="text-xs text-gray-500">
                    Check payment status
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
