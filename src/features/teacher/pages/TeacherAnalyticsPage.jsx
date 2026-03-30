/**
 * Teacher AI Analytics Page
 * Shows per-class/subject insights: student performance distribution,
 * at-risk students, subject difficulty, and teaching recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Tag } from "antd";
import { getTeacherAnalytics } from "../../../services/analytics.service";
import {
  AnalyticsLoading,
  AnalyticsError,
  AnalyticsHeader,
  AISummaryPanel,
  AlertCards,
  RecommendationsList,
  StatCard,
  BarChartCard,
  LineChartCard,
  RadarChartCard,
  AttendanceHeatmapCard,
  RiskTable,
  RiskTag,
} from "../../../components/Analytics/AnalyticsComponents";

export default function TeacherAnalyticsPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeacherAnalytics();
      setPayload(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (loading) return <AnalyticsLoading />;
  if (error) return <AnalyticsError message={error} onRetry={fetchInsights} />;
  if (!payload)
    return (
      <AnalyticsError message="No insights available" onRetry={fetchInsights} />
    );

  const insights = payload?.insights ?? payload;
  const charts = payload?.charts ?? {};
  const stats = payload?.stats ?? {};

  // Chart data
  const weakStudentsBar = (charts.weakStudents || []).map((s) => ({
    label: s.name,
    value: Math.round(s.avgScore ?? 0),
  }));

  const subjectPerf = (charts.subjectPerformance || []).map((s) => ({
    subject: s.subject,
    value: Math.round(s.avgScore ?? 0),
  }));

  const subjectPerfLine = (charts.subjectPerformance || []).map((s) => ({
    label: s.subject,
    avgScore: Math.round(s.avgScore ?? 0),
    failCount: s.failCount ?? 0,
  }));

  // Alerts
  const alerts = [];
  if (insights.weakStudents?.length) {
    alerts.push({
      type: "warning",
      title: "Students Need Attention",
      message: `${insights.weakStudents.length} student(s) scoring below average — consider remedial support.`,
    });
  }
  if (insights.attendanceConcerns?.length) {
    alerts.push({
      type: "warning",
      title: "Low Attendance Detected",
      message: `${insights.attendanceConcerns.length} student(s) have low attendance in your classes.`,
    });
  }

  if (Array.isArray(insights.alerts) && insights.alerts.length) {
    insights.alerts.forEach((a) => alerts.push(a));
  }

  // At-risk students
  const weakStudents = (
    insights.weakStudents ||
    insights.atRiskStudents ||
    []
  ).slice(0, 15);
  const riskColumns = [
    { key: "name", title: "Student" },
    {
      key: "class",
      title: "Class",
      render: (val) => val || "—",
    },
    {
      key: "averageScore",
      title: "Avg Score",
      render: (val, row) => {
        const score = val ?? row.avgScore ?? 0;
        return (
          <span
            className={
              score < 40 ? "text-red-600 font-bold" : "text-slate-700"
            }>
            {Math.round(score)}%
          </span>
        );
      },
    },
    {
      key: "risk",
      title: "Risk",
      render: (val) => <RiskTag level={val || "medium"} />,
    },
    {
      key: "suggestion",
      title: "AI Suggestion",
      render: (val) => (
        <span className="text-xs text-slate-600">{val || "—"}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Insights for your classes and students"
        loading={loading}
        onRefresh={fetchInsights}
      />

      <AISummaryPanel summary={insights.summary || insights.overallSummary} />

      <AlertCards alerts={alerts} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Classes" value={stats.classCount ?? "—"} />
        <StatCard label="Students" value={stats.totalStudents ?? "—"} />
        <StatCard
          label="Trend"
          value={insights.classPerformance?.trend || "—"}
          trend={
            insights.classPerformance?.trend === "improving" ? "up" : "stable"
          }
        />
        <StatCard
          label="Pass Rate"
          value={
            insights.classPerformance?.passRate !== undefined
              ? Math.round(insights.classPerformance.passRate)
              : "—"
          }
          suffix={insights.classPerformance?.passRate !== undefined ? "%" : ""}
          trend={insights.classPerformance?.trend}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChartCard title="Student Performance Radar" data={subjectPerf} />
        <BarChartCard
          title="Weak Students (Average Score %)"
          data={weakStudentsBar}
          color="#ef4444"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Subject Performance"
          data={subjectPerfLine}
          xKey="label"
          lines={[{ key: "avgScore", name: "Avg Score %", color: "#3b82f6" }]}
        />
        <AttendanceHeatmapCard
          title="Attendance Heatmap"
          data={charts.attendanceHeatmap || []}
        />
      </div>

      {/* Weak Students Table */}
      {weakStudents.length > 0 && (
        <RiskTable
          title="Students Needing Attention"
          data={weakStudents}
          columns={riskColumns}
        />
      )}

      <RecommendationsList
        items={
          insights.interventionTips ||
          insights.recommendations ||
          insights.teachingTips ||
          []
        }
        title="Teaching Recommendations"
      />
    </div>
  );
}
