/**
 * Student Timetable Page
 */

import { Card, Tag, Tabs } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";

const TimetablePage = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timetable = {
    Monday: [
      {
        time: "8:00 - 8:45",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        room: "101",
      },
      {
        time: "9:00 - 9:45",
        subject: "Science",
        teacher: "Ms. Johnson",
        room: "203",
      },
      {
        time: "10:00 - 10:45",
        subject: "English",
        teacher: "Mrs. Brown",
        room: "105",
      },
      {
        time: "11:00 - 11:45",
        subject: "History",
        teacher: "Mr. Wilson",
        room: "302",
      },
      {
        time: "1:00 - 1:45",
        subject: "Physics",
        teacher: "Dr. Lee",
        room: "Lab 1",
      },
      {
        time: "2:00 - 2:45",
        subject: "Computer",
        teacher: "Mr. Davis",
        room: "Lab 2",
      },
    ],
    Tuesday: [
      {
        time: "8:00 - 8:45",
        subject: "English",
        teacher: "Mrs. Brown",
        room: "105",
      },
      {
        time: "9:00 - 9:45",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        room: "101",
      },
      {
        time: "10:00 - 10:45",
        subject: "Chemistry",
        teacher: "Dr. Adams",
        room: "Lab 3",
      },
      {
        time: "11:00 - 11:45",
        subject: "Geography",
        teacher: "Ms. Taylor",
        room: "204",
      },
      {
        time: "1:00 - 1:45",
        subject: "Physical Ed",
        teacher: "Coach Miller",
        room: "Gym",
      },
      {
        time: "2:00 - 2:45",
        subject: "Art",
        teacher: "Ms. Green",
        room: "401",
      },
    ],
    Wednesday: [
      {
        time: "8:00 - 8:45",
        subject: "Science",
        teacher: "Ms. Johnson",
        room: "203",
      },
      {
        time: "9:00 - 9:45",
        subject: "History",
        teacher: "Mr. Wilson",
        room: "302",
      },
      {
        time: "10:00 - 10:45",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        room: "101",
      },
      {
        time: "11:00 - 11:45",
        subject: "English",
        teacher: "Mrs. Brown",
        room: "105",
      },
      {
        time: "1:00 - 1:45",
        subject: "Music",
        teacher: "Mr. Anderson",
        room: "501",
      },
      {
        time: "2:00 - 2:45",
        subject: "Library",
        teacher: "Mrs. White",
        room: "Library",
      },
    ],
    Thursday: [
      {
        time: "8:00 - 8:45",
        subject: "Physics",
        teacher: "Dr. Lee",
        room: "Lab 1",
      },
      {
        time: "9:00 - 9:45",
        subject: "Chemistry",
        teacher: "Dr. Adams",
        room: "Lab 3",
      },
      {
        time: "10:00 - 10:45",
        subject: "Biology",
        teacher: "Dr. Clark",
        room: "Lab 4",
      },
      {
        time: "11:00 - 11:45",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        room: "101",
      },
      {
        time: "1:00 - 1:45",
        subject: "English",
        teacher: "Mrs. Brown",
        room: "105",
      },
      {
        time: "2:00 - 2:45",
        subject: "Computer",
        teacher: "Mr. Davis",
        room: "Lab 2",
      },
    ],
    Friday: [
      {
        time: "8:00 - 8:45",
        subject: "Geography",
        teacher: "Ms. Taylor",
        room: "204",
      },
      {
        time: "9:00 - 9:45",
        subject: "Science",
        teacher: "Ms. Johnson",
        room: "203",
      },
      {
        time: "10:00 - 10:45",
        subject: "Physical Ed",
        teacher: "Coach Miller",
        room: "Gym",
      },
      {
        time: "11:00 - 11:45",
        subject: "Art",
        teacher: "Ms. Green",
        room: "401",
      },
      {
        time: "1:00 - 1:45",
        subject: "History",
        teacher: "Mr. Wilson",
        room: "302",
      },
      {
        time: "2:00 - 2:45",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        room: "101",
      },
    ],
  };

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: "blue",
      Science: "green",
      English: "purple",
      History: "orange",
      Physics: "cyan",
      Chemistry: "magenta",
      Biology: "lime",
      Geography: "gold",
      Computer: "geekblue",
      "Physical Ed": "red",
      Art: "pink",
      Music: "volcano",
      Library: "default",
    };
    return colors[subject] || "default";
  };

  const tabItems = days.map((day) => ({
    key: day,
    label: day,
    children: (
      <div className="space-y-3">
        {timetable[day].map((period, index) => (
          <Card
            key={index}
            size="small"
            className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-20">
                  <ClockCircleOutlined className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{period.time}</span>
                </div>
                <div>
                  <Tag
                    color={getSubjectColor(period.subject)}
                    className="text-sm font-medium">
                    {period.subject}
                  </Tag>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  <UserOutlined className="mr-1" />
                  {period.teacher}
                </span>
                <span>
                  <EnvironmentOutlined className="mr-1" />
                  {period.room}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    ),
  }));

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const defaultTab = days.includes(today) ? today : "Monday";

  return (
    <div>
      <PageHeader
        title="Timetable"
        subtitle="Your weekly class schedule"
        breadcrumbs={[
          { label: "Student", path: "/student/dashboard" },
          { label: "Timetable" },
        ]}
      />

      <Card>
        <Tabs defaultActiveKey={defaultTab} items={tabItems} size="large" />
      </Card>
    </div>
  );
};

export default TimetablePage;
