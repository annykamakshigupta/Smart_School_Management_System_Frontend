/**
 * Student Dashboard
 * Premium SaaS-style — solid colors, clean hierarchy, no gradients
 */

import { useState, useEffect, useCallback } from "react";
import { Card, Tag, Spin, Empty, Avatar, message } from "antd";
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
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  getMyStudentProfile,
  getMyAttendance,
  getMySubjects,
} from "../../../services/student.service";
import scheduleService from "../../../services/schedule.service";
import { getMyExamResults } from "../../../services/exam.service";
import { getMyFees } from "../../../services/fee.service";

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState({ data: [], summary: {} });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const fetchAdditionalData = useCallback(async (profile) => {
    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      const classId = profile?.class?._id || profile?.classId?._id;

      const [attendanceRes, resultsRes, feesRes, scheduleRes, subjectsRes] =
        await Promise.all([
          getMyAttendance({
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          }).catch(() => ({ data: [] })),
          getMyExamResults().catch(() => ({ data: [] })),
          getMyFees().catch(() => ({ data: [], summary: {} })),
          scheduleService
            .getStudentSchedules()
            .catch(() => ({ data: { groupedByDay: {} } })),
          classId
            ? getMySubjects(classId).catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
        ]);

      setAttendance(attendanceRes.data || []);
      setResults(resultsRes.data || []);
      setFees(feesRes);
      setSubjects(subjectsRes.data || []);

      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const grouped = scheduleRes.data?.groupedByDay || {};
      setTodaySchedule(grouped[today] || []);
    } catch (error) {
      console.error("Error fetching additional data:", error);
    } finally {
      setAttendanceLoading(false);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();
      const profile = profileRes.data;
      setStudentProfile(profile);
      if (profile?._id) {
        await fetchAdditionalData(profile);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      message.error("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, [fetchAdditionalData]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

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
      <div className="max-w-3xl mx-auto mt-12">
        <Card className="border border-slate-200">
          <Empty
            description="Student profile not found. Please contact the administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  const classInfo = studentProfile.class || studentProfile.classId;
  const classTeacher = classInfo?.classTeacher;
  const parentInfo = studentProfile.parentId;

  const classTeacherName =
    classTeacher?.userId?.name || classTeacher?.name || null;
  const classTeacherEmail = classTeacher?.userId?.email || null;
  const classTeacherPhone = classTeacher?.userId?.phone || null;
  const hasClassTeacherDetails = !!(
    classTeacherName ||
    classTeacherEmail ||
    classTeacherPhone
  );

  const attendanceRate = calculateAttendanceRate();
  const avgPerformance =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) /
            results.length,
        )
      : null;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {studentProfile.userId?.name || "Student"}
          </h1>
          <p className="text-slate-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="border-slate-300 text-slate-700 font-medium px-3 py-0.5">
            {classInfo?.name || "N/A"} — {studentProfile.section || "N/A"}
          </Tag>
          <Tag className="border-slate-300 text-slate-700 font-medium px-3 py-0.5">
            Roll #{studentProfile.rollNumber || "N/A"}
          </Tag>
          <Tag className="border-slate-300 text-slate-700 font-medium px-3 py-0.5">
            {studentProfile.academicYear || "N/A"}
          </Tag>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircleOutlined className="text-emerald-600 text-lg" />
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              This Month
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{attendanceRate}%</p>
          <p className="text-sm text-slate-500 mt-1">Attendance</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOutlined className="text-blue-600 text-lg" />
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {subjects.length || 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">Subjects</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
              <TrophyOutlined className="text-violet-600 text-lg" />
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Average
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {avgPerformance != null ? `${avgPerformance}%` : "—"}
          </p>
          <p className="text-sm text-slate-500 mt-1">Performance</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <FileTextOutlined className="text-amber-600 text-lg" />
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Balance
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ₹{fees.summary?.totalBalance || 0}
          </p>
          <p className="text-sm text-slate-500 mt-1">Pending Fees</p>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — 2 cols wide */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Timetable */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            title={
              <div className="flex items-center gap-2">
                <ClockCircleOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  Today&apos;s Schedule
                </span>
                <span className="text-xs text-slate-400 ml-1">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </span>
              </div>
            }
            extra={
              <Link
                to="/student/timetable"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Full timetable <ArrowRightOutlined className="text-xs" />
              </Link>
            }>
            {todaySchedule.length ? (
              <div className="divide-y divide-slate-100">
                {todaySchedule.slice(0, 6).map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-20 text-center shrink-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {s.startTime}
                      </p>
                      <p className="text-xs text-slate-400">{s.endTime}</p>
                    </div>
                    <div className="w-px h-10 bg-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {s.subjectId?.name || "Untitled"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {s.teacherId?.name || "—"} · Room {s.room || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description="No classes today"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* My Subjects */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            title={
              <div className="flex items-center gap-2">
                <BookOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  My Subjects
                </span>
                <span className="ml-auto text-xs text-slate-400">
                  {subjects.length} total
                </span>
              </div>
            }>
            {subjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map((subject) => {
                  const teacherName =
                    subject?.assignedTeacher?.userId?.name || null;
                  return (
                    <div
                      key={subject._id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors">
                      <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <BookOutlined className="text-blue-600" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {subject?.name || "Untitled"}
                        </p>
                        {teacherName && (
                          <p className="text-xs text-slate-500 truncate">
                            {teacherName}
                          </p>
                        )}
                      </div>
                      {subject?.code && (
                        <Tag className="border-slate-300 text-slate-600 m-0">
                          {subject.code}
                        </Tag>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty
                description="No subjects assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Class Teacher */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            title={
              <div className="flex items-center gap-2">
                <TeamOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  Class Teacher
                </span>
              </div>
            }>
            {classTeacher && hasClassTeacherDetails ? (
              <div className="flex items-start gap-4">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-slate-100 text-slate-500 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {classTeacherName || "N/A"}
                  </p>
                  {classTeacherEmail && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 truncate mt-1">
                      <MailOutlined className="text-xs" /> {classTeacherEmail}
                    </p>
                  )}
                  {classTeacherPhone && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 truncate mt-0.5">
                      <PhoneOutlined className="text-xs" /> {classTeacherPhone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description="Not assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* Parent / Guardian */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  Parent / Guardian
                </span>
              </div>
            }>
            {parentInfo ? (
              <div className="flex items-start gap-4">
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  className="bg-slate-100 text-slate-500 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {parentInfo.userId?.name || parentInfo.name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 truncate mt-1">
                    <MailOutlined className="text-xs" />{" "}
                    {parentInfo.userId?.email || parentInfo.email || "N/A"}
                  </p>
                  {(parentInfo.userId?.phone || parentInfo.phone) && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 truncate mt-0.5">
                      <PhoneOutlined className="text-xs" />{" "}
                      {parentInfo.userId?.phone || parentInfo.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Empty
                description="Not assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* Recent Attendance */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            loading={attendanceLoading}
            title={
              <div className="flex items-center gap-2">
                <CheckCircleOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  Recent Attendance
                </span>
              </div>
            }
            extra={
              <Link
                to="/student/attendance"
                className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
              </Link>
            }>
            {attendance.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {attendance.slice(0, 5).map((record, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <span className="text-sm text-slate-600">
                      {new Date(record.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Tag
                      color={
                        record.status === "present"
                          ? "success"
                          : record.status === "absent"
                            ? "error"
                            : "warning"
                      }
                      className="m-0 capitalize">
                      {record.status}
                    </Tag>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description="No records"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

          {/* My Information */}
          <Card
            className="border border-slate-200 shadow-sm rounded-xl"
            title={
              <div className="flex items-center gap-2">
                <IdcardOutlined className="text-slate-400" />
                <span className="font-semibold text-slate-800">
                  My Information
                </span>
              </div>
            }>
            <div className="space-y-3">
              {[
                { label: "Email", value: studentProfile.userId?.email },
                { label: "Phone", value: studentProfile.userId?.phone },
                {
                  label: "Admission Date",
                  value: studentProfile.admissionDate
                    ? new Date(
                        studentProfile.admissionDate,
                      ).toLocaleDateString()
                    : null,
                },
                { label: "Academic Year", value: studentProfile.academicYear },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-slate-800">
                    {value || "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <Card
        className="border border-slate-200 shadow-sm rounded-xl"
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-slate-400" />
            <span className="font-semibold text-slate-800">Quick Actions</span>
          </div>
        }>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              to: "/student/attendance",
              icon: (
                <CheckCircleOutlined className="text-xl text-emerald-600" />
              ),
              bg: "bg-emerald-50",
              label: "Attendance",
              sub: "View records",
            },
            {
              to: "/student/assignments",
              icon: <FileTextOutlined className="text-xl text-blue-600" />,
              bg: "bg-blue-50",
              label: "Assignments",
              sub: "Pending tasks",
            },
            {
              to: "/student/timetable",
              icon: <CalendarOutlined className="text-xl text-violet-600" />,
              bg: "bg-violet-50",
              label: "Timetable",
              sub: "Class schedule",
            },
            {
              to: "/student/fees",
              icon: <FileTextOutlined className="text-xl text-amber-600" />,
              bg: "bg-amber-50",
              label: "Fee Status",
              sub: "Payment info",
            },
          ].map(({ to, icon, bg, label, sub }) => (
            <Link key={to} to={to}>
              <div className="group p-5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-center cursor-pointer">
                <div
                  className={`w-12 h-12 mx-auto mb-3 ${bg} rounded-xl flex items-center justify-center`}>
                  {icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StudentDashboard;
