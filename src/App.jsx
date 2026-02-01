import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";

// Providers
import { AuthProvider } from "./app/providers/AuthProvider";

// Layouts
import { AuthLayout, DashboardLayout } from "./app/layouts";

// Route Guards
import { PublicRoutes, PrivateRoute, RoleRoute } from "./app/routes";

// Public Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { UnauthorizedPage, NotFoundPage } from "./pages";

// Feature Pages - Admin
import {
  AdminDashboard,
  AdminAssignmentsPage,
  TeachersPage,
  StudentsPage,
  ParentsPage,
  SettingsPage as AdminSettingsPage,
  SchedulesPage,
  ClassesPage,
  SubjectsPage,
  AdminAttendancePage,
  UserManagementPage,
  StudentEnrollmentPage,
  ParentChildMappingPage,
  ClassSubjectAssignmentPage,
  AdminProfilePage,
} from "./features/admin";

// Feature Pages - Teacher
import {
  TeacherDashboard,
  AttendancePage as TeacherAttendancePage,
  MarkAttendancePage,
  MyStudentsPage,
  MySchedulePage,
  TeacherAssignmentsPage,
  TeacherProfilePage,
} from "./features/teacher";

// Feature Pages - Student
import {
  StudentDashboard,
  StudentAttendancePage,
  TimetablePage,
  StudentAssignmentsPage,
  StudentClassesPage,
  StudentProfilePage,
} from "./features/student";

// Assignment Detail Pages
import TeacherAssignmentDetailPage from "./features/teacher/pages/TeacherAssignmentDetailPage";
import StudentAssignmentDetailPage from "./features/student/pages/StudentAssignmentDetailPage";

// Feature Pages - Parent
import {
  ParentDashboard,
  MyChildrenPage,
  FeePaymentPage,
  ParentChildAttendancePage,
  ChildSchedulePage,
  ChildDetailsPage,
  ParentProfilePage,
} from "./features/parent";

// Styles
import "./App.css";

// Role constants
const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
};

// Ant Design theme configuration
const themeConfig = {
  token: {
    colorPrimary: "#6366f1",
    borderRadius: 8,
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route element={<PublicRoutes />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Auth Routes - Redirect if already logged in */}
            <Route element={<PublicRoutes restricted />}>
              <Route element={<AuthLayout />}>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
              </Route>
            </Route>

            {/* ========== PROTECTED ROUTES ========== */}
            <Route element={<PrivateRoute />}>
              {/* ----- ADMIN ROUTES ----- */}
              <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />

                  {/* User Management Module */}
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route
                    path="/admin/users/teachers"
                    element={<TeachersPage />}
                  />
                  <Route
                    path="/admin/users/students"
                    element={<StudentsPage />}
                  />
                  <Route
                    path="/admin/users/parents"
                    element={<ParentsPage />}
                  />
                  <Route
                    path="/admin/students/enroll"
                    element={<StudentEnrollmentPage />}
                  />
                  <Route
                    path="/admin/parents/mapping"
                    element={<ParentChildMappingPage />}
                  />
                  <Route
                    path="/admin/assignments"
                    element={<AdminAssignmentsPage />}
                  />
                  <Route
                    path="/admin/academics/teacher-assignments"
                    element={<ClassSubjectAssignmentPage />}
                  />

                  {/* Academics */}
                  <Route
                    path="/admin/academics/classes"
                    element={<ClassesPage />}
                  />
                  <Route
                    path="/admin/academics/subjects"
                    element={<SubjectsPage />}
                  />
                  <Route
                    path="/admin/academics/timetable"
                    element={<SchedulesPage />}
                  />

                  {/* Attendance */}
                  <Route
                    path="/admin/attendance"
                    element={<AdminAttendancePage />}
                  />

                  {/* Fee Management */}
                  <Route
                    path="/admin/fees/structure"
                    element={<PlaceholderPage title="Fee Structure" />}
                  />
                  <Route
                    path="/admin/fees/collection"
                    element={<PlaceholderPage title="Fee Collection" />}
                  />
                  <Route
                    path="/admin/fees/reports"
                    element={<PlaceholderPage title="Fee Reports" />}
                  />

                  {/* Reports & Settings */}
                  <Route
                    path="/admin/reports"
                    element={<PlaceholderPage title="Reports & Analytics" />}
                  />
                  <Route
                    path="/admin/settings"
                    element={<AdminSettingsPage />}
                  />
                  <Route path="/admin/profile" element={<AdminProfilePage />} />
                </Route>
              </Route>

              {/* ----- TEACHER ROUTES ----- */}
              <Route element={<RoleRoute allowedRoles={[ROLES.TEACHER]} />}>
                <Route element={<DashboardLayout />}>
                  <Route
                    path="/teacher/dashboard"
                    element={<TeacherDashboard />}
                  />

                  {/* Attendance */}
                  <Route
                    path="/teacher/attendance"
                    element={<TeacherAttendancePage />}
                  />
                  <Route
                    path="/teacher/attendance/mark"
                    element={<MarkAttendancePage />}
                  />
                  {/* Grades */}
                  <Route
                    path="/teacher/assignments"
                    element={<TeacherAssignmentsPage />}
                  />
                  <Route
                    path="/teacher/assignments/:id"
                    element={<TeacherAssignmentDetailPage />}
                  />
                  <Route
                    path="/teacher/grades/enter"
                    element={<PlaceholderPage title="Enter Grades" />}
                  />
                  <Route
                    path="/teacher/grades/results"
                    element={<PlaceholderPage title="Results" />}
                  />

                  {/* Other */}
                  <Route
                    path="/teacher/students"
                    element={<MyStudentsPage />}
                  />
                  <Route
                    path="/teacher/students/:id"
                    element={<PlaceholderPage title="Student Details" />}
                  />
                  <Route
                    path="/teacher/schedule"
                    element={<MySchedulePage />}
                  />
                  <Route
                    path="/teacher/communication"
                    element={<PlaceholderPage title="Communication" />}
                  />
                  <Route
                    path="/teacher/profile"
                    element={<TeacherProfilePage />}
                  />
                  <Route
                    path="/teacher/settings"
                    element={<PlaceholderPage title="Teacher Settings" />}
                  />
                  <Route
                    path="/teacher/notifications"
                    element={<PlaceholderPage title="Notifications" />}
                  />
                </Route>
              </Route>

              {/* ----- STUDENT ROUTES ----- */}
              <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]} />}>
                <Route element={<DashboardLayout />}>
                  <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                  />

                  {/* Academics */}
                  <Route
                    path="/student/attendance"
                    element={<StudentAttendancePage />}
                  />
                  <Route
                    path="/student/academics/grades"
                    element={<PlaceholderPage title="My Grades" />}
                  />
                  <Route
                    path="/student/assignments"
                    element={<StudentAssignmentsPage />}
                  />
                  <Route
                    path="/student/assignments/:id"
                    element={<StudentAssignmentDetailPage />}
                  />
                  <Route
                    path="/student/academics/results"
                    element={<PlaceholderPage title="Results" />}
                  />

                  {/* Other */}
                  <Route
                    path="/student/timetable"
                    element={<TimetablePage />}
                  />
                  <Route
                    path="/student/classes"
                    element={<StudentClassesPage />}
                  />
                  <Route
                    path="/student/fees"
                    element={<PlaceholderPage title="Fee Status" />}
                  />
                  <Route
                    path="/student/notifications"
                    element={<PlaceholderPage title="Notifications" />}
                  />
                  <Route
                    path="/student/profile"
                    element={<StudentProfilePage />}
                  />
                  <Route
                    path="/student/settings"
                    element={<PlaceholderPage title="Student Settings" />}
                  />
                </Route>
              </Route>

              {/* ----- PARENT ROUTES ----- */}
              <Route element={<RoleRoute allowedRoles={[ROLES.PARENT]} />}>
                <Route element={<DashboardLayout />}>
                  <Route
                    path="/parent/dashboard"
                    element={<ParentDashboard />}
                  />
                  {/* Children */}
                  <Route path="/parent/children" element={<MyChildrenPage />} />
                  <Route
                    path="/parent/children/:id"
                    element={<ChildDetailsPage />}
                  />
                  <Route
                    path="/parent/child-schedule"
                    element={<ChildSchedulePage />}
                  />
                  {/* Performance */}
                  {/* Performance */}
                  <Route
                    path="/parent/performance/grades"
                    element={<PlaceholderPage title="Child Grades" />}
                  />

                  {/* Attendance */}
                  <Route
                    path="/parent/attendance"
                    element={<ParentChildAttendancePage />}
                  />

                  <Route
                    path="/parent/performance/reports"
                    element={<PlaceholderPage title="Performance Reports" />}
                  />

                  {/* Fees */}
                  <Route
                    path="/parent/fees/status"
                    element={<FeePaymentPage />}
                  />
                  <Route
                    path="/parent/fees/history"
                    element={<PlaceholderPage title="Payment History" />}
                  />
                  {/* Other */}
                  <Route
                    path="/parent/communication"
                    element={<PlaceholderPage title="Communication" />}
                  />
                  <Route
                    path="/parent/notifications"
                    element={<PlaceholderPage title="Notifications" />}
                  />
                  <Route
                    path="/parent/profile"
                    element={<ParentProfilePage />}
                  />
                  <Route
                    path="/parent/settings"
                    element={<PlaceholderPage title="Parent Settings" />}
                  />
                </Route>
              </Route>
            </Route>

            {/* ========== ERROR ROUTES ========== */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  );
}

/**
 * Placeholder Page Component
 * Used for routes that haven't been fully implemented yet
 */
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-500">This page is under development.</p>
    </div>
  </div>
);

export default App;
