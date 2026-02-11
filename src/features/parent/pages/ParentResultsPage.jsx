import { useState, useEffect } from "react";
import {
  Card,
  Select,
  Table,
  Tag,
  Empty,
  Spin,
  Statistic,
  message,
} from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getChildExamResults,
  getReportCard,
} from "../../../services/exam.service";
import { getMyChildren } from "../../../services/parent.service";
import { GradeBadge, ReportCardView } from "../../../components/Results";

const ParentResultsPage = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const res = await getMyChildren();
      const data = res.data || [];
      setChildren(data);
      if (data.length === 1) {
        handleChildSelect(data[0]._id);
      }
    } catch (e) {
      message.error("Error loading children");
    } finally {
      setLoading(false);
    }
  };

  const handleChildSelect = async (studentId) => {
    setSelectedChild(studentId);
    setSelectedExam(null);
    setResults([]);
    setReportCard(null);
    setLoading(true);
    try {
      const res = await getChildExamResults(studentId);
      const data = res.data || [];
      const examMap = {};
      data.forEach((r) => {
        const examId = r.examId?._id || r.examId;
        if (!examMap[examId]) {
          examMap[examId] = {
            examId,
            examName: r.examId?.name || "Exam",
            examType: r.examId?.examType || "",
            results: [],
          };
        }
        examMap[examId].results.push(r);
      });
      setExams(Object.values(examMap));
    } catch (e) {
      message.error("Error loading results");
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelect = async (examId) => {
    const exam = exams.find((e) => e.examId === examId);
    setSelectedExam(exam);
    setResults(exam?.results || []);
    setReportCard(null);
    setLoadingReport(true);
    try {
      const res = await getReportCard(examId, selectedChild);
      setReportCard(res.data || null);
    } catch {
      // May not be available
    } finally {
      setLoadingReport(false);
    }
  };

  const computeSummary = () => {
    if (!results.length) return null;
    const totalObtained = results.reduce(
      (s, r) => s + (r.marksObtained || 0),
      0,
    );
    const totalMax = results.reduce((s, r) => s + (r.totalMarks || 0), 0);
    const pct =
      totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;
    const allPassed = results.every((r) => r.isPassed);
    return { totalObtained, totalMax, percentage: pct, allPassed };
  };

  const summary = selectedExam ? computeSummary() : null;

  const columns = [
    { title: "#", width: 50, render: (_, __, i) => i + 1 },
    {
      title: "Subject",
      dataIndex: "subjectId",
      render: (s) => s?.name || "—",
    },
    {
      title: "Marks",
      render: (_, r) => `${r.marksObtained} / ${r.totalMarks}`,
      width: 100,
    },
    {
      title: "%",
      dataIndex: "percentage",
      render: (v) => `${v ?? 0}%`,
      width: 70,
    },
    {
      title: "Grade",
      dataIndex: "grade",
      render: (g) => <GradeBadge grade={g} />,
      width: 80,
    },
    {
      title: "Result",
      dataIndex: "isPassed",
      width: 80,
      render: (v) =>
        v ? <Tag color="success">PASS</Tag> : <Tag color="error">FAIL</Tag>,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (v) => v || "—",
    },
  ];

  if (loading && !children.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Child Results</h1>
        <p className="text-slate-500">
          View your child&apos;s exam results and report card
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-2xl">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            <UserOutlined className="mr-1" />
            Select Child
          </label>
          <Select
            className="w-full"
            placeholder="Choose your child"
            value={selectedChild}
            onChange={handleChildSelect}
            options={children.map((c) => ({
              value: c._id,
              label: `${c.userId?.name || "Student"} – ${c.classId?.name || ""}${c.classId?.section ? "-" + c.classId.section : ""}`,
            }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Select Exam
          </label>
          <Select
            className="w-full"
            placeholder="Choose an exam"
            disabled={!selectedChild || !exams.length}
            onChange={handleExamSelect}
            options={exams.map((e) => ({
              value: e.examId,
              label: `${e.examName} (${e.examType})`,
            }))}
          />
        </div>
      </div>

      {loading && selectedChild ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : selectedExam ? (
        <>
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center">
                <Statistic
                  title="Total Marks"
                  value={`${summary.totalObtained} / ${summary.totalMax}`}
                />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Percentage"
                  value={summary.percentage}
                  suffix="%"
                  valueStyle={{ color: "#2563eb" }}
                />
              </Card>
              <Card className="text-center">
                <Statistic title="Subjects" value={results.length} />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Result"
                  value={summary.allPassed ? "PASS" : "FAIL"}
                  valueStyle={{
                    color: summary.allPassed ? "#16a34a" : "#dc2626",
                    fontWeight: 700,
                  }}
                  prefix={summary.allPassed ? <TrophyOutlined /> : null}
                />
              </Card>
            </div>
          )}

          <Card
            title="Subject-wise Results"
            className="mb-6 border-0 shadow-sm">
            <Table
              columns={columns}
              dataSource={results}
              rowKey="_id"
              pagination={false}
              size="middle"
            />
          </Card>

          {loadingReport ? (
            <div className="text-center py-8">
              <Spin />
              <p className="text-sm text-slate-500 mt-2">
                Loading report card...
              </p>
            </div>
          ) : reportCard ? (
            <Card
              title={
                <span>
                  <FileTextOutlined className="mr-2" />
                  Report Card
                </span>
              }
              className="border-0 shadow-sm">
              <ReportCardView data={reportCard} />
            </Card>
          ) : null}
        </>
      ) : selectedChild && exams.length === 0 ? (
        <Empty description="No published results found for this child" />
      ) : (
        <Empty description="Select a child and exam to view results" />
      )}
    </div>
  );
};

export default ParentResultsPage;
