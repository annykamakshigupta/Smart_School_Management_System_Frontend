import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Table,
  Tag,
  Tabs,
  message,
  Space,
  Badge,
  Empty,
  Spin,
  InputNumber,
  Popconfirm,
  Statistic,
  Progress,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  EyeOutlined,
  SendOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  createExam,
  getAllExams,
  updateExam,
  deleteExam,
  addExamSubjects,
  getExamSubjects,
  getApprovalQueue,
  approveMarks,
  rejectMarks,
  publishExamResults,
  unpublishExamResults,
  getExamResults,
  getClassAnalytics,
} from "../../../services/exam.service";
import { getAllClasses } from "../../../services/class.service";
import { getAllSubjects } from "../../../services/subject.service";
import { GradeBadge, ResultTable } from "../../../components/Results";

const examTypes = [
  { value: "unit-test-1", label: "Unit Test 1" },
  { value: "unit-test-2", label: "Unit Test 2" },
  { value: "midterm", label: "Midterm" },
  { value: "final", label: "Final" },
  { value: "assignment", label: "Assignment" },
  { value: "practical", label: "Practical" },
];

const statusColors = {
  upcoming: "blue",
  ongoing: "orange",
  completed: "green",
  cancelled: "red",
};

const AdminResultsPage = () => {
  const [activeTab, setActiveTab] = useState("exams");
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Exam modal
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examForm] = Form.useForm();

  // Subject assignment modal
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examSubjects, setExamSubjects] = useState([]);
  const [subjectForm] = Form.useForm();

  // Approval queue
  const [approvalQueue, setApprovalQueue] = useState([]);

  // Approval details (view marks)
  const [approvalDetailsOpen, setApprovalDetailsOpen] = useState(false);
  const [selectedApprovalItem, setSelectedApprovalItem] = useState(null);
  const [approvalMarks, setApprovalMarks] = useState([]);
  const [approvalMarksLoading, setApprovalMarksLoading] = useState(false);

  // Results view
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [selectedClassForResults, setSelectedClassForResults] = useState(null);

  // Analytics
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (activeTab === "approval") fetchApprovalQueue();
  }, [activeTab]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await getAllExams();
      setExams(res.data || []);
    } catch (e) {
      message.error(e.message || "Error fetching exams");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await getAllClasses();
      setClasses(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await getAllSubjects();
      setSubjects(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApprovalQueue = async () => {
    setLoading(true);
    try {
      const res = await getApprovalQueue();
      setApprovalQueue(res.data || []);
    } catch (e) {
      message.error(e.message || "Error fetching approval queue");
    } finally {
      setLoading(false);
    }
  };

  const openApprovalDetails = async (row) => {
    const examId = row?.examId?._id;
    const classId = row?.classId?._id;
    const subjectId = row?.subjectId?._id;

    if (!examId || !classId || !subjectId) {
      message.error("Missing exam/class/subject for this approval item");
      return;
    }

    setSelectedApprovalItem(row);
    setApprovalDetailsOpen(true);
    setApprovalMarks([]);
    setApprovalMarksLoading(true);
    try {
      const res = await getExamResults(examId, classId, subjectId);
      setApprovalMarks(res.data || []);
    } catch (e) {
      message.error(e?.message || "Error loading marks");
      setApprovalMarks([]);
    } finally {
      setApprovalMarksLoading(false);
    }
  };

  // ===== EXAM CRUD =====

  const handleExamSubmit = async () => {
    try {
      const values = await examForm.validateFields();
      const payload = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };
      delete payload.dateRange;

      if (editingExam) {
        await updateExam(editingExam._id, payload);
        message.success("Exam updated");
      } else {
        await createExam(payload);
        message.success("Exam created");
      }
      setExamModalOpen(false);
      examForm.resetFields();
      setEditingExam(null);
      fetchExams();
    } catch (e) {
      if (e.errorFields) return;
      message.error(e.message || "Error saving exam");
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await deleteExam(id);
      message.success("Exam deleted");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error deleting exam");
    }
  };

  const openEditExam = (exam) => {
    setEditingExam(exam);
    examForm.setFieldsValue({
      name: exam.name,
      examType: exam.examType,
      academicYear: exam.academicYear,
      classes: exam.classes?.map((c) => c._id),
      description: exam.description,
      status: exam.status,
      dateRange: [dayjs(exam.startDate), dayjs(exam.endDate)],
    });
    setExamModalOpen(true);
  };

  // ===== SUBJECT ASSIGNMENT =====

  const openSubjectModal = async (exam) => {
    setSelectedExam(exam);
    setSubjectModalOpen(true);
    try {
      const res = await getExamSubjects(exam._id);
      setExamSubjects(res.data || []);
    } catch (e) {
      message.error("Error loading exam subjects");
    }
  };

  const handleAddSubjects = async () => {
    try {
      const values = await subjectForm.validateFields();
      const subjectsPayload = values.subjects.map((s) => ({
        subjectId: s.subjectId,
        classId: s.classId,
        maxMarks: s.maxMarks,
        passingMarks: s.passingMarks,
        examDate: s.examDate?.toISOString() || null,
      }));
      await addExamSubjects(selectedExam._id, subjectsPayload);
      message.success("Subjects assigned");
      subjectForm.resetFields();
      const res = await getExamSubjects(selectedExam._id);
      setExamSubjects(res.data || []);
    } catch (e) {
      if (e.errorFields) return;
      message.error(e.message || "Error assigning subjects");
    }
  };

  // ===== APPROVAL =====

  const handleApprove = async (id) => {
    try {
      await approveMarks(id);
      message.success("Marks approved");
      fetchApprovalQueue();
      if (selectedApprovalItem?._id === id) {
        setApprovalDetailsOpen(false);
        setSelectedApprovalItem(null);
        setApprovalMarks([]);
      }
    } catch (e) {
      message.error(e.message || "Error approving");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectMarks(id);
      message.success("Marks rejected");
      fetchApprovalQueue();
      if (selectedApprovalItem?._id === id) {
        setApprovalDetailsOpen(false);
        setSelectedApprovalItem(null);
        setApprovalMarks([]);
      }
    } catch (e) {
      message.error(e.message || "Error rejecting");
    }
  };

  // ===== PUBLISH =====

  const handlePublish = async (examId, classId) => {
    try {
      await publishExamResults(examId, classId);
      message.success("Results published");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error publishing");
    }
  };

  const handleUnpublish = async (examId, classId) => {
    try {
      await unpublishExamResults(examId, classId);
      message.success("Results unpublished");
      fetchExams();
    } catch (e) {
      message.error(e.message || "Error unpublishing");
    }
  };

  // ===== VIEW RESULTS =====

  const openResults = async (exam, classId) => {
    setSelectedExam(exam);
    setSelectedClassForResults(classId);
    setResultsModalOpen(true);
    setResultsLoading(true);
    try {
      const res = await getExamResults(exam._id, classId);
      setResultsData(res.data || []);
    } catch (e) {
      message.error("Error loading results");
    } finally {
      setResultsLoading(false);
    }
  };

  // ===== ANALYTICS =====

  const openAnalytics = async (exam, classId) => {
    setSelectedExam(exam);
    setAnalyticsModalOpen(true);
    setAnalyticsLoading(true);
    try {
      const res = await getClassAnalytics(exam._id, classId);
      setAnalyticsData(res.data || null);
      if (res.message) {
        message.info(res.message);
      }
    } catch (e) {
      message.error("Error loading analytics");
      setAnalyticsData(null);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ===== COLUMNS =====

  const examColumns = [
    {
      title: "Exam Name",
      dataIndex: "name",
      key: "name",
      render: (name, r) => (
        <div>
          <span className="font-semibold text-slate-900">{name}</span>
          <br />
          <span className="text-xs text-slate-500">
            {examTypes.find((e) => e.value === r.examType)?.label}
          </span>
        </div>
      ),
    },
    {
      title: "Academic Year",
      dataIndex: "academicYear",
      key: "year",
      width: 130,
    },
    {
      title: "Classes",
      dataIndex: "classes",
      key: "classes",
      render: (cls) =>
        cls?.map((c) => (
          <Tag key={c._id} color="blue">
            {c.name}-{c.section}
          </Tag>
        )),
    },
    {
      title: "Dates",
      key: "dates",
      width: 200,
      render: (_, r) => (
        <span className="text-sm">
          {dayjs(r.startDate).format("DD MMM")} –{" "}
          {dayjs(r.endDate).format("DD MMM YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s) => <Tag color={statusColors[s]}>{s?.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 300,
      render: (_, exam) => (
        <Space wrap>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditExam(exam)}>
            Edit
          </Button>
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => openSubjectModal(exam)}>
            Subjects
          </Button>
          {exam.classes?.map((c) => (
            <Space key={c._id} size={4}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => openResults(exam, c._id)}>
                {c.name}-{c.section}
              </Button>
              <Button
                size="small"
                icon={<BarChartOutlined />}
                onClick={() => openAnalytics(exam, c._id)}
              />
              <Button
                size="small"
                type="primary"
                icon={<SendOutlined />}
                className="bg-green-600"
                onClick={() => handlePublish(exam._id, c._id)}>
                Publish
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleUnpublish(exam._id, c._id)}>
                Unpublish
              </Button>
            </Space>
          ))}
          <Popconfirm
            title="Delete this exam?"
            onConfirm={() => handleDeleteExam(exam._id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const approvalColumns = [
    {
      title: "Exam",
      key: "exam",
      render: (_, r) => (
        <div>
          <span className="font-semibold">{r.examId?.name}</span>
          <br />
          <span className="text-xs text-slate-500">
            {examTypes.find((e) => e.value === r.examId?.examType)?.label}
          </span>
        </div>
      ),
    },
    {
      title: "Subject",
      key: "subject",
      render: (_, r) =>
        r.subjectId ? `${r.subjectId.name} (${r.subjectId.code})` : "—",
    },
    {
      title: "Class",
      key: "class",
      render: (_, r) =>
        r.classId ? `${r.classId.name}-${r.classId.section}` : "—",
    },
    {
      title: "Submitted By",
      key: "teacher",
      render: (_, r) => r.submittedBy?.userId?.name || "—",
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "at",
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY HH:mm") : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_, r) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openApprovalDetails(r)}>
            View Marks
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            className="bg-green-600"
            onClick={() => handleApprove(r._id)}>
            Approve
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleReject(r._id)}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const approvalMarksColumns = [
    {
      title: "Roll No",
      key: "roll",
      width: 100,
      render: (_, r) => r.studentId?.rollNumber ?? "—",
    },
    {
      title: "Student",
      key: "student",
      render: (_, r) => r.studentId?.userId?.name || "—",
    },
    {
      title: "Marks",
      key: "marks",
      width: 120,
      render: (_, r) => (
        <span className="font-semibold">
          {typeof r.marksObtained === "number" ? r.marksObtained : "—"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (_, r) => (
        <Tag color={r.isPassed ? "green" : "red"}>
          {r.isPassed ? "PASS" : "FAIL"}
        </Tag>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (v) => v || "—",
    },
  ];

  const tabItems = [
    {
      key: "exams",
      label: (
        <span>
          <CalendarOutlined /> Exams
        </span>
      ),
      children: (
        <Card
          className="border-0 shadow-sm"
          title={
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">All Exams</span>
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchExams}>
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="bg-blue-600"
                  onClick={() => {
                    setEditingExam(null);
                    examForm.resetFields();
                    setExamModalOpen(true);
                  }}>
                  Create Exam
                </Button>
              </Space>
            </div>
          }>
          <Table
            columns={examColumns}
            dataSource={exams}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>
      ),
    },
    {
      key: "approval",
      label: (
        <span>
          <CheckCircleOutlined /> Approval Queue{" "}
          <Badge count={approvalQueue.length} />
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm" title="Marks Approval Queue">
          <Table
            columns={approvalColumns}
            dataSource={approvalQueue}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 -m-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Result Management</h1>
        <p className="text-slate-500">
          Create exams, approve marks, publish results & view analytics
        </p>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* Approval Details Modal */}
      <Modal
        title="Review Submitted Marks"
        open={approvalDetailsOpen}
        onCancel={() => {
          setApprovalDetailsOpen(false);
          setSelectedApprovalItem(null);
          setApprovalMarks([]);
        }}
        footer={
          selectedApprovalItem
            ? [
                <Button
                  key="close"
                  onClick={() => {
                    setApprovalDetailsOpen(false);
                    setSelectedApprovalItem(null);
                    setApprovalMarks([]);
                  }}>
                  Close
                </Button>,
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(selectedApprovalItem._id)}>
                  Reject
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  className="bg-green-600"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApprove(selectedApprovalItem._id)}>
                  Approve
                </Button>,
              ]
            : null
        }
        width={900}>
        {selectedApprovalItem ? (
          <div className="space-y-3">
            <div className="text-sm text-slate-600">
              <div>
                <span className="font-semibold text-slate-900">
                  {selectedApprovalItem.examId?.name}
                </span>
                <span className="ml-2 text-slate-500">
                  {examTypes.find(
                    (e) => e.value === selectedApprovalItem.examId?.examType,
                  )?.label || selectedApprovalItem.examId?.examType}
                </span>
              </div>
              <div>
                {selectedApprovalItem.subjectId?.name} (
                {selectedApprovalItem.subjectId?.code}) •{" "}
                {selectedApprovalItem.classId?.name}-
                {selectedApprovalItem.classId?.section}
              </div>
              <div className="text-xs text-slate-500">
                Max: {selectedApprovalItem.maxMarks} | Pass:{" "}
                {selectedApprovalItem.passingMarks} | Submitted by:{" "}
                {selectedApprovalItem.submittedBy?.userId?.name || "—"}
              </div>
            </div>

            <Table
              columns={approvalMarksColumns}
              dataSource={approvalMarks}
              rowKey="_id"
              loading={approvalMarksLoading}
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: approvalMarksLoading
                  ? "Loading..."
                  : "No marks found for this submission",
              }}
            />
          </div>
        ) : (
          <Empty description="No approval selected" />
        )}
      </Modal>

      {/* Create/Edit Exam Modal */}
      <Modal
        title={editingExam ? "Edit Exam" : "Create Exam"}
        open={examModalOpen}
        onOk={handleExamSubmit}
        onCancel={() => {
          setExamModalOpen(false);
          setEditingExam(null);
        }}
        okText={editingExam ? "Update" : "Create"}
        okButtonProps={{ className: "bg-blue-600" }}
        width={600}>
        <Form form={examForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Exam Name"
            rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="e.g. Midterm Examination 2026" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="examType"
              label="Exam Type"
              rules={[{ required: true }]}>
              <Select options={examTypes} placeholder="Select type" />
            </Form.Item>
            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true }]}>
              <Input placeholder="2025-2026" />
            </Form.Item>
          </div>
          <Form.Item
            name="dateRange"
            label="Exam Dates"
            rules={[{ required: true }]}>
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="classes"
            label="Assign to Classes"
            rules={[{ required: true }]}>
            <Select
              mode="multiple"
              placeholder="Select classes"
              options={classes.map((c) => ({
                value: c._id,
                label: `${c.name} - ${c.section}`,
              }))}
            />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              placeholder="Select status"
            />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subject Assignment Modal */}
      <Modal
        title={`Manage Subjects – ${selectedExam?.name || ""}`}
        open={subjectModalOpen}
        onCancel={() => setSubjectModalOpen(false)}
        footer={null}
        width={800}>
        {examSubjects.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Assigned Subjects</h4>
            <Table
              size="small"
              dataSource={examSubjects}
              rowKey="_id"
              pagination={false}
              columns={[
                {
                  title: "Subject",
                  render: (_, r) =>
                    r.subjectId
                      ? `${r.subjectId.name} (${r.subjectId.code})`
                      : "—",
                },
                {
                  title: "Class",
                  render: (_, r) =>
                    r.classId ? `${r.classId.name}-${r.classId.section}` : "—",
                },
                { title: "Max", dataIndex: "maxMarks" },
                { title: "Pass", dataIndex: "passingMarks" },
                {
                  title: "Status",
                  dataIndex: "marksEntryStatus",
                  render: (s) => {
                    const colors = {
                      pending: "default",
                      draft: "orange",
                      submitted: "blue",
                      approved: "green",
                    };
                    return <Tag color={colors[s]}>{s?.toUpperCase()}</Tag>;
                  },
                },
              ]}
            />
          </div>
        )}

        <h4 className="font-semibold mb-2">Add Subjects</h4>
        <Form form={subjectForm} layout="vertical">
          <Form.List name="subjects" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <div
                    key={key}
                    className="grid grid-cols-5 gap-2 items-end mb-2">
                    <Form.Item
                      {...rest}
                      name={[name, "subjectId"]}
                      rules={[{ required: true }]}>
                      <Select
                        placeholder="Subject"
                        options={subjects.map((s) => ({
                          value: s._id,
                          label: `${s.name} (${s.code})`,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "classId"]}
                      rules={[{ required: true }]}>
                      <Select
                        placeholder="Class"
                        options={classes.map((c) => ({
                          value: c._id,
                          label: `${c.name}-${c.section}`,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "maxMarks"]}
                      rules={[{ required: true }]}>
                      <InputNumber
                        placeholder="Max"
                        min={1}
                        className="w-full"
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, "passingMarks"]}
                      rules={[{ required: true }]}>
                      <InputNumber
                        placeholder="Pass"
                        min={0}
                        className="w-full"
                      />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Subject Row
                </Button>
              </>
            )}
          </Form.List>
          <Button
            type="primary"
            className="bg-blue-600 mt-4"
            onClick={handleAddSubjects}>
            Save Subjects
          </Button>
        </Form>
      </Modal>

      {/* Results View Modal */}
      <Modal
        title={`Results – ${selectedExam?.name || ""}`}
        open={resultsModalOpen}
        onCancel={() => setResultsModalOpen(false)}
        footer={null}
        width={1000}>
        <ResultTable results={resultsData} loading={resultsLoading} />
      </Modal>

      {/* Analytics Modal */}
      <Modal
        title={
          <span>
            <BarChartOutlined /> Class Analytics – {selectedExam?.name || ""}
          </span>
        }
        open={analyticsModalOpen}
        onCancel={() => {
          setAnalyticsModalOpen(false);
          setAnalyticsData(null);
        }}
        footer={null}
        width={900}>
        {analyticsLoading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : !analyticsData ? (
          <Empty description="No results data available" />
        ) : (
          <div>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center">
                <Statistic
                  title="Total Students"
                  value={analyticsData.overview.totalStudents}
                />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Class Average"
                  value={analyticsData.overview.overallAverage}
                  suffix="%"
                  styles={{ color: "#2563eb" }}
                />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Passed"
                  value={analyticsData.overview.passCount}
                  styles={{ color: "#16a34a" }}
                />
              </Card>
              <Card className="text-center">
                <Statistic
                  title="Failed"
                  value={analyticsData.overview.failCount}
                  styles={{ color: "#dc2626" }}
                />
              </Card>
            </div>

            {/* Subject-wise Analytics */}
            <h4 className="font-semibold mb-3">Subject Performance</h4>
            <div className="space-y-3 mb-6">
              {analyticsData.subjectAnalytics?.map((sa, i) => (
                <Card key={i} size="small" className="border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">
                        {sa.subject?.name} ({sa.subject?.code})
                      </span>
                      <div className="text-xs text-slate-500 mt-1">
                        Avg: {sa.average} | Highest: {sa.highest} | Lowest:{" "}
                        {sa.lowest}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress
                        type="circle"
                        percent={parseFloat(sa.passPercentage)}
                        size={50}
                        format={(p) => `${p}%`}
                      />
                      <div className="text-xs text-slate-500">
                        Pass: {sa.passCount} / Fail: {sa.failCount}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Student Ranking */}
            <h4 className="font-semibold mb-3">Student Ranking</h4>
            <Table
              size="small"
              dataSource={analyticsData.studentRanking}
              rowKey={(r) => r.student?._id}
              pagination={{ pageSize: 10 }}
              columns={[
                {
                  title: "Rank",
                  dataIndex: "rank",
                  width: 60,
                  render: (v) => (
                    <span className="font-bold">
                      {v <= 3 ? (
                        <TrophyOutlined className="text-amber-500" />
                      ) : null}{" "}
                      #{v}
                    </span>
                  ),
                },
                {
                  title: "Student",
                  render: (_, r) => r.student?.userId?.name || "—",
                },
                {
                  title: "Total",
                  render: (_, r) => `${r.totalMarks} / ${r.totalMaxMarks}`,
                },
                {
                  title: "%",
                  dataIndex: "percentage",
                  render: (v) => `${v}%`,
                },
                {
                  title: "Grade",
                  dataIndex: "overallGrade",
                  render: (g) => <GradeBadge grade={g} />,
                },
                {
                  title: "Result",
                  render: (_, r) =>
                    r.allPassed ? (
                      <Tag color="success">PASS</Tag>
                    ) : (
                      <Tag color="error">FAIL</Tag>
                    ),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminResultsPage;
