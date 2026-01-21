import React from "react";

const SUBJECT_COLORS = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-indigo-100 border-indigo-300 text-indigo-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-teal-100 border-teal-300 text-teal-800",
];

const getSubjectColor = (subjectId) => {
  const hash = subjectId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return SUBJECT_COLORS[hash % SUBJECT_COLORS.length];
};

const TimetableCard = ({
  schedule,
  onClick,
  showTeacher = true,
  showClass = false,
}) => {
  const colorClass = schedule?.subjectId?._id
    ? getSubjectColor(schedule.subjectId._id)
    : SUBJECT_COLORS[0];

  return (
    <div className="relative group">
      <div
        onClick={onClick}
        className={`${colorClass} border-l-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] relative`}>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm line-clamp-1">
              {schedule?.subjectId?.name || "Unknown Subject"}
            </h4>
            <span className="text-xs opacity-75 font-medium">
              {schedule?.startTime} - {schedule?.endTime}
            </span>
          </div>

          {showTeacher && schedule?.teacherId && (
            <p className="text-xs opacity-80 font-medium">
              {schedule.teacherId.firstName} {schedule.teacherId.lastName}
            </p>
          )}

          {showClass && schedule?.classId && (
            <p className="text-xs opacity-80 font-medium">
              {schedule.classId.name} - {schedule.section}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs opacity-75">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>{schedule?.room}</span>
          </div>
        </div>
      </div>

      {/* Modern Hover Tooltip with higher z-index */}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute left-0 top-full mt-2 z-[9999] pointer-events-none">
        <div className="bg-white shadow-2xl rounded-xl p-4 border border-gray-200 min-w-[280px] transform translate-y-0 group-hover:translate-y-1">
          {/* Tooltip Arrow */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

          <div className="relative space-y-2.5">
            <div className="flex items-start gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {schedule?.subjectId?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {schedule?.subjectId?.code}
                </p>
              </div>
            </div>

            {showTeacher && schedule?.teacherId && (
              <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg p-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium">
                  {schedule.teacherId.firstName} {schedule.teacherId.lastName}
                </span>
              </div>
            )}

            {showClass && schedule?.classId && (
              <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg p-2">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="font-medium">
                  {schedule.classId.name} - Section {schedule.section}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg p-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium">Room {schedule?.room}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-700 bg-blue-50 rounded-lg p-2 border border-blue-200">
              <svg
                className="w-4 h-4 text-blue-600"
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
              <span className="font-semibold text-blue-700">
                {schedule?.startTime} - {schedule?.endTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableCard;
