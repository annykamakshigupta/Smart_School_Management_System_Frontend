/**
 * ChildSchedulePage - Parent's View of Child's Schedule
 * Modern, responsive schedule display for parents to view their children's timetables
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  GraduationCap,
  RefreshCw,
  Users,
  ChevronDown,
} from "lucide-react";
import { ScheduleView } from "../../../components/Schedule";
import scheduleService from "../../../services/schedule.service";
import { useAuth } from "../../../hooks/useAuth";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, subtext }) => {
  const colorClasses = {
    indigo: {
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    emerald: {
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    violet: {
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    amber: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
        <div
          className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${colors.iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Child Selector Component
const ChildSelector = ({ children, selectedChild, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!children || children.length === 0) {
    return null;
  }

  const selected = children.find((c) => c._id === selectedChild) || children[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors min-w-[200px]">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <Users className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-slate-800">
            {selected?.name || "Select Child"}
          </p>
          <p className="text-xs text-slate-500">
            {selected?.classId?.name || "Class"} -{" "}
            {selected?.section || "Section"}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {children.map((child) => (
              <button
                key={child._id}
                onClick={() => {
                  onSelect(child._id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors
                  ${child._id === selectedChild ? "bg-indigo-50" : ""}
                `}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    child._id === selectedChild
                      ? "bg-indigo-100"
                      : "bg-slate-100"
                  }`}>
                  <Users
                    className={`w-4 h-4 ${child._id === selectedChild ? "text-indigo-600" : "text-slate-500"}`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {child.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {child.classId?.name || "Class"} - Section{" "}
                    {child.section || "-"}
                  </p>
                </div>
                {child._id === selectedChild && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ChildSchedulePage = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    items: [],
    groupedByDay: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch parent's children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // This would call the parent service to get linked children
        // For now, we'll use a placeholder
        const response = await fetch("/api/parents/children", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ssms_token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setChildren(data.data || []);
          if (data.data?.length > 0) {
            setSelectedChild(data.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch children:", err);
      }
    };

    if (user) {
      fetchChildren();
    }
  }, [user]);

  // Fetch schedule for selected child
  const fetchSchedule = async () => {
    if (!selectedChild) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // This would fetch the schedule for the specific child
      const response = await scheduleService.getStudentSchedules({
        studentId: selectedChild,
      });
      setScheduleData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChild) {
      fetchSchedule();
    }
  }, [selectedChild]);

  // Calculate statistics
  const stats = useMemo(() => {
    const items = scheduleData.items || [];
    const groupedByDay = scheduleData.groupedByDay || {};

    const totalClasses = items.length;
    const schoolDays = Object.values(groupedByDay).filter(
      (day) => day.length > 0,
    ).length;

    const totalHours = items.reduce((total, schedule) => {
      if (!schedule.startTime || !schedule.endTime) return total;
      const [startH, startM] = schedule.startTime.split(":").map(Number);
      const [endH, endM] = schedule.endTime.split(":").map(Number);
      const duration = (endH * 60 + endM - (startH * 60 + startM)) / 60;
      return total + duration;
    }, 0);

    const uniqueSubjects = new Set(
      items.map((item) => item.subjectId?._id).filter(Boolean),
    ).size;

    return {
      totalClasses,
      schoolDays,
      totalHours: totalHours.toFixed(1),
      uniqueSubjects,
    };
  }, [scheduleData]);

  // Get unique subjects and teachers for filters
  const { subjects, teachers } = useMemo(() => {
    const subjectMap = new Map();
    const teacherMap = new Map();

    (scheduleData.items || []).forEach((item) => {
      if (item.subjectId?._id) {
        subjectMap.set(item.subjectId._id, item.subjectId);
      }
      if (item.teacherId?._id) {
        teacherMap.set(item.teacherId._id, item.teacherId);
      }
    });

    return {
      subjects: Array.from(subjectMap.values()),
      teachers: Array.from(teacherMap.values()),
    };
  }, [scheduleData.items]);

  const selectedChildData = children.find((c) => c._id === selectedChild);

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Child's Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your child's weekly class timetable
          </p>
        </div>
        <div className="flex items-center gap-3">
          {children.length > 0 && (
            <ChildSelector
              children={children}
              selectedChild={selectedChild}
              onSelect={setSelectedChild}
            />
          )}
          <button
            onClick={fetchSchedule}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Child Info Banner */}
      {selectedChildData && (
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedChildData.name}</h2>
              <p className="text-white/80 text-sm">
                {selectedChildData.classId?.name || "Class"} - Section{" "}
                {selectedChildData.section || "-"}
                {selectedChildData.rollNumber &&
                  ` • Roll No: ${selectedChildData.rollNumber}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BookOpen}
          label="Total Classes"
          value={stats.totalClasses}
          color="indigo"
          subtext="Per week"
        />
        <StatCard
          icon={Calendar}
          label="School Days"
          value={stats.schoolDays}
          color="emerald"
          subtext="Days per week"
        />
        <StatCard
          icon={Clock}
          label="Hours/Week"
          value={stats.totalHours}
          color="violet"
          subtext="Total class hours"
        />
        <StatCard
          icon={GraduationCap}
          label="Subjects"
          value={stats.uniqueSubjects}
          color="amber"
          subtext="This semester"
        />
      </div>

      {/* Schedule View */}
      <ScheduleView
        groupedByDay={scheduleData.groupedByDay}
        loading={loading}
        error={error}
        onRefresh={fetchSchedule}
        onItemClick={(item) => console.log("Schedule clicked:", item)}
        showTeacher={true}
        showClass={false}
        subjects={subjects}
        teachers={teachers}
        emptyTitle={
          children.length === 0 ? "No Children Linked" : "No Schedule Available"
        }
        emptySubtitle={
          children.length === 0
            ? "Please contact the school administrator to link your child's account."
            : "The timetable for your child will appear here once it's published."
        }
        showFilters={true}
        showSearch={true}
        showViewToggle={true}
        role="parent"
      />
    </div>
  );
};

export default ChildSchedulePage;
