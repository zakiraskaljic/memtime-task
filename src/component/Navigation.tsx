import { Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname;

  const menuItems = [
    { key: "/clients", label: "Clients" },
    { key: "/time-entries", label: "Time Entries" }
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        background: "#001529",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
      <Title
        level={3}
        style={{
          color: "#fff",
          margin: 0,
          cursor: "pointer",
          fontWeight: 600
        }}
        onClick={() => navigate("/")}>
        Memtime
      </Title>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={menuItems.map((item) => ({
          key: item.key,
          label: item.label,
          onClick: () => navigate(item.key)
        }))}
        style={{
          background: "transparent",
          borderBottom: "none",
          fontWeight: 500
        }}
      />
    </Header>
  );
};

export default Navigation;
