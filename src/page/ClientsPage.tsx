import { Typography } from "antd";
import ClientsTable from "../component/ClientsTable";

const { Title } = Typography;

const ClientsPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Title level={1}>Clients</Title>
      <ClientsTable />
    </div>
  );
};

export default ClientsPage;
