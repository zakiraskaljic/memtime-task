import { Tag } from "antd";

interface Props {
  status: string;
}

const StatusTag = ({ status }: Props) => {
  const renderTag = () => {
    switch (status.toLowerCase()) {
      case "in-progress":
        return <Tag color="green">{status.toUpperCase()}</Tag>;
      case "pending":
        return <Tag color="yellow">{status.toUpperCase()}</Tag>;
      case "completed":
        return <Tag color="cyan">{status.toUpperCase()}</Tag>;
      default:
        return <Tag color="gold">{status.toUpperCase()}</Tag>;
    }
  };

  return renderTag();
};

export default StatusTag;
