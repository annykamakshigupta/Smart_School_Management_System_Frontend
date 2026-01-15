/**
 * Student Attendance Page
 * Allows students to view their own attendance records and statistics
 */

import { useState, useEffect } from "react";
import { Card, message, Row, Col, DatePicker, Select, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import PageHeader from "../../../components/UI/PageHeader";
import {
  AttendanceStats,
  AttendanceTable,
} from "../../../components/Attendance";
import {
  getAttendanceByStudent,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import { getAllSubjects } from "../../../services/subject.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StudentAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dateRange, setDateRange] = useState(() => {
    const range = getCurrentMonthRange();
    return [dayjs(range.startDate), dayjs(range.endDate)];
  });

  useEffect(() => {
    fetchSubjects();
    fetchAttendance();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedSubject, dateRange]);

  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getAttendanceByStudent(params);
      setAttendance(response.data || []);
      setStatistics(response.statistics);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="My Attendance"
        subtitle="View your attendance records and statistics"
        icon={<CalendarOutlined />}
      />

      <div className="mt-6">
        <Row gutter={[16, 16]}>
          {/* Statistics Section */}
          <Col xs={24} lg={8}>
            {statistics ? (
              <AttendanceStats statistics={statistics} loading={loading} />
            ) : (
              <Card className="border-0 shadow-sm">
                <Empty description="No attendance data available" />
              </Card>
            )}
          </Col>

          {/* Attendance Records Section */}
          <Col xs={24} lg={16}>
            <Card className="border-0 shadow-sm mb-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    format="YYYY-MM-DD"
                    className="w-full"
                    disabledDate={(current) =>
                      current && current > dayjs().endOf("day")
                    }
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Select
                    placeholder="All Subjects"
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    allowClear
                    className="w-full"
                    showSearch
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
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

            <Card className="border-0 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
              <AttendanceTable
                data={attendance}
                loading={loading}
                showStudent={false}
                showClass={true}
                showSubject={true}
                showActions={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StudentAttendancePage;
