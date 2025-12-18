import { TaskListMapper } from "../../service/TaskService";
import type { IProject } from "../Project";
import type { ITask } from "../Task";

export interface TProjectPresentationModel extends IProject {
  tasks?: ITask[];
}

export interface IProjectPresentationModel extends TProjectPresentationModel {}

const ProjectPresentationModel = (
  project: IProject,
  tasks: ITask[] = []
): IProjectPresentationModel => {
  return {
    ...project,
    tasks: TaskListMapper(tasks)
  };
};

export default ProjectPresentationModel;
