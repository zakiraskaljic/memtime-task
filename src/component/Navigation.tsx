import { Layout, Menu, Typography } from "antd";
import { FieldTimeOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname;

  const menuItems = [
    { key: "/clients", label: "Clients", icon: <UserOutlined /> },
    { key: "/time-entries", label: "Time Entries", icon: <FieldTimeOutlined /> }
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 60px",
        background: "#001529",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
      <Title
        level={3}
        style={{
          color: "white",
          margin: 0,
          cursor: "pointer",
          fontWeight: 600
        }}
        onClick={() => navigate("/")}>
        Mem<span style={{ color: "#1b73e8" }}>time</span>
      </Title>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{
          borderBottom: "none",
          display: "flex",
          gap: 5
        }}
        itemIcon={null}
        overflowedIndicator={null}>
        {menuItems.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => navigate(item.key)}
            title={item.label}
            style={{
              padding: 10,
              borderRadius: 5,

              alignItems: "center"
            }}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
};

export default Navigation;
