import { useEffect, useState } from "react";
import {
  Table,
  Skeleton,
  notification,
  Typography,
  Button,
  Space,
  InputNumber
} from "antd";
import { dayjs } from "../utils/DayjsConfig";
import { TimeEntryService } from "../service/TimeEntryService";
import type { ITimeEntry } from "../model/TimeEntry";
import { useNavigate } from "react-router-dom";
import TimeEntryFormModal from "./TimeEntryModal";
import type { ITask } from "../model/Task";
import type { SortOrder } from "antd/es/table/interface";

const { Text } = Typography;

interface Props {
  task?: ITask;
  isReadOnly?: boolean;
}

const TimeEntriesTable = ({ task, isReadOnly = false }: Props) => {
  const [timeEntries, setTimeEntries] = useState<ITimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ITimeEntry | undefined>(
    undefined
  );

  const timeEntryService = TimeEntryService();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [sorter, setSorter] = useState<{
    field?: string;
    order?: "asc" | "desc";
  }>({});
  const [customOffset, setCustomOffset] = useState(0);

  const loadTimeEntries = async (
    page = pagination.current,
    pageSize = pagination.pageSize,
    sortField?: string,
    sortOrder?: "asc" | "desc",
    offsetOverride?: number
  ) => {
    setLoading(true);
    try {
      const offset = offsetOverride ?? (page - 1) * pageSize;
      const { data, total } = await timeEntryService.getTimeEntries({
        limit: pageSize,
        offset,
        sortBy: sortField ?? sorter.field,
        order: sortOrder ?? sorter.order
      });
      const filtered = task?.id
        ? data.filter((e) => Number(e.taskId) === Number(task.id))
        : data;
      setTimeEntries(filtered);
      setPagination((prev) => ({ ...prev, current: page, pageSize, total }));
    } catch (error) {
      notification.error({ message: "Failed to load time entries" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeEntries();
  }, [task]);

  const handleTableChange = (pag: any, _filters: any, sorterParam: any) => {
    const sortField = sorterParam.field;

    const sortOrder: "asc" | "desc" | undefined =
      sorterParam.order === "ascend"
        ? "asc"
        : sorterParam.order === "descend"
        ? "desc"
        : "asc";

    const offsetOverride = customOffset > 0 ? customOffset : 0;
    loadTimeEntries(
      pag.current,
      pag.pageSize,
      sortField,
      sortOrder,
      offsetOverride
    );

    setSorter({ field: sortField, order: sortOrder });
  };

  const handleCreate = () => {
    setEditingEntry(undefined);
    setModalVisible(true);
  };

  const handleEdit = (entry: ITimeEntry) => {
    setEditingEntry(entry);
    setModalVisible(true);
  };

  const handleDelete = async (entry: ITimeEntry) => {
    try {
      await timeEntryService.deleteTimeEntry(entry.id);
      notification.success({ message: "Deleted successfully" });
      loadTimeEntries();
    } catch {
      notification.error({ message: "Failed to delete entry" });
    }
  };

  const columns = [
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
      title: "Task ID",
      dataIndex: "taskId",
      key: "taskId",
      sorter: true,
      sortOrder:
        sorter.field === "taskId"
          ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
          : null
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      sorter: true,
      sortOrder:
        sorter.field === "comment"
          ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
          : null
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      sorter: true,
      sortOrder:
        sorter.field === "start"
          ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
          : null,
      render: (value: any) =>
        value ? (
          <Text>{dayjs(value).format("DD/MM/YYYY HH:mm:ss")}</Text>
        ) : undefined
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      sorter: true,
      sortOrder:
        sorter.field === "end"
          ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
          : null,
      render: (value: any) =>
        value ? (
          <Text>{dayjs(value).format("DD/MM/YYYY HH:mm:ss")}</Text>
        ) : undefined
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortOrder:
        sorter.field === "createdAt"
          ? ((sorter.order === "asc" ? "ascend" : "descend") as SortOrder)
          : null,
      render: (value: any) =>
        value ? (
          <Text>{dayjs(value).format("DD/MM/YYYY HH:mm:ss")}</Text>
        ) : undefined
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, entry: ITimeEntry) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/time-entries/${entry.id}`)}>
            Details
          </Button>

          {!isReadOnly && (
            <>
              <Button type="link" onClick={() => handleEdit(entry)}>
                Edit
              </Button>
              <Button type="link" danger onClick={() => handleDelete(entry)}>
                Delete
              </Button>
            </>
          )}
        </>
      )
    }
  ];

  if (loading) return <Skeleton active />;

  return (
    <div>
      {!isReadOnly && (
        <>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={handleCreate}>
            Create Time Entry
          </Button>

          <TimeEntryFormModal
            visible={modalVisible}
            entry={editingEntry}
            onClose={() => setModalVisible(false)}
            onSaved={loadTimeEntries}
            task={task}
          />
        </>
      )}
      <Space style={{ padding: 10 }}>
        <Text>Offset</Text>
        <InputNumber
          min={0}
          value={customOffset}
          onChange={(value) => setCustomOffset(value ?? 0)}
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
      <Table
        columns={columns}
        dataSource={timeEntries}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true
        }}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default TimeEntriesTable;
