import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import GenericTable from '../Templates/GenericTable';
import axios from 'axios';

interface ZoneData {
  Uid: string;
  Version: string;
  Name: string;
  Builtin: boolean;
  Comment: string | null;
  Profileuid: string;
  Locationcountrycode: string | null;
  Locationcity: string | null;
  Locationstate: string | null;
  Callprefix: string | null;
}

interface Zone extends ZoneData {
  key: string;
}

interface ZonesResponse {
  zones: ZoneData[];
}

const Zones: React.FC = () => {
  const [zonesData, setZonesData] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ZonesResponse>('http://localhost:4000/zones');
        const zones = response.data.zones.map((zone: ZoneData) => ({
          ...zone,
          key: zone.Uid, // Use Uid as the key
        }));
        setZonesData(zones);
      } catch (error) {
        console.error('Error fetching zones:', error);
        setZonesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  const columns: ColumnsType<Zone> = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Type',
      dataIndex: 'Builtin',
      key: 'Builtin',
      render: (builtin: boolean) => (
        <span style={{ 
          color: builtin ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {builtin ? 'System' : 'Custom'}
        </span>
      ),
      sorter: (a, b) => (a.Builtin ? 1 : 0) - (b.Builtin ? 1 : 0),
      filters: [
        { text: 'System', value: 'true' },
        { text: 'Custom', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Builtin) === value,
    },
    {
      title: 'Location',
      dataIndex: 'Locationcity',
      key: 'Locationcity',
      render: (_, record: Zone) => {
        const location = [record.Locationcity, record.Locationstate, record.Locationcountrycode]
          .filter(Boolean)
          .join(', ');
        return location || '-';
      },
      sorter: (a, b) => {
        const locationA = [a.Locationcity, a.Locationstate, a.Locationcountrycode]
          .filter(Boolean)
          .join(', ');
        const locationB = [b.Locationcity, b.Locationstate, b.Locationcountrycode]
          .filter(Boolean)
          .join(', ');
        return locationA.localeCompare(locationB);
      },
    },
    {
      title: 'Comment',
      dataIndex: 'Comment',
      key: 'Comment',
      render: (comment: string | null) => comment || '-',
    },
    {
      title: 'Version',
      dataIndex: 'Version',
      key: 'Version',
      sorter: (a, b) => a.Version.localeCompare(b.Version),
    },
    {
      title: 'Profile UID',
      dataIndex: 'Profileuid',
      key: 'Profileuid',
      sorter: (a, b) => a.Profileuid.localeCompare(b.Profileuid),
    },
  ];

  const columnConfigs = [
    { dataIndex: 'Name' as keyof Zone, filterable: true, sortable: true },
    { dataIndex: 'Builtin' as keyof Zone, filterable: true, sortable: true },
    { dataIndex: 'Locationcity' as keyof Zone, filterable: true, sortable: true },
    { dataIndex: 'Comment' as keyof Zone, filterable: true, sortable: true },
    { dataIndex: 'Version' as keyof Zone, filterable: true, sortable: true },
    { dataIndex: 'Profileuid' as keyof Zone, filterable: true, sortable: true },
  ];

  if (loading) {
    return (
      <div>
        <h2>Zones Management</h2>
        <div>Loading zones...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Zones Management</h2>
      <GenericTable<Zone>
        uri="/zones"
        columns={columns}
        columnConfigs={columnConfigs}
        dataSource={zonesData}
      />
    </div>
  );
};

export default Zones;
