// src/components/GenericTable.tsx
import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Space, Input, Select, message } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Search } = Input;

interface GenericTableProps<T> {
  uri: string;
  columns: ColumnsType<T>; // strongly typed columns
  filterField?: keyof T; // optional field to filter by dropdown
  searchField?: keyof T; // optional field to search text
}

export default function GenericTable<T extends { key: string | number }>({
  uri,
  columns,
  filterField,
  searchField,
}: GenericTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterValue, setFilterValue] = useState("Any");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<T[]>(uri);
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load data from API");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<T[]>(uri);
      setData(response.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load data from API");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [uri]);

  const filteredData = useMemo(() => {
    let filtered = data;
    if (searchField && searchText) {
      filtered = filtered.filter((item) =>
        String(item[searchField])
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }
    if (filterField && filterValue !== "Any") {
      filtered = filtered.filter((item) => item[filterField] === filterValue);
    }
    return filtered;
  }, [data, searchText, filterValue, filterField, searchField]);

  const rowSelection = { selectedRowKeys, onChange: setSelectedRowKeys };

  return (
    <div style={{ padding: 16 }}>
      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Refresh
          </Button>
        </Space>

        <Space>
          {searchField && (
            <Search
              placeholder={`Search ${String(searchField)}`}
              style={{ width: 200 }}
              onChange={(e) => setSearchText(e.target.value)}
            />
          )}
          {filterField && (
            <Select
              defaultValue="Any"
              style={{ width: 150 }}
              onChange={(value) => setFilterValue(value)}
              options={[
                { value: "Any", label: "Any" },
                ...Array.from(new Set(data.map((d) => d[filterField]))).map(
                  (val) => ({ value: val, label: String(val) })
                ),
              ]}
            />
          )}
        </Space>
      </div>

      {/* Data Table */}
      <Table
        
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="small"
      />
    </div>
  );
}
