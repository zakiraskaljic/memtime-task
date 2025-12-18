import { Typography } from "antd";
import TimeEntriesTable from "../component/TimeEntriesTable";

const { Title } = Typography;

const TimeEntriesPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Title level={1}>Time Entries</Title>
      <TimeEntriesTable isReadOnly={true} />
    </div>
  );
};

export default TimeEntriesPage;
