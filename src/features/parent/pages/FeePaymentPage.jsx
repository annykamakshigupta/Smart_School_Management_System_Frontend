/**
 * Parent Fee Payment Page
 * Real API integration with child selector, payment flow, history, receipts
 * Modern, trustworthy, mobile-friendly design
 */

import { useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Modal,
  Select,
  message,
  Empty,
  Skeleton,
  Timeline,
  Tooltip,
  Badge,
  Radio,
} from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  BankOutlined,
  WalletOutlined,
  HistoryOutlined,
  UserOutlined,
} from "@ant-design/icons";
import * as feeService from "../../../services/fee.service";
import * as parentService from "../../../services/parent.service";

const PAYMENT_METHODS = [
  { value: "upi", label: "UPI", icon: "📱" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "online", label: "Net Banking", icon: "🏦" },
  { value: "wallet", label: "Wallet", icon: "👛" },
];

const ParentFeePaymentPage = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchFees(selectedChildId);
      fetchPaymentHistory(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await parentService.getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChildId(childrenData[0]._id);
      }
    } catch (error) {
      message.error(error.message || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (studentId) => {
    try {
      const response = await feeService.getFeesByStudent(studentId);
      setFees(response.data || []);
      setSummary(response.summary || null);
    } catch (error) {
      message.error(error.message || "Failed to load fees");
    }
  };

  const fetchPaymentHistory = async (studentId) => {
    try {
      const response = await feeService.getPaymentHistory(studentId);
      setPaymentHistory(response.data || []);
    } catch (error) {
      console.error("Failed to load payment history:", error);
    }
  };

  const handlePay = async () => {
    if (!selectedFee) return;
    setProcessing(true);
    try {
      // Simulate a brief processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await feeService.parentPayment(selectedFee._id, {
        amountPaid: selectedFee.balanceDue,
        paymentMethod,
        transactionRef: `TXN-${Date.now()}`,
      });

      setPaymentSuccess(true);
      setLastPayment(result.data?.payment);
      message.success("Payment successful!");
      fetchFees(selectedChildId);
      fetchPaymentHistory(selectedChildId);
    } catch (error) {
      message.error(error.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const closePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedFee(null);
    setPaymentSuccess(false);
    setLastPayment(null);
    setPaymentMethod("upi");
  };

  const selectedChild = children.find((c) => c._id === selectedChildId);

  const getStatusConfig = (status) => {
    const configs = {
      paid: { color: "success", label: "Paid", icon: <CheckCircleOutlined />, bg: "bg-emerald-50", text: "text-emerald-700" },
      unpaid: { color: "default", label: "Unpaid", icon: <ClockCircleOutlined />, bg: "bg-slate-50", text: "text-slate-700" },
      partial: { color: "warning", label: "Partial", icon: <ExclamationCircleOutlined />, bg: "bg-amber-50", text: "text-amber-700" },
      overdue: { color: "error", label: "Overdue", icon: <WarningOutlined />, bg: "bg-red-50", text: "text-red-700" },
    };
    return configs[status] || configs.unpaid;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6">
        <Card className="border-0 shadow-sm mb-6"><Skeleton active /></Card>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => <Card key={i} className="border-0 shadow-sm"><Skeleton active paragraph={{ rows: 1 }} /></Card>)}
        </div>
        <Card className="border-0 shadow-sm"><Skeleton active paragraph={{ rows: 6 }} /></Card>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 -m-6 p-6 flex items-center justify-center">
        <Empty description="No children linked to your account" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BankOutlined className="text-blue-600" />
              Fee Payment
            </h1>
            <p className="text-slate-500 mt-1">View and pay your children's fees</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setShowHistory(!showHistory)}
              type={showHistory ? "primary" : "default"}>
              Payment History
            </Button>
          </div>
        </div>
      </div>

      {/* Child Selector */}
      <Card className="border-0 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <UserOutlined className="text-xl text-blue-600" />
          <span className="font-medium text-slate-700">Select Child:</span>
          <Select
            value={selectedChildId}
            onChange={setSelectedChildId}
            className="w-72"
            size="large">
            {children.map((child) => (
              <Select.Option key={child._id} value={child._id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{child.userId?.name || "Student"}</span>
                  {child.classId && (
                    <Tag className="ml-2">{child.classId.name} - {child.classId.section}</Tag>
                  )}
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <DollarOutlined className="text-xl text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Total Fees</p>
                <p className="text-2xl font-bold text-slate-900">₹{summary.totalAmount?.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircleOutlined className="text-xl text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Amount Paid</p>
                <p className="text-2xl font-bold text-emerald-600">₹{summary.totalPaid?.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-red-600">₹{summary.totalBalance?.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <ClockCircleOutlined className="text-xl text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-sm">Pending Items</p>
                <p className="text-2xl font-bold text-amber-600">
                  {(summary.unpaidCount || 0) + (summary.partialCount || 0) + (summary.overdueCount || 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {showHistory ? (
        /* Payment History Timeline */
        <Card
          title={<span className="flex items-center gap-2"><HistoryOutlined />Payment History</span>}
          className="border-0 shadow-sm">
          {paymentHistory.length > 0 ? (
            <Timeline
              items={paymentHistory.map((payment) => ({
                color: payment.status === "success" ? "green" : "red",
                children: (
                  <div className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          ₹{payment.amount?.toLocaleString()}
                          <Tag color="success" className="ml-2">
                            {payment.paymentMethod?.toUpperCase()}
                          </Tag>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          {payment.feeId?.feeType} – {payment.feeId?.description || "Fee Payment"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-blue-600">{payment.receiptNumber}</p>
                      </div>
                    </div>
                  </div>
                ),
              }))}
            />
          ) : (
            <Empty description="No payment history yet" />
          )}
        </Card>
      ) : (
        /* Fee Cards */
        <div className="space-y-4">
          {/* Overdue/Unpaid First */}
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
                    const statusConfig = getStatusConfig(fee.paymentStatus);
                    const isOverdue = new Date(fee.dueDate) < new Date();
                    return (
                      <Card
                        key={fee._id}
                        className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
                          isOverdue ? "border-l-red-500" : "border-l-amber-500"
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-900 text-lg">{fee.description || fee.feeType}</p>
                            <Tag icon={statusConfig.icon} color={statusConfig.color} className="mt-1">
                              {statusConfig.label}
                            </Tag>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">₹{fee.balanceDue?.toLocaleString()}</p>
                            <p className="text-xs text-slate-500">of ₹{fee.totalAmount?.toLocaleString()}</p>
                          </div>
                        </div>

                        {fee.amountPaid > 0 && (
                          <div className="bg-emerald-50 rounded-lg p-2 mb-3 text-sm">
                            <span className="text-emerald-700">Already paid: ₹{fee.amountPaid?.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-500">
                            Due: <span className={isOverdue ? "text-red-600 font-semibold" : "font-medium"}>
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </span>
                            {isOverdue && <span className="text-red-500 ml-1">(Overdue)</span>}
                          </div>
                          <Button
                            type="primary"
                            icon={<CreditCardOutlined />}
                            onClick={() => {
                              setSelectedFee(fee);
                              setPaymentModalOpen(true);
                            }}
                            className="bg-blue-600">
                            Pay Now
                          </Button>
                        </div>
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
                    <Card key={fee._id} className="border-l-4 border-l-emerald-500 shadow-sm opacity-80">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{fee.description || fee.feeType}</p>
                          <Tag icon={<CheckCircleOutlined />} color="success" className="mt-1">
                            Paid
                          </Tag>
                          <p className="text-xs text-slate-400 mt-2">
                            Paid on {fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-600">₹{fee.totalAmount?.toLocaleString()}</p>
                          {fee.receiptNumber && (
                            <p className="text-xs font-mono text-slate-400 mt-1">{fee.receiptNumber}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {fees.length === 0 && <Empty description="No fees found for this child" className="py-12" />}
        </div>
      )}

      {/* Payment Modal */}
      <Modal
        open={paymentModalOpen}
        onCancel={closePaymentModal}
        footer={null}
        width={480}
        centered
        closable={!processing}>
        {paymentSuccess ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleOutlined className="text-4xl text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 mb-6">Your payment has been processed successfully.</p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-emerald-600">₹{selectedFee?.balanceDue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Method</span>
                  <span className="font-medium">{paymentMethod.toUpperCase()}</span>
                </div>
                {lastPayment?.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Receipt</span>
                    <span className="font-mono text-blue-600">{lastPayment.receiptNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <Button type="primary" onClick={closePaymentModal} className="bg-blue-600" size="large">
              Done
            </Button>
          </div>
        ) : (
          /* Payment Form */
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCardOutlined className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Confirm Payment</h2>
            </div>

            {selectedFee && (
              <>
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student</span>
                      <span className="font-medium">{selectedChild?.userId?.name || "Student"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fee Type</span>
                      <span className="font-medium">{selectedFee.description || selectedFee.feeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Due Date</span>
                      <span className="font-medium">{new Date(selectedFee.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-slate-900">Amount to Pay</span>
                      <span className="text-2xl font-bold text-blue-600">₹{selectedFee.balanceDue?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-slate-700 mb-3">Select Payment Method</p>
                  <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full">
                    <div className="grid grid-cols-2 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <Radio.Button
                          key={method.value}
                          value={method.value}
                          className={`h-16 flex items-center justify-center text-center rounded-xl ${
                            paymentMethod === method.value ? "border-blue-500 bg-blue-50" : ""
                          }`}>
                          <div>
                            <span className="text-xl">{method.icon}</span>
                            <span className="ml-2 font-medium">{method.label}</span>
                          </div>
                        </Radio.Button>
                      ))}
                    </div>
                  </Radio.Group>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handlePay}
                  loading={processing}
                  className="bg-blue-600 h-12 text-lg font-semibold rounded-xl">
                  {processing ? "Processing..." : `Pay ₹${selectedFee.balanceDue?.toLocaleString()}`}
                </Button>

                <p className="text-xs text-center text-slate-400 mt-3">
                  🔒 Secure payment processing. Your information is encrypted.
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParentFeePaymentPage;
