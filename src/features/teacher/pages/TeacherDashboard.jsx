/**
 * Teacher Dashboard
 * Main dashboard view for teachers - Shows real data from API
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  List,
  Avatar,
  Tag,
  Badge,
  Spin,
  Empty,
  message,
} from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import {
  getMyAssignments,
  getMySchedule,
  getMyClasses,
  getStudentsByClass,
} from "../../../services/teacher.service";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState({
    assignedClasses: [],
    assignedSubjects: [],
    classTeacherOf: [],
    schedule: [],
    totalStudents: 0,
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);

      // Fetch assignments (classes and subjects assigned)
      const assignmentsRes = await getMyAssignments().catch(() => ({
        data: { assignedClasses: [], assignedSubjects: [] },
      }));

      // Fetch classes where user is class teacher
      const classTeacherRes = await getMyClasses().catch(() => ({ data: [] }));

      // Fetch schedule
      setScheduleLoading(true);
      const scheduleRes = await getMySchedule().catch(() => ({ data: [] }));
      setScheduleLoading(false);

      // Calculate total students from assigned classes
      let totalStudents = 0;
      const assignedClasses = assignmentsRes.data?.assignedClasses || [];

      for (const cls of assignedClasses) {
        try {
          const studentsRes = await getStudentsByClass(cls._id || cls);
          totalStudents += studentsRes.data?.length || 0;
        } catch {
          // Ignore errors for individual class student counts
        }
      }

      setTeacherData({
        assignedClasses: assignedClasses,
        assignedSubjects: assignmentsRes.data?.assignedSubjects || [],
        classTeacherOf: classTeacherRes.data || [],
        schedule: scheduleRes.data || [],
        totalStudents,
      });
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      message.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return teacherData.schedule.filter(
      (s) => s.dayOfWeek?.toLowerCase() === today,
    );
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  const todaySchedule = getTodaySchedule();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your overview for today."
        action={
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            size="large"
            onClick={() => navigate("/teacher/attendance?mark=1")}>
            Mark Attendance
          </Button>
        }
      />

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="My Students"
            value={teacherData.totalStudents}
            icon={TeamOutlined}
            iconColor="bg-blue-100 text-blue-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Classes Today"
            value={todaySchedule.length}
            icon={CalendarOutlined}
            iconColor="bg-green-100 text-green-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Assigned Classes"
            value={teacherData.assignedClasses.length}
            icon={HomeOutlined}
            iconColor="bg-yellow-100 text-yellow-600"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Subjects"
            value={teacherData.assignedSubjects.length}
            icon={BookOutlined}
            iconColor="bg-purple-100 text-purple-600"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Class Teacher Status */}
        {teacherData.classTeacherOf.length > 0 && (
          <Col xs={24}>
            <Card className="mb-4">
              <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <IdcardOutlined className="text-2xl" />
                  <h3 className="text-xl font-semibold m-0">Class Teacher</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teacherData.classTeacherOf.map((cls) => (
                    <div key={cls._id} className="bg-white/10 rounded-lg p-4">
                      <div className="font-semibold text-lg">{cls.name}</div>
                      <div className="text-white/70 text-sm">
                        Section: {cls.section || "A"}
                      </div>
                      <div className="text-white/70 text-sm">
                        Students: {cls.students?.length || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        )}

        {/* Today's Schedule */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <CalendarOutlined className="text-green-600" />
                Today's Schedule
              </span>
            }
            extra={
              <Link to="/teacher/schedule" className="text-indigo-600">
                View Full
              </Link>
            }
            loading={scheduleLoading}>
            {todaySchedule.length > 0 ? (
              <List
                dataSource={todaySchedule}
                renderItem={(item) => (
                  <List.Item>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">
                            {item.classId?.name || "Class"} -{" "}
                            {item.subjectId?.name || "Subject"}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {formatTime(item.startTime)} -{" "}
                            {formatTime(item.endTime)}
                          </div>
                        </div>
                      </div>
                      <Tag color="blue">{item.room || "TBA"}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No classes scheduled for today"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Assigned Classes */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <HomeOutlined className="text-blue-600" />
                My Classes
              </span>
            }
            extra={
              <Link to="/teacher/classes" className="text-indigo-600">
                View All
              </Link>
            }>
            {teacherData.assignedClasses.length > 0 ? (
              <List
                dataSource={teacherData.assignedClasses}
                renderItem={(cls) => (
                  <List.Item>
                    <div className="flex items-center gap-3">
                      <Avatar
                        icon={<TeamOutlined />}
                        className="bg-blue-100 text-blue-600"
                      />
                      <div>
                        <div className="font-medium">{cls.name || cls}</div>
                        <div className="text-gray-500 text-sm">
                          {cls.students?.length || 0} students
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No classes assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Assigned Subjects */}
        <Col xs={24} md={12}>
          <Card
            title={
              <span className="flex items-center gap-2">
                <BookOutlined className="text-purple-600" />
                My Subjects
              </span>
            }>
            {teacherData.assignedSubjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacherData.assignedSubjects.map((subject, index) => (
                  <Tag key={index} color="purple" className="py-2 px-4 text-sm">
                    <BookOutlined className="mr-1" />
                    {subject.name || subject}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty
                description="No subjects assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/teacher/attendance">
                <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-all hover:shadow-md cursor-pointer">
                  <CheckCircleOutlined className="text-3xl text-green-600 mb-2" />
                  <div className="font-medium text-gray-900">
                    Mark Attendance
                  </div>
                  <div className="text-xs text-gray-500">
                    Take class attendance
                  </div>
                </div>
              </Link>
              <Link to="/teacher/assignments">
                <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-all hover:shadow-md cursor-pointer">
                  <FileTextOutlined className="text-3xl text-blue-600 mb-2" />
                  <div className="font-medium text-gray-900">Assignments</div>
                  <div className="text-xs text-gray-500">Create & manage</div>
                </div>
              </Link>
              <Link to="/teacher/schedule">
                <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-all hover:shadow-md cursor-pointer">
                  <CalendarOutlined className="text-3xl text-purple-600 mb-2" />
                  <div className="font-medium text-gray-900">Schedule</div>
                  <div className="text-xs text-gray-500">View timetable</div>
                </div>
              </Link>
              <Link to="/teacher/students">
                <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-all hover:shadow-md cursor-pointer">
                  <TeamOutlined className="text-3xl text-yellow-600 mb-2" />
                  <div className="font-medium text-gray-900">Students</div>
                  <div className="text-xs text-gray-500">View all students</div>
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
