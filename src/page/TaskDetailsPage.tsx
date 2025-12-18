import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsCardLayout from "../component/DetailsCardLayout";
import type { ITask } from "../model/Task";
import { TaskService } from "../service/TaskService";
import { notification } from "antd";
import TimeEntriesTable from "../component/TimeEntriesTable";

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<ITask>();
  const [loading, setLoading] = useState(true);
  const taskService = TaskService();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    taskService
      .getTaskById(id)
      .then(setTask)
      .catch(() => {
        notification.error({
          title: "Error",
          description: "Task not found",
          placement: "topRight"
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!task && loading) {
    return <DetailsCardLayout loading={true} backTo="/clients" />;
  }

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <DetailsCardLayout loading={false} backTo="/clients" model={task} />
      </div>
      <div style={{ flex: 2, minWidth: 500 }}>
        <TimeEntriesTable task={task} />
      </div>
    </div>
  );
};

export default TaskDetailsPage;
