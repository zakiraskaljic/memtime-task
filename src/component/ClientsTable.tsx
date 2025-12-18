import React, { useEffect, useState } from "react";
import { Space, Typography, InputNumber, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ExpandableTable } from "./ExpandableTable";
import { ClientService } from "../service/ClientService";
import { ProjectService } from "../service/ProjectService";
import {
  clientColumns,
  clientProjectColumns,
  projectTaskColumns
} from "../utils/Columns";
import ClientPresentationModel, {
  type IClientPresentationModel
} from "../model/presentationModel/ClientPresentationModel";
import ProjectPresentationModel, {
  type IProjectPresentationModel
} from "../model/presentationModel/ProjectPresentationModel";

const { Text } = Typography;

const ClientsTable: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [sorter, setSorter] = useState<{
    field?: string;
    order: "asc" | "desc";
  }>({ order: "asc" });
  const [customOffset, setCustomOffset] = useState(0);

  const clientService = ClientService();
  const projectService = ProjectService();
  const navigate = useNavigate();

  const loadClients = async (
    page = 1,
    pageSize = 10,
    sortField?: string,
    sortOrder?: "asc" | "desc",
    offsetOverride?: number
  ) => {
    setLoading(true);
    try {
      const offset = offsetOverride ?? (page - 1) * pageSize;
      const { data, total } = await clientService.getClients({
        limit: pageSize,
        offset,
        sortBy: sortField,
        order: sortOrder
      });
      setClients(data.map((c) => ClientPresentationModel(c)));
      setPagination({ current: page, pageSize, total });
    } catch {
      notification.error({
        title: "Error",
        description: "Failed to load clients.",
        placement: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClientProjects = async (client: IClientPresentationModel) => {
    const projects = await clientService.getClientProjects(client.id);
    return projects.data.map((p) => ProjectPresentationModel(p));
  };

  const loadProjectTasks = async (project: IProjectPresentationModel) => {
    const tasksResp = await projectService.getProjectTasks(project.id);
    return tasksResp.data;
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleTableChange = (pag: any, _filters: any, sorterParam: any) => {
    const sortField = sorterParam.field;
    const sortOrder: "asc" | "desc" =
      sorterParam.order === "ascend"
        ? "asc"
        : sorterParam.order === "descend"
        ? "desc"
        : "asc";
    const offsetOverride = customOffset > 0 ? customOffset : 0;

    loadClients(
      pag.current,
      pag.pageSize,
      sortField,
      sortOrder,
      offsetOverride
    );
    setSorter({ field: sortField, order: sortOrder });
  };

  return (
    <>
      <Space style={{ padding: 10 }}>
        <Text>Offset</Text>
        <InputNumber
          min={0}
          value={customOffset}
          onChange={(v) => setCustomOffset(v ?? 0)}
        />
        <Button
          title="Offset"
          onClick={() => {
            const page = Math.floor(customOffset / pagination.pageSize) + 1;
            handleTableChange(
              { current: page, pageSize: pagination.pageSize },
              {},
              sorter
            );
          }}>
          Go
        </Button>
      </Space>

      <ExpandableTable
        columns={clientColumns(sorter, navigate)}
        dataSource={clients}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true
        }}
        loadChildren={loadClientProjects}
        renderChildren={(projects) => (
          <ExpandableTable
            columns={clientProjectColumns(navigate)}
            dataSource={projects}
            rowKey="id"
            loadChildren={loadProjectTasks}
            renderChildren={(tasks) => (
              <ExpandableTable
                columns={projectTaskColumns(navigate)}
                dataSource={tasks}
                rowKey="id"
              />
            )}
          />
        )}
        onChange={handleTableChange}
      />
    </>
  );
};

export default ClientsTable;
