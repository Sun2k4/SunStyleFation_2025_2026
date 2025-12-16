import React, { useEffect, useState } from "react";
import {
  Search,
  Shield,
  User as UserIcon,
  Mail,
  Edit2,
  Trash2,
} from "lucide-react";
// 1. IMPORT ANTD
import {
  Table,
  Tag,
  Button,
  Input,
  Modal,
  Form,
  Radio,
  Popconfirm,
  message,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import { userService } from "../../../services/userService";
import { User, UserRole } from "../../../types";
import { useAuth } from "../../../context/AuthContext";

const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Antd Form Instance
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Mở Modal Edit
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    // Fill dữ liệu vào form
    form.setFieldsValue({
      name: user.name,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  // Xử lý Update
  const handleUpdate = async () => {
    try {
      // Validate form
      const values = await form.validateFields();

      if (!editingUser) return;

      await userService.updateUser(editingUser.id, {
        name: values.name,
        role: values.role,
      });

      message.success("User updated successfully");
      setIsEditModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      console.error(error);
      message.error("Failed to update user");
    }
  };

  // Xử lý Delete (Nhận ID trực tiếp)
  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      message.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete user");
    }
  };

  // Lọc dữ liệu theo search term
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cấu hình các cột cho bảng Antd Table
  const columns: ColumnsType<User> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={
              record.avatarUrl ||
              `https://ui-avatars.com/api/?name=${record.name}`
            }
            alt=""
            className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.name}{" "}
              {record.id === currentUser?.id && (
                <span className="text-xs text-gray-400">(You)</span>
              )}
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              <Mail size={12} /> {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const isAdmin = role === "admin";
        return (
          <Tag
            color={isAdmin ? "purple" : "green"}
            icon={isAdmin ? <Shield size={12} /> : <UserIcon size={12} />}
          >
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="default">ACTIVE</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const isTargetAdmin = record.role === "admin";
        const canModify = !isTargetAdmin;

        return (
          <Space>
            <Button
              type="text"
              icon={<Edit2 size={16} />}
              onClick={() => handleEditClick(record)}
              disabled={!canModify}
              className={
                canModify ? "text-blue-600 hover:bg-blue-50" : "text-gray-300"
              }
            />

            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              disabled={!canModify}
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<Trash2 size={16} />}
                disabled={!canModify}
                className={canModify ? "hover:bg-red-50" : ""}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage user access and roles</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 flex items-center gap-2">
          <Shield size={16} />
          <span>Admin accounts are protected</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <Input
            prefix={<Search className="text-gray-400 w-4 h-4" />}
            placeholder="Search users by name or email..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
          />
        </div>

        {/* Antd Table */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Edit Modal using Antd */}
      <Modal
        title="Edit User Details"
        open={isEditModalOpen}
        onOk={handleUpdate}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Update User"
        okButtonProps={{ type: "primary" }} // Mặc định là màu xanh của Antd (hoặc config theme)
      >
        <Form form={form} layout="vertical" name="edit_user_form">
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: "Please input user name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-4">
                <Radio.Button value="user" className="text-center h-auto py-2">
                  <div className="flex flex-col items-center gap-1">
                    <UserIcon size={18} />
                    <span>User</span>
                  </div>
                </Radio.Button>
                <Radio.Button value="admin" className="text-center h-auto py-2">
                  <div className="flex flex-col items-center gap-1">
                    <Shield size={18} />
                    <span>Admin</span>
                  </div>
                </Radio.Button>
              </div>
            </Radio.Group>
          </Form.Item>

          <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 mt-2">
            Note: Granting <strong>Admin</strong> privileges allows full access
            to the dashboard.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
