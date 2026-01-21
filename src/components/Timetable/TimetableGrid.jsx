import React from "react";
import TimetableCard from "./TimetableCard";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const TimetableGrid = ({
  weeklySchedule,
  onScheduleClick,
  showTeacher = true,
  showClass = false,
}) => {
  // Function to check if a schedule falls within a time slot
  const isInTimeSlot = (schedule, slotTime) => {
    const [slotHour] = slotTime.split(":").map(Number);
    const [scheduleStartHour, scheduleStartMin] = schedule.startTime
      .split(":")
      .map(Number);
    const [scheduleEndHour] = schedule.endTime.split(":").map(Number);

    return scheduleStartHour <= slotHour && scheduleEndHour > slotHour;
  };

  return (
    <div className="overflow-x-auto overflow-visible">
      <div className="min-w-225">
        {/* Header */}
        <div className="grid grid-cols-6 gap-2 mb-2">
          <div className="text-center font-semibold text-gray-700 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
            Time
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {TIME_SLOTS.map((timeSlot, index) => (
          <div key={timeSlot} className="grid grid-cols-6 gap-2 mb-2">
            {/* Time column */}
            <div className="flex items-start justify-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-600">
                {timeSlot}
                {index < TIME_SLOTS.length - 1 && ` - ${TIME_SLOTS[index + 1]}`}
              </span>
            </div>

            {/* Day columns */}
            {DAYS.map((day) => {
              const daySchedules = weeklySchedule[day] || [];
              const scheduleInSlot = daySchedules.find((schedule) =>
                isInTimeSlot(schedule, timeSlot),
              );

              return (
                <div
                  key={`${day}-${timeSlot}`}
                  className="min-h-20 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors relative overflow-visible">
                  {scheduleInSlot ? (
                    <TimetableCard
                      schedule={scheduleInSlot}
                      onClick={() =>
                        onScheduleClick && onScheduleClick(scheduleInSlot)
                      }
                      showTeacher={showTeacher}
                      showClass={showClass}
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-xs py-6">
                      -
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetableGrid;
