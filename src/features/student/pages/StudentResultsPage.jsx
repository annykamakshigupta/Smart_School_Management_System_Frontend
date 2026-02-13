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
  Divider,
  Button,
} from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  getMyExamResults,
  getReportCard,
} from "../../../services/exam.service";
import { GradeBadge, ReportCardView } from "../../../components/Results";

const StudentResultsPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [reportCard, setReportCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await getMyExamResults();
      const data = res.data || [];
      // Group results by exam
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
      const res = await getReportCard(examId);
      setReportCard(res.data || null);
    } catch {
      // report card may not be available
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
      title: "Code",
      dataIndex: "subjectId",
      render: (s) => s?.code || "—",
      width: 90,
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
      title: "Status",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Results</h1>
        <p className="text-slate-500">View your exam results and report card</p>
      </div>

      <div className="mb-6 max-w-md">
        <label className="text-sm font-medium text-slate-700 mb-1 block">
          Select Exam
        </label>
        <Select
          className="w-full"
          placeholder="Choose an exam"
          onChange={handleExamSelect}
          options={exams.map((e) => ({
            value: e.examId,
            label: `${e.examName} (${e.examType})`,
          }))}
        />
      </div>

      {selectedExam ? (
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
                  styles={{ color: "#2563eb" }}
                />
              </Card>
              <Card className="text-center">
                <Statistic title="Subjects" value={results.length} />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Result"
                  value={summary.allPassed ? "PASS" : "FAIL"}
                  styles={{
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
      ) : (
        <Empty description="Select an exam to view your results" />
      )}
    </div>
  );
};

export default StudentResultsPage;
