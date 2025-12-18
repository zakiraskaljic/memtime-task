import { dayjs, type Dayjs } from "../utils/DayjsConfig";
import Model from "./Model";

export interface TProject {
  id: number;
  clientId: number;
  name: string;
  description?: string;
  status?: string;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
}

export interface IProject extends TProject {
  create(value: Partial<TProject>): IProject;
}

const ValidateObject = (obj: Partial<TProject>): TProject => {
  if (!obj.id) throw new Error("Project id is required");
  if (!obj.name) throw new Error("Project name is required");
  if (!obj.clientId) throw new Error("Project has to be assigned to a client");
  return {
    id: obj.id,
    clientId: obj.clientId,
    name: obj.name,
    description: obj.description,
    status: obj.status,
    createdAt: obj.createdAt || dayjs(),
    updatedAt: obj.updatedAt || dayjs()
  };
};

const Project = Model((model: TProject): IProject => {
  const _project: TProject = { ...model };

  const create = (value: Partial<TProject>): IProject => {
    const obj = ValidateObject({ ..._project, ...value });
    return Project(obj);
  };

  return {
    get id() {
      return _project.id;
    },
    set id(value) {
      _project.id = value;
    },
    get clientId() {
      return _project.clientId;
    },
    set clientId(value) {
      _project.clientId = value;
    },
    get name() {
      return _project.name;
    },
    set name(value) {
      _project.name = value;
    },
    get description() {
      return _project.description;
    },
    set description(value) {
      _project.description = value;
    },
    get status() {
      return _project.status;
    },
    set status(value) {
      _project.status = value;
    },
    get createdAt() {
      return _project.createdAt;
    },
    set createdAt(value) {
      _project.createdAt = value;
    },
    get updatedAt() {
      return _project.updatedAt;
    },
    set updatedAt(value) {
      _project.updatedAt = value;
    },
    create
  };
});

export default Project;
