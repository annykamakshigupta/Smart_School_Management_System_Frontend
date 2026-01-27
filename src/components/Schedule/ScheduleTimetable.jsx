import React, { useEffect, useMemo, useRef, useState } from "react";
import ScheduleCard from "./ScheduleCard";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getTodayLabel = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

const isSmallScreen = () =>
  typeof window !== "undefined" ? window.innerWidth < 1024 : false;

const EmptyState = ({ title, subtitle }) => (
  <div className="text-center py-14">
    <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
    <div className="mt-4 text-lg font-semibold text-slate-800">{title}</div>
    {subtitle ? (
      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    ) : null}
  </div>
);

const DayTabs = ({ selectedDay, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto pb-2">
    {DAYS.map((day) => {
      const active = day === selectedDay;
      return (
        <button
          key={day}
          type="button"
          onClick={() => onSelect(day)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            active
              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}>
          {day.slice(0, 3)}
        </button>
      );
    })}
  </div>
);

const ScheduleTimetable = ({
  groupedByDay,
  onItemClick,
  showTeacher = true,
  showClass = false,
  emptyTitle = "No schedule yet",
  emptySubtitle = "Once schedules are created, they’ll show up here.",
}) => {
  const allItems = useMemo(
    () => DAYS.flatMap((d) => groupedByDay?.[d] || []),
    [groupedByDay],
  );

  const [compact, setCompact] = useState(isSmallScreen());
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = getTodayLabel();
    return DAYS.includes(today) ? today : "Monday";
  });

  const columnRefs = useRef({});

  useEffect(() => {
    const onResize = () => setCompact(isSmallScreen());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const effectiveDay = useMemo(() => {
    if (!compact) return selectedDay;
    const hasSelected = (groupedByDay?.[selectedDay] || []).length > 0;
    if (hasSelected) return selectedDay;
    const firstWithItems = DAYS.find(
      (d) => (groupedByDay?.[d] || []).length > 0,
    );
    return firstWithItems || selectedDay;
  }, [compact, groupedByDay, selectedDay]);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    if (!compact && columnRefs.current?.[day]) {
      columnRefs.current[day].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  };

  if (!allItems.length) {
    return <EmptyState title={emptyTitle} subtitle={emptySubtitle} />;
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 pb-3">
        <DayTabs selectedDay={effectiveDay} onSelect={handleSelectDay} />
      </div>

      {compact ? (
        <div className="space-y-3">
          {(groupedByDay?.[effectiveDay] || []).length ? (
            (groupedByDay?.[effectiveDay] || []).map((item) => (
              <ScheduleCard
                key={item._id}
                item={item}
                onClick={() => onItemClick && onItemClick(item)}
                showTeacher={showTeacher}
                showClass={showClass}
              />
            ))
          ) : (
            <EmptyState
              title={`No classes on ${effectiveDay}`}
              subtitle="Try another day, or ask an admin to publish the timetable."
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {DAYS.map((day) => {
            const items = groupedByDay?.[day] || [];
            const isSelected = day === effectiveDay;
            return (
              <div
                key={day}
                ref={(el) => {
                  if (el) columnRefs.current[day] = el;
                }}
                className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${
                  isSelected ? "border-slate-900" : "border-slate-200"
                }`}>
                <div
                  className={`px-4 py-3 border-b ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-800 border-slate-200"
                  }`}>
                  <div className="text-sm font-semibold">{day}</div>
                  <div
                    className={`text-xs ${isSelected ? "text-white/80" : "text-slate-500"}`}>
                    {items.length
                      ? `${items.length} class${items.length > 1 ? "es" : ""}`
                      : "No classes"}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {items.length ? (
                    items.map((item) => (
                      <ScheduleCard
                        key={item._id}
                        item={item}
                        onClick={() => onItemClick && onItemClick(item)}
                        showTeacher={showTeacher}
                        showClass={showClass}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">—</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScheduleTimetable;
