import { Card, Table, Tag, Divider } from "antd";
import GradeBadge from "./GradeBadge";

const ReportCardView = ({ data, loading = false }) => {
  if (!data || !data.student) return null;

  const { student, results, summary } = data;

  const columns = [
    {
      title: "Subject",
      dataIndex: ["subjectId"],
      key: "subject",
      render: (s) => (s ? `${s.name} (${s.code})` : "—"),
    },
    {
      title: "Max Marks",
      dataIndex: "maxMarks",
      key: "max",
      width: 100,
      align: "center",
    },
    {
      title: "Marks Obtained",
      dataIndex: "marksObtained",
      key: "obtained",
      width: 130,
      align: "center",
      render: (v) => <span className="font-semibold">{v}</span>,
    },
    {
      title: "%",
      dataIndex: "percentage",
      key: "pct",
      width: 80,
      align: "center",
      render: (v) => (v != null ? `${parseFloat(v).toFixed(1)}%` : "—"),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 80,
      align: "center",
      render: (g) => <GradeBadge grade={g} />,
    },
    {
      title: "Status",
      key: "status",
      width: 80,
      align: "center",
      render: (_, r) =>
        r.isPassed ? (
          <Tag color="success">PASS</Tag>
        ) : (
          <Tag color="error">FAIL</Tag>
        ),
    },
  ];

  return (
    <div className="report-card-container" id="report-card">
      <Card className="border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Smart School Management System
          </h2>
          <p className="text-slate-500 text-sm">Academic Report Card</p>
        </div>

        <Divider />

        {/* Student Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-500">Student Name</p>
            <p className="font-semibold text-slate-900">
              {student.userId?.name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Admission No</p>
            <p className="font-semibold text-slate-900">
              {student.admissionNumber || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Class</p>
            <p className="font-semibold text-slate-900">
              {student.classId
                ? `${student.classId.name} - ${student.classId.section}`
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Roll Number</p>
            <p className="font-semibold text-slate-900">
              {student.rollNumber || "—"}
            </p>
          </div>
        </div>

        <Divider />

        {/* Results Table */}
        <Table
          columns={columns}
          dataSource={results}
          rowKey={(r) => r._id}
          loading={loading}
          pagination={false}
          size="middle"
          bordered
        />

        {/* Summary */}
        {summary && (
          <>
            <Divider />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Total Marks</p>
                <p className="text-lg font-bold text-slate-900">
                  {summary.totalMarks} / {summary.totalMaxMarks}
                </p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Percentage</p>
                <p className="text-lg font-bold text-blue-600">
                  {summary.overallPercentage}%
                </p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Grade</p>
                <GradeBadge grade={summary.overallGrade} size="large" />
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Result</p>
                <Tag
                  color={summary.result === "PASS" ? "success" : "error"}
                  style={{
                    fontSize: 16,
                    padding: "4px 16px",
                    fontWeight: 700,
                  }}>
                  {summary.result}
                </Tag>
              </div>
            </div>
            <div className="mt-4 text-sm text-slate-500 flex justify-between">
              <span>
                Passed: {summary.passedSubjects} / {summary.totalSubjects}{" "}
                subjects
              </span>
              <span>
                Failed: {summary.failedSubjects} / {summary.totalSubjects}{" "}
                subjects
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ReportCardView;
