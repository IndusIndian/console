// src/App.tsx
import { useEffect, useMemo, useCallback, useState, memo } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAppContext } from "./contexts/AppContext";
import {
  ConfigProvider,
  Layout,
  Menu,
  Switch,
  theme,
  Select,
  Dropdown,
  Spin,
} from "antd";
import {
  DownOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import BTLogo from "./components/BTLogo";
import Login from "./components/Login";
import Home from "./components/Home";
import { lazy, Suspense } from "react";

// Lazy load components for better performance
const Turrets = lazy(() => import("./components/DeviceManagement/Turrets"));
const BTPT = lazy(() => import("./components/DeviceManagement/BTPT"));
const TPOs = lazy(() => import("./components/DeviceManagement/TPOs"));
const Lines = lazy(() => import("./components/DeviceManagement/Lines"));
const Zones = lazy(() => import("./components/DeviceManagement/Zones"));
const BTPTClusters = lazy(() => import("./components/DeviceManagement/BTPTClusters"));
const RecordingServers = lazy(() => import("./components/DeviceManagement/RecordingServers"));
const Users = lazy(() => import("./components/AccountManagement/Users"));
const UserEdit = lazy(() => import("./components/AccountManagement/UserEdit"));

const { Header, Content, Footer } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

const App = memo(function App() {
  const { pageSize, setPageSize, isDarkMode, toggleTheme, timeRemaining } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  // Add dark class to body for proper dark mode styling with smooth transition
  useEffect(() => {
    // Temporarily disable transitions during class change to prevent flicker
    document.body.classList.add('no-transition');
    
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Re-enable transitions after a brief delay
    requestAnimationFrame(() => {
      document.body.classList.remove('no-transition');
    });
  }, [isDarkMode]);

  // Page loading effect for smooth transitions
  useEffect(() => {
    setPageLoading(true);
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // helper for navigation links - memoized
  const nav = useCallback((path: string, label: string) => <Link to={path}>{label}</Link>, []);

  // Memoize theme configuration for better performance
  const themeConfig = useMemo(() => ({
    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: "#6400AA", // BT purple
      fontSize: 13,
      controlHeight: 32,
      colorBgContainer: isDarkMode ? "#141414" : "#ffffff",
      colorBgElevated: isDarkMode ? "#1f1f1f" : "#ffffff",
      colorText: isDarkMode ? "#ffffff" : "#000000",
      colorTextSecondary: isDarkMode ? "#a6a6a6" : "#666666",
      colorBorder: isDarkMode ? "#424242" : "#d9d9d9",
      colorBorderSecondary: isDarkMode ? "#303030" : "#f0f0f0",
      colorFillSecondary: isDarkMode ? "#262626" : "#fafafa",
      colorFillTertiary: isDarkMode ? "#1f1f1f" : "#f5f5f5",
      colorFillQuaternary: isDarkMode ? "#141414" : "#f0f0f0",
    },
    components: {
      Menu: {
        itemHeight: 28, // compact vertical menu
      },
    },
  }), [isDarkMode]);

  // Full menu with routing paths - memoized
  const menuItems = useMemo(() => [
    {
      key: "device",
      label: "Device Management",
      children: [
        { key: "prod-tools", label: nav("/device/btpt", "Productivity Tools") },
        { key: "prod-tools-clusters", label: nav("/device/btptclusters", "Productivity Tools Clusters") },
        { key: "geo-groups", label: nav("/device/geographic-groups", "Geographic Groups") },
        { key: "turrets", label: nav("/device/turrets", "Turrets") },
        { key: "lines", label: nav("/device/lines", "Lines") },
        { key: "mobile-traders", label: nav("/device/mobile-traders", "Mobile Traders") },
        { key: "pcs", label: nav("/device/pcs", "PCs") },
        { key: "tpos", label: nav("/device/tpos", "TPOs") },
        { key: "zones", label: nav("/device/zones", "Zones") },
        { key: "tpo-clusters", label: nav("/device/tpo-clusters", "TPO Clusters") },
        { key: "tpo-floor", label: nav("/device/tpo-floor-map", "TPOs Floor Map") },
        { key: "recording", label: nav("/device/recording-servers", "Recording Servers") },
        { key: "sip-gateways", label: nav("/device/sip-gateways", "SIP Private Wire Gateways") },
        { key: "pbx-clusters", label: nav("/device/pbx-clusters", "PBX Clusters") },
        { key: "dmr", label: nav("/device/dmr-ais-gateways", "DMR AIS Gateways") },
      ],
    },
    {
      key: "account",
      label: "Account Management",
      children: [
        { key: "users", label: nav("/account/users", "Users") },
        { key: "profiles", label: nav("/account/shared-profiles", "Shared Profiles") },
      ],
    },
    {
      key: "telephony",
      label: "Telephony",
      children: [
        { key: "lines", label: nav("/telephony/lines", "Lines") },
        { key: "elins", label: nav("/telephony/elins", "ELINs") },
        { key: "intercom", label: nav("/telephony/intercom-groups", "Intercom Groups") },
        { key: "presence", label: nav("/telephony/presence-groups", "Presence Groups") },
        { key: "slots", label: nav("/telephony/slots", "Slots") },
      ],
    },
    {
      key: "security",
      label: "Security",
      children: [
        { key: "apps", label: nav("/security/applications", "Applications") },
        { key: "passwords", label: nav("/security/password-policies", "Password Policies") },
      ],
    },
    {
      key: "system",
      label: "System",
      children: [
        { key: "monitoring", label: nav("/system/monitoring", "Monitoring") },
        {
          key: "provisioning",
          label: "Provisioning",
          children: [
            { key: "tss", label: nav("/system/provisioning/tss-settings", "TSS Settings") },
            { key: "devuser", label: nav("/system/provisioning/device-user-settings", "Device & User Settings") },
            { key: "zone-settings", label: nav("/system/provisioning/zone-settings", "Zone Settings") },
            { key: "devices", label: nav("/system/provisioning/devices", "Devices") },
            { key: "users-sub", label: nav("/system/provisioning/users", "Users") },
            { key: "pcs-sub", label: nav("/system/provisioning/pcs", "PCs") },
            { key: "lines-sub", label: nav("/system/provisioning/lines", "Lines") },
            { key: "tpo-places", label: nav("/system/provisioning/tpo-places", "TPO Places") },
            { key: "tpo-slots", label: nav("/system/provisioning/tpo-slots", "TPO Slots") },
            { key: "phonebook", label: nav("/system/provisioning/phonebook", "Phonebook") },
            { key: "sip-wire", label: nav("/system/provisioning/sip-gateways", "SIP Private Wire Gateways") },
            { key: "sip-lines", label: nav("/system/provisioning/sip-lines", "SIP Private Wire Lines") },
            { key: "dmr-gw", label: nav("/system/provisioning/dmr-ais-gateways", "DMR AIS Gateways") },
            { key: "dmr-dispatch", label: nav("/system/provisioning/dmr-dispatchers", "DMR AIS Dispatchers") },
            { key: "dmr-talk", label: nav("/system/provisioning/dmr-talk-groups", "DMR AIS Talk Groups") },
            { key: "streams", label: nav("/system/provisioning/video-streams", "Video Streams") },
            { key: "elin-links", label: nav("/system/provisioning/elin-links", "ELIN links") },
          ],
        },
        {
          key: "sessions",
          label: "Sessions",
          children: [
            { key: "sess-tss", label: nav("/system/sessions/tss", "TSS Settings") },
            { key: "sess-users", label: nav("/system/sessions/device-user", "Device & User Settings") },
            { key: "sess-zone", label: nav("/system/sessions/zone-settings", "Zone Settings") },
          ],
        },
        {
          key: "settings",
          label: "Settings",
          children: [
            { key: "job-policies", label: nav("/system/settings/job-policies", "Job Policies") },
            { key: "licenses", label: nav("/system/settings/licenses", "Licenses") },
            { key: "models", label: nav("/system/settings/models", "Models") },
          ],
        },
        { key: "firmware", label: nav("/system/firmware", "Firmware management") },
        { key: "ringtones", label: nav("/system/ringtones", "Ringtones") },
        { key: "ringtone-set", label: nav("/system/ringtone-set", "Ringtone Set") },
        { key: "phonebook-main", label: nav("/system/phonebook", "Phonebook") },
        { key: "alt-labels", label: nav("/system/alternate-labels", "Alternate Labels") },
        { key: "directories", label: nav("/system/directories", "Directories") },
        { key: "video-streams", label: nav("/system/video-streams", "Video Streams") },
        { key: "announcements", label: nav("/system/announcement-messages", "Announcement Messages") },
      ],
    },
    {
      key: "console",
      label: "Console",
      children: [
        { key: "admins", label: nav("/console/administrators", "Administrators") },
        { key: "groups", label: nav("/console/admin-groups", "Administrator Groups") },
        { key: "password", label: nav("/console/admin-password", "Admin. Password") },
        { key: "help", label: nav("/console/help", "Help") },
      ],
    },
  ], [nav]);

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* === FIXED HEADER === */}
        <Header
          style={{
            padding: 0,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            width: "100%",
            background: "#6400AA",
            height: "64px",
            flexShrink: 0,
            transition: "background-color 0.3s ease, color 0.3s ease"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100%",
              paddingInline: 24,
            }}
          >
            {/* Left: Logo / App title */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12,
              color: "#fff", 
              fontWeight: 700, 
              fontSize: "1.1rem" 
            }}>
              <BTLogo size={36} />
              <span>Trading & Command</span>
            </div>

            {/* Right: Items per page, Username, Theme, Logout */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                color: "#fff",
              }}
            >
              {/* Items per page */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>Items per page:</span>
                <Select
                  value={pageSize.toString()}
                  onChange={(value) => setPageSize(parseInt(value, 10))}
                  style={{ width: 80 }}
                  options={[
                    { value: "25", label: "25" },
                    { value: "50", label: "50" },
                    { value: "100", label: "100" },
                    { value: "500", label: "500" },
                  ]}
                />
              </div>

              {/* Username */}
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Profile" },
                    { key: "2", label: "Settings" },
                  ],
                }}
              >
                <span style={{ cursor: "pointer" }}>
                  Username: <b>admin1</b> <DownOutlined />
                </span>
              </Dropdown>

              {/* Theme switch */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 6,
                transition: "all 0.3s ease"
              }}>
                <span style={{ transition: "color 0.3s ease" }}>
                  {isDarkMode ? "Dark" : "Light"}
                </span>
                <Switch 
                  checked={isDarkMode} 
                  onChange={toggleTheme}
                  style={{ transition: "all 0.3s ease" }}
                />
              </div>

              {/* Logout */}
              <span
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onClick={() => setIsLoggedIn(false)}
              >
                <LogoutOutlined /> Logout
              </span>
            </div>
          </div>
        </Header>

        {/* === SECOND NAV MENU BAR === */}
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 999,
            flexShrink: 0,
            transition: "background-color 0.3s ease, color 0.3s ease",
            padding: "0 24px",
            background: isDarkMode 
              ? "linear-gradient(135deg, #1f1f1f 0%, #262626 100%)" 
              : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
            borderBottom: isDarkMode ? "1px solid #303030" : "1px solid #e8e8e8",
            boxShadow: isDarkMode 
              ? "0 2px 8px rgba(0, 0, 0, 0.3)" 
              : "0 2px 8px rgba(0, 0, 0, 0.06)"
          }}
        >
          <Menu
            mode="horizontal"
            theme={isDarkMode ? "dark" : "light"}
            items={menuItems}
            style={{
              height: "48px",
              lineHeight: "48px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              flex: 1,
              minHeight: "48px",
              maxHeight: "48px",
              transition: "background-color 0.3s ease, color 0.3s ease",
              background: "transparent",
              border: "none",
              boxShadow: "none"
            }}
            overflowedIndicator={null}
          />
        </div>

        {/* === MAIN CONTENT === */}
        <Content 
          style={{ 
            marginTop: "112px", // 64px header + 48px menu
            marginBottom: "32px", // Space for footer
            padding: 24,
            overflow: "auto", // Allow scrolling on main content
            flex: 1,
            minHeight: "calc(100vh - 144px)", // Minimum height
            display: "flex",
            flexDirection: "column",
            transition: "background-color 0.3s ease, color 0.3s ease"
          }}
        >
          <Spin 
            spinning={pageLoading} 
            tip="Loading..."
            style={{ 
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/device/turrets" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Turrets/>
                </Suspense>
              } />
              <Route path="/device/lines" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Lines/>
                </Suspense>
              } />
              <Route path="/device/btpt" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BTPT/>
                </Suspense>
              } />
              <Route path="/device/tpos" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <TPOs/>
                </Suspense>
              } />
              <Route path="/device/zones" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Zones/>
                </Suspense>
              } />
              <Route path="/device/btptclusters" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <BTPTClusters/>
                </Suspense>
              } />
              <Route path="/device/recording-servers" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <RecordingServers/>
                </Suspense>
              } />
              <Route path="/account/users" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Users/>
                </Suspense>
              } />
              <Route path="/account/users/:id/edit" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <UserEdit/>
                </Suspense>
              } />
              {/* Catch-all route - redirect any invalid URLs to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Spin>
        </Content>

        {/* === FOOTER === */}
        <Footer 
          style={{ 
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "32px",
            lineHeight: "32px",
            padding: "4px 16px",
            flexShrink: 0,
            zIndex: 998,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            color: "#666",
            transition: "background-color 0.3s ease, color 0.3s ease"
          }}
        >
          <div style={{ textAlign: "left", flex: 1 }}>
            Copyright © 2005-{new Date().getFullYear()} BT GROUP PLC All rights reserved.
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            {timeRemaining || 'Session not started'}
          </div>
          <div style={{ textAlign: "right", flex: 1 }}>
            10.1.3.58541
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
});

export default App;
