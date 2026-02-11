import { Tag } from "antd";

const gradeColors = {
  "A+": { color: "#15803d", bg: "#dcfce7" },
  A: { color: "#16a34a", bg: "#dcfce7" },
  "B+": { color: "#2563eb", bg: "#dbeafe" },
  B: { color: "#3b82f6", bg: "#dbeafe" },
  "C+": { color: "#d97706", bg: "#fef3c7" },
  C: { color: "#f59e0b", bg: "#fef3c7" },
  D: { color: "#ea580c", bg: "#ffedd5" },
  F: { color: "#dc2626", bg: "#fee2e2" },
};

const GradeBadge = ({ grade, size = "default" }) => {
  if (!grade) return <span className="text-slate-400">—</span>;
  const cfg = gradeColors[grade] || { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <Tag
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        border: "none",
        fontWeight: 700,
        fontSize: size === "large" ? 16 : 13,
        padding: size === "large" ? "4px 16px" : "2px 10px",
      }}>
      {grade}
    </Tag>
  );
};

export default GradeBadge;
