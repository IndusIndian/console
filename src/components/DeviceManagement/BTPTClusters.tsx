import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import GenericTable from '../Templates/GenericTable';
import axios from 'axios';

interface BTPTClusterData {
  Uid: string;
  Version: string;
  Name: string;
  Lastupdatedatetime: string;
  Type: string;
  Ringtonesetuid: string | null;
  Ringtonevolume: string | null;
  Shortcutversion: string | null;
  Comment: string | null;
  Builtin: boolean;
  Redundancymode: string | null;
  Applicationuid: string;
  Fetchdeviceid: string | null;
  Fetchsippassword: string | null;
  Fetchsipdigest: string | null;
  Fetchauto: string | null;
  Lastfetchtime: string | null;
  Editable: boolean;
  Grouplines: string | null;
  Editablebyuid: string | null;
  Desk: boolean;
  Originaluid: string | null;
  Tssuri: string | null;
  Backgrounduid: string | null;
  Turretscreensaveruid: string | null;
  Userscreensaveruid: string | null;
  Recordingserveruid: string | null;
  Recordingserverenabled: boolean;
  Fetchpbxclusteruid: string | null;
  Allzonesattached: boolean;
  Hold: boolean;
  Department: string | null;
  Costcenter: string | null;
  Email: string | null;
  Employeeid: string | null;
}

interface BTPTCluster extends BTPTClusterData {
  key: string;
}

interface BTPTClustersResponse {
  btptclusters: BTPTClusterData[];
}

const BTPTClusters: React.FC = () => {
  const [clustersData, setClustersData] = useState<BTPTCluster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        setLoading(true);
        const response = await axios.get<BTPTClustersResponse>('http://localhost:4000/btptclusters');
        const clusters = response.data.btptclusters.map((cluster: BTPTClusterData) => ({
          ...cluster,
          key: cluster.Uid, // Use Uid as the key
        }));
        setClustersData(clusters);
      } catch (error) {
        console.error('Error fetching BTPT clusters:', error);
        setClustersData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  const columns: ColumnsType<BTPTCluster> = [
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
      render: (type: string) => (
        <span style={{ 
          color: type === 'S' ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {type === 'S' ? 'Server' : type}
        </span>
      ),
      sorter: (a, b) => a.Type.localeCompare(b.Type),
      filters: [
        { text: 'Server', value: 'S' },
        { text: 'Other', value: 'O' },
      ],
      onFilter: (value, record) => record.Type === value,
    },
    {
      title: 'Built-in',
      dataIndex: 'Builtin',
      key: 'Builtin',
      render: (builtin: boolean) => (
        <span style={{ 
          color: builtin ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {builtin ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Builtin ? 1 : 0) - (b.Builtin ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Builtin) === value,
    },
    {
      title: 'Editable',
      dataIndex: 'Editable',
      key: 'Editable',
      render: (editable: boolean) => (
        <span style={{ 
          color: editable ? '#52c41a' : '#ff4d4f',
          fontWeight: '500'
        }}>
          {editable ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Editable ? 1 : 0) - (b.Editable ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Editable) === value,
    },
    {
      title: 'Desk',
      dataIndex: 'Desk',
      key: 'Desk',
      render: (desk: boolean) => (
        <span style={{ 
          color: desk ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {desk ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Desk ? 1 : 0) - (b.Desk ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Desk) === value,
    },
    {
      title: 'Recording Enabled',
      dataIndex: 'Recordingserverenabled',
      key: 'Recordingserverenabled',
      render: (enabled: boolean) => (
        <span style={{ 
          color: enabled ? '#52c41a' : '#ff4d4f',
          fontWeight: '500'
        }}>
          {enabled ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Recordingserverenabled ? 1 : 0) - (b.Recordingserverenabled ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Recordingserverenabled) === value,
    },
    {
      title: 'All Zones Attached',
      dataIndex: 'Allzonesattached',
      key: 'Allzonesattached',
      render: (attached: boolean) => (
        <span style={{ 
          color: attached ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {attached ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Allzonesattached ? 1 : 0) - (b.Allzonesattached ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Allzonesattached) === value,
    },
    {
      title: 'Hold',
      dataIndex: 'Hold',
      key: 'Hold',
      render: (hold: boolean) => (
        <span style={{ 
          color: hold ? '#52c41a' : '#1890ff',
          fontWeight: '500'
        }}>
          {hold ? 'Yes' : 'No'}
        </span>
      ),
      sorter: (a, b) => (a.Hold ? 1 : 0) - (b.Hold ? 1 : 0),
      filters: [
        { text: 'Yes', value: 'true' },
        { text: 'No', value: 'false' },
      ],
      onFilter: (value, record) => String(record.Hold) === value,
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
      title: 'Last Updated',
      dataIndex: 'Lastupdatedatetime',
      key: 'Lastupdatedatetime',
      render: (datetime: string) => {
        const date = new Date(datetime);
        return date.toLocaleString();
      },
      sorter: (a, b) => new Date(a.Lastupdatedatetime).getTime() - new Date(b.Lastupdatedatetime).getTime(),
    },
  ];

  const columnConfigs = [
    { dataIndex: 'Name' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Type' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Builtin' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Editable' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Desk' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Recordingserverenabled' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Allzonesattached' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Hold' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Comment' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Version' as keyof BTPTCluster, filterable: true, sortable: true },
    { dataIndex: 'Lastupdatedatetime' as keyof BTPTCluster, filterable: true, sortable: true },
  ];

  if (loading) {
    return (
      <div>
        <h2>Productivity Tools Clusters</h2>
        <div>Loading clusters...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Productivity Tools Clusters</h2>
      <GenericTable<BTPTCluster>
        uri="/btptclusters"
        columns={columns}
        columnConfigs={columnConfigs}
        dataSource={clustersData}
      />
    </div>
  );
};

export default BTPTClusters;
