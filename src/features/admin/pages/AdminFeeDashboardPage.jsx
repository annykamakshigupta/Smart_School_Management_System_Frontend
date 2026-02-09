/**
 * Admin Fee Dashboard Page
 * Comprehensive fee management with structures, assignment, payments, analytics
 * Modern SaaS-style admin interface
 */

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  Card,
  Tooltip,
  Badge,
  Dropdown,
  Empty,
  Skeleton,
  Popconfirm,
  InputNumber,
  DatePicker,
  Table,
  Progress,
  Switch,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  SearchOutlined,
  SendOutlined,
  EyeOutlined,
  DownloadOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import * as feeService from "../../../services/fee.service";
import * as classService from "../../../services/class.service";
import dayjs from "dayjs";

const FEE_TYPES = [
  { value: "tuition", label: "Tuition", color: "#2563eb" },
  { value: "exam", label: "Exam", color: "#7c3aed" },
  { value: "transport", label: "Transport", color: "#059669" },
  { value: "library", label: "Library", color: "#d97706" },
  { value: "lab", label: "Lab", color: "#dc2626" },
  { value: "admission", label: "Admission", color: "#0891b2" },
  { value: "sports", label: "Sports", color: "#ca8a04" },
  { value: "other", label: "Other", color: "#6b7280" },
];

const PAYMENT_STATUS_CONFIG = {
  paid: { color: "success", label: "Paid", icon: <CheckCircleOutlined /> },
  unpaid: { color: "default", label: "Unpaid", icon: <ClockCircleOutlined /> },
  partial: {
    color: "warning",
    label: "Partial",
    icon: <ExclamationCircleOutlined />,
  },
  overdue: { color: "error", label: "Overdue", icon: <WarningOutlined /> },
};

const AdminFeeDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [structures, setStructures] = useState([]);
  const [fees, setFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modals
  const [structureModalOpen, setStructureModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);

  // Filters
  const [feeFilters, setFeeFilters] = useState({
    paymentStatus: "",
    feeType: "",
    classId: "",
    search: "",
  });

  const [structureForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === "fees") fetchFees();
    if (activeTab === "payments") fetchPayments();
  }, [activeTab, feeFilters]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsRes, structuresRes, classesRes] = await Promise.all([
        feeService.getFeeStats(),
        feeService.getAllFeeStructures(),
        classService.getAllClasses(),
      ]);
      setStats(statsRes.data || null);
      setStructures(structuresRes.data || []);
      setClasses(classesRes.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await feeService.getAllFees(feeFilters);
      setFees(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await feeService.getAllPayments();
      setPayments(response.data || []);
    } catch (error) {
      message.error(error.message || "Failed to load payments");
    }
  };

  const handleCreateStructure = async (values) => {
    try {
      const data = {
        ...values,
        dueDate: values.dueDate?.toISOString(),
      };
      if (editingStructure) {
        await feeService.updateFeeStructure(editingStructure._id, data);
        message.success("Fee structure updated");
      } else {
        await feeService.createFeeStructure(data);
        message.success("Fee structure created");
      }
      setStructureModalOpen(false);
      setEditingStructure(null);
      structureForm.resetFields();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleAssignFees = async (structureId) => {
    try {
      const result = await feeService.assignFeesToClass(structureId);
      message.success(result.message);
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleToggleStructure = async (id) => {
    try {
      await feeService.toggleFeeStructure(id);
      message.success("Status updated");
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteStructure = async (id) => {
    try {
      await feeService.deleteFeeStructure(id);
      message.success("Fee structure deleted");
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRecordPayment = async (values) => {
    try {
      await feeService.recordPayment(selectedFee._id, values);
      message.success("Payment recorded successfully");
      setPaymentModalOpen(false);
      setSelectedFee(null);
      paymentForm.resetFields();
      fetchFees();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteFee = async (feeId) => {
    try {
      await feeService.deleteFee(feeId);
      message.success("Fee deleted");
      fetchFees();
      fetchInitialData();
    } catch (error) {
      message.error(error.message);
    }
  };

  const overall = stats?.overall || {};
  const collectionRate =
    overall.totalAmount > 0
      ? Math.round((overall.totalCollected / overall.totalAmount) * 100)
      : 0;

  // ═══════════════════════════════════════
  // OVERVIEW TAB
  // ═══════════════════════════════════════
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <DollarOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Fees Generated</p>
              <p className="text-2xl font-bold text-slate-900">
                ₹{(overall.totalAmount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircleOutlined className="text-2xl text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Collected</p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹{(overall.totalCollected || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
              <ClockCircleOutlined className="text-2xl text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-amber-600">
                ₹{(overall.totalPending || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
              <WarningOutlined className="text-2xl text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {overall.overdueCount || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Collection Progress + Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Collection Progress" className="border-0 shadow-sm">
          <div className="text-center mb-4">
            <Progress
              type="dashboard"
              percent={collectionRate}
              strokeColor={{
                "0%": "#3b82f6",
                "100%": "#10b981",
              }}
              size={180}
              format={(percent) => (
                <div>
                  <div className="text-3xl font-bold text-slate-900">
                    {percent}%
                  </div>
                  <div className="text-sm text-slate-500">Collected</div>
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <p className="text-lg font-bold text-emerald-700">
                {overall.paidCount || 0}
              </p>
              <p className="text-sm text-emerald-600">Fully Paid</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <p className="text-lg font-bold text-amber-700">
                {overall.partialCount || 0}
              </p>
              <p className="text-sm text-amber-600">Partial</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-slate-700">
                {overall.unpaidCount || 0}
              </p>
              <p className="text-sm text-slate-600">Unpaid</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-lg font-bold text-red-700">
                {overall.overdueCount || 0}
              </p>
              <p className="text-sm text-red-600">Overdue</p>
            </div>
          </div>
        </Card>

        <Card title="Fee Type Breakdown" className="border-0 shadow-sm">
          {stats?.byFeeType && stats.byFeeType.length > 0 ? (
            <div className="space-y-4">
              {stats.byFeeType.map((item) => {
                const feeConfig = FEE_TYPES.find((f) => f.value === item._id);
                const percent =
                  item.totalAmount > 0
                    ? Math.round((item.totalCollected / item.totalAmount) * 100)
                    : 0;
                return (
                  <div key={item._id} className="flex items-center gap-3">
                    <Tag
                      color={feeConfig?.color || "#6b7280"}
                      className="min-w-20 text-center">
                      {feeConfig?.label || item._id}
                    </Tag>
                    <div className="flex-1">
                      <Progress
                        percent={percent}
                        strokeColor={feeConfig?.color || "#6b7280"}
                        size="small"
                        format={() =>
                          `₹${item.totalCollected.toLocaleString()} / ₹${item.totalAmount.toLocaleString()}`
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty description="No fee data available" />
          )}
        </Card>
      </div>

      {/* Recent Payments + Defaulters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Recent Payments"
          className="border-0 shadow-sm"
          extra={
            <Button type="link" onClick={() => setActiveTab("payments")}>
              View All
            </Button>
          }>
          {stats?.recentPayments && stats.recentPayments.length > 0 ? (
            <div className="space-y-3">
              {stats.recentPayments.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <CheckCircleOutlined className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {payment.studentId?.userId?.name || "Student"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.feeId?.feeType} •{" "}
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600">
                    ₹{payment.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No recent payments" />
          )}
        </Card>

        <Card
          title={
            <span className="text-red-600">
              <WarningOutlined className="mr-2" />
              Defaulters
            </span>
          }
          className="border-0 shadow-sm"
          extra={
            <Badge count={stats?.defaulters?.length || 0} color="#ef4444" />
          }>
          {stats?.defaulters && stats.defaulters.length > 0 ? (
            <div className="space-y-3">
              {stats.defaulters.slice(0, 5).map((fee) => (
                <div
                  key={fee._id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      {fee.studentId?.userId?.name || "Student"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {fee.studentId?.classId?.name}{" "}
                      {fee.studentId?.classId?.section} • Due:{" "}
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-bold text-red-600">
                    ₹{fee.balanceDue?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty description="No defaulters! 🎉" />
          )}
        </Card>
      </div>
    </div>
  );

  // ═══════════════════════════════════════
  // FEE STRUCTURES TAB
  // ═══════════════════════════════════════
  const structureColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <p className="font-semibold text-slate-900">{text}</p>
          {record.description && (
            <p className="text-xs text-slate-500">{record.description}</p>
          )}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "feeType",
      key: "feeType",
      render: (type) => {
        const config = FEE_TYPES.find((f) => f.value === type);
        return <Tag color={config?.color}>{config?.label || type}</Tag>;
      },
    },
    {
      title: "Class",
      dataIndex: "classId",
      key: "classId",
      render: (cls) => (cls ? `${cls.name} - ${cls.section}` : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-bold text-slate-900">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStructure(record._id)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Assign to Students">
            <Popconfirm
              title="Assign Fees"
              description="This will create fee records for all students in the class. Continue?"
              onConfirm={() => handleAssignFees(record._id)}
              okText="Assign">
              <Button
                size="small"
                type="primary"
                ghost
                icon={<SendOutlined />}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingStructure(record);
                structureForm.setFieldsValue({
                  ...record,
                  classId: record.classId?._id,
                  dueDate: dayjs(record.dueDate),
                });
                setStructureModalOpen(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this fee structure?"
            onConfirm={() => handleDeleteStructure(record._id)}
            okType="danger">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const renderStructures = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900">
          Fee Structures ({structures.length})
        </h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStructure(null);
            structureForm.resetFields();
            setStructureModalOpen(true);
          }}
          className="bg-blue-600">
          Create Structure
        </Button>
      </div>

      <Table
        columns={structureColumns}
        dataSource={structures}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        className="border rounded-xl overflow-hidden"
      />
    </div>
  );

  // ═══════════════════════════════════════
  // STUDENT FEES TAB
  // ═══════════════════════════════════════
  const feeColumns = [
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-slate-900">
            {record.studentId?.userId?.name || "N/A"}
          </p>
          <p className="text-xs text-slate-500">
            {record.studentId?.admissionNumber} •{" "}
            {record.studentId?.classId?.name}{" "}
            {record.studentId?.classId?.section}
          </p>
        </div>
      ),
    },
    {
      title: "Fee Type",
      key: "feeType",
      render: (_, record) => {
        const config = FEE_TYPES.find((f) => f.value === record.feeType);
        return (
          <div>
            <Tag color={config?.color}>{config?.label || record.feeType}</Tag>
            {record.description && (
              <p className="text-xs text-slate-500 mt-1">
                {record.description}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: "Amount",
      key: "amount",
      render: (_, record) => (
        <div>
          <p className="font-bold">₹{record.totalAmount?.toLocaleString()}</p>
          {record.discount > 0 && (
            <p className="text-xs text-green-600">
              Discount: ₹{record.discount}
            </p>
          )}
          {record.fine > 0 && (
            <p className="text-xs text-red-600">Fine: ₹{record.fine}</p>
          )}
        </div>
      ),
    },
    {
      title: "Paid",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (amount) => (
        <span className="font-medium text-emerald-600">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balanceDue",
      key: "balanceDue",
      render: (balance) => (
        <span
          className={`font-bold ${balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
          ₹{balance?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date) => {
        const isOverdue = new Date(date) < new Date();
        return (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const config =
          PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.unpaid;
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          {record.paymentStatus !== "paid" && (
            <Tooltip title="Record Payment">
              <Button
                size="small"
                type="primary"
                icon={<DollarOutlined />}
                onClick={() => {
                  setSelectedFee(record);
                  paymentForm.resetFields();
                  setPaymentModalOpen(true);
                }}
              />
            </Tooltip>
          )}
          {record.amountPaid === 0 && (
            <Popconfirm
              title="Delete this fee?"
              onConfirm={() => handleDeleteFee(record._id)}
              okType="danger">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const renderFees = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search student..."
          prefix={<SearchOutlined />}
          value={feeFilters.search}
          onChange={(e) =>
            setFeeFilters({ ...feeFilters, search: e.target.value })
          }
          className="w-64"
          allowClear
        />
        <Select
          placeholder="Payment Status"
          value={feeFilters.paymentStatus || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, paymentStatus: val || "" })
          }
          allowClear
          className="w-40">
          <Select.Option value="paid">Paid</Select.Option>
          <Select.Option value="unpaid">Unpaid</Select.Option>
          <Select.Option value="partial">Partial</Select.Option>
          <Select.Option value="overdue">Overdue</Select.Option>
        </Select>
        <Select
          placeholder="Fee Type"
          value={feeFilters.feeType || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, feeType: val || "" })
          }
          allowClear
          className="w-40">
          {FEE_TYPES.map((ft) => (
            <Select.Option key={ft.value} value={ft.value}>
              {ft.label}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Class"
          value={feeFilters.classId || undefined}
          onChange={(val) =>
            setFeeFilters({ ...feeFilters, classId: val || "" })
          }
          allowClear
          className="w-48">
          {classes.map((cls) => (
            <Select.Option key={cls._id} value={cls._id}>
              {cls.name} - {cls.section}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        columns={feeColumns}
        dataSource={fees}
        rowKey="_id"
        pagination={{ pageSize: 15, showSizeChanger: true }}
        className="border rounded-xl overflow-hidden"
        loading={loading}
      />
    </div>
  );

  // ═══════════════════════════════════════
  // PAYMENTS TAB
  // ═══════════════════════════════════════
  const paymentColumns = [
    {
      title: "Receipt #",
      dataIndex: "receiptNumber",
      key: "receiptNumber",
      render: (receipt) => (
        <span className="font-mono text-sm text-blue-600">{receipt}</span>
      ),
    },
    {
      title: "Student",
      key: "student",
      render: (_, record) => record.studentId?.userId?.name || "N/A",
    },
    {
      title: "Fee Type",
      key: "feeType",
      render: (_, record) => {
        const feeType = record.feeId?.feeType;
        const config = FEE_TYPES.find((f) => f.value === feeType);
        return <Tag color={config?.color}>{config?.label || feeType}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-bold text-emerald-600">
          ₹{amount?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag>{method?.toUpperCase()}</Tag>,
    },
    {
      title: "Paid By",
      key: "paidBy",
      render: (_, record) => (
        <Tag color={record.paidBy === "parent" ? "purple" : "blue"}>
          {record.paidBy === "parent" ? "Parent" : "Admin"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "success"
              ? "success"
              : status === "failed"
                ? "error"
                : "warning"
          }>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const renderPayments = () => (
    <div className="space-y-4">
      <Table
        columns={paymentColumns}
        dataSource={payments}
        rowKey="_id"
        pagination={{ pageSize: 15, showSizeChanger: true }}
        className="border rounded-xl overflow-hidden"
        loading={loading}
      />
    </div>
  );

  // ═══════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </div>
        <Card className="border-0 shadow-sm">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BankOutlined className="text-blue-600" />
                Fee Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage fee structures, track payments, and monitor collections
              </p>
            </div>
            <div className="flex gap-3">
              <Button icon={<ReloadOutlined />} onClick={fetchInitialData}>
                Refresh
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingStructure(null);
                  structureForm.resetFields();
                  setStructureModalOpen(true);
                }}
                className="bg-blue-600">
                New Fee Structure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card className="border-0 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "overview",
              label: (
                <span className="flex items-center gap-2">
                  <RiseOutlined />
                  Overview
                </span>
              ),
              children: renderOverview(),
            },
            {
              key: "structures",
              label: (
                <span className="flex items-center gap-2">
                  <FileTextOutlined />
                  Fee Structures
                  <Badge count={structures.length} className="ml-1" />
                </span>
              ),
              children: renderStructures(),
            },
            {
              key: "fees",
              label: (
                <span className="flex items-center gap-2">
                  <DollarOutlined />
                  Student Fees
                </span>
              ),
              children: renderFees(),
            },
            {
              key: "payments",
              label: (
                <span className="flex items-center gap-2">
                  <CheckCircleOutlined />
                  Payments
                  <Badge count={payments.length} className="ml-1" />
                </span>
              ),
              children: renderPayments(),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Fee Structure Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            {editingStructure ? "Edit Fee Structure" : "Create Fee Structure"}
          </div>
        }
        open={structureModalOpen}
        onCancel={() => {
          setStructureModalOpen(false);
          setEditingStructure(null);
          structureForm.resetFields();
        }}
        footer={null}
        width={700}>
        <Form
          form={structureForm}
          layout="vertical"
          onFinish={handleCreateStructure}
          className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Structure Name"
              rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g., Tuition Fee - Class 10" />
            </Form.Item>

            <Form.Item
              name="feeType"
              label="Fee Type"
              rules={[{ required: true, message: "Required" }]}>
              <Select placeholder="Select type">
                {FEE_TYPES.map((ft) => (
                  <Select.Option key={ft.value} value={ft.value}>
                    {ft.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="classId"
              label="Class"
              rules={[{ required: true, message: "Required" }]}>
              <Select placeholder="Select class">
                {classes.map((cls) => (
                  <Select.Option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount (₹)"
              rules={[{ required: true, message: "Required" }]}>
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Enter amount"
              />
            </Form.Item>

            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true, message: "Required" }]}>
              <Input placeholder="e.g., 2025-2026" />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: "Required" }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="frequency" label="Frequency">
              <Select placeholder="Select frequency" defaultValue="one-time">
                <Select.Option value="one-time">One-Time</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="quarterly">Quarterly</Select.Option>
                <Select.Option value="yearly">Yearly</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              className="col-span-2">
              <Input.TextArea rows={2} placeholder="Optional description" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={() => {
                setStructureModalOpen(false);
                structureForm.resetFields();
              }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {editingStructure ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        title={
          <div className="text-lg font-semibold text-slate-900">
            <DollarOutlined className="mr-2 text-emerald-600" />
            Record Payment
          </div>
        }
        open={paymentModalOpen}
        onCancel={() => {
          setPaymentModalOpen(false);
          setSelectedFee(null);
          paymentForm.resetFields();
        }}
        footer={null}
        width={500}>
        {selectedFee && (
          <div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Student:</span>
                  <p className="font-semibold">
                    {selectedFee.studentId?.userId?.name}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Fee Type:</span>
                  <p className="font-semibold">{selectedFee.feeType}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total Amount:</span>
                  <p className="font-semibold">
                    ₹{selectedFee.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Balance Due:</span>
                  <p className="font-bold text-red-600">
                    ₹{selectedFee.balanceDue?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Form
              form={paymentForm}
              layout="vertical"
              onFinish={handleRecordPayment}>
              <Form.Item
                name="amountPaid"
                label="Payment Amount (₹)"
                rules={[
                  { required: true, message: "Required" },
                  {
                    type: "number",
                    max: selectedFee.balanceDue,
                    message: `Max: ₹${selectedFee.balanceDue}`,
                  },
                ]}>
                <InputNumber
                  min={1}
                  max={selectedFee.balanceDue}
                  className="w-full"
                  placeholder="Enter amount"
                />
              </Form.Item>

              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select method">
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="card">Card</Select.Option>
                  <Select.Option value="bank-transfer">
                    Bank Transfer
                  </Select.Option>
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="cheque">Cheque</Select.Option>
                  <Select.Option value="upi">UPI</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="transactionRef" label="Transaction Reference">
                <Input placeholder="Optional reference number" />
              </Form.Item>

              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={2} placeholder="Optional remarks" />
              </Form.Item>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setPaymentModalOpen(false);
                    paymentForm.resetFields();
                  }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-emerald-600 hover:bg-emerald-700">
                  Record Payment
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminFeeDashboardPage;
