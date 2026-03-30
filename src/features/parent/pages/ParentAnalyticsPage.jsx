/**
 * Parent AI Analytics Page
 * Shows insights about children: performance comparison,
 * attendance trends, risk notifications, and recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { getParentAnalytics } from "../../../services/analytics.service";
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
} from "../../../components/Analytics/AnalyticsComponents";

export default function ParentAnalyticsPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getParentAnalytics();
      setPayload(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch parent analytics");
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
  const stats = payload?.stats ?? {};
  const charts = payload?.charts ?? {};

  // Children performance chart
  const childrenChart = (charts.childrenComparison || []).map((c) => ({
    label: c.name,
    value: Math.round(c.avgScore ?? 0),
  }));

  const attendanceChart = (charts.childrenComparison || []).map((c) => ({
    label: c.name,
    value: Math.round(c.attendanceRate ?? 0),
  }));

  const compareSeries = (charts.childrenComparison || []).map((c) => ({
    name: c.name,
    avgScore: Math.round(c.avgScore ?? 0),
    attendanceRate: Math.round(c.attendanceRate ?? 0),
  }));

  const firstChildTrend = (charts.firstChildTrend || []).map((m) => ({
    label: m.month,
    avgScore: m.avgScore,
    exams: m.exams,
  }));

  // Alerts
  const alerts = [];
  if (Array.isArray(insights.alerts) && insights.alerts.length) {
    insights.alerts.forEach((a) => alerts.push(a));
  }
  if (insights.attendanceImpact?.impact === "negative") {
    alerts.unshift({
      type: "warning",
      title: "Attendance Impact",
      message:
        insights.attendanceImpact.explanation ||
        "Attendance may be affecting performance.",
    });
  }

  const avgOf = (nums) => {
    const cleaned = nums.filter(
      (n) => typeof n === "number" && !Number.isNaN(n),
    );
    if (!cleaned.length) return null;
    return (
      Math.round((cleaned.reduce((a, b) => a + b, 0) / cleaned.length) * 10) /
      10
    );
  };

  const avgScoreAll = avgOf(
    (charts.childrenComparison || []).map((c) => c.avgScore),
  );
  const avgAttendanceAll = avgOf(
    (charts.childrenComparison || []).map((c) => c.attendanceRate),
  );

  return (
    <div className="pb-8 space-y-6">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Insights about your children's academic performance"
        loading={loading}
        onRefresh={fetchInsights}
      />

      <AISummaryPanel summary={insights.summary || insights.overallSummary} />

      <AlertCards alerts={alerts} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Children"
          value={stats.childrenCount ?? "—"}
          color="blue"
        />
        <StatCard
          label="Avg Score"
          value={avgScoreAll ?? "—"}
          suffix={avgScoreAll !== null ? "%" : ""}
          trend={insights.progressSummary?.trend}
          color="green"
        />
        <StatCard
          label="Avg Attendance"
          value={avgAttendanceAll ?? "—"}
          suffix={avgAttendanceAll !== null ? "%" : ""}
          trend={insights.progressSummary?.trend}
          color="amber"
        />
        <StatCard
          label="Impact"
          value={insights.attendanceImpact?.impact || "—"}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {childrenChart.length > 0 && (
          <BarChartCard
            title="Children Performance Comparison"
            data={childrenChart}
            color="#8b5cf6"
          />
        )}
        {attendanceChart.length > 0 && (
          <BarChartCard
            title="Children Attendance Comparison"
            data={attendanceChart}
            color="#06b6d4"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {compareSeries.length > 0 && (
          <LineChartCard
            title="Attendance vs Performance (by Child)"
            data={compareSeries}
            xKey="name"
            lines={[
              { key: "avgScore", name: "Avg Score %", color: "#8b5cf6" },
              {
                key: "attendanceRate",
                name: "Attendance %",
                color: "#06b6d4",
              },
            ]}
          />
        )}
        {firstChildTrend.length > 0 && (
          <AreaChartCard
            title={`${charts.firstChildName || "Child"} — Progress Trend`}
            data={firstChildTrend}
            xKey="label"
            areas={[{ key: "avgScore", name: "Avg Score %", color: "#10b981" }]}
          />
        )}
      </div>

      <RecommendationsList
        items={
          insights.parentActions ||
          insights.recommendations ||
          insights.parentTips ||
          []
        }
        title="Recommendations for Parents"
      />
    </div>
  );
}
