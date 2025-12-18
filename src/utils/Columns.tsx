import { Button } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import type { IClientPresentationModel } from "../model/presentationModel/ClientPresentationModel";
import type { ITask } from "../model/Task";
import type { IProjectPresentationModel } from "../model/presentationModel/ProjectPresentationModel";
import { useNavigate } from "react-router-dom";
import StatusTag from "../component/StatusTag";

export const clientColumns = (
  sorter: { field?: string; order?: "asc" | "desc" },
  navigate: ReturnType<typeof useNavigate>
) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    sorter: true,
    sortOrder:
      sorter.field === "id"
        ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
        : null
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: true,
    sortOrder:
      sorter.field === "name"
        ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
        : null
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    sorter: true,
    sortOrder:
      sorter.field === "description"
        ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
        : null
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    sorter: true,
    sortOrder:
      sorter.field === "status"
        ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
        : null,
    render: (status: string) => <StatusTag status={status} />
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: any, client: IClientPresentationModel) => (
      <Button type="link" onClick={() => navigate(`/clients/${client.id}`)}>
        Details
      </Button>
    )
  }
];

export const projectTaskColumns = (
  navigate: ReturnType<typeof useNavigate>
) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => <StatusTag status={status} />
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: any, task: ITask) => (
      <Button type="link" onClick={() => navigate(`/tasks/${task.id}`)}>
        Details
      </Button>
    )
  }
];

export const clientProjectColumns = (
  navigate: ReturnType<typeof useNavigate>
) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => <StatusTag status={status} />
  },
  {
    title: "Actions",
    key: "actions",
    render: (_: any, project: IProjectPresentationModel) => (
      <Button type="link" onClick={() => navigate(`/projects/${project.id}`)}>
        Details
      </Button>
    )
  }
];
