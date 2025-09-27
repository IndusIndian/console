import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import GenericTable from '../Templates/GenericTable';
import axios from 'axios';

interface RecordingServerData {
  Uid: string;
  Version: string;
  Title: string;
  Primaryuri: string;
  Secondaryuri: string;
  Vendor: number;
  Mixingmode: number;
  Enablecdrcheck: boolean;
  Chunkduration: number;
  Retrydelay: number;
  Maxtrycount: number;
  Timezoneid: string;
  Datetimeformat: string | null;
  Primaryapiuri: string | null;
  Primaryapikey: string | null;
  Primaryapiusername: string | null;
  Primaryapipassword: string | null;
  Primaryapidrift: number;
  Secondaryapiuri: string | null;
  Secondaryapikey: string | null;
  Secondaryapiusername: string | null;
  Secondaryapipassword: string | null;
  Secondaryapidrift: number | null;
}

interface RecordingServer extends RecordingServerData {
  key: string;
}

interface RecordingServersResponse {
  recordingservers: RecordingServerData[];
}

const RecordingServers: React.FC = () => {
  const [serversData, setServersData] = useState<RecordingServer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<RecordingServersResponse>('http://localhost:4000/recordingservers');
        const servers = response.data.recordingservers.map((server: RecordingServerData) => ({
          ...server,
          key: server.Uid, // Use Uid as the key
        }));
        setServersData(servers);
      } catch (error) {
        console.error('Error fetching recording servers:', error);
        setServersData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const getVendorName = (vendor: number) => {
    const vendors = {
      1: 'Cisco',
      2: 'Avaya',
      3: 'ASC',
      4: 'Verint',
      5: 'NICE',
    };
    return vendors[vendor as keyof typeof vendors] || `Vendor ${vendor}`;
  };

  const getMixingModeName = (mode: number) => {
    const modes = {
      0: 'None',
      1: 'Audio Only',
      2: 'Video Only',
      3: 'Audio + Video',
    };
    return modes[mode as keyof typeof modes] || `Mode ${mode}`;
  };

  const columns: ColumnsType<RecordingServer> = [
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title',
      sorter: (a, b) => a.Title.localeCompare(b.Title),
    },
    {
      title: 'Vendor',
      dataIndex: 'Vendor',
      key: 'Vendor',
      render: (vendor: number) => (
        <span style={{ 
          color: '#1890ff',
          fontWeight: '500'
        }}>
          {getVendorName(vendor)}
        </span>
      ),
      sorter: (a, b) => a.Vendor - b.Vendor,
      filters: [
        { text: 'Cisco', value: 1 },
        { text: 'Avaya', value: 2 },
        { text: 'ASC', value: 3 },
        { text: 'Verint', value: 4 },
        { text: 'NICE', value: 5 },
      ],
      onFilter: (value, record) => record.Vendor === value,
    },
    {
      title: 'Primary URI',
      dataIndex: 'Primaryuri',
      key: 'Primaryuri',
      render: (uri: string) => (
        <span style={{ 
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#666'
        }}>
          {uri}
        </span>
      ),
      sorter: (a, b) => a.Primaryuri.localeCompare(b.Primaryuri),
    },
    {
      title: 'Secondary URI',
      dataIndex: 'Secondaryuri',
      key: 'Secondaryuri',
      render: (uri: string) => (
        <span style={{ 
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#666'
        }}>
          {uri}
        </span>
      ),
      sorter: (a, b) => a.Secondaryuri.localeCompare(b.Secondaryuri),
    },
    {
      title: 'Mixing Mode',
      dataIndex: 'Mixingmode',
      key: 'Mixingmode',
      render: (mode: number) => (
        <span style={{ 
          color: mode === 0 ? '#ff4d4f' : mode === 3 ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {getMixingModeName(mode)}
        </span>
      ),
      sorter: (a, b) => a.Mixingmode - b.Mixingmode,
      filters: [
        { text: 'None', value: 0 },
        { text: 'Audio Only', value: 1 },
        { text: 'Video Only', value: 2 },
        { text: 'Audio + Video', value: 3 },
      ],
      onFilter: (value, record) => record.Mixingmode === value,
    },
    {
      title: 'CDR Check',
      dataIndex: 'Enablecdrcheck',
      key: 'Enablecdrcheck',
      render: (enabled: boolean) => (
        <span style={{ 
          color: enabled ? '#52c41a' : '#ff4d4f',
          fontWeight: '500'
        }}>
          {enabled ? 'Enabled' : 'Disabled'}
        </span>
      ),
      sorter: (a, b) => (a.Enablecdrcheck ? 1 : 0) - (b.Enablecdrcheck ? 1 : 0),
      filters: [
        { text: 'Enabled', value: 'true' },
        { text: 'Disabled', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Enablecdrcheck) === value,
    },
    {
      title: 'Chunk Duration',
      dataIndex: 'Chunkduration',
      key: 'Chunkduration',
      render: (duration: number) => `${duration}s`,
      sorter: (a, b) => a.Chunkduration - b.Chunkduration,
    },
    {
      title: 'Retry Delay',
      dataIndex: 'Retrydelay',
      key: 'Retrydelay',
      render: (delay: number) => `${delay}s`,
      sorter: (a, b) => a.Retrydelay - b.Retrydelay,
    },
    {
      title: 'Max Try Count',
      dataIndex: 'Maxtrycount',
      key: 'Maxtrycount',
      sorter: (a, b) => a.Maxtrycount - b.Maxtrycount,
    },
    {
      title: 'Timezone',
      dataIndex: 'Timezoneid',
      key: 'Timezoneid',
      sorter: (a, b) => a.Timezoneid.localeCompare(b.Timezoneid),
    },
    {
      title: 'Version',
      dataIndex: 'Version',
      key: 'Version',
      sorter: (a, b) => a.Version.localeCompare(b.Version),
    },
  ];

  const columnConfigs = [
    { dataIndex: 'Title' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Vendor' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Primaryuri' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Secondaryuri' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Mixingmode' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Enablecdrcheck' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Chunkduration' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Retrydelay' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Maxtrycount' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Timezoneid' as keyof RecordingServer, filterable: true, sortable: true },
    { dataIndex: 'Version' as keyof RecordingServer, filterable: true, sortable: true },
  ];

  if (loading) {
    return (
      <div>
        <h2>Recording Servers</h2>
        <div>Loading recording servers...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Recording Servers</h2>
      <GenericTable<RecordingServer>
        uri="/recordingservers"
        columns={columns}
        columnConfigs={columnConfigs}
        dataSource={serversData}
      />
    </div>
  );
};

export default RecordingServers;
