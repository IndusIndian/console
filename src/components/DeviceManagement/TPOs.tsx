// src/components/DeviceManagement/TPOs.tsx
import React from "react";
import GenericTable from "../Templates/GenericTable";
import { Space, Tooltip, Button } from "antd";
import { LinkOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface TPOs {
  Useruid: string;
  Tpouid: string;
  Version: string;
  Firstname: string;
  Lastname: string;
  Status: string;
  Userlogin: string;
  Logindatetime: string;
  Lastlogindatetime: string;
  Modelid: number;
  Operatingsystem: string;
  Bootstraplevel: string;
  Serialnumber: string;
  Currentstate: string;
  Applicationlevel: string;
  Hostname: string;
  Ipaddress: string;
  Ipnetmask: string;
  Gateway: string;
  Dns: string;
  Tftp: string;
  Geogroupuid: string;
  Geogroupposition: string;
  key: string;
}

const columns = [
  {
    title: "User Login",
    dataIndex: "Userlogin",
    sorter: (a: TPOs, b: TPOs) => (a.Userlogin || '').localeCompare(b.Userlogin || ''),
  },
  {
    title: "First Name",
    dataIndex: "Firstname",
    sorter: (a: TPOs, b: TPOs) => (a.Firstname || '').localeCompare(b.Firstname || ''),
  },
  {
    title: "Last Name",
    dataIndex: "Lastname",
    sorter: (a: TPOs, b: TPOs) => (a.Lastname || '').localeCompare(b.Lastname || ''),
  },
  {
    title: "Model ID",
    dataIndex: "Modelid",
    sorter: (a: TPOs, b: TPOs) => String(a.Modelid || '').localeCompare(String(b.Modelid || '')),
  },
  {
    title: "Bootstrap Level",
    dataIndex: "Bootstraplevel",
    sorter: (a: TPOs, b: TPOs) => (a.Bootstraplevel || '').localeCompare(b.Bootstraplevel || ''),
  },
  {
    title: "Application Level",
    dataIndex: "Applicationlevel",
    sorter: (a: TPOs, b: TPOs) => (a.Applicationlevel || '').localeCompare(b.Applicationlevel || ''),
  },
  {
    title: "IP Address",
    dataIndex: "Ipaddress",
    sorter: (a: TPOs, b: TPOs) => (a.Ipaddress || '').localeCompare(b.Ipaddress || ''),
  },
  {
    title: "Hostname",
    dataIndex: "Hostname",
    sorter: (a: TPOs, b: TPOs) => (a.Hostname || '').localeCompare(b.Hostname || ''),
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

const TPOs = React.memo(() => {
  const columnConfigs = [
    { dataIndex: "Userlogin" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Firstname" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Lastname" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Bootstraplevel" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Applicationlevel" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Status" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Operatingsystem" as keyof TPOs, filterable: true, sortable: true },
    { dataIndex: "Modelid" as keyof TPOs, filterable: true, sortable: true }
  ];

  return (
    <GenericTable<TPOs>
      uri="http://localhost:4000/tpos"
      columns={columns}
      columnConfigs={columnConfigs}
      statusConfig={{
        showStatus: true,
        statusField: "Status",
        iconType: "server"
      }}
    />
  );
});

TPOs.displayName = 'TPOs';

export default TPOs;
