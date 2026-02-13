/**
 * Parent Profile Page
 * Modern profile page for parents to view and manage their information
 */

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Statistic,
  message,
  List,
  Badge,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";
import { getMyChildren } from "../../../services/parent.service";
import { Link } from "react-router-dom";

const ParentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [parentProfile, setParentProfile] = useState(null);
  const [children, setChildren] = useState([]);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Get parent profile from localStorage
      const userData = localStorage.getItem("ssms_user");
      if (userData) {
        const user = JSON.parse(userData);
        setParentProfile(user.roleProfile || user);
      }

      // Fetch children
      const childrenRes = await getMyChildren().catch(() => ({ data: [] }));
      setChildren(childrenRes.data || []);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (!parentProfile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="My Profile"
          subtitle="View your profile information"
        />
        <Card>
          <Empty description="Profile not found" />
        </Card>
      </div>
    );
  }

  const user = parentProfile.userId || parentProfile;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your profile information"
      />

      {/* Profile Header */}
      <Card className="border-0 shadow-lg">
        <div className="bg-linear-to-r from-purple-500 to-indigo-600 rounded-xl p-8 -m-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              className="bg-white/20 border-4 border-white/30"
              src={user?.avatar}
            />
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Tag
                  icon={<HeartOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  Parent/Guardian
                </Tag>
                <Tag
                  icon={<TeamOutlined />}
                  className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm">
                  {children.length}{" "}
                  {children.length === 1 ? "Child" : "Children"}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <Row gutter={[24, 24]} className="mt-6">
          <Col xs={24} sm={12}>
            <Card className="text-center bg-purple-50 border-purple-200">
              <Statistic
                title={
                  <span className="text-purple-700 font-semibold">
                    Total Children
                  </span>
                }
                value={children.length}
                styles={{ color: "#7c3aed" }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="text-center bg-blue-50 border-blue-200">
              <Statistic
                title={
                  <span className="text-blue-700 font-semibold">
                    Active Students
                  </span>
                }
                value={
                  children.filter((c) => c.userId?.status === "active").length
                }
                styles={{ color: "#2563eb" }}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Personal Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-purple-600" />
                <span>Personal Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Full Name
                  </span>
                }>
                {user?.name}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <MailOutlined className="mr-2" />
                    Email
                  </span>
                }>
                {user?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <PhoneOutlined className="mr-2" />
                    Phone
                  </span>
                }>
                {user?.phone || parentProfile.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <HomeOutlined className="mr-2" />
                    Address
                  </span>
                }>
                {parentProfile.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    Occupation
                  </span>
                }>
                {parentProfile.occupation || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Status
                  </span>
                }>
                <Badge
                  status={user?.status === "active" ? "success" : "default"}
                  text={user?.status || "Active"}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Additional Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <IdcardOutlined className="text-emerald-600" />
                <span>Additional Information</span>
              </div>
            }
            className="h-full shadow-md border-slate-200">
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    National ID
                  </span>
                }>
                {parentProfile.nationalId || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <PhoneOutlined className="mr-2" />
                    Emergency Contact
                  </span>
                }>
                {parentProfile.emergencyContact || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <HeartOutlined className="mr-2" />
                    Relationship
                  </span>
                }>
                {parentProfile.relationship || "Parent"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Registration Date
                  </span>
                }>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Children List */}
        <Col xs={24}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <TeamOutlined className="text-blue-600" />
                <span>My Children</span>
                <Tag color="blue">{children.length} students</Tag>
              </div>
            }
            extra={
              <Link to="/parent/children">
                <span className="text-blue-600 hover:text-blue-700">
                  View All →
                </span>
              </Link>
            }
            className="shadow-md border-slate-200">
            {children.length > 0 ? (
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 3,
                  lg: 4,
                }}
                dataSource={children}
                renderItem={(child) => (
                  <List.Item>
                    <Link to={`/parent/children/${child._id}`}>
                      <Card
                        hoverable
                        className="border-slate-200 transition-all hover:shadow-md">
                        <div className="text-center">
                          <Avatar
                            size={64}
                            className="bg-blue-100 text-blue-600 mb-3"
                            icon={<UserOutlined />}
                          />
                          <div className="font-semibold text-slate-900 mb-1">
                            {child.userId?.name || child.name}
                          </div>
                          <div className="text-sm text-slate-500 mb-2">
                            {child.classId?.name || "N/A"} -{" "}
                            {child.section || "N/A"}
                          </div>
                          <Tag color="blue" className="text-xs">
                            Roll: {child.rollNumber || "N/A"}
                          </Tag>
                        </div>
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No children registered yet" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ParentProfilePage;
