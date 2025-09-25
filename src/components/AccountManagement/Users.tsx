// src/components/Users.tsx
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

const columns = [
  {
    title: "User Login",
    dataIndex: "Userlogin",
    sorter: (a: User, b: User) => a.Userlogin.localeCompare(b.Userlogin),
  },
  {
    title: "First Name",
    dataIndex: "Firstname",
    sorter: (a: User, b: User) => a.Firstname.localeCompare(b.Firstname),
  },
  {
    title: "Last Name",
    dataIndex: "Lastname",
    sorter: (a: User, b: User) => a.Lastname.localeCompare(b.Lastname),
  },
  {
    title: "Status",
    dataIndex: "Status",
    sorter: (a: User, b: User) => a.Status.localeCompare(b.Status),
  },
  {
    title: "Actions",
    render: () => (
      <Space>
        <Tooltip title="Link">
          <Button type="text" icon={<LinkOutlined />} />
        </Tooltip>
        <Tooltip title="Edit">
          <Button type="text" icon={<EditOutlined />} />
        </Tooltip>
        <Tooltip title="Delete">
          <Button danger type="text" icon={<DeleteOutlined />} />
        </Tooltip>
      </Space>
    ),
  },
];

const Users = () => {
  return (
    <GenericTable<User>
      uri="http://localhost:4000/users"
      columns={columns}
      searchField="Userlogin"
      filterField="Status"
    />
  );
};

export default Users;
