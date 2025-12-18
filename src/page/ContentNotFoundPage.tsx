import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const ContentNotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px"
      }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button type="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};

export default ContentNotFoundPage;
