import { Card, Skeleton, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import StatusTag from "./StatusTag";
import { dayjs } from "../utils/DayjsConfig";

const { Text } = Typography;

interface DetailsCardLayoutProps<T = any> {
  loading: boolean;
  backTo: string;
  model?: T;
}

const DetailsCardLayout = <T extends object>({
  loading,
  backTo,
  model
}: DetailsCardLayoutProps<T>) => {
  const navigate = useNavigate();

  if (loading && !model) return <Skeleton active />;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 20,
        minHeight: "100vh",
        columnGap: 20
      }}>
      <Button
        type="default"
        onClick={() => navigate(backTo)}
        style={{ marginBottom: 50 }}>
        Back
      </Button>
      <Card
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        {model
          ? Object.entries(model)
              .filter(
                ([key, value]) =>
                  typeof value === "string" ||
                  typeof value === "number" ||
                  dayjs.isDayjs(value)
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <Text strong style={{ marginRight: 4 }}>
                    {key}:
                  </Text>
                  {key === "status" ? (
                    <StatusTag status={String(value)} />
                  ) : dayjs.isDayjs(value) ? (
                    <Text>{value.format("DD/MM/YYYY HH:mm:ss")}</Text>
                  ) : (
                    <Text>{value}</Text>
                  )}
                </div>
              ))
          : "No data available"}
      </Card>
    </div>
  );
};

export default DetailsCardLayout;
