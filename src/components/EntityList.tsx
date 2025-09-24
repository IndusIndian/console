// src/components/EntityList.tsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Dropdown,
  Tooltip,
  message,
} from "antd";
import {
  ReloadOutlined,
  PlusOutlined,
  ToolOutlined,
  SettingOutlined,
  DeleteOutlined,
  LinkOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface Entity {
  Uid: string;
  Userlogin: string;
  Bootstraplevel: string;
  Applicationlevel: string;
  Ipaddress: string;
}

const EntityList: React.FC = () => {
  const [data, setData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterZone, setFilterZone] = useState("Any");

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Entity[]>("http://localhost:4000/acs_acl");
      console.log("Fetched data:", response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load data from API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = [
    {
      title: "User Login",
      dataIndex: "Userlogin",
      sorter: (a: Entity, b: Entity) => a.Userlogin.localeCompare(b.Userlogin),
    },
    {
      title: "Bootstrap Level",
      dataIndex: "Bootstraplevel",
      sorter: (a: Entity, b: Entity) => a.Bootstraplevel.localeCompare(b.Bootstraplevel),
    },
    {
      title: "Application Level",
      dataIndex: "Applicationlevel",
      sorter: (a: Entity, b: Entity) => a.Applicationlevel.localeCompare(b.Applicationlevel),
    },
    {
      title: "IP Address",
      dataIndex: "Ipaddress",
      sorter: (a: Entity, b: Entity) => a.Ipaddress.localeCompare(b.Ipaddress),
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

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  // Filtering & Search
  const filteredData = useMemo(() => {
    return data
      .filter((item) =>
        item.Userlogin.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((item) => (filterZone === "Any" ? true : item.Bootstraplevel === filterZone));
  }, [data, searchText, filterZone]);

  return (
    <div style={{ padding: 16 }}>
      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Left actions */}
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Refresh
          </Button>
          <Button icon={<PlusOutlined />} type="primary">
            Add New
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: "bulk1", label: "Bulk Delete" },
                { key: "bulk2", label: "Bulk Update" },
              ],
            }}
          >
            <Button icon={<ToolOutlined />}>Bulk Admin</Button>
          </Dropdown>
          <Button icon={<SettingOutlined />}>Provisioning</Button>
        </Space>

        {/* Filters */}
        <Space>
          <Search
            placeholder="Search User Login"
            style={{ width: 200 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            defaultValue="Any"
            style={{ width: 150 }}
            onChange={(value) => setFilterZone(value)}
            options={[
              { value: "Any", label: "Any Bootstrap" },
              ...Array.from(new Set(data.map((d) => d.Bootstraplevel))).map(
                (b) => ({ value: b, label: b })
              ),
            ]}
          />
        </Space>
      </div>

      {/* Data Table */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData.map((item) => ({ ...item, key: item.Uid }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default EntityList;
