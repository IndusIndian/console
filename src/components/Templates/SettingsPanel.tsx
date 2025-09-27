import React, { useState, useEffect, memo } from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface SettingsPanelProps {
  onUpdate?: (settings: any) => void;
  onRefresh?: () => void;
}

interface Setting {
  name: string;
  id: string;
  friendly_name: string;
  short_description: string;
  long_description: string;
  constraint_description: string;
  type: string;
  default_value: string;
  current_value?: string;
  inherited_value?: string;
  validator_range: string;
  validator_require: string;
  basic_level: string;
  mandatory: string;
  choices: Array<{ Text: string; Value: string }> | null;
}

interface Group {
  name: string;
  id: string;
  settings: Setting[];
}

interface Category {
  name: string;
  uid: string;
  groups: Group[];
}

interface SettingsData {
  categories: Category[];
}

const SettingsPanel: React.FC<SettingsPanelProps> = memo(({
  onUpdate,
  onRefresh
}) => {
  const { isDarkMode } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSettings, setSelectedSettings] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [selectedMode, setSelectedMode] = useState<'basic' | 'expert' | 'advanced'>('basic');

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setLoading(true);
    console.log('🔄 Loading settings from API...');
    
    try {
      // Try API first
      console.log('🌐 Attempting to fetch from: http://localhost:4000/settings');
      const response = await fetch('http://localhost:4000/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response URL:', response.url);
      console.log('📡 API Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Settings data loaded from API:', data);
      
      // Filter to only show "profile" category, exclude "boot"
      const filteredData = {
        categories: data.categories.filter((cat: Category) => cat.name === 'profile')
      };
      
      console.log('🔍 Filtered data (profile only):', filteredData);
      setSettingsData(filteredData);
      
      // Set default category and group
      if (filteredData.categories && filteredData.categories.length > 0) {
        const firstCategory = filteredData.categories[0];
        setSelectedCategory(firstCategory.name);
        if (firstCategory.groups && firstCategory.groups.length > 0) {
          setSelectedGroup(firstCategory.groups[0].name);
        }
        console.log('🎯 Set default category:', firstCategory.name, 'group:', firstCategory.groups[0]?.name);
      }
    } catch (apiError) {
      console.error('❌ API failed, trying fallback:', apiError);
      
      // Fallback to sample.json if API fails
      try {
        console.log('🔄 Trying fallback: /sample.json');
        const response = await fetch('/sample.json');
        console.log('📡 Fallback Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Fallback error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Settings data loaded from fallback:', data);
        
        // Filter to only show "profile" category, exclude "boot"
        const filteredData = {
          categories: data.categories.filter((cat: Category) => cat.name === 'profile')
        };
        
        console.log('🔍 Filtered fallback data (profile only):', filteredData);
        setSettingsData(filteredData);
        
        // Set default category and group
        if (filteredData.categories && filteredData.categories.length > 0) {
          const firstCategory = filteredData.categories[0];
          setSelectedCategory(firstCategory.name);
          if (firstCategory.groups && firstCategory.groups.length > 0) {
            setSelectedGroup(firstCategory.groups[0].name);
          }
          console.log('🎯 Set fallback category:', firstCategory.name, 'group:', firstCategory.groups[0]?.name);
        }
      } catch (fallbackError) {
        console.error('❌ Both API and fallback failed:', fallbackError);
        setSettingsData(null);
      }
    } finally {
      setLoading(false);
      console.log('🏁 Loading completed');
    }
  };

  const currentCategory = settingsData?.categories.find(cat => cat.name === selectedCategory);
  const currentGroup = currentCategory?.groups.find(group => group.name === selectedGroup);
  
  // Filter settings based on selected mode
  const currentSettings = (currentGroup?.settings || []).filter(setting => {
    switch (selectedMode) {
      case 'basic':
        return setting.basic_level === 'Y';
      case 'expert':
        return setting.basic_level === 'N' && setting.mandatory === 'N';
      case 'advanced':
        return setting.mandatory === 'Y';
      default:
        return true;
    }
  });

  const toggleDescription = (settingName: string) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(settingName)) {
      newExpanded.delete(settingName);
    } else {
      newExpanded.add(settingName);
    }
    setExpandedDescriptions(newExpanded);
  };

  const toggleSetting = (settingName: string) => {
    const newSelected = new Set(selectedSettings);
    if (newSelected.has(settingName)) {
      newSelected.delete(settingName);
    } else {
      newSelected.add(settingName);
    }
    setSelectedSettings(newSelected);
  };

  const renderSettingValue = (setting: Setting) => {
    const isEnabled = selectedSettings.has(setting.name);
    
    switch (setting.type) {
      case 'dd': // Dropdown
        return (
          <select
            value={setting.default_value}
            disabled={!isEnabled}
            style={{
              width: '100%',
              padding: '4px 6px',
              border: `1px solid ${isDarkMode ? '#404040' : '#d9d9d9'}`,
              borderRadius: '3px',
              backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '12px',
              height: '24px'
            }}
          >
            {setting.choices?.map((choice, index) => (
              <option key={index} value={choice.Value}>
                {choice.Text || choice.Value}
              </option>
            ))}
          </select>
        );
      case 'tb': // Textbox
        return (
          <input
            type="text"
            value={setting.default_value}
            disabled={!isEnabled}
            style={{
              width: '100%',
              padding: '4px 6px',
              border: `1px solid ${isDarkMode ? '#404040' : '#d9d9d9'}`,
              borderRadius: '3px',
              backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '12px',
              height: '24px'
            }}
          />
        );
      case 'rb': // Radio Button
        return (
          <div style={{ display: 'flex', gap: '12px' }}>
            {setting.choices?.map((choice, index) => (
              <label key={index} style={{ color: isDarkMode ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={setting.name}
                  value={choice.Value}
                  checked={setting.default_value === choice.Value}
                  disabled={!isEnabled}
                  className="settings-radio"
                />
                <span style={{ fontSize: '12px' }}>{choice.Text || choice.Value}</span>
              </label>
            ))}
          </div>
        );
      case 'bl': // Boolean
        return (
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ color: isDarkMode ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name={setting.name}
                value="true"
                checked={setting.default_value === 'true'}
                disabled={!isEnabled}
                className="settings-radio"
              />
              <span style={{ fontSize: '12px' }}>True</span>
            </label>
            <label style={{ color: isDarkMode ? '#fff' : '#000', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="radio"
                name={setting.name}
                value="false"
                checked={setting.default_value === 'false'}
                disabled={!isEnabled}
                className="settings-radio"
              />
              <span style={{ fontSize: '12px' }}>False</span>
            </label>
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={setting.default_value}
            disabled={!isEnabled}
            style={{
              width: '100%',
              padding: '4px 6px',
              border: `1px solid ${isDarkMode ? '#404040' : '#d9d9d9'}`,
              borderRadius: '3px',
              backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
              color: isDarkMode ? '#fff' : '#000',
              fontSize: '12px',
              height: '24px'
            }}
          />
        );
    }
  };

  return (
    <div 
      className={isDarkMode ? 'dark' : ''}
      style={{ 
        display: 'flex', 
        height: '100%', 
        backgroundColor: isDarkMode ? '#141414' : '#f5f5f5',
        overflow: 'hidden'
      }}>
      {/* Left Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
        borderRight: `1px solid ${isDarkMode ? '#303030' : '#d9d9d9'}`,
        padding: '8px 0',
        overflowY: 'auto',
        flexShrink: 0
      }}>
        {settingsData?.categories.map((category) => (
          <div key={category.name}>
            {category.groups.map((group) => (
              <div
                key={group.name}
                style={{
                  padding: '6px 12px',
                  backgroundColor: selectedGroup === group.name ? '#722ed1' : 'transparent',
                  color: selectedGroup === group.name ? '#fff' : (isDarkMode ? '#fff' : '#000'),
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: selectedGroup === group.name ? '600' : '500',
                  marginBottom: '1px',
                  borderRadius: '3px',
                  marginLeft: '6px',
                  marginRight: '6px',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.3'
                }}
                onClick={() => setSelectedGroup(group.name)}
              >
                {group.name} ({group.settings.length})
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Fixed Header */}
        <div style={{ 
          padding: '8px 12px 0 12px',
          flexShrink: 0,
          backgroundColor: isDarkMode ? '#141414' : '#f5f5f5'
        }}>
          <h2 style={{ 
            color: isDarkMode ? '#fff' : '#000', 
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            {currentGroup?.name} Settings
          </h2>

          {/* Mode Tabs */}
          <div className="settings-mode-tabs">
            {['basic', 'expert', 'advanced'].map((mode) => (
              <button
                key={mode}
                className={`settings-mode-tab ${selectedMode === mode ? 'active' : ''}`}
                onClick={() => setSelectedMode(mode as 'basic' | 'expert' | 'advanced')}
              >
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ 
          flex: 1, 
          padding: '8px 12px', 
          overflowY: 'auto', 
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ color: isDarkMode ? '#fff' : '#000' }}>Loading settings...</div>
            </div>
          ) : settingsData ? (
            <div style={{ flex: 1 }}>
              {/* Settings Table */}
              <div style={{
                backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
                border: `1px solid ${isDarkMode ? '#303030' : '#e8e8e8'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                flex: 1
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: isDarkMode ? '#2a2a2a' : '#fafafa' }}>
                      <th style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e8e8e8'}`,
                        color: isDarkMode ? '#fff' : '#000',
                        width: '250px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>Name</th>
                      <th style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e8e8e8'}`,
                        color: isDarkMode ? '#fff' : '#000',
                        width: '430px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>Value</th>
                      <th style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e8e8e8'}`,
                        color: isDarkMode ? '#fff' : '#000',
                        width: '140px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>Inherited Value</th>
                      <th style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        borderBottom: `1px solid ${isDarkMode ? '#404040' : '#e8e8e8'}`,
                        color: isDarkMode ? '#fff' : '#000',
                        width: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSettings.map((setting, index) => (
                      <React.Fragment key={setting.name}>
                        <tr style={{ 
                          backgroundColor: index % 2 === 0 ? (isDarkMode ? '#1f1f1f' : '#fff') : (isDarkMode ? '#2a2a2a' : '#fafafa')
                        }}>
                          <td style={{ padding: '6px', borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}` }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={selectedSettings.has(setting.name)}
                                onChange={() => toggleSetting(setting.name)}
                                className="settings-checkbox"
                              />
                              <span style={{ 
                                color: isDarkMode ? '#fff' : '#000',
                                fontSize: '12px',
                                lineHeight: '1.3'
                              }}>
                                {setting.friendly_name}
                              </span>
                            </label>
                          </td>
                          <td style={{ padding: '6px', borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}` }}>
                            {renderSettingValue(setting)}
                          </td>
                          <td style={{ 
                            padding: '6px', 
                            borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                            color: isDarkMode ? '#bfbfbf' : '#666',
                            fontSize: '12px'
                          }}>
                            -
                          </td>
                          <td style={{ 
                            padding: '6px', 
                            borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                            textAlign: 'center'
                          }}>
                            <span
                              style={{
                                color: expandedDescriptions.has(setting.name) ? '#722ed1' : '#faad14',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                              onClick={() => toggleDescription(setting.name)}
                            >
                              ?
                            </span>
                          </td>
                        </tr>
                        {expandedDescriptions.has(setting.name) && (
                          <tr>
                            <td colSpan={4} style={{ padding: '8px', backgroundColor: isDarkMode ? '#2a2a2a' : '#fffbe6' }}>
                              <div style={{ 
                                border: `1px solid ${isDarkMode ? '#404040' : '#ffe58f'}`,
                                borderRadius: '4px',
                                padding: '8px'
                              }}>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong style={{ color: isDarkMode ? '#fff' : '#262626', fontSize: '12px' }}>
                                    Key: {setting.name}
                                  </strong>
                                </div>
                                <div style={{ marginBottom: '6px' }}>
                                  <strong style={{ color: isDarkMode ? '#fff' : '#262626', fontSize: '12px' }}>Description:</strong>
                                  <div style={{ marginTop: '2px', color: isDarkMode ? '#bfbfbf' : '#595959', fontSize: '11px', lineHeight: '1.4' }}>
                                    {setting.long_description || setting.short_description || 'No description available'}
                                  </div>
                                </div>
                                {setting.constraint_description && (
                                  <div style={{ marginBottom: '6px' }}>
                                    <strong style={{ color: isDarkMode ? '#fff' : '#262626', fontSize: '12px' }}>Constraint:</strong>
                                    <div style={{ marginTop: '2px', color: isDarkMode ? '#bfbfbf' : '#595959', fontSize: '11px', lineHeight: '1.4' }}>
                                      {setting.constraint_description}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ color: isDarkMode ? '#fff' : '#000' }}>No settings data available</div>
            </div>
          )}
        </div>

        {/* Fixed Footer with Buttons */}
        <div style={{ 
          padding: '8px 12px',
          borderTop: `1px solid ${isDarkMode ? '#303030' : '#e8e8e8'}`,
          backgroundColor: isDarkMode ? '#1f1f1f' : '#fff',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '6px'
        }}>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: isDarkMode ? '#404040' : '#f0f0f0',
              color: isDarkMode ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#555' : '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#404040' : '#f0f0f0';
            }}
            onClick={() => {
              loadSettingsData();
              onRefresh?.();
            }}
          >
            Refresh
          </button>
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#722ed1',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#9254de';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#722ed1';
            }}
            onClick={() => onUpdate?.(selectedSettings)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
});

export default SettingsPanel;
