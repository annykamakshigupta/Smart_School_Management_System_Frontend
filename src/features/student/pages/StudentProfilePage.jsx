/**
 * Student Profile Page
 * Modern profile page for students to view and manage their information
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Statistic,
  Progress,
  message,
  Button,
  List,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  TeamOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMySubjects,
} from "../../../services/student.service";
import { getMyExamResults } from "../../../services/exam.service";

const StudentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [results, setResults] = useState([]);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      setStudentProfile(profileRes.data);

      if (profileRes.data) {
        // Fetch additional data
        const classId =
          profileRes.data.class?._id || profileRes.data.classId?._id;

        const [attendanceRes, subjectsRes, resultsRes] = await Promise.all([
          getMyAttendance({
            startDate: new Date(new Date().getFullYear(), 0, 1)
              .toISOString()
              .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          }).catch(() => ({ data: [] })),
          classId
            ? getMySubjects(classId).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          getMyExamResults().catch(() => ({ data: [] })),
        ]);

        setAttendance(attendanceRes.data || []);
        setSubjects(subjectsRes.data || []);
        setResults(resultsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Calculate stats
  const calculateAttendanceRate = () => {
    if (!attendance || attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const calculateAverageGrade = () => {
    if (!results || results.length === 0) return 0;
    const total = results.reduce((acc, r) => acc + (r.marksObtained || 0), 0);
    const maxTotal = results.reduce(
      (acc, r) => acc + (r.maxMarks ?? r.totalMarks ?? 0),
      0,
    );
    return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
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
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          subtitle="View your profile information"
        />
        <Card>
          <Empty description="Profile not found" />
        </Card>
      </div>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const parentInfo = studentProfile.parentId;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
      />

      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-8 -m-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="bg-white/20 border-4 border-white/30"
              src={studentProfile.userId?.avatar}
            />
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">
                {studentProfile.userId?.name}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Tag
                  icon={<IdcardOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  Roll: {studentProfile.rollNumber}
                </Tag>
                <Tag
                  icon={<TeamOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  {classInfo?.name} - {studentProfile.section}
                </Tag>
                <Tag
                  icon={<CalendarOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  {studentProfile.academicYear}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <Row gutter={[24, 24]} className="mt-6">
          <Col xs={24} sm={8}>
            <Card className="text-center bg-emerald-50 border-emerald-200">
              <Statistic
                title={
                  <span className="text-emerald-700 font-semibold">
                    Attendance Rate
                  </span>
                }
                value={calculateAttendanceRate()}
                suffix="%"
                styles={{ color: "#059669" }}
                prefix={<CheckCircleOutlined />}
              />
              <Progress
                percent={calculateAttendanceRate()}
                strokeColor="#059669"
                showInfo={false}
                className="mt-2"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-blue-50 border-blue-200">
              <Statistic
                title={
                  <span className="text-blue-700 font-semibold">
                    Total Subjects
                  </span>
                }
                value={subjects.length}
                styles={{ color: "#2563eb" }}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center bg-amber-50 border-amber-200">
              <Statistic
                title={
                  <span className="text-amber-700 font-semibold">
                    Average Grade
                  </span>
                }
                value={calculateAverageGrade()}
                suffix="%"
                styles={{ color: "#d97706" }}
                prefix={<TrophyOutlined />}
              />
              <Progress
                percent={calculateAverageGrade()}
                strokeColor="#d97706"
                showInfo={false}
                className="mt-2"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-indigo-600" />
                <span>Personal Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Full Name
                  </span>
                }>
                {studentProfile.userId?.name}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <MailOutlined className="mr-2" />
                    Email
                  </span>
                }>
                {studentProfile.userId?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <PhoneOutlined className="mr-2" />
                    Phone
                  </span>
                }>
                {studentProfile.userId?.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <HomeOutlined className="mr-2" />
                    Address
                  </span>
                }>
                {studentProfile.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Date of Birth
                  </span>
                }>
                {studentProfile.dateOfBirth
                  ? new Date(studentProfile.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Admission Date
                  </span>
                }>
                {studentProfile.admissionDate
                  ? new Date(studentProfile.admissionDate).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Academic Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-emerald-600" />
                <span>Academic Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <TeamOutlined className="mr-2" />
                    Class
                  </span>
                }>
                {classInfo?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    Section
                  </span>
                }>
                {studentProfile.section || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    Roll Number
                  </span>
                }>
                {studentProfile.rollNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Academic Year
                  </span>
                }>
                {studentProfile.academicYear}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <BookOutlined className="mr-2" />
                    Total Subjects
                  </span>
                }>
                {subjects.length}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Class Teacher
                  </span>
                }>
                {classInfo?.classTeacher?.user?.name ||
                  classInfo?.classTeacher?.name ||
                  "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Parent Information */}
        {parentInfo && (
          <Col xs={24} lg={12}>
            <Card
              title={
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-purple-600" />
                  <span>Parent/Guardian Information</span>
                </div>
              }
              className="shadow-md border-slate-200">
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <span className="font-semibold">
                      <UserOutlined className="mr-2" />
                      Name
                    </span>
                  }>
                  {parentInfo.userId?.name || parentInfo.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold">
                      <MailOutlined className="mr-2" />
                      Email
                    </span>
                  }>
                  {parentInfo.userId?.email || parentInfo.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold">
                      <PhoneOutlined className="mr-2" />
                      Phone
                    </span>
                  }>
                  {parentInfo.userId?.phone || parentInfo.phone || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="font-semibold">
                      <UserOutlined className="mr-2" />
                      Relationship
                    </span>
                  }>
                  {parentInfo.relationship || "Parent"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Subjects List */}
        <Col xs={24} lg={parentInfo ? 12 : 24}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-blue-600" />
                <span>My Subjects</span>
                <Tag color="blue">{subjects.length} subjects</Tag>
              </div>
            }
            className="shadow-md border-slate-200">
            {subjects.length > 0 ? (
              <List
                dataSource={subjects}
                renderItem={(subject) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Avatar
                          size="small"
                          className="bg-blue-100 text-blue-600"
                          icon={<BookOutlined />}
                        />
                        <div>
                          <div className="font-semibold text-slate-900">
                            {subject.name}
                          </div>
                          {subject.code && (
                            <div className="text-xs text-slate-500">
                              Code: {subject.code}
                            </div>
                          )}
                        </div>
                      </div>
                      {subject.assignedTeacher && (
                        <div className="text-sm text-slate-600">
                          <UserOutlined className="mr-1" />
                          {subject.assignedTeacher.user?.name ||
                            subject.assignedTeacher.name}
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No subjects assigned yet" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfilePage;
