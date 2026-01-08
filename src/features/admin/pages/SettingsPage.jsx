/**
 * Admin Settings Page
 */

import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Select,
  message,
  Divider,
} from "antd";
import {
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../../../components/UI";

const SettingsPage = () => {
  const [generalForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const handleGeneralSave = (values) => {
    console.log("General settings:", values);
    message.success("Settings saved successfully");
  };

  const handleNotificationSave = (values) => {
    console.log("Notification settings:", values);
    message.success("Notification settings saved successfully");
  };

  const items = [
    {
      key: "general",
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          General
        </span>
      ),
      children: (
        <Card>
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={handleGeneralSave}
            initialValues={{
              schoolName: "Smart School Management System",
              email: "admin@ssms.edu",
              phone: "555-0000",
              address: "123 Education Street, Learning City",
              timezone: "UTC",
            }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="schoolName"
                label="School Name"
                rules={[{ required: true }]}>
                <Input placeholder="Enter school name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Contact Email"
                rules={[{ required: true, type: "email" }]}>
                <Input placeholder="Enter contact email" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number">
                <Input placeholder="Enter phone number" />
              </Form.Item>
              <Form.Item name="timezone" label="Timezone">
                <Select>
                  <Select.Option value="UTC">UTC</Select.Option>
                  <Select.Option value="EST">Eastern Time</Select.Option>
                  <Select.Option value="PST">Pacific Time</Select.Option>
                  <Select.Option value="IST">India Standard Time</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="address" label="Address">
              <Input.TextArea rows={3} placeholder="Enter school address" />
            </Form.Item>
            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: "notifications",
      label: (
        <span className="flex items-center gap-2">
          <BellOutlined />
          Notifications
        </span>
      ),
      children: (
        <Card>
          <Form
            form={notificationForm}
            layout="vertical"
            onFinish={handleNotificationSave}
            initialValues={{
              emailNotifications: true,
              smsNotifications: false,
              attendanceAlerts: true,
              feeReminders: true,
              examNotifications: true,
            }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <Form.Item
                  name="emailNotifications"
                  valuePropName="checked"
                  noStyle>
                  <Switch />
                </Form.Item>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-gray-500">
                    Receive notifications via SMS
                  </p>
                </div>
                <Form.Item
                  name="smsNotifications"
                  valuePropName="checked"
                  noStyle>
                  <Switch />
                </Form.Item>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Attendance Alerts</h4>
                  <p className="text-sm text-gray-500">
                    Get alerts for attendance issues
                  </p>
                </div>
                <Form.Item
                  name="attendanceAlerts"
                  valuePropName="checked"
                  noStyle>
                  <Switch />
                </Form.Item>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h4 className="font-medium">Fee Reminders</h4>
                  <p className="text-sm text-gray-500">
                    Send fee payment reminders
                  </p>
                </div>
                <Form.Item name="feeReminders" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="font-medium">Exam Notifications</h4>
                  <p className="text-sm text-gray-500">
                    Notify about upcoming exams
                  </p>
                </div>
                <Form.Item
                  name="examNotifications"
                  valuePropName="checked"
                  noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: "security",
      label: (
        <span className="flex items-center gap-2">
          <SafetyOutlined />
          Security
        </span>
      ),
      children: (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Password Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 className="font-medium">Minimum Password Length</h4>
                    <p className="text-sm text-gray-500">
                      Set minimum characters required
                    </p>
                  </div>
                  <Select defaultValue="8" className="w-24">
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="10">10</Select.Option>
                    <Select.Option value="12">12</Select.Option>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">
                      Require 2FA for all admin accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-gray-500">
                      Auto logout after inactivity
                    </p>
                  </div>
                  <Select defaultValue="30" className="w-32">
                    <Select.Option value="15">15 minutes</Select.Option>
                    <Select.Option value="30">30 minutes</Select.Option>
                    <Select.Option value="60">1 hour</Select.Option>
                    <Select.Option value="120">2 hours</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="primary">Save Security Settings</Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage system configuration and preferences"
        breadcrumbs={[
          { label: "Admin", path: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      <Tabs items={items} className="settings-tabs" />
    </div>
  );
};

export default SettingsPage;
