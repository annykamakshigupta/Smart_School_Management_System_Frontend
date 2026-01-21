import React, { useState, useEffect } from "react";
import { PageHeader } from "../../../components/UI";
import {
  TimetableGrid,
  TimetableMobileView,
} from "../../../components/Timetable";
import scheduleService from "../../../services/schedule.service";
import { useAuth } from "../../../hooks/useAuth";

const MySchedulePage = () => {
  const { user } = useAuth();
  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch teacher's schedule
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use new API endpoint that doesn't require teacherId (uses JWT)
      const response = await scheduleService.getMySchedule();
      setWeeklySchedule(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // Handle schedule card click to show details
  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  // Close schedule details modal
  const closeDetailsModal = () => {
    setSelectedSchedule(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Teaching Schedule"
        subtitle="View your weekly class schedule"
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">
                {Object.values(weeklySchedule).flat().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Teaching Days</p>
              <p className="text-2xl font-bold text-gray-800">
                {
                  Object.values(weeklySchedule).filter((day) => day.length > 0)
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Hours/Week</p>
              <p className="text-2xl font-bold text-gray-800">
                {Object.values(weeklySchedule)
                  .flat()
                  .reduce((total, schedule) => {
                    const [startH, startM] = schedule.startTime
                      .split(":")
                      .map(Number);
                    const [endH, endM] = schedule.endTime
                      .split(":")
                      .map(Number);
                    return (
                      total + (endH * 60 + endM - (startH * 60 + startM)) / 60
                    );
                  }, 0)
                  .toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {Object.values(weeklySchedule).flat().length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Classes Assigned Yet
            </h3>
            <p className="text-gray-500">
              You don't have any scheduled classes at the moment. Please contact
              your administrator if you believe this is an error.
            </p>
          </div>
        ) : isMobile ? (
          <TimetableMobileView
            weeklySchedule={weeklySchedule}
            onScheduleClick={handleScheduleClick}
            showTeacher={false}
            showClass={true}
          />
        ) : (
          <TimetableGrid
            weeklySchedule={weeklySchedule}
            onScheduleClick={handleScheduleClick}
            showTeacher={false}
            showClass={true}
          />
        )}
      </div>

      {/* Schedule Details Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold">Class Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-white hover:text-gray-200 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="text-lg font-semibold">
                  {selectedSchedule.subjectId?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-semibold">
                  {selectedSchedule.classId?.name} - {selectedSchedule.section}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Day</p>
                <p className="text-lg font-semibold">
                  {selectedSchedule.dayOfWeek}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-lg font-semibold">
                  {selectedSchedule.startTime} - {selectedSchedule.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Room</p>
                <p className="text-lg font-semibold">{selectedSchedule.room}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedulePage;
