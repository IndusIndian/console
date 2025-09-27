// src/components/Turrets.tsx
import React from "react";
import GenericTable from "../Templates/GenericTable";
import { Space, Tooltip, Button } from "antd";
import { LinkOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Entity {
  Uid: string;
  Userlogin: string;
  Bootstraplevel: string;
  Applicationlevel: string;
  Ipaddress: string;
  Status?: string;
  key: string;
}

const columns = [
  {
    title: "User Login",
    dataIndex: "Userlogin",
    sorter: (a: Entity, b: Entity) => (a.Userlogin || '').localeCompare(b.Userlogin || ''),
  },
  {
    title: "Bootstrap Level",
    dataIndex: "Bootstraplevel",
    sorter: (a: Entity, b: Entity) => (a.Bootstraplevel || '').localeCompare(b.Bootstraplevel || ''),
  },
  {
    title: "Application Level",
    dataIndex: "Applicationlevel",
    sorter: (a: Entity, b: Entity) => (a.Applicationlevel || '').localeCompare(b.Applicationlevel || ''),
  },
  {
    title: "IP Address",
    dataIndex: "Ipaddress",
    sorter: (a: Entity, b: Entity) => (a.Ipaddress || '').localeCompare(b.Ipaddress || ''),
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

const Turrets = React.memo(() => {
  const columnConfigs = [
    { dataIndex: "Userlogin" as keyof Entity, filterable: true, sortable: true },
    { dataIndex: "Bootstraplevel" as keyof Entity, filterable: true, sortable: true },
    { dataIndex: "Applicationlevel" as keyof Entity, filterable: true, sortable: true },
    { dataIndex: "Ipaddress" as keyof Entity, filterable: true, sortable: true }
  ];

  return (
    <GenericTable<Entity>
      uri="http://localhost:4000/turrets"
      columns={columns}
      columnConfigs={columnConfigs}
      statusConfig={{
        showStatus: true,
        statusField: "Status",
        iconType: "phone"
      }}
    />
  );
});

Turrets.displayName = 'Turrets';

export default Turrets;
