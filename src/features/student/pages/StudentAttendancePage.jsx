/**
 * Student Attendance Page
 * Modern, clean design for students to view their attendance records and statistics
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  message,
  DatePicker,
  Select,
  Empty,
  Table,
  Tag,
  Spin,
  Progress,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import {
  getMyAttendance,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import {
  getMySubjects,
  getMyStudentProfile,
} from "../../../services/student.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StudentAttendancePage = () => {
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const range = getCurrentMonthRange();
    return [dayjs(range.startDate), dayjs(range.endDate)];
  });

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const profileRes = await getMyStudentProfile();

      const classId =
        profileRes.data?.class?._id || profileRes.data?.classId?._id;

      if (classId) {
        const subjectsRes = await getMySubjects(classId);
        setSubjects(subjectsRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch attendance
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getMyAttendance(params);
      setAttendance(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [selectedSubject, dateRange]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // Calculate statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter((a) => a.status === "present").length,
    absent: attendance.filter((a) => a.status === "absent").length,
    late: attendance.filter((a) => a.status === "late").length,
  };

  const attendanceRate =
    stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-slate-400" />
          <span>{dayjs(date).format("MMM DD, YYYY")}</span>
        </div>
      ),
    },
    {
      title: "Day",
      dataIndex: "date",
      key: "day",
      width: 100,
      render: (date) => (
        <span className="text-slate-500">{dayjs(date).format("dddd")}</span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subjectId",
      key: "subject",
      render: (subject) => (
        <div className="flex items-center gap-2">
          <BookOutlined className="text-emerald-500" />
          <span className="font-medium">{subject?.name || "N/A"}</span>
        </div>
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
          <Tag color={color} icon={icon} className="px-3 py-1">
            {label}
          </Tag>
        );
      },
    },
  ];

  if (loading && attendance.length === 0) {
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
        title="My Attendance"
        subtitle="View your attendance records and statistics"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border border-slate-200 shadow-sm">
          <div className="text-center">
            <CalendarOutlined className="text-2xl text-slate-500 mb-2" />
            <div className="text-3xl font-bold text-slate-900">
              {stats.total}
            </div>
            <div className="text-sm text-slate-500 mt-1">Total Days</div>
          </div>
        </Card>

        <Card className="border border-emerald-200 bg-emerald-50 shadow-sm">
          <div className="text-center">
            <CheckCircleOutlined className="text-2xl text-emerald-600 mb-2" />
            <div className="text-3xl font-bold text-emerald-700">
              {stats.present}
            </div>
            <div className="text-sm text-emerald-600 mt-1">Present</div>
          </div>
        </Card>

        <Card className="border border-red-200 bg-red-50 shadow-sm">
          <div className="text-center">
            <CloseCircleOutlined className="text-2xl text-red-600 mb-2" />
            <div className="text-3xl font-bold text-red-700">
              {stats.absent}
            </div>
            <div className="text-sm text-red-600 mt-1">Absent</div>
          </div>
        </Card>

        <Card className="border border-amber-200 bg-amber-50 shadow-sm">
          <div className="text-center">
            <ClockCircleOutlined className="text-2xl text-amber-600 mb-2" />
            <div className="text-3xl font-bold text-amber-700">
              {stats.late}
            </div>
            <div className="text-sm text-amber-600 mt-1">Late</div>
          </div>
        </Card>

        <Card className="border border-emerald-200 bg-emerald-50 shadow-sm">
          <div className="text-center">
            <BarChartOutlined className="text-2xl text-emerald-600 mb-2" />
            <Progress
              type="circle"
              percent={attendanceRate}
              width={50}
              strokeColor={
                attendanceRate >= 75
                  ? "#10b981"
                  : attendanceRate >= 50
                    ? "#f59e0b"
                    : "#ef4444"
              }
              className="mb-1"
            />
            <div className="text-sm text-emerald-600 mt-1">Attendance %</div>
          </div>
        </Card>
      </div>

      {/* Attendance Warning */}
      {attendanceRate < 75 && stats.total > 0 && (
        <Card className="border border-amber-300 bg-amber-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <ClockCircleOutlined className="text-amber-600 text-xl" />
            </div>
            <div>
              <div className="font-semibold text-amber-800">
                Low Attendance Warning
              </div>
              <div className="text-sm text-amber-700">
                Your attendance is below 75%. Please ensure regular attendance
                to avoid academic issues.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <CalendarOutlined className="mr-1" /> Date Range
            </label>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="MMM DD, YYYY"
              className="w-full"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <BookOutlined className="mr-1" /> Subject
            </label>
            <Select
              placeholder="All Subjects"
              value={selectedSubject}
              onChange={setSelectedSubject}
              allowClear
              className="w-full"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }>
              {subjects.map((subject) => (
                <Select.Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card
        className="border border-slate-200 shadow-sm"
        title={
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-emerald-600" />
            <span>Attendance Records</span>
          </div>
        }>
        <Table
          columns={columns}
          dataSource={attendance}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No attendance records found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default StudentAttendancePage;
