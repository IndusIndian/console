// src/components/GenericTable.tsx
import React, { useEffect, useState, useMemo, useRef, useCallback, memo } from "react";
import { Table, Button, Space, Input, Select, message, Tooltip, theme, Skeleton } from "antd";
import { ReloadOutlined, PlusOutlined, SettingOutlined, CloudOutlined, PhoneOutlined, UserOutlined, DatabaseOutlined, ClockCircleOutlined, ClearOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useAppContext } from "../../contexts/AppContext";

interface StatusConfig<T> {
  showStatus: boolean;
  statusField: keyof T;
  iconType: 'phone' | 'user' | 'server';
}

interface ColumnConfig<T> {
  dataIndex: keyof T;
  filterable?: boolean; // Allow Excel-like filtering (default: true)
  sortable?: boolean; // Allow column sorting (default: true)
}

interface GenericTableProps<T> {
  uri: string;
  columns: ColumnsType<T>; // strongly typed columns
  columnConfigs?: ColumnConfig<T>[]; // configuration for which columns have filters
  statusConfig?: StatusConfig<T>; // optional status configuration
  dataSource?: T[]; // optional data source to override API calls
}

const GenericTable = memo(function GenericTable<T extends { key: string | number }>({
  uri,
  columns,
  columnConfigs = [],
  statusConfig,
  dataSource: propDataSource,
}: GenericTableProps<T>) {
  const { pageSize, resetSession } = useAppContext();
  const { token } = theme.useToken();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [globalSearchText, setGlobalSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const intervalRef = useRef<number | null>(null);
  const searchTimeoutRef = useRef<number | null>(null);
  const dataCacheRef = useRef<Map<string, { data: T[], timestamp: number }>>(new Map());

  const fetchData = useCallback(async (forceRefresh = false) => {
    // If dataSource is provided as prop, use it instead of API
    if (propDataSource) {
      setData(propDataSource);
      setLoading(false);
      setInitialLoading(false);
      return;
    }

    const cacheKey = uri;
    const cache = dataCacheRef.current;
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    // Check cache first (unless force refresh)
    if (!forceRefresh && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)!;
      if (now - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setInitialLoading(false);
        return;
      }
    }

    setLoading(true);
    if (initialLoading) {
      setInitialLoading(true);
    }

    try {
      const response = await axios.get<T[]>(uri);
      const newData = response.data;
      
      // Cache the data
      cache.set(cacheKey, { data: newData, timestamp: now });
      
      setData(newData);
      resetSession(); // Reset session on data activity
    } catch (error) {
      console.error(error);
      message.error("Failed to load data from API");
      
      // Try to use cached data as fallback
      if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey)!;
        setData(cached.data);
        message.warning("Using cached data due to API error");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [uri, resetSession, initialLoading, propDataSource]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Preload data when component becomes visible (intersection observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && data.length === 0 && !loading) {
            fetchData();
          }
        });
      },
      { threshold: 0.1 }
    );

    const tableElement = document.querySelector('.ant-table-wrapper');
    if (tableElement) {
      observer.observe(tableElement);
    }

    return () => {
      if (tableElement) {
        observer.unobserve(tableElement);
      }
    };
  }, [data.length, loading, fetchData]);

  // Debounce global search to reduce filtering operations
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchText(globalSearchText);
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [globalSearchText]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, refreshInterval, fetchData]);


  const rowSelection = useMemo(() => ({ 
      selectedRowKeys,
    onChange: setSelectedRowKeys 
  }), [selectedRowKeys]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleReset = useCallback(() => {
    setGlobalSearchText('');
    setDebouncedSearchText(''); // Also clear debounced text
    setCurrentPage(1);
    setSelectedRowKeys([]);
    // Note: Ant Design filters will be cleared when columns are re-rendered
  }, []);




  // Create status column if statusConfig is provided
  const getStatusIcon = (status: string, iconType: 'phone' | 'user' | 'server') => {
    const getStatusColor = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'A':
          return '#52c41a'; // Green
        case 'B':
          return '#ff4d4f'; // Red
        default:
          return '#d9d9d9'; // Grey
      }
    };

    const getStatusTooltip = (status: string) => {
      switch (status?.toUpperCase()) {
        case 'A':
          return 'Active';
        case 'B':
          return 'Inactive';
        default:
          return 'Unknown';
      }
    };

    const iconProps = {
      style: {
        color: getStatusColor(status),
        fontSize: '16px'
      },
      title: getStatusTooltip(status)
    };

    switch (iconType) {
      case 'phone':
        return <PhoneOutlined {...iconProps} />;
      case 'user':
        return <UserOutlined {...iconProps} />;
      case 'server':
        return <DatabaseOutlined {...iconProps} />;
      default:
        return null;
    }
  };



  // Apply global search filter with debounced text
  const filteredData = useMemo(() => {
    if (!debouncedSearchText) return data;
    
    return data.filter((item) => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    });
  }, [data, debouncedSearchText]);

  // Cache Excel-like filter options to avoid reprocessing data
  const excelFilterOptionsCache = useMemo(() => {
    const cache = new Map();
    return (dataIndex: keyof T) => {
      if (cache.has(dataIndex)) {
        return cache.get(dataIndex);
      }
      
      const uniqueValues = Array.from(new Set(data.map(item => (item as any)[dataIndex])))
        .filter(value => value !== null && value !== undefined && value !== '')
        .sort((a, b) => {
          const aStr = String(a || '');
          const bStr = String(b || '');
          return aStr.localeCompare(bStr);
        });
      
      const options = uniqueValues.map((value, index) => ({
        key: `${String(dataIndex)}-${index}`,
        value: String(value),
        label: String(value)
      }));
      
      cache.set(dataIndex, options);
      return options;
    };
  }, [data]);

  // Create Excel-like column filter props with filterSearch
  const getExcelFilterProps = useCallback((dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8, width: 200 }}>
        <Select
          placeholder={`Filter ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(value) => setSelectedKeys(value ? [value] : [])}
          style={{ marginBottom: 8, width: '100%' }}
          allowClear
          showSearch
          size="small"
          filterOption={(input: string, option: any) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[{ value: '', label: 'All' }, ...excelFilterOptionsCache(dataIndex)]}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ flex: 1 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            style={{ flex: 1 }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: T) => {
      const recordValue = (record as any)[dataIndex];
      return value === '' || String(recordValue) === String(value);
    },
  }), [excelFilterOptionsCache]);

  // Memoize status columns to prevent recreation
  const statusColumns = useMemo(() => {
    if (!statusConfig?.showStatus) return null;
    
    return {
      iconColumn: {
        title: "",
        dataIndex: statusConfig.statusField as string,
        render: (status: string) => getStatusIcon(status, statusConfig.iconType),
        width: 50,
        align: 'center' as const,
      },
      statusColumn: {
        title: "Status",
        dataIndex: statusConfig.statusField as string,
        sorter: (a: T, b: T) => String((a as any)[statusConfig.statusField] || '').localeCompare(String((b as any)[statusConfig.statusField] || '')),
        render: (status: string) => <span>{status}</span>,
        width: 80,
      }
    };
  }, [statusConfig]);

  // Add icon and status columns if configured
  const finalColumns = useMemo(() => {
    let baseColumns = columns;

    // Add status columns if configured
    if (statusColumns) {
      // Insert icon column as first column, status column as second
      baseColumns = [...columns];
      baseColumns.splice(0, 0, statusColumns.iconColumn);
      baseColumns.splice(1, 0, statusColumns.statusColumn);
    }

    // Add Excel-like filtering and sorting to columns
    return baseColumns.map((column) => {
      // Only add filters to columns that have dataIndex (not column groups)
      if (!('dataIndex' in column) || !column.dataIndex) {
        return column;
      }
      
      const columnKey = String(column.dataIndex);
      const columnConfig = columnConfigs.find(config => String(config.dataIndex) === columnKey);
      
      // If no column config, return original column
      if (!columnConfig) {
        return column;
      }
      
      // Add Excel-like filter if filterable
      const filterProps = columnConfig.filterable !== false ? getExcelFilterProps(column.dataIndex) : {};
      
      return {
        ...column,
        ...filterProps,
        sorter: columnConfig.sortable !== false ? column.sorter : false,
      };
    });
  }, [columns, statusColumns, columnConfigs, getExcelFilterProps]);


  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 12, flexShrink: 0 }}>
        {/* Left side - Auto-refresh controls first */}
        <Space>
            {/* Auto-refresh controls grouped with refresh */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 12px',
              border: `1px solid ${token.colorBorder}`,
              borderRadius: '6px',
              backgroundColor: autoRefresh ? token.colorSuccessBg : token.colorFillTertiary,
              color: token.colorText
            }}>
              <Tooltip title={`Auto-refresh every ${refreshInterval}s`}>
                <Select
                  size="small"
                  value={autoRefresh ? refreshInterval : null}
                  onChange={(value) => {
                    if (value) {
                      setRefreshInterval(value);
                      setAutoRefresh(true);
                    } else {
                      setAutoRefresh(false);
                    }
                  }}
                  style={{ width: 80 }}
                  placeholder="Auto"
                  suffixIcon={<ClockCircleOutlined />}
                  options={[
                    { value: null, label: 'Off' },
                    { value: 10, label: '10s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '1m' },
                    { value: 300, label: '5m' },
                    { value: 600, label: '10m' },
                  ]}
                />
              </Tooltip>
              
            <Button icon={<ReloadOutlined />} onClick={() => fetchData(true)} loading={loading}>
            Refresh
            </Button>
            </div>
            <Button icon={<ClearOutlined />} onClick={handleReset}>
              Reset
            </Button>
            <Button icon={<PlusOutlined />} type="primary">
              Add New
            </Button>
            <Button icon={<SettingOutlined />}>
              Bulk Admin
            </Button>
            <Button icon={<CloudOutlined />}>
              Provisioning
          </Button>
        </Space>

        {/* Right side - Global Search */}
        <Space>
          <Input
            placeholder="Search all columns..."
            value={globalSearchText}
            onChange={(e) => setGlobalSearchText(e.target.value)}
              style={{ width: 200 }}
            prefix={<SearchOutlined />}
              allowClear
            />
        </Space>
      </div>

      {/* Data Table */}
      <div 
        className={loading ? 'loading' : ''}
        style={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          overflow: 'hidden',
          minHeight: 0,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >

      {initialLoading ? (
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Skeleton active paragraph={{ rows: 8 }} />
          <div style={{ marginTop: '16px', color: '#666' }}>
            Loading data...
          </div>
        </div>
      ) : (
      <Table
          rowKey="Uid"
        rowSelection={rowSelection}
          columns={finalColumns}
        dataSource={filteredData}
        loading={loading}
          pagination={{ 
            pageSize,
            current: currentPage,
            onChange: handlePageChange,
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} records`,
            position: ['bottomRight'],
            showSizeChanger: false,
            showQuickJumper: false
          }}
        size="small"
          scroll={{ 
            x: 'max-content',
            y: 'calc(100vh - 300px)'
          }}
          style={{ 
            width: "100%",
            height: "100%"
          }}
          components={{
            header: {
              cell: (props: any) => <th {...props} style={{ ...props.style, padding: '12px 8px', height: '48px' }} />
            },
            body: {
              cell: (props: any) => <td {...props} style={{ ...props.style, padding: '4px 8px' }} />
            }
          }}
        />
      )}
      </div>
    </div>
  );
}) as <T extends { key: string | number }>(props: GenericTableProps<T>) => React.ReactElement;

export default GenericTable;
