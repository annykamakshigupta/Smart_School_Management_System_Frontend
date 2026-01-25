/**
 * Parent Dashboard
 * Main dashboard view for parents - Shows real data from API
 */

import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Progress,
  List,
  Avatar,
  Tag,
  Statistic,
  Timeline,
  Spin,
  Empty,
  Select,
  Badge,
  message,
  Tabs,
} from "antd";
import {
  UserOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BellOutlined,
  BookOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { StatCard, PageHeader } from "../../../components/UI";
import { getMyChildren, getChildAttendance, getChildTimetable } from "../../../services/parent.service";

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childAttendance, setChildAttendance] = useState([]);
  const [childTimetable, setChildTimetable] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchChildDetails();
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await getMyChildren();
      const childrenData = response.data || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
      message.error("Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchChildDetails = async () => {
    if (!selectedChild) return;
    
    setAttendanceLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();
      
      const [attendanceRes, timetableRes] = await Promise.all([
        getChildAttendance(selectedChild._id, {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        }).catch(() => ({ data: [] })),
        selectedChild.classId?._id 
          ? getChildTimetable(selectedChild.classId._id).catch(() => ({ data: [] }))
          : { data: [] },
      ]);
      
      setChildAttendance(attendanceRes.data || []);
      setChildTimetable(timetableRes.data || []);
    } catch (error) {
      console.error("Error fetching child details:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const calculateAttendanceRate = () => {
    if (!childAttendance || childAttendance.length === 0) return 0;
    const presentDays = childAttendance.filter(a => a.status === 'present').length;
    return Math.round((presentDays / childAttendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div>
        <PageHeader
          title="Parent Dashboard"
          subtitle="Monitor your children's academic progress"
        />
        <Card>
          <Empty
            description="No children linked to your account yet. Please contact the school administrator."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Parent Dashboard"
        subtitle="Monitor your children's academic progress"
      />

      {/* Child Selector */}
      {children.length > 1 && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-600">Select Child:</span>
            <Select
              value={selectedChild?._id}
              onChange={(value) => {
                const child = children.find(c => c._id === value);
                setSelectedChild(child);
              }}
              style={{ width: 300 }}
              size="large"
            >
              {children.map((child) => (
                <Select.Option key={child._id} value={child._id}>
                  <div className="flex items-center gap-2">
                    <Avatar size="small" icon={<UserOutlined />} className="bg-indigo-100" />
                    <span>{child.userId?.name}</span>
                    <Tag color="blue" size="small">
                      {child.classId?.name} - {child.section}
                    </Tag>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </Card>
      )}

      {/* Children Overview Tabs */}
      <Card className="mb-6">
        <Tabs
          activeKey={selectedChild?._id}
          onChange={(key) => {
            const child = children.find(c => c._id === key);
            setSelectedChild(child);
          }}
          items={children.map((child) => ({
            key: child._id,
            label: (
              <span className="flex items-center gap-2">
                <Avatar size="small" icon={<UserOutlined />} />
                {child.userId?.name}
              </span>
            ),
            children: (
              <div>
                {/* Child Profile Card */}
                <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                  <div className="flex items-start gap-6">
                    <Avatar
                      size={80}
                      icon={<UserOutlined />}
                      className="bg-white/20 border-2 border-white/30"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-1">{child.userId?.name}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-white/70 text-xs">Class</div>
                          <div className="font-semibold">
                            {child.classId?.name} - {child.section}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">Roll Number</div>
                          <div className="font-semibold">{child.rollNumber}</div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">Academic Year</div>
                          <div className="font-semibold">{child.academicYear}</div>
                        </div>
                        <div>
                          <div className="text-white/70 text-xs">Status</div>
                          <Badge 
                            status={child.userId?.status === 'active' ? 'success' : 'warning'} 
                            text={<span className="text-white">{child.userId?.status || 'Active'}</span>}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <Row gutter={[16, 16]} className="mb-6">
                  <Col xs={12} md={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleOutlined className="text-2xl text-green-600" />
                      </div>
                      <Statistic
                        title="Attendance"
                        value={calculateAttendanceRate()}
                        suffix="%"
                        valueStyle={{ color: '#22c55e' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOutlined className="text-2xl text-blue-600" />
                      </div>
                      <Statistic
                        title="Subjects"
                        value={child.classId?.subjects?.length || 0}
                        valueStyle={{ color: '#3b82f6' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                        <TeamOutlined className="text-2xl text-purple-600" />
                      </div>
                      <Statistic
                        title="Class Teacher"
                        value={child.classId?.classTeacher?.name ? 1 : 0}
                        formatter={() => child.classId?.classTeacher?.name || 'Not Assigned'}
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} md={6}>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                        <CalendarOutlined className="text-2xl text-yellow-600" />
                      </div>
                      <Statistic
                        title="Admission Date"
                        value={child.admissionDate ? new Date(child.admissionDate).toLocaleDateString() : 'N/A'}
                        valueStyle={{ fontSize: '14px' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  {/* Class Teacher Info */}
                  <Col xs={24} md={12}>
                    <Card 
                      title={
                        <span className="flex items-center gap-2">
                          <TeamOutlined className="text-indigo-600" />
                          Class Teacher
                        </span>
                      }
                      className="h-full"
                    >
                      {child.classId?.classTeacher ? (
                        <div className="flex items-center gap-4">
                          <Avatar
                            size={64}
                            icon={<UserOutlined />}
                            className="bg-indigo-100 text-indigo-600"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">
                              {child.classId.classTeacher.name}
                            </h4>
                            <div className="text-gray-500 text-sm flex items-center gap-1">
                              <MailOutlined />
                              {child.classId.classTeacher.email}
                            </div>
                            {child.classId.classTeacher.phone && (
                              <div className="text-gray-500 text-sm flex items-center gap-1">
                                <PhoneOutlined />
                                {child.classId.classTeacher.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Empty 
                          description="No class teacher assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>

                  {/* Child Contact Info */}
                  <Col xs={24} md={12}>
                    <Card 
                      title={
                        <span className="flex items-center gap-2">
                          <IdcardOutlined className="text-indigo-600" />
                          Student Information
                        </span>
                      }
                      className="h-full"
                    >
                      <List size="small">
                        <List.Item>
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium">{child.userId?.email || 'N/A'}</span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Phone:</span>
                          <span className="font-medium">{child.userId?.phone || 'N/A'}</span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Section:</span>
                          <span className="font-medium">{child.section}</span>
                        </List.Item>
                        <List.Item>
                          <span className="text-gray-500">Academic Year:</span>
                          <span className="font-medium">{child.academicYear}</span>
                        </List.Item>
                      </List>
                    </Card>
                  </Col>

                  {/* Recent Attendance */}
                  <Col xs={24} md={12}>
                    <Card 
                      title={
                        <span className="flex items-center gap-2">
                          <CheckCircleOutlined className="text-green-600" />
                          Recent Attendance
                        </span>
                      }
                      extra={
                        <Link to="/parent/attendance" className="text-indigo-600">
                          View All
                        </Link>
                      }
                      loading={attendanceLoading}
                    >
                      {childAttendance.length > 0 ? (
                        <List
                          size="small"
                          dataSource={childAttendance.slice(0, 5)}
                          renderItem={(record) => (
                            <List.Item>
                              <div className="flex items-center justify-between w-full">
                                <span className="text-gray-600">
                                  {new Date(record.date).toLocaleDateString()}
                                </span>
                                <Tag color={record.status === 'present' ? 'success' : record.status === 'absent' ? 'error' : 'warning'}>
                                  {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                                </Tag>
                              </div>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty 
                          description="No attendance records found"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>

                  {/* Subjects */}
                  <Col xs={24} md={12}>
                    <Card 
                      title={
                        <span className="flex items-center gap-2">
                          <BookOutlined className="text-blue-600" />
                          Class Subjects
                        </span>
                      }
                    >
                      {child.classId?.subjects?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {child.classId.subjects.map((subject, index) => (
                            <Tag key={index} color="blue" className="py-1 px-3">
                              {subject.name || subject}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Empty 
                          description="No subjects assigned yet"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          }))}
        />
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Link to="/parent/attendance">
              <div className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-all hover:shadow-md cursor-pointer">
                <CheckCircleOutlined className="text-3xl text-green-600 mb-2" />
                <div className="font-medium text-gray-900">View Attendance</div>
                <div className="text-xs text-gray-500">Check attendance records</div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/children">
              <div className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-all hover:shadow-md cursor-pointer">
                <TeamOutlined className="text-3xl text-purple-600 mb-2" />
                <div className="font-medium text-gray-900">My Children</div>
                <div className="text-xs text-gray-500">View all children details</div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/performance/grades">
              <div className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-all hover:shadow-md cursor-pointer">
                <TrophyOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-gray-900">Grades</div>
                <div className="text-xs text-gray-500">View academic performance</div>
              </div>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link to="/parent/fees/status">
              <div className="p-4 bg-yellow-50 rounded-xl text-center hover:bg-yellow-100 transition-all hover:shadow-md cursor-pointer">
                <CalendarOutlined className="text-3xl text-yellow-600 mb-2" />
                <div className="font-medium text-gray-900">Fee Status</div>
                <div className="text-xs text-gray-500">Check payment status</div>
              </div>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ParentDashboard;
