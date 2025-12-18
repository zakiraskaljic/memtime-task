import { dayjs } from "../utils/DayjsConfig";
import type { IProject } from "../model/Project";
import Project from "../model/Project";
import { API_BASE_URL, API_KEY } from "../utils/config";
import type { ITask } from "../model/Task";
import { TaskListMapper } from "./TaskService";
import { cache as LocalStorageCache } from "../utils/LocalStorageCache";
import type { IQueryParams } from "../interface/IQueryParams";

export interface IProjectService {
  getProjectById(id: string): Promise<IProject>;
  getProjectTasks(projectId: number): Promise<{ data: ITask[]; total: number }>;
}

export const ProjectListMapper = (jsonList: any = []): IProject[] => {
  return jsonList.map(ProjectMapper);
};

const ProjectMapper = (json: any): IProject => {
  const project = Project(json);
  project.createdAt = dayjs(json.createdAt);
  project.updatedAt = json.updatedAt ? dayjs(json.updatedAt) : undefined;
  return project;
};

export const ProjectService = (): IProjectService => {
  const basePath = `${API_BASE_URL}/projects`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  return {
    async getProjectById(id: string): Promise<IProject> {
      const cacheKey = `project_${id}`;
      const cached = LocalStorageCache.get<IProject>(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${basePath}/${id}`, { headers });
      if (!response.ok) throw new Error("Project not found");

      const data = await response.json();
      const mapped = ProjectMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 60_000);
      return mapped;
    },

    async getProjectTasks(projectId: number, queryParam?: IQueryParams) {
      const query = new URLSearchParams();
      if (queryParam?.limit) query.set("limit", queryParam.limit.toString());
      if (queryParam?.offset) query.set("offset", queryParam.offset.toString());
      if (queryParam?.sortBy) query.set("sortBy", queryParam.sortBy);
      if (queryParam?.order) query.set("order", queryParam.order);

      const cacheKey = `project_${projectId.toString()}_tasks_${query.toString()}`;
      const cached = LocalStorageCache.get<ITask[]>(cacheKey);
      if (cached) return { data: TaskListMapper(cached), total: cached.length };
      const response = await fetch(`${basePath}/${projectId}/tasks`, {
        headers
      });
      if (!response.ok) throw new Error("Tasks not found for project");

      const data = await response.json();
      const mapped = TaskListMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 60_000);
      return { data: mapped, total: mapped.length };
    }
  };
};
