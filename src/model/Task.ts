import { dayjs, type Dayjs } from "../utils/DayjsConfig";
import Model from "./Model";

export interface TTask {
  id: number;
  parent: number;
  name: string;
  status?: string;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
}

export interface ITask extends TTask {
  create(value: Partial<TTask>): ITask;
}

const ValidateObject = (obj: Partial<TTask>): TTask => {
  if (!obj.id) throw new Error("Task id is required");
  if (!obj.name) throw new Error("Task name is required");
  if (!obj.parent) throw new Error("Task has to be assigned to a project");
  return {
    id: obj.id,
    parent: obj.parent,
    name: obj.name,
    createdAt: obj.createdAt || dayjs(),
    updatedAt: obj.updatedAt || dayjs()
  };
};

const Task = Model((model: TTask): ITask => {
  const _task: TTask = { ...model };

  const create = (value: Partial<TTask>): ITask => {
    const obj = ValidateObject({ ..._task, ...value });
    return Task(obj);
  };

  return {
    get id() {
      return _task.id;
    },
    set id(value) {
      _task.id = value;
    },
    get parent() {
      return _task.parent;
    },
    set parent(value) {
      _task.parent = value;
    },
    get name() {
      return _task.name;
    },
    set name(value) {
      _task.name = value;
    },
    get status() {
      return _task.status;
    },
    set status(value) {
      _task.status = value;
    },
    get createdAt() {
      return _task.createdAt;
    },
    set createdAt(value) {
      _task.createdAt = value;
    },
    get updatedAt() {
      return _task.updatedAt;
    },
    set updatedAt(value) {
      _task.updatedAt = value;
    },
    create
  };
});

export default Task;
