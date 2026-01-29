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
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  const todaySchedule = getTodaySchedule();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome Back, Teacher! 🎓
            </h1>
            <p className="text-indigo-100 text-lg">
              Here's your overview for today
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => navigate("/teacher/attendance?mark=1")}
              className="bg-white/20 hover:bg-white/30 border-white/30 backdrop-blur-sm">
              Mark Attendance
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-blue-500 to-blue-400 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <TeamOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Total
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {teacherData.totalStudents}
            </h3>
            <p className="text-blue-100 text-sm font-medium">My Students</p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <CalendarOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Today
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{todaySchedule.length}</h3>
            <p className="text-green-100 text-sm font-medium">Classes Today</p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <HomeOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Active
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {teacherData.assignedClasses.length}
            </h3>
            <p className="text-amber-100 text-sm font-medium">
              Assigned Classes
            </p>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BookOutlined className="text-3xl" />
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1 text-xs font-semibold">
                Teaching
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {teacherData.assignedSubjects.length}
            </h3>
            <p className="text-purple-100 text-sm font-medium">My Subjects</p>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Class Teacher Status */}
        {teacherData.classTeacherOf.length > 0 && (
          <Col xs={24}>
            <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
              <div className="bg-indigo-500 rounded-xl p-6 text-white">
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-green-600" />
                </div>
                <span className="font-bold">Today's Schedule</span>
              </div>
            }
            extra={
              <Link
                to="/teacher/schedule"
                className="text-indigo-600 hover:text-indigo-800 font-semibold">
                View Full
              </Link>
            }
            loading={scheduleLoading}
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HomeOutlined className="text-blue-400" />
                </div>
                <span className="font-bold">My Classes</span>
              </div>
            }
            extra={
              <Link
                to="/teacher/classes"
                className="text-indigo-600 hover:text-indigo-800 font-semibold">
                View All
              </Link>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            {teacherData.assignedClasses.length > 0 ? (
              <List
                dataSource={teacherData.assignedClasses}
                renderItem={(cls) => (
                  <List.Item>
                    <div className="flex items-center gap-3">
                      <Avatar
                        icon={<TeamOutlined />}
                        className="bg-blue-100 text-blue-400"
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOutlined className="text-purple-600" />
                </div>
                <span className="font-bold">My Subjects</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
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
          <Card
            title={
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <CalendarOutlined className="text-indigo-600" />
                </div>
                <span className="font-bold">Quick Actions</span>
              </div>
            }
            className="shadow-md hover:shadow-lg transition-shadow rounded-2xl border-0">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/teacher/attendance">
                <div className="group p-5 bg-linear-to-br from-green-50 to-green-100 rounded-2xl text-center hover:from-green-100 hover:to-green-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircleOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Mark Attendance
                  </div>
                  <div className="text-xs text-slate-600">
                    Take class attendance
                  </div>
                </div>
              </Link>
              <Link to="/teacher/assignments">
                <div className="group p-5 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl text-center hover:from-blue-100 hover:to-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FileTextOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">
                    Assignments
                  </div>
                  <div className="text-xs text-slate-600">Create & manage</div>
                </div>
              </Link>
              <Link to="/teacher/schedule">
                <div className="group p-5 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl text-center hover:from-purple-100 hover:to-purple-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CalendarOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Schedule</div>
                  <div className="text-xs text-slate-600">View timetable</div>
                </div>
              </Link>
              <Link to="/teacher/students">
                <div className="group p-5 bg-linear-to-br from-amber-50 to-amber-100 rounded-2xl text-center hover:from-amber-100 hover:to-amber-200 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 bg-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <TeamOutlined className="text-2xl text-white" />
                  </div>
                  <div className="font-bold text-slate-800 mb-1">Students</div>
                  <div className="text-xs text-slate-600">
                    View all students
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
