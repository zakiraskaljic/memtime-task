import { useEffect } from "react";
import { Modal, Form, Input, DatePicker, notification, Select } from "antd";
import { dayjs } from "../utils/DayjsConfig";
import type { ITimeEntry } from "../model/TimeEntry";
import { TimeEntryService } from "../service/TimeEntryService";
import type { ITask } from "../model/Task";

interface Props {
  visible: boolean;
  entry?: ITimeEntry;
  onClose: () => void;
  onSaved: () => void;
  task?: ITask;
}

const TimeEntryFormModal = ({
  visible,
  entry,
  onClose,
  onSaved,
  task
}: Props) => {
  const [form] = Form.useForm();
  const timeEntryService = TimeEntryService();

  useEffect(() => {
    if (entry) {
      form.setFieldsValue({
        taskId: entry.taskId,
        comment: entry.comment,
        start: entry.start,
        end: entry.end
      });
    } else {
      form.resetFields();
    }
  }, [entry, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        taskId: Number(values.taskId),
        comment: values.comment,
        start: dayjs(values.start),
        end: dayjs(values.end)
      } as ITimeEntry;

      if (entry) {
        await timeEntryService.updateTimeEntry(entry.id, payload);
        notification.success({ description: "Updated successfully" });
      } else {
        await timeEntryService.createTimeEntry(payload);
        notification.success({ description: "Created successfully" });
      }

      onClose();
      onSaved();
    } catch (e) {
      notification.error({ description: "Failed to save entry" });
    }
  };

  return (
    <Modal
      open={visible}
      title={entry ? "Update Time Entry" : "Create Time Entry"}
      onCancel={onClose}
      onOk={handleSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Task"
          name="taskId"
          initialValue={task?.id || entry?.taskId}
          rules={[{ required: true, message: "Task is required" }]}>
          <Select disabled>
            <Select.Option value={task?.id || entry?.taskId}>
              {task?.name || `Task ${entry?.taskId}`}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Comment"
          name="comment"
          rules={[{ required: true, message: "Comment is required" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Start"
          name="start"
          rules={[{ required: true, message: "Start time is required" }]}>
          <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label="End"
          name="end"
          rules={[{ required: true, message: "End time is required" }]}>
          <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TimeEntryFormModal;
