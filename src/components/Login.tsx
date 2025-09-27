import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, CloudOutlined } from '@ant-design/icons';
import BTLogo from './BTLogo';
import { useAppContext } from '../contexts/AppContext';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { resetSession } = useAppContext();

  const handleLocalLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (values.username === 'admin1' && values.password === 'admin1') {
        message.success('Login successful!');
        resetSession(); // Start 30-minute session
        onLogin();
      } else {
        message.error('Invalid credentials. Use admin1/admin1');
      }
      setLoading(false);
    }, 1000);
  };

  const handleAzureLogin = () => {
    setLoading(true);
    
    // Simulate Azure login
    setTimeout(() => {
      message.success('Azure login successful!');
      resetSession(); // Start 30-minute session
      onLogin();
      setLoading(false);
    }, 1500);
  };

  const tabItems = [
    {
      key: 'local',
      label: 'Local User Login',
      children: (
        <Form
          form={form}
          onFinish={handleLocalLogin}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'azure',
      label: 'Azure Login',
      children: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Button
            type="primary"
            size="large"
            icon={<CloudOutlined />}
            onClick={handleAzureLogin}
            loading={loading}
            style={{ 
              height: '50px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            Login with Microsoft
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: 'none'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <BTLogo />
          <h2 style={{ 
            marginTop: '20px', 
            marginBottom: '0',
            color: '#1890ff',
            fontWeight: '600'
          }}>
            TSS Console
          </h2>
          <p style={{ 
            color: '#666', 
            marginTop: '8px',
            marginBottom: '0'
          }}>
            Sign in to your account
          </p>
        </div>

        <Tabs
          defaultActiveKey="local"
          items={tabItems}
          centered
          size="large"
        />
      </Card>
    </div>
  );
};

export default Login;
