import { dayjs } from "../utils/DayjsConfig";
import type { ITask } from "../model/Task";
import Task from "../model/Task";
import { API_BASE_URL, API_KEY } from "../utils/config";
import { cache as LocalStorageCache } from "../utils/LocalStorageCache";

export interface ITaskService {
  getTaskById(id: string): Promise<ITask>;
}

export const TaskListMapper = (jsonList: any = []): ITask[] => {
  return jsonList.map(TaskMapper);
};

const TaskMapper = (json: any): ITask => {
  const task = Task(json);
  task.createdAt = dayjs(json.createdAt);
  task.updatedAt = json.updatedAt ? dayjs(json.updatedAt) : undefined;
  return task;
};

export const TaskService = (): ITaskService => {
  const basePath = `${API_BASE_URL}/tasks`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  return {
    async getTaskById(id: string): Promise<ITask> {
      const cacheKey = `task_${id}`;
      const cached = LocalStorageCache.get<ITask>(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${basePath}/${id}`, { headers });
      if (!response.ok) throw new Error(`Task #${id} not found`);

      const data = await response.json();
      const mapped = TaskMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 180_000);
      return mapped;
    }
  };
};
