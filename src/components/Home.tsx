// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Avatar, 
  List, 
  Badge,
  Progress,
  Tag,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  DatabaseOutlined, 
  SettingOutlined,
  ReloadOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface SystemStats {
  totalUsers: number;
  activeTurrets: number;
  tpoDevices: number;
  btptDevices: number;
  systemUptime: string;
  lastBackup: string;
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

const Home: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const navigate = useNavigate();
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeTurrets: 0,
    tpoDevices: 0,
    btptDevices: 0,
    systemUptime: '0d 0h 0m',
    lastBackup: 'Never'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSystemStats({
      totalUsers: 1247,
      activeTurrets: 892,
      tpoDevices: 156,
      btptDevices: 89,
      systemUptime: '15d 8h 32m',
      lastBackup: '2 hours ago'
    });

    setRecentActivity([
      { id: '1', action: 'User login', user: 'admin1', timestamp: '2 minutes ago', status: 'success' },
      { id: '2', action: 'Device sync', user: 'system', timestamp: '5 minutes ago', status: 'success' },
      { id: '3', action: 'Backup completed', user: 'system', timestamp: '2 hours ago', status: 'success' },
      { id: '4', action: 'Failed login attempt', user: 'unknown', timestamp: '3 hours ago', status: 'error' },
      { id: '5', action: 'Configuration update', user: 'admin1', timestamp: '4 hours ago', status: 'warning' }
    ]);
    
    setLoading(false);
  };

  // Simulate data fetching
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const quickActions = [
    { title: 'Add New User', icon: <UserOutlined />, color: '#1890ff', path: '/account/users' },
    { title: 'Manage Turrets', icon: <PhoneOutlined />, color: '#52c41a', path: '/device/turrets' },
    { title: 'Configure TPOs', icon: <DatabaseOutlined />, color: '#722ed1', path: '/device/tpos' },
    { title: 'System Settings', icon: <SettingOutlined />, color: '#fa8c16', path: '/system' }
  ];

  return (
    <div style={{ 
      padding: '24px', 
      minHeight: '100%',
      background: isDarkMode ? 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Welcome Header */}
      <div style={{ 
        marginBottom: '32px',
        textAlign: 'center',
        padding: '40px 20px',
        background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)'
      }}>
        <Title level={1} style={{ 
          margin: 0, 
          color: isDarkMode ? '#fff' : '#000',
          background: isDarkMode ? 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to BT Trading & Command
        </Title>
        <Text type="secondary" style={{ fontSize: '18px', marginTop: '16px', display: 'block' }}>
          Monitor and manage your trading infrastructure from a single dashboard
        </Text>
      </div>

      {/* System Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading} 
            style={{ 
              textAlign: 'center',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
          >
            <Statistic
              title="Total Users"
              value={systemStats.totalUsers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
            <Progress 
              percent={85} 
              size="small" 
              status="active" 
              style={{ marginTop: '8px' }}
              showInfo={false}
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading} 
            style={{ 
              textAlign: 'center',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
          >
            <Statistic
              title="Active Turrets"
              value={systemStats.activeTurrets}
              prefix={<PhoneOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
            <Progress 
              percent={92} 
              size="small" 
              status="active" 
              style={{ marginTop: '8px' }}
              showInfo={false}
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading} 
            style={{ 
              textAlign: 'center',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
          >
            <Statistic
              title="TPO Devices"
              value={systemStats.tpoDevices}
              prefix={<DatabaseOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
            />
            <Progress 
              percent={78} 
              size="small" 
              status="active" 
              style={{ marginTop: '8px' }}
              showInfo={false}
              strokeColor="#722ed1"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            loading={loading} 
            style={{ 
              textAlign: 'center',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            hoverable
          >
            <Statistic
              title="BTPT Devices"
              value={systemStats.btptDevices}
              prefix={<CloudOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
            />
            <Progress 
              percent={65} 
              size="small" 
              status="active" 
              style={{ marginTop: '8px' }}
              showInfo={false}
              strokeColor="#fa8c16"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                Quick Actions
              </Space>
            }
            extra={<Button type="link" icon={<ReloadOutlined />} onClick={fetchDashboardData}>Refresh</Button>}
            style={{ 
              height: '100%',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px'
            }}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={12} sm={6} key={index}>
                  <Tooltip title={action.title}>
                    <Button
                      type="text"
                      size="large"
                      style={{
                        width: '100%',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${action.color}20`,
                        borderRadius: '8px',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${action.color}10`;
                        e.currentTarget.style.borderColor = action.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = `${action.color}20`;
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <div style={{ fontSize: '24px', color: action.color, marginBottom: '8px' }}>
                        {action.icon}
                      </div>
                      <Text style={{ fontSize: '12px', textAlign: 'center' }}>
                        {action.title}
                      </Text>
                    </Button>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* System Status */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <SecurityScanOutlined />
                System Status
              </Space>
            }
            style={{ 
              height: '100%',
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>System Uptime</Text>
                <Tag color="green">{systemStats.systemUptime}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Last Backup</Text>
                <Tag color="blue">{systemStats.lastBackup}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Database Status</Text>
                <Badge status="success" text="Online" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>API Status</Text>
                <Badge status="success" text="Healthy" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>Security Level</Text>
                <Tag color="orange">High</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        {/* Recent Activity */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                Recent Activity
              </Space>
            }
            extra={<Button type="link">View All</Button>}
            style={{
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px'
            }}
          >
            <List
              dataSource={recentActivity}
              loading={loading}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: item.status === 'success' ? '#52c41a' : item.status === 'warning' ? '#faad14' : '#ff4d4f' }}
                        icon={getStatusIcon(item.status)}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{item.action}</Text>
                        <Text type="secondary">by {item.user}</Text>
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary">{item.timestamp}</Text>
                        <Tag color={item.status === 'success' ? 'green' : item.status === 'warning' ? 'orange' : 'red'}>
                          {item.status.toUpperCase()}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* System Alerts */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <ExclamationCircleOutlined />
                System Alerts
              </Space>
            }
            extra={<Badge count={2} />}
            style={{
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(10px)',
              border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px'
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#fff2e8', 
                border: '1px solid #ffd591',
                borderRadius: '6px'
              }}>
                <Text type="warning">
                  <ExclamationCircleOutlined /> Backup scheduled for maintenance window
                </Text>
              </div>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '6px'
              }}>
                <Text type="success">
                  <CheckCircleOutlined /> All systems operational
                </Text>
              </div>
            </Space>
    </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
