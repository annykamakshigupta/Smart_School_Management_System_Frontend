/**
 * Fee Payment Page
 * Parent page to view and pay fees
 */

import { useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Statistic,
  Row,
  Col,
  message,
} from "antd";
import {
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";

const FeePaymentPage = () => {
  const [selectedChild, setSelectedChild] = useState("1");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Mock data
  const children = [
    { id: "1", name: "Alice Johnson", class: "10A" },
    { id: "2", name: "Bob Johnson", class: "8B" },
  ];

  const feeData = {
    1: {
      totalDue: 500,
      paid: 2500,
      fees: [
        {
          id: 1,
          type: "Tuition Fee",
          amount: 300,
          dueDate: "Jan 31, 2026",
          status: "pending",
        },
        {
          id: 2,
          type: "Lab Fee",
          amount: 100,
          dueDate: "Jan 31, 2026",
          status: "pending",
        },
        {
          id: 3,
          type: "Library Fee",
          amount: 100,
          dueDate: "Jan 31, 2026",
          status: "pending",
        },
        {
          id: 4,
          type: "Tuition Fee",
          amount: 300,
          dueDate: "Dec 31, 2025",
          status: "paid",
          paidDate: "Dec 15, 2025",
        },
        {
          id: 5,
          type: "Sports Fee",
          amount: 200,
          dueDate: "Dec 31, 2025",
          status: "paid",
          paidDate: "Dec 15, 2025",
        },
      ],
    },
    2: {
      totalDue: 0,
      paid: 2000,
      fees: [
        {
          id: 1,
          type: "Tuition Fee",
          amount: 250,
          dueDate: "Jan 31, 2026",
          status: "paid",
          paidDate: "Jan 5, 2026",
        },
        {
          id: 2,
          type: "Lab Fee",
          amount: 75,
          dueDate: "Jan 31, 2026",
          status: "paid",
          paidDate: "Jan 5, 2026",
        },
        {
          id: 3,
          type: "Tuition Fee",
          amount: 250,
          dueDate: "Dec 31, 2025",
          status: "paid",
          paidDate: "Dec 10, 2025",
        },
      ],
    },
  };

  const currentFees = feeData[selectedChild];
  const currentChild = children.find((c) => c.id === selectedChild);

  const columns = [
    {
      title: "Fee Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span className="font-medium">${amount}</span>,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div>
          <Tag
            color={status === "paid" ? "success" : "warning"}
            icon={
              status === "paid" ? (
                <CheckCircleOutlined />
              ) : (
                <ClockCircleOutlined />
              )
            }>
            {status === "paid" ? "Paid" : "Pending"}
          </Tag>
          {status === "paid" && (
            <div className="text-xs text-gray-500 mt-1">
              Paid on {record.paidDate}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "pending" ? (
          <Button
            type="primary"
            size="small"
            icon={<CreditCardOutlined />}
            onClick={() => {
              setSelectedFee(record);
              setPaymentModalOpen(true);
            }}>
            Pay Now
          </Button>
        ) : (
          <Button size="small" icon={<DownloadOutlined />}>
            Receipt
          </Button>
        ),
    },
  ];

  const handlePayment = () => {
    message.success(
      `Payment of $${selectedFee.amount} processed successfully!`
    );
    setPaymentModalOpen(false);
    setSelectedFee(null);
  };

  return (
    <div>
      <PageHeader
        title="Fee Payment"
        subtitle="View and pay your children's fees"
        breadcrumbs={[
          { label: "Parent", path: "/parent/dashboard" },
          { label: "Fees", path: "/parent/fees" },
          { label: "Payment Status" },
        ]}
      />

      {/* Child Selector */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <span className="font-medium">Select Child:</span>
          <Select
            value={selectedChild}
            onChange={setSelectedChild}
            className="w-48"
            options={children.map((c) => ({
              value: c.id,
              label: `${c.name} (${c.class})`,
            }))}
          />
        </div>
      </Card>

      {/* Summary */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Due"
              value={currentFees.totalDue}
              prefix="$"
              valueStyle={{
                color: currentFees.totalDue > 0 ? "#ef4444" : "#22c55e",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Paid (This Year)"
              value={currentFees.paid}
              prefix="$"
              valueStyle={{ color: "#22c55e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Pending Items"
              value={
                currentFees.fees.filter((f) => f.status === "pending").length
              }
              valueStyle={{
                color:
                  currentFees.fees.filter((f) => f.status === "pending")
                    .length > 0
                    ? "#f59e0b"
                    : "#22c55e",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Fee Table */}
      <Card
        title={`Fee Details - ${currentChild?.name}`}
        extra={
          currentFees.totalDue > 0 && (
            <Button type="primary" icon={<CreditCardOutlined />}>
              Pay All (${currentFees.totalDue})
            </Button>
          )
        }>
        <Table
          columns={columns}
          dataSource={currentFees.fees}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Payment Modal */}
      <Modal
        title="Make Payment"
        open={paymentModalOpen}
        onCancel={() => {
          setPaymentModalOpen(false);
          setSelectedFee(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => setPaymentModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="pay" type="primary" onClick={handlePayment}>
            Confirm Payment
          </Button>,
        ]}>
        {selectedFee && (
          <div className="space-y-4">
            <div className="text-center py-6">
              <DollarOutlined className="text-4xl text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold">${selectedFee.amount}</h3>
              <p className="text-gray-500">{selectedFee.type}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">{currentChild?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">{selectedFee.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{selectedFee.dueDate}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              You will be redirected to the payment gateway to complete this
              transaction.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeePaymentPage;
