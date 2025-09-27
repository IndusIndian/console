import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Form, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Space,
  List,
  Checkbox,
  Typography,
  message
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  userLogin: string;
  status: string;
  type: string;
  department?: string;
  costCenter?: string;
  email?: string;
  employeeId?: string;
  securityPolicy: string;
  zone: string;
  recordingServer: string;
  comment: string;
  lastUpdateDateTime: string;
  fallbackPinCode?: string;
}

interface Profile {
  id: string;
  name: string;
  type: string;
  selected: boolean;
}

interface Directory {
  id: string;
  name: string;
  selected: boolean;
}

const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // User data state
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Parent Profiles state
  const [availableProfiles, setAvailableProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [profileSearchText] = useState('');
  
  // Directories state
  const [availableDirectories, setAvailableDirectories] = useState<Directory[]>([]);
  const [selectedDirectories, setSelectedDirectories] = useState<Directory[]>([]);
  
  // Profile selection state
  const [selectedProfileItems, setSelectedProfileItems] = useState<string[]>([]);
  const [selectedDirectoryItems, setSelectedDirectoryItems] = useState<string[]>([]);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
    loadProfiles();
    loadDirectories();
  }, []);

  // Handle dark mode class on body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    return () => {
      document.body.classList.remove('dark');
    };
  }, [isDarkMode]);

  const loadUserData = () => {
    // Simulate loading user data from API
    const mockUserData: UserData = {
      uid: '12345',
      firstName: 'Nagendra',
      lastName: 'Gedela',
      userLogin: 'NAG_T401',
      status: 'Active',
      type: 'Turret',
      department: '',
      costCenter: '',
      email: '',
      employeeId: '',
      securityPolicy: 'PwdPolicy_User',
      zone: 'Nag_Zone',
      recordingServer: 'Disabled',
      comment: 'Profile With All the Lines Active_NAG',
      lastUpdateDateTime: '4/23/2025 10:32:44 AM',
      fallbackPinCode: ''
    };
    
    setUserData(mockUserData);
    form.setFieldsValue(mockUserData);
  };

  const loadProfiles = () => {
    // Simulate loading profiles
    const mockProfiles: Profile[] = [
      { id: '1', name: '01.GeneralSettings', type: 'Shared', selected: false },
      { id: '2', name: '02.AnotherProfile', type: 'Shared', selected: false },
      { id: '3', name: '03.Nag_SUN_DDI_Lines', type: 'Shared', selected: true },
      { id: '4', name: '04.Nag_4thline_DDI_lines', type: 'Shared', selected: true },
      { id: '5', name: '05.Nag_VEGA_Lines', type: 'Shared', selected: true },
      { id: '6', name: '06.NAG_SBC_Lines', type: 'Shared', selected: true },
      { id: '7', name: '07.Nag_DMR_Lines', type: 'Shared', selected: true },
      { id: '8', name: '08.Nag_T4_Shortcuts_Layout', type: 'Shared', selected: true },
      { id: '9', name: '09.AnotherProfile2', type: 'Shared', selected: false },
      { id: '10', name: '10.StreamDeckXL', type: 'Shared', selected: true },
      { id: '11', name: '11.TPO_Local_Lines_First_5', type: 'Shared', selected: true },
      { id: '12', name: '12.TPO_Local_Lines_First_10', type: 'Shared', selected: true },
      { id: '13', name: '13.AnotherProfile3', type: 'Shared', selected: true },
      { id: '14', name: '14.AnotherProfile4', type: 'Shared', selected: true },
      { id: '15', name: '15.AnotherProfile5', type: 'Shared', selected: true },
      { id: '16', name: '16.AnotherProfile6', type: 'Shared', selected: true }
    ];
    
    const available = mockProfiles.filter(p => !p.selected);
    const selected = mockProfiles.filter(p => p.selected);
    
    setAvailableProfiles(available);
    setSelectedProfiles(selected);
  };

  const loadDirectories = () => {
    // Simulate loading directories
    const mockDirectories: Directory[] = [
      { id: '1', name: 'ITSNET Console Admin', selected: false },
      { id: '2', name: 'DevSystemDirectory', selected: false },
      { id: '3', name: 'AppEngDirectory', selected: false }
    ];
    
    setAvailableDirectories(mockDirectories);
    setSelectedDirectories([]);
  };

  const handleProfileAdd = () => {
    const profilesToAdd = availableProfiles.filter(p => selectedProfileItems.includes(p.id));
    const newSelected = [...selectedProfiles, ...profilesToAdd];
    const newAvailable = availableProfiles.filter(p => !selectedProfileItems.includes(p.id));
    
    setSelectedProfiles(newSelected);
    setAvailableProfiles(newAvailable);
    setSelectedProfileItems([]);
  };

  const handleProfileRemove = () => {
    const profilesToRemove = selectedProfiles.filter(p => selectedProfileItems.includes(p.id));
    const newAvailable = [...availableProfiles, ...profilesToRemove];
    const newSelected = selectedProfiles.filter(p => !selectedProfileItems.includes(p.id));
    
    setAvailableProfiles(newAvailable);
    setSelectedProfiles(newSelected);
    setSelectedProfileItems([]);
  };

  const handleDirectoryAdd = () => {
    const directoriesToAdd = availableDirectories.filter(d => selectedDirectoryItems.includes(d.id));
    const newSelected = [...selectedDirectories, ...directoriesToAdd];
    const newAvailable = availableDirectories.filter(d => !selectedDirectoryItems.includes(d.id));
    
    setSelectedDirectories(newSelected);
    setAvailableDirectories(newAvailable);
    setSelectedDirectoryItems([]);
  };

  const handleDirectoryRemove = () => {
    const directoriesToRemove = selectedDirectories.filter(d => selectedDirectoryItems.includes(d.id));
    const newAvailable = [...availableDirectories, ...directoriesToRemove];
    const newSelected = selectedDirectories.filter(d => !selectedDirectoryItems.includes(d.id));
    
    setAvailableDirectories(newAvailable);
    setSelectedDirectories(newSelected);
    setSelectedDirectoryItems([]);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('User updated successfully!');
    } catch (error) {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAndGoBack = async () => {
    await handleUpdate();
    navigate('/account/users');
  };

  const handleReset = () => {
    form.resetFields();
    loadUserData();
    loadProfiles();
    loadDirectories();
  };

  const handleRefresh = () => {
    loadUserData();
    loadProfiles();
    loadDirectories();
  };

  const handleCancel = () => {
    navigate('/account/users');
  };

  const handleDelete = () => {
    // Implement delete logic
    message.warning('Delete functionality not implemented yet');
  };

  const filteredAvailableProfiles = availableProfiles.filter(profile =>
    profile.name.toLowerCase().includes(profileSearchText.toLowerCase())
  );

  return (
    <div 
      className={isDarkMode ? 'dark' : ''}
      style={{ 
        padding: '0', 
        backgroundColor: isDarkMode ? '#141414' : '#f5f5f5', 
        minHeight: '100vh',
        overflow: 'hidden'
      }}>
      {/* Header with Tabs */}
      <div style={{ 
        backgroundColor: isDarkMode ? '#1f1f1f' : '#fff', 
        borderBottom: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
        padding: '0 24px',
        position: 'fixed',
        top: '112px', // Below the main header (64px) + menu (48px)
        left: 0,
        right: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 0'
        }}>
          <Space align="center">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/account/users')}
              type="link"
              style={{ padding: 0 }}
            >
              &lt;&lt; Back to Users list
            </Button>
          </Space>
          
          <Space align="center">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => window.location.reload()}
              type="primary"
              size="small"
            >
              Refresh
            </Button>
          </Space>
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="custom-tabs"
          style={{ margin: 0 }}
        >
          <TabPane tab="General" key="general" />
          <TabPane tab="Lines" key="lines" />
          <TabPane tab="Adv. Telephony" key="telephony" />
          <TabPane tab="Settings" key="settings" />
          <TabPane tab="Screen Layout" key="screen" />
          <TabPane tab="Video Stream" key="video" />
          <TabPane tab="Call Notification" key="notification" />
          <TabPane tab="Shortcuts" key="shortcuts" />
          <TabPane tab="Call History" key="history" />
        </Tabs>
      </div>

      {/* Main Content with Scroll */}
      <div style={{ 
        minHeight: 'calc(100vh - 200px)', 
        padding: '12px',
        marginTop: '80px' // Space for fixed tabs (approximately 80px height)
      }}>
        <Row gutter={16}>
          {/* Main Content */}
          <Col span={24}>
            {activeTab === 'general' && (
              <div style={{
                backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                border: `1px solid ${isDarkMode ? '#303030' : '#e8e8e8'}`,
                borderRadius: '8px',
                boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                padding: '16px'
              }}>
                {/* Last Update DateTime - Top Left */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-start', 
                  marginBottom: '16px',
                  padding: '6px 10px',
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  border: `1px solid ${isDarkMode ? '#404040' : '#e9ecef'}`,
                  borderRadius: '4px'
                }}>
                  <Text strong style={{ 
                    color: isDarkMode ? '#fff' : '#262626',
                    fontSize: '11px'
                  }}>
                    Last Update DateTime: {userData?.lastUpdateDateTime}
                  </Text>
                </div>

                <Form
                  form={form}
                  layout="horizontal"
                  initialValues={userData || {}}
                  className="user-edit-form"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter last name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="type"
                        label="Type"
                        rules={[{ required: true, message: 'Please select type' }]}
                      >
                        <Select>
                          <Option value="Turret">Turret</Option>
                          <Option value="User">User</Option>
                          <Option value="Admin">Admin</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status' }]}
                      >
                        <Select>
                          <Option value="Active">Active</Option>
                          <Option value="Inactive">Inactive</Option>
                          <Option value="Suspended">Suspended</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="userLogin"
                        label="User Login"
                        rules={[{ required: true, message: 'Please enter user login' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="department"
                        label="Department"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="costCenter"
                        label="Cost Center"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="employeeId"
                        label="Employee ID"
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="securityPolicy"
                        label="Security policy"
                        rules={[{ required: true, message: 'Please select security policy' }]}
                      >
                        <Select>
                          <Option value="PwdPolicy_User">PwdPolicy_User</Option>
                          <Option value="PwdPolicy_Admin">PwdPolicy_Admin</Option>
                          <Option value="PwdPolicy_Strong">PwdPolicy_Strong</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter password' }]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="confirmPassword"
                        label="Confirm password"
                        rules={[{ required: true, message: 'Please confirm password' }]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="fallbackPinCode"
                        label="Fallback pin code (Netrix only)"
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="zone"
                        label="Zone"
                        rules={[{ required: true, message: 'Please select zone' }]}
                      >
                        <Select>
                          <Option value="Nag_Zone">Nag_Zone</Option>
                          <Option value="Default_Zone">Default_Zone</Option>
                          <Option value="Admin_Zone">Admin_Zone</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="recordingServer"
                        label="Recording Server"
                        rules={[{ required: true, message: 'Please select recording server' }]}
                      >
                        <Select>
                          <Option value="Disabled">Disabled</Option>
                          <Option value="Enabled">Enabled</Option>
                          <Option value="Optional">Optional</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* Empty column for balance */}
                    </Col>
                  </Row>

                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        name="comment"
                        label="Comment"
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* Empty column for balance */}
                    </Col>
                  </Row>

                </Form>

                {/* Parent Profiles Section */}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ 
                    color: isDarkMode ? '#fff' : '#262626',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Parent profiles
                  </h3>
                  <Row gutter={12}>
                    <Col span={8}>
                      <Form.Item label="Desk profile">
                        <Select defaultValue="None">
                          <Option value="None">None</Option>
                          <Option value="Profile1">Profile1</Option>
                          <Option value="Profile2">Profile2</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item label="Profile Name">
                        <Space.Compact>
                          <Input placeholder="Search profiles..." />
                          <Select defaultValue="All" style={{ width: 80 }}>
                            <Option value="All">All</Option>
                            <Option value="Shared">Shared</Option>
                            <Option value="Personal">Personal</Option>
                          </Select>
                          <Button icon={<SearchOutlined />}>Search</Button>
                        </Space.Compact>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={12} justify="center" style={{ marginTop: '4px' }}>
                    <Col span={8}>
                      <div style={{ 
                        border: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
                        height: '160px',
                        marginTop: '2px'
                      }}>
                        <div style={{
                          backgroundColor: '#8B5FBF',
                          color: 'white',
                          padding: '4px 8px',
                          fontWeight: '600',
                          fontSize: '11px'
                        }}>
                          Available Profiles ({availableProfiles.length})
                        </div>
                        <div 
                          className="transfer-list-scroll"
                          style={{ 
                            height: '128px', 
                            overflow: 'auto',
                            padding: '4px',
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff'
                          }}>
                          <List
                            dataSource={filteredAvailableProfiles}
                            renderItem={(profile) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Checkbox
                                  checked={selectedProfileItems.includes(profile.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedProfileItems([...selectedProfileItems, profile.id]);
                                    } else {
                                      setSelectedProfileItems(selectedProfileItems.filter(id => id !== profile.id));
                                    }
                                  }}
                                >
                                  {profile.name} ({profile.type})
                                </Checkbox>
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={handleProfileAdd}
                        disabled={selectedProfileItems.length === 0}
                        style={{ 
                          marginBottom: '4px',
                          backgroundColor: '#8B5FBF',
                          borderColor: '#8B5FBF',
                          borderRadius: '4px',
                          fontSize: '11px',
                          height: '24px',
                          padding: '0 8px',
                          fontWeight: '500'
                        }}
                      >
                        Add &gt;&gt;
                      </Button>
                      <Button 
                        size="small"
                        onClick={handleProfileRemove}
                        disabled={selectedProfileItems.length === 0}
                        style={{
                          borderColor: '#8B5FBF',
                          color: '#8B5FBF',
                          borderRadius: '4px',
                          fontSize: '11px',
                          height: '24px',
                          padding: '0 8px',
                          fontWeight: '500'
                        }}
                      >
                        &lt;&lt; Remove
                      </Button>
                    </Col>
                    
                    <Col span={8}>
                      <div style={{ 
                        border: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
                        height: '160px',
                        marginTop: '6px'
                      }}>
                        <div style={{
                          backgroundColor: '#8B5FBF',
                          color: 'white',
                          padding: '4px 8px',
                          fontWeight: '600',
                          fontSize: '11px'
                        }}>
                          Selected Profiles ({selectedProfiles.length})
                        </div>
                        <div 
                          className="transfer-list-scroll"
                          style={{ 
                            height: '128px', 
                            overflow: 'auto',
                            padding: '4px',
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff'
                          }}>
                          <List
                            dataSource={selectedProfiles}
                            renderItem={(profile) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Checkbox
                                  checked={selectedProfileItems.includes(profile.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedProfileItems([...selectedProfileItems, profile.id]);
                                    } else {
                                      setSelectedProfileItems(selectedProfileItems.filter(id => id !== profile.id));
                                    }
                                  }}
                                >
                                  {profile.name} ({profile.type})
                                </Checkbox>
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Directories Section */}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ 
                    color: isDarkMode ? '#fff' : '#262626',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Directories
                  </h3>
                  <Row gutter={12} justify="center" style={{ marginTop: '4px' }}>
                    <Col span={8}>
                      <div style={{ 
                        border: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
                        height: '160px',
                        marginTop: '2px'
                      }}>
                        <div style={{
                          backgroundColor: '#8B5FBF',
                          color: 'white',
                          padding: '4px 8px',
                          fontWeight: '600',
                          fontSize: '11px'
                        }}>
                          Available Directories ({availableDirectories.length})
                        </div>
                        <div 
                          className="transfer-list-scroll"
                          style={{ 
                            height: '128px', 
                            overflow: 'auto',
                            padding: '4px',
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff'
                          }}>
                          <List
                            dataSource={availableDirectories}
                            renderItem={(directory) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Checkbox
                                  checked={selectedDirectoryItems.includes(directory.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDirectoryItems([...selectedDirectoryItems, directory.id]);
                                    } else {
                                      setSelectedDirectoryItems(selectedDirectoryItems.filter(id => id !== directory.id));
                                    }
                                  }}
                                >
                                  {directory.name}
                                </Checkbox>
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    </Col>
                    
                    <Col span={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={handleDirectoryAdd}
                        disabled={selectedDirectoryItems.length === 0}
                        style={{ 
                          marginBottom: '4px',
                          backgroundColor: '#8B5FBF',
                          borderColor: '#8B5FBF',
                          borderRadius: '4px',
                          fontSize: '11px',
                          height: '24px',
                          padding: '0 8px',
                          fontWeight: '500'
                        }}
                      >
                        Add &gt;&gt;
                      </Button>
                      <Button 
                        size="small"
                        onClick={handleDirectoryRemove}
                        disabled={selectedDirectoryItems.length === 0}
                        style={{
                          borderColor: '#8B5FBF',
                          color: '#8B5FBF',
                          borderRadius: '4px',
                          fontSize: '11px',
                          height: '24px',
                          padding: '0 8px',
                          fontWeight: '500'
                        }}
                      >
                        &lt;&lt; Remove
                      </Button>
                    </Col>
                    
                    <Col span={8}>
                      <div style={{ 
                        border: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
                        height: '160px',
                        marginTop: '6px'
                      }}>
                        <div style={{
                          backgroundColor: '#8B5FBF',
                          color: 'white',
                          padding: '4px 8px',
                          fontWeight: '600',
                          fontSize: '11px'
                        }}>
                          Selected Directories ({selectedDirectories.length})
                        </div>
                        <div 
                          className="transfer-list-scroll"
                          style={{ 
                            height: '128px', 
                            overflow: 'auto',
                            padding: '4px',
                            backgroundColor: isDarkMode ? '#1f1f1f' : '#fff'
                          }}>
                          <List
                            dataSource={selectedDirectories}
                            renderItem={(directory) => (
                              <List.Item style={{ padding: '4px 0' }}>
                                <Checkbox
                                  checked={selectedDirectoryItems.includes(directory.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDirectoryItems([...selectedDirectoryItems, directory.id]);
                                    } else {
                                      setSelectedDirectoryItems(selectedDirectoryItems.filter(id => id !== directory.id));
                                    }
                                  }}
                                >
                                  {directory.name}
                                </Checkbox>
                              </List.Item>
                            )}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Tools Section */}
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ 
                    color: isDarkMode ? '#fff' : '#262626',
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Tools
                  </h3>
                  <div style={{
                    padding: '16px',
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#404040' : '#e9ecef'}`,
                    borderRadius: '6px'
                  }}>
                    <Button type="link" style={{ 
                      padding: 0, 
                      textAlign: 'left',
                      color: isDarkMode ? '#fff' : '#262626',
                      fontSize: '14px'
                    }}>
                      Reset Password History
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: '32px', textAlign: 'right' }}>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={handleUpdate}
                      loading={loading}
                    >
                      Update
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={handleUpdateAndGoBack}
                      loading={loading}
                    >
                      Update and Go Back
                    </Button>
                    <Button 
                      icon={<UndoOutlined />}
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={handleRefresh}
                    >
                      Refresh
                    </Button>
                    <Button onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </Space>
                </div>
              </div>
            )}

            {activeTab !== 'general' && (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="secondary">{activeTab} configuration will be implemented here</Text>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserEdit;