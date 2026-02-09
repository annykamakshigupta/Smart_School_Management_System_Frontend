/**
 * Student Fee Page
 * Read-only view of student's fee status and payment history
 */

import { useState, useEffect } from "react";
import { Card, Tag, Empty, Skeleton, Timeline, Progress } from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  BankOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import * as feeService from "../../../services/fee.service";

const STATUS_CONFIG = {
  paid: {
    color: "success",
    label: "Paid",
    icon: <CheckCircleOutlined />,
    borderColor: "border-l-emerald-500",
  },
  unpaid: {
    color: "default",
    label: "Unpaid",
    icon: <ClockCircleOutlined />,
    borderColor: "border-l-slate-400",
  },
  partial: {
    color: "warning",
    label: "Partial",
    icon: <ExclamationCircleOutlined />,
    borderColor: "border-l-amber-500",
  },
  overdue: {
    color: "error",
    label: "Overdue",
    icon: <WarningOutlined />,
    borderColor: "border-l-red-500",
  },
};

const FEE_TYPE_LABELS = {
  tuition: "Tuition Fee",
  exam: "Exam Fee",
  transport: "Transport Fee",
  library: "Library Fee",
  lab: "Lab Fee",
  admission: "Admission Fee",
  sports: "Sports Fee",
  other: "Other",
};

const StudentFeePage = () => {
  const [loading, setLoading] = useState(true);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await feeService.getMyFees();
      setFees(response.data || []);
      setSummary(response.summary || null);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <Card className="border-0 shadow-sm mb-6">
          <Skeleton active />
        </Card>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <Skeleton active paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const paidPercentage =
    summary?.totalAmount > 0
      ? Math.round((summary.totalPaid / summary.totalAmount) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3">
          <BankOutlined className="text-2xl text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Fee Status</h1>
            <p className="text-slate-500">
              View your fee details and payment status
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <InfoCircleOutlined className="text-blue-600 text-lg" />
        <p className="text-sm text-blue-700">
          This is a read-only view. Please contact your parent or the school
          administration for fee payments.
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Fees</p>
                <p className="text-xl font-bold text-slate-900">
                  ₹{summary.totalAmount?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-xl text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Paid</p>
                <p className="text-xl font-bold text-emerald-600">
                  ₹{summary.totalPaid?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <WarningOutlined className="text-xl text-red-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Outstanding</p>
                <p className="text-xl font-bold text-red-600">
                  ₹{summary.totalBalance?.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="flex items-center justify-center py-2">
              <Progress
                type="circle"
                percent={paidPercentage}
                size={80}
                strokeColor="#10b981"
                format={(percent) => (
                  <span className="text-sm font-bold">{percent}%</span>
                )}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Fee List */}
      {fees.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Empty description="No fee records found" className="py-12" />
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Pending / Unpaid */}
          {fees.filter((f) => f.paymentStatus !== "paid").length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <ClockCircleOutlined className="text-amber-500" />
                Pending Fees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fees
                  .filter((f) => f.paymentStatus !== "paid")
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((fee) => {
                    const config =
                      STATUS_CONFIG[fee.paymentStatus] || STATUS_CONFIG.unpaid;
                    const isOverdue = new Date(fee.dueDate) < new Date();
                    return (
                      <Card
                        key={fee._id}
                        className={`border-l-4 ${config.borderColor} shadow-sm`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {fee.description ||
                                FEE_TYPE_LABELS[fee.feeType] ||
                                fee.feeType}
                            </p>
                            <Tag
                              icon={config.icon}
                              color={config.color}
                              className="mt-1">
                              {config.label}
                            </Tag>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">
                              ₹{fee.balanceDue?.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-500">
                              of ₹{fee.totalAmount?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {fee.amountPaid > 0 && (
                          <p className="text-sm text-emerald-600 mb-2">
                            Paid so far: ₹{fee.amountPaid?.toLocaleString()}
                          </p>
                        )}
                        <p className="text-sm text-slate-500">
                          Due:{" "}
                          <span
                            className={
                              isOverdue
                                ? "text-red-600 font-medium"
                                : "font-medium"
                            }>
                            {new Date(fee.dueDate).toLocaleDateString()}
                          </span>
                          {isOverdue && (
                            <span className="text-red-500 ml-1">(Overdue)</span>
                          )}
                        </p>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Paid Fees */}
          {fees.filter((f) => f.paymentStatus === "paid").length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircleOutlined className="text-emerald-500" />
                Paid Fees
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fees
                  .filter((f) => f.paymentStatus === "paid")
                  .map((fee) => (
                    <Card
                      key={fee._id}
                      className="border-l-4 border-l-emerald-500 shadow-sm opacity-75">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {fee.description ||
                              FEE_TYPE_LABELS[fee.feeType] ||
                              fee.feeType}
                          </p>
                          <Tag
                            icon={<CheckCircleOutlined />}
                            color="success"
                            className="mt-1">
                            Paid
                          </Tag>
                          {fee.paidDate && (
                            <p className="text-xs text-slate-400 mt-2">
                              Paid on{" "}
                              {new Date(fee.paidDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="text-xl font-bold text-emerald-600">
                          ₹{fee.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentFeePage;
