/**
 * Student AI Analytics Page
 * Shows personalized academic insights: subject performance radar,
 * improvement potential, attendance impact, and study recommendations.
 */

import { useState, useEffect, useCallback } from "react";
import { Progress } from "antd";
import { getStudentAnalytics } from "../../../services/analytics.service";
import {
  AnalyticsLoading,
  AnalyticsError,
  AnalyticsHeader,
  AISummaryPanel,
  AlertCards,
  RecommendationsList,
  StatCard,
  RadarChartCard,
  BarChartCard,
  LineChartCard,
  AreaChartCard,
  ImprovementScore,
} from "../../../components/Analytics/AnalyticsComponents";

export default function StudentAnalyticsPage() {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getStudentAnalytics();
      setPayload(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch student analytics");
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

  // Radar data for subject performance
  const radarData = (charts.subjectComparison || []).map((s) => ({
    subject: s.subject,
    value: Math.round(s.avgScore ?? 0),
  }));

  // Bar chart for subject scores
  const barData = radarData.map((d) => ({
    label: d.subject,
    value: d.value,
  }));

  // Alerts
  const alerts = [];
  if (insights.weakSubjects?.length) {
    alerts.push({
      type: "warning",
      title: "Subjects to Focus On",
      message: `You need improvement in: ${insights.weakSubjects.map((s) => s.subject || s.name || s).join(", ")}`,
    });
  }
  if (insights.attendanceAlert) {
    alerts.push({
      type: insights.attendanceAlert.type || "info",
      title: "Attendance Status",
      message: insights.attendanceAlert.message,
    });
  }

  const improvement =
    insights.improvementScore || insights.improvementPotential || {};

  const marksProgression = (charts.marksProgression || []).map((m) => ({
    label: m.month,
    avgScore: m.avgScore,
    exams: m.exams,
  }));

  const attendanceTrend = (charts.attendanceTrend || []).map((m) => ({
    label: m.month,
    attendanceRate: m.attendanceRate,
    marked: m.marked,
  }));

  return (
    <div className="space-y-6 pb-8">
      <AnalyticsHeader
        title="AI Analytics"
        subtitle="Your personalized academic insights"
        loading={loading}
        onRefresh={fetchInsights}
      />

      <AISummaryPanel summary={insights.summary || insights.overallSummary} />

      <AlertCards alerts={alerts} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Overall Avg"
          value={stats.overallAvg ?? "—"}
          suffix={stats.overallAvg !== undefined ? "%" : ""}
          trend={insights.performanceAnalysis?.trend}
          color="blue"
        />
        <StatCard
          label="Attendance"
          value={stats.attendanceRate ?? "—"}
          suffix={stats.attendanceRate !== undefined ? "%" : ""}
          trend={insights.performanceAnalysis?.trend}
          color="green"
        />
        <StatCard label="Exams" value={stats.totalExams ?? "—"} color="amber" />
        <StatCard
          label="Readiness"
          value={insights.examReadiness?.level || "—"}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {radarData.length > 0 && (
          <RadarChartCard title="Subject Performance Radar" data={radarData} />
        )}
        {barData.length > 0 && (
          <BarChartCard title="Subject Scores" data={barData} color="#10b981" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Marks Progression"
          data={marksProgression}
          xKey="label"
          lines={[{ key: "avgScore", name: "Avg Score %", color: "#6366f1" }]}
        />
        <AreaChartCard
          title="Attendance Trend"
          data={attendanceTrend}
          xKey="label"
          areas={[
            { key: "attendanceRate", name: "Attendance %", color: "#06b6d4" },
          ]}
        />
      </div>

      {stats.attendanceRate !== undefined && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4">
            Attendance Progress
          </h3>
          <div className="flex items-center gap-6">
            <Progress
              type="circle"
              percent={Math.round(stats.attendanceRate || 0)}
              size={110}
              strokeColor="#10b981"
              format={(p) => (
                <span className="text-lg font-bold text-slate-800">{p}%</span>
              )}
            />
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-800">
                Keep consistency for better results.
              </p>
              <p className="mt-1">
                Higher attendance often correlates with stronger performance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Score */}
      {(improvement.current || improvement.potential) && (
        <ImprovementScore
          current={improvement.current}
          potential={improvement.potential}
          gap={improvement.gap}
        />
      )}

      <RecommendationsList
        items={
          insights.studySuggestions ||
          insights.recommendations ||
          insights.studyTips ||
          []
        }
        title="Personalized Study Recommendations"
      />
    </div>
  );
}
