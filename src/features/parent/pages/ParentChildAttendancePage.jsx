/**
 * Parent Child Attendance Page
 * Allows parents to view their children's attendance records
 */

import { useState, useEffect } from "react";
import { Card, message, Row, Col, DatePicker, Select, Empty, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PageHeader from "../../../components/UI/PageHeader";
import {
  AttendanceStats,
  AttendanceTable,
} from "../../../components/Attendance";
import {
  getAttendanceForChild,
  getCurrentMonthRange,
} from "../../../services/attendance.service";
import { getAllSubjects } from "../../../services/subject.service";
import { getUsersByRole } from "../../../services/user.service";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ParentChildAttendancePage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
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
    fetchChildren();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchAttendance();
    }
  }, [selectedChild, selectedSubject, dateRange]);

  const fetchChildren = async () => {
    try {
      // In a real app, you'd fetch children linked to this parent
      // For now, we'll get all students
      const response = await getUsersByRole("student");
      setChildren(response.data || []);

      // Auto-select first child if available
      if (response.data && response.data.length > 0) {
        setSelectedChild(response.data[0]._id);
      }
    } catch (error) {
      message.error("Error fetching children");
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedChild) return;

    setLoading(true);
    try {
      const params = {
        childId: selectedChild,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      };

      if (selectedSubject) {
        params.subjectId = selectedSubject;
      }

      const response = await getAttendanceForChild(params);
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

  const selectedChildInfo = children.find(
    (child) => child._id === selectedChild
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Child's Attendance"
        subtitle="Monitor your child's attendance records and performance"
        icon={<UserOutlined />}
      />

      <div className="mt-6">
        {/* Child Selector */}
        <Card className="mb-4 border-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Child
              </label>
              <Select
                placeholder="Select a child"
                value={selectedChild}
                onChange={setSelectedChild}
                className="w-full"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }>
                {children.map((child) => (
                  <Select.Option key={child._id} value={child._id}>
                    {child.name} ({child.email})
                  </Select.Option>
                ))}
              </Select>
            </div>
            {selectedChildInfo && (
              <div className="text-sm text-gray-600">
                <div className="font-medium">{selectedChildInfo.name}</div>
                <div>{selectedChildInfo.email}</div>
              </div>
            )}
          </div>
        </Card>

        {selectedChild ? (
          <Row gutter={[16, 16]}>
            {/* Statistics Section */}
            <Col xs={24} lg={8}>
              {statistics ? (
                <>
                  <AttendanceStats statistics={statistics} loading={loading} />

                  {/* Alert for Low Attendance */}
                  {statistics.attendancePercentage < 75 && (
                    <Card className="mt-4 border-l-4 border-l-red-500 bg-red-50">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">⚠️</div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-1">
                            Low Attendance Alert
                          </h4>
                          <p className="text-sm text-red-700">
                            Your child's attendance is{" "}
                            <strong>{statistics.attendancePercentage}%</strong>,
                            which is below the recommended 75%. Please ensure
                            regular school attendance for better academic
                            performance.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Excellent Attendance Recognition */}
                  {statistics.attendancePercentage >= 95 && (
                    <Card className="mt-4 border-l-4 border-l-green-500 bg-green-50">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🌟</div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">
                            Excellent Attendance!
                          </h4>
                          <p className="text-sm text-green-700">
                            Your child maintains an outstanding attendance rate
                            of{" "}
                            <strong>{statistics.attendancePercentage}%</strong>.
                            Keep up the great work!
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
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
                <h3 className="text-lg font-semibold mb-4">
                  Attendance Records
                </h3>
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
        ) : (
          <Card className="border-0 shadow-sm">
            <Empty
              description="Please select a child to view attendance records"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentChildAttendancePage;
