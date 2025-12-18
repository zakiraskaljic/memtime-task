import type { IClient } from "../Client";
import type { IProject } from "../Project";
import type { ITask } from "../Task";
import type { IProjectPresentationModel } from "./ProjectPresentationModel";
import ProjectPresentationModel from "./ProjectPresentationModel";

export interface TClientPresentationModel extends IClient {
  projects?: IProjectPresentationModel[];
}

export interface IClientPresentationModel extends TClientPresentationModel {}

const ClientPresentationModel = (
  client: IClient,
  projects: IProject[] = [],
  tasksMap: Record<number, ITask[]> = {}
): IClientPresentationModel => {
  return {
    ...client,
    projects: projects.map((project) =>
      ProjectPresentationModel(project, tasksMap[project.id] || [])
    )
  };
};

export default ClientPresentationModel;
