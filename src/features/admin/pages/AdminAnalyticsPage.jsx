/**
 * Admin AI Analytics Page
 * Shows school-wide AI-generated insights: class performance,
 * weak subjects, fee forecast, at-risk students, and recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Tag } from "antd";
import { getAdminAnalytics } from "../../../services/analytics.service";
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
  AreaChartCard,
  PieChartCard,
  RiskTable,
  RiskTag,
} from "../../../components/Analytics/AnalyticsComponents";

export default function AdminAnalyticsPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminAnalytics();
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

  const atRiskStudentsAll = Array.isArray(insights.atRiskStudents)
    ? insights.atRiskStudents
    : [];

  // Build chart-ready data
  const classChartData = (charts.classComparison || []).map((c) => ({
    label: c.className,
    value: Math.round(c.avgScore ?? 0),
  }));

  const subjectChartData = (charts.subjectPerformance || []).map((s) => ({
    label: s.subject,
    value: Math.round(s.avgScore ?? 0),
  }));

  const performanceTrend = (charts.resultTrend || []).map((r) => ({
    label: r.month,
    avgScore: r.avgScore,
    exams: r.exams,
  }));

  const feeTrend = (charts.feeCollectionTrend || []).map((f) => ({
    label: f.month,
    expected: f.expected,
    collected: f.collected,
  }));

  // Alerts
  const alerts = [];
  if (atRiskStudentsAll.length || insights.dropoutRisks?.length) {
    const riskCount =
      atRiskStudentsAll.length ||
      insights.dropoutRisks?.reduce?.((sum, r) => sum + (r.count || 0), 0) ||
      insights.dropoutRisks.length;
    alerts.push({
      type: "danger",
      title: "Dropout Risk Detected",
      message: `${riskCount} student(s) are at risk of dropping out. Review immediately.`,
    });
  }
  if (insights.feeDefaulters?.length || insights.feeForecast?.defaulterCount) {
    alerts.push({
      type: "warning",
      title: "Fee Collection Alert",
      message:
        insights.feeForecast?.summary ||
        `${insights.feeDefaulters?.length ?? insights.feeForecast?.defaulterCount} students have outstanding fees.`,
    });
  }
  if (insights.attendanceConcerns?.length) {
    alerts.push({
      type: "warning",
      title: "Low Attendance",
      message: `${insights.attendanceConcerns.length} student(s) with attendance below threshold.`,
    });
  }

  if (Array.isArray(insights.alerts) && insights.alerts.length) {
    insights.alerts.forEach((a) => alerts.push(a));
  }

  // At-risk students table
  const atRiskStudents = atRiskStudentsAll.slice(0, 10);

  const riskColumns = [
    {
      key: "name",
      title: "Student",
      render: (val, row) => {
        const meta = [row.class, row.status].filter(Boolean).join(" • ");
        return (
          <div>
            <div className="font-medium text-slate-800">{val || "—"}</div>
            <div className="text-xs text-slate-500">{meta || "—"}</div>
          </div>
        );
      },
    },
    {
      key: "risk",
      title: "Risk Level",
      render: (val) => <RiskTag level={val || "medium"} />,
    },
    {
      key: "reason",
      title: "Reason",
      render: (val) => <span className="text-slate-700">{val || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="School-wide insights powered by AI"
        loading={loading}
        onRefresh={fetchInsights}
      />

      {/* AI Summary */}
      <AISummaryPanel summary={insights.summary || insights.overallSummary} />

      {/* Alerts */}
      <AlertCards alerts={alerts} />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Students" value={stats.totalStudents ?? "—"} />
        <StatCard label="Classes" value={stats.totalClasses ?? "—"} />
        <StatCard
          label="Attendance"
          value={stats.overallAttendanceRate ?? "—"}
          suffix={stats.overallAttendanceRate !== undefined ? "%" : ""}
          trend={
            insights.attendancePrediction?.risk === "high" ? "down" : "stable"
          }
        />
        <StatCard
          label="Fee Collection"
          value={stats.feeCollectionRate ?? "—"}
          suffix={stats.feeCollectionRate !== undefined ? "%" : ""}
          trend={
            insights.feeCollectionForecast?.collectionRate > 80
              ? "up"
              : "stable"
          }
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Student Performance Trend"
          data={performanceTrend}
          xKey="label"
          lines={[{ key: "avgScore", name: "Avg Score %", color: "#6366f1" }]}
        />
        <AreaChartCard
          title="Fee Collection Trend"
          data={feeTrend}
          xKey="label"
          areas={[
            { key: "expected", name: "Expected", color: "#94a3b8" },
            { key: "collected", name: "Collected", color: "#10b981" },
          ]}
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard
          title="Attendance Distribution"
          data={charts.attendanceDistribution || []}
        />
        <PieChartCard
          title="Fee Status Distribution"
          data={charts.feeDistribution || []}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Class-wise Average Performance"
          data={classChartData}
          color="#6366f1"
        />
        <BarChartCard
          title="Subject-wise Performance"
          data={subjectChartData}
          color="#f59e0b"
        />
      </div>

      {/* At-risk Students */}
      {atRiskStudents.length > 0 && (
        <RiskTable
          title="At-Risk Students"
          data={atRiskStudents}
          columns={riskColumns}
        />
      )}

      {/* Recommendations */}
      <RecommendationsList items={insights.recommendations || []} />
    </div>
  );
}
