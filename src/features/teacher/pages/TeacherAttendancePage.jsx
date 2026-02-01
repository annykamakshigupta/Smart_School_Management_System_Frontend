/**
 * Teacher Attendance Page
 * Overview page for teachers to view attendance records and navigate to mark attendance
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  Table,
  Tag,
  Empty,
  Spin,
  message,
  Progress,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../components/UI";
import { getMyAssignments } from "../../../services/teacher.service";
import {
  getAttendanceByClass,
  getAttendanceSummary,
} from "../../../services/attendance.service";
import dayjs from "dayjs";

const TeacherAttendancePage = () => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);

  // Filters
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);

  // Fetch assignments
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyAssignments();
      setAssignments(response.items || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("Failed to load your classes");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    if (!selectedClass) return;

    try {
      setAttendanceLoading(true);

      const params = {
        classId: selectedClass,
        startDate: dateRange[0]?.format("YYYY-MM-DD"),
        endDate: dateRange[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const [attendanceRes, summaryRes] = await Promise.all([
        getAttendanceByClass(params),
        getAttendanceSummary(params).catch(() => null),
      ]);

      setAttendance(attendanceRes.data || []);
      setSummary(summaryRes?.data || null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      message.error("Failed to load attendance records");
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedClass, selectedSubject, dateRange]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (selectedClass) {
      fetchAttendance();
    }
  }, [selectedClass, selectedSubject, dateRange, fetchAttendance]);

  // Get unique classes from assignments
  const classOptions = [
    ...new Map(
      assignments
        .filter((a) => a.classId)
        .map((a) => {
          const cls = a.classId;
          return [
            cls._id || cls,
            { value: cls._id || cls, label: cls.name || "Unknown Class" },
          ];
        }),
    ).values(),
  ];

  // Get subjects for selected class
  const subjectOptions = assignments
    .filter((a) => {
      const classId = a.classId?._id || a.classId;
      return classId === selectedClass && a.subjectId;
    })
    .map((a) => ({
      value: a.subjectId._id || a.subjectId,
      label: a.subjectId.name || "Unknown Subject",
    }));

  // Calculate local summary from attendance data
  const localSummary = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    localSummary.total > 0
      ? Math.round((localSummary.present / localSummary.total) * 100)
      : 0;

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      render: (student) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-medium text-sm">
            {student?.user?.name?.[0]?.toUpperCase() || "S"}
          </div>
          <div>
            <div className="font-medium text-slate-900">
              {student?.user?.name || "Unknown"}
            </div>
            <div className="text-xs text-slate-500">
              Roll: {student?.rollNumber || "N/A"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <span className="text-slate-600">{subject?.name || "N/A"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = {
          present: {
            color: "success",
            icon: <CheckCircleOutlined />,
            label: "Present",
          },
          absent: {
            color: "error",
            icon: <CloseCircleOutlined />,
            label: "Absent",
          },
          late: {
            color: "warning",
            icon: <ClockCircleOutlined />,
            label: "Late",
          },
        };
        const { color, icon, label } = config[status] || config.present;
        return (
          <Tag color={color} icon={icon}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (remarks) => (
        <span className="text-slate-500 text-sm">{remarks || "-"}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle="View and manage attendance records for your classes"
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/teacher/attendance/mark")}
            size="large"
            className="bg-blue-600 hover:bg-blue-700">
            Mark Attendance
          </Button>
        }
      />

      {/* Filter Card */}
      <Card className="border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FilterOutlined className="mr-1" /> Class
            </label>
            <Select
              placeholder="Select Class"
              value={selectedClass}
              onChange={(value) => {
                setSelectedClass(value);
                setSelectedSubject(null);
              }}
              className="w-full"
              options={classOptions}
              allowClear
            />
          </div>

          <div className="flex-1 min-w-37.5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <Select
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              className="w-full"
              options={subjectOptions}
              disabled={!selectedClass}
              allowClear
            />
          </div>

          <div className="flex-1 min-w-50">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarOutlined className="mr-1" /> Date Range
            </label>
            <DatePicker.RangePicker
              value={dateRange}
              onChange={setDateRange}
              className="w-full"
              format="MMM DD, YYYY"
            />
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAttendance}
            loading={attendanceLoading}
            disabled={!selectedClass}>
            Refresh
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      {selectedClass && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">
                {localSummary.total}
              </div>
              <div className="text-sm text-slate-500 mt-1">Total Records</div>
            </div>
          </Card>

          <Card className="border border-emerald-200 bg-emerald-50 shadow-sm">
            <div className="text-center">
              <CheckCircleOutlined className="text-2xl text-emerald-600 mb-1" />
              <div className="text-3xl font-bold text-emerald-700">
                {localSummary.present}
              </div>
              <div className="text-sm text-emerald-600 mt-1">Present</div>
            </div>
          </Card>

          <Card className="border border-red-200 bg-red-50 shadow-sm">
            <div className="text-center">
              <CloseCircleOutlined className="text-2xl text-red-600 mb-1" />
              <div className="text-3xl font-bold text-red-700">
                {localSummary.absent}
              </div>
              <div className="text-sm text-red-600 mt-1">Absent</div>
            </div>
          </Card>

          <Card className="border border-amber-200 bg-amber-50 shadow-sm">
            <div className="text-center">
              <ClockCircleOutlined className="text-2xl text-amber-600 mb-1" />
              <div className="text-3xl font-bold text-amber-700">
                {localSummary.late}
              </div>
              <div className="text-sm text-amber-600 mt-1">Late</div>
            </div>
          </Card>

          <Card className="border border-blue-200 bg-blue-50 shadow-sm">
            <div className="text-center">
              <BarChartOutlined className="text-2xl text-blue-600 mb-1" />
              <Progress
                type="circle"
                percent={attendanceRate}
                width={50}
                strokeColor="#3b82f6"
                className="mb-1"
              />
              <div className="text-sm text-blue-600 mt-1">Attendance Rate</div>
            </div>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      <Card
        className="border border-slate-200 shadow-sm"
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-blue-600" />
            <span>Attendance Records</span>
          </div>
        }>
        {!selectedClass ? (
          <Empty
            description="Please select a class to view attendance records"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={attendance}
            rowKey="_id"
            loading={attendanceLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} records`,
            }}
            locale={{
              emptyText: (
                <Empty
                  description="No attendance records found for the selected filters"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default TeacherAttendancePage;
