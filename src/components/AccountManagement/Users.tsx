// src/components/Users.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../Templates/GenericTable";
import { Space, Tooltip, Button } from "antd";
import { LinkOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface User {
  Uid: string;
  Userlogin: string;
  Firstname: string;
  Lastname: string;
  Status: string;
  key: string;
}

const Users = React.memo(() => {
  const navigate = useNavigate();

  const handleEditUser = (userId: string) => {
    navigate(`/account/users/${userId}/edit`);
  };

  const columns = [
    {
      title: "User Login",
      dataIndex: "Userlogin",
      sorter: (a: User, b: User) => (a.Userlogin || '').localeCompare(b.Userlogin || ''),
      onCell: (record: User) => ({
        onClick: () => handleEditUser(record.Uid),
        style: { cursor: 'pointer' }
      }),
    },
    {
      title: "First Name",
      dataIndex: "Firstname",
      sorter: (a: User, b: User) => (a.Firstname || '').localeCompare(b.Firstname || ''),
      onCell: (record: User) => ({
        onClick: () => handleEditUser(record.Uid),
        style: { cursor: 'pointer' }
      }),
    },
    {
      title: "Last Name",
      dataIndex: "Lastname",
      sorter: (a: User, b: User) => (a.Lastname || '').localeCompare(b.Lastname || ''),
      onCell: (record: User) => ({
        onClick: () => handleEditUser(record.Uid),
        style: { cursor: 'pointer' }
      }),
    },
    {
      title: "Status",
      dataIndex: "Status",
      sorter: (a: User, b: User) => (a.Status || '').localeCompare(b.Status || ''),
      onCell: (record: User) => ({
        onClick: () => handleEditUser(record.Uid),
        style: { cursor: 'pointer' }
      }),
    },
    {
      title: "Actions",
      render: (record: User) => (
        <Space>
          <Tooltip title="Link">
            <Button type="text" icon={<LinkOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(record.Uid);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              danger 
              type="text" 
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                // Handle delete logic here
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnConfigs = [
    { dataIndex: "Userlogin" as keyof User, filterable: true, sortable: true },
    { dataIndex: "Firstname" as keyof User, filterable: true, sortable: true },
    { dataIndex: "Lastname" as keyof User, filterable: true, sortable: true },
    { dataIndex: "Status" as keyof User, filterable: true, sortable: true }
  ];

  return (
    <GenericTable<User>
      uri="http://localhost:4000/users"
      columns={columns}
      columnConfigs={columnConfigs}
      statusConfig={{
        showStatus: true,
        statusField: "Status",
        iconType: "user"
      }}
    />
  );
});

Users.displayName = 'Users';

export default Users;