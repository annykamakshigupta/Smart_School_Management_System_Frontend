/**
 * Admin Attendance Page
 * Allows admins to view, mark, edit, and manage all attendance records
 */

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Modal,
  Form,
  Select,
  Input,
  Empty,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import PageHeader from "../../../components/UI/PageHeader";
import {
  AttendanceTable,
  AttendanceFilter,
  MarkAttendanceForm,
} from "../../../components/Attendance";
import {
  getAttendanceByClass,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../../../services/attendance.service";
import StatCard from "../../../components/UI/StatCard";

const { confirm } = Modal;

const AdminAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [editModal, setEditModal] = useState({ visible: false, record: null });
  const [filters, setFilters] = useState({});
  const [summary, setSummary] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchAttendance();
      fetchSummary();
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

  const fetchSummary = async () => {
    try {
      const response = await getAttendanceSummary(filters);
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleFilter = (filterValues) => {
    setFilters(filterValues);
  };

  const handleEdit = (record) => {
    setEditModal({ visible: true, record });
    form.setFieldsValue({
      status: record.status,
      remarks: record.remarks,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateAttendance(editModal.record._id, values);
      message.success("Attendance updated successfully");
      setEditModal({ visible: false, record: null });
      form.resetFields();
      fetchAttendance();
      fetchSummary();
    } catch (error) {
      message.error(error.message || "Error updating attendance");
    }
  };

  const handleDelete = (record) => {
    confirm({
      title: "Delete Attendance Record",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete this attendance record for ${record.student?.name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteAttendance(record._id);
          message.success("Attendance deleted successfully");
          fetchAttendance();
          fetchSummary();
        } catch (error) {
          message.error(error.message || "Error deleting attendance");
        }
      },
    });
  };

  const handleMarkSuccess = () => {
    setShowMarkForm(false);
    if (Object.keys(filters).length > 0) {
      fetchAttendance();
      fetchSummary();
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Manage all attendance records across the institution"
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
          showDateFilter={false}
          showDateRange={true}
        />

        {summary && (
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Records"
                value={summary.totalRecords}
                iconColor="bg-blue-100 text-blue-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Present"
                value={summary.present}
                iconColor="bg-green-100 text-green-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Absent"
                value={summary.absent}
                iconColor="bg-red-100 text-red-600"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Attendance Rate"
                value={`${summary.attendanceRate}%`}
                iconColor="bg-purple-100 text-purple-600"
              />
            </Col>
          </Row>
        )}

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
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Card>
      </div>

      {/* Mark Attendance Modal */}
      <MarkAttendanceForm
        visible={showMarkForm}
        onClose={() => setShowMarkForm(false)}
        onSuccess={handleMarkSuccess}
      />

      {/* Edit Attendance Modal */}
      <Modal
        title="Edit Attendance"
        open={editModal.visible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModal({ visible: false, record: null });
          form.resetFields();
        }}
        okText="Update">
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}>
            <Select>
              <Select.Option value="present">Present</Select.Option>
              <Select.Option value="absent">Absent</Select.Option>
              <Select.Option value="late">Late</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={3} maxLength={500} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminAttendancePage;
