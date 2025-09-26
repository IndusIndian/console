// src/components/DeviceManagement/BTPT.tsx

import GenericTable from "../Templates/GenericTable";
import { Space, Tooltip, Button } from "antd";
import { LinkOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface BTPT {
  Uid: string;
  Version: string;
  Firstname: string;
  Lastname: string;
  Status: string;
  Roleuid: string;
  Userlogin: string;
  Userpassword: string;
  Passwordlastupdatedatetime: string;
  Passwordfailedattempt: number;
  Passwordpolicyuid: string;
  Logindatetime: string;
  Lastlogindatetime: string;
  Modelid: number;
  Operatingsystem: string;
  Bootstraplevel: string;
  Serialnumber: string;
  Currentstate: string;
  Applicationlevel: string;
  Enableautologin: string;
  Hostname: string;
  Ipaddress: string;
  Ipnetmask: string;
  Gateway: string;
  Dns: string;
  Tftp: string;
  Geogroupuid: string;
  Geogroupposition: string;
  Authenticationtypeuid: string;
  Ldapuserdn: string;
  Preferreddisplaytimezoneid: string;
  Lastlogin: string;
  Lastlogindomain: string;
  Directoryuid: string;
  Fallbackpincode: string;
  key: string;
}

const columns = [
  {
    title: "User Login",
    dataIndex: "Userlogin",
    sorter: (a: BTPT, b: BTPT) => a.Userlogin.localeCompare(b.Userlogin),
  },
  {
    title: "First Name",
    dataIndex: "Firstname",
    sorter: (a: BTPT, b: BTPT) => a.Firstname.localeCompare(b.Firstname),
  },
  {
    title: "Last Name",
    dataIndex: "Lastname",
    sorter: (a: BTPT, b: BTPT) => a.Lastname.localeCompare(b.Lastname),
  },
  {
    title: "Status",
    dataIndex: "Status",
    sorter: (a: BTPT, b: BTPT) => a.Status.localeCompare(b.Status),
  },
  {
    title: "Model ID",
    dataIndex: "Modelid",
    sorter: (a: BTPT, b: BTPT) => a.Modelid.toString().localeCompare(b.Modelid.toString()),
  },
  {
    title: "Operating System",
    dataIndex: "Operatingsystem",
    sorter: (a: BTPT, b: BTPT) => a.Operatingsystem.localeCompare(b.Operatingsystem),
  },
  {
    title: "Bootstrap Level",
    dataIndex: "Bootstraplevel",
    sorter: (a: BTPT, b: BTPT) => a.Bootstraplevel.localeCompare(b.Bootstraplevel),
  },
  {
    title: "Application Level",
    dataIndex: "Applicationlevel",
    sorter: (a: BTPT, b: BTPT) => a.Applicationlevel.localeCompare(b.Applicationlevel),
  },
  {
    title: "IP Address",
    dataIndex: "Ipaddress",
    sorter: (a: BTPT, b: BTPT) => a.Ipaddress.localeCompare(b.Ipaddress),
  },
  {
    title: "Hostname",
    dataIndex: "Hostname",
    sorter: (a: BTPT, b: BTPT) => a.Hostname.localeCompare(b.Hostname),
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

const BTPT = () => {
  return (
    <GenericTable<BTPT>
      uri="http://localhost:4000/btpt"
      columns={columns}
      searchField="Userlogin"
      filterField="Status"
    />
  );
};

export default BTPT;
