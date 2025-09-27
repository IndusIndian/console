import React from 'react';
import { Button, Space, message } from 'antd';
import { CopyOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import GenericTable from '../Templates/GenericTable';
import type { ColumnsType } from 'antd/es/table';

interface LineData {
  key: string;
  type: string;
  sipDisplayName: string;
  sipExtension: string;
  sipDigest: string;
  sipDomain: string;
  tpoDnsName: string;
}

const Lines: React.FC = () => {
  // Sample data matching the image structure
  const sampleData: LineData[] = [
    {
      key: '1',
      type: 'DDI Sharing Line',
      sipDisplayName: '+441932778327',
      sipExtension: '+441932778327',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: '',
    },
    {
      key: '2',
      type: 'DDI Sharing Line',
      sipDisplayName: '1111',
      sipExtension: '1111',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '3',
      type: 'DDI Sharing Line',
      sipDisplayName: 'IPVegaPort1',
      sipExtension: '2201',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '4',
      type: 'DDI Sharing Line',
      sipDisplayName: 'IPVegaPort2',
      sipExtension: '2202',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '5',
      type: 'DDI Sharing Line',
      sipDisplayName: 'IPVegaPort3',
      sipExtension: '2203',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '6',
      type: 'DDI Sharing Line',
      sipDisplayName: 'IPVegaPort4',
      sipExtension: '2204',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '7',
      type: 'DDI Sharing Line',
      sipDisplayName: '31113',
      sipExtension: '31113',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '8',
      type: 'DDI Sharing Line',
      sipDisplayName: '4000',
      sipExtension: '4000',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '9',
      type: 'DDI Sharing Line',
      sipDisplayName: 'NAG_500355',
      sipExtension: '500355',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '10',
      type: 'DDI Sharing Line',
      sipDisplayName: 'NAG_500356',
      sipExtension: '500356',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '11',
      type: 'DDI Sharing Line',
      sipDisplayName: 'NAG_500357',
      sipExtension: '500357',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '12',
      type: 'DDI Sharing Line',
      sipDisplayName: 'NAG_500358',
      sipExtension: '500358',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '13',
      type: 'DDI Sharing Line',
      sipDisplayName: 'NAG_500359',
      sipExtension: '500359',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '14',
      type: 'DDI Sharing Line',
      sipDisplayName: 'DMR-7000',
      sipExtension: '7000',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
    {
      key: '15',
      type: 'DDI Sharing Line',
      sipDisplayName: 'DMR-8000',
      sipExtension: '8000',
      sipDigest: '',
      sipDomain: '',
      tpoDnsName: 'inherited',
    },
  ];

  const handleCopy = (record: LineData) => {
    message.success(`Copied line: ${record.sipDisplayName}`);
  };

  const handleEdit = (record: LineData) => {
    message.info(`Edit line: ${record.sipDisplayName}`);
  };

  const handleDelete = (record: LineData) => {
    message.warning(`Delete line: ${record.sipDisplayName}`);
  };

  const columns: ColumnsType<LineData> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: 'SIP Display Name',
      dataIndex: 'sipDisplayName',
      key: 'sipDisplayName',
      width: 200,
    },
    {
      title: 'SIP Extension',
      dataIndex: 'sipExtension',
      key: 'sipExtension',
      width: 150,
    },
    {
      title: 'SIP Digest',
      dataIndex: 'sipDigest',
      key: 'sipDigest',
      width: 150,
    },
    {
      title: 'SIP Domain',
      dataIndex: 'sipDomain',
      key: 'sipDomain',
      width: 150,
    },
    {
      title: 'TPO DNS Name',
      dataIndex: 'tpoDnsName',
      key: 'tpoDnsName',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            size="small"
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <GenericTable<LineData>
        uri="/api/lines" // This would be your actual API endpoint
        columns={columns}
        dataSource={sampleData} // Pass sample data directly
      />
    </div>
  );
};

export default Lines;
