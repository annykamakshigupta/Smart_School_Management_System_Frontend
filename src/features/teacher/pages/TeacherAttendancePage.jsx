/**
 * Teacher Attendance Page
 * Allows teachers to mark and view attendance for their assigned classes
 */

import { useState, useEffect } from "react";
import { Card, Button, message, Empty } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import PageHeader from "../../../components/UI/PageHeader";
import {
  AttendanceTable,
  AttendanceFilter,
  MarkAttendanceForm,
} from "../../../components/Attendance";
import { getAttendanceByClass } from "../../../services/attendance.service";

const TeacherAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchAttendance();
    }
  }, [filters]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await getAttendanceByClass(filters);
      setAttendance(response.data || []);
    } catch (error) {
      message.error(error.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };

  const handleMarkSuccess = () => {
    setShowMarkForm(false);
    if (Object.keys(filters).length > 0) {
      fetchAttendance();
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Mark and view attendance for your classes"
        action={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowMarkForm(true)}
            size="large">
            Mark Attendance
          </Button>
        }
      />

      <div className="mt-6">
        <AttendanceFilter
          onFilter={handleFilter}
          showClassFilter={true}
          showSubjectFilter={true}
          showDateFilter={true}
        />

        <Card
          className="border-0 shadow-sm"
          extra={
            Object.keys(filters).length > 0 && (
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAttendance}
                loading={loading}>
                Refresh
              </Button>
            )
          }>
          {Object.keys(filters).length === 0 ? (
            <Empty
              description="Please select filters to view attendance records"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <AttendanceTable
              data={attendance}
              loading={loading}
              showStudent={true}
              showClass={true}
              showSubject={true}
              showActions={false}
            />
          )}
        </Card>
      </div>

      <MarkAttendanceForm
        visible={showMarkForm}
        onClose={() => setShowMarkForm(false)}
        onSuccess={handleMarkSuccess}
      />
    </div>
  );
};

export default TeacherAttendancePage;
