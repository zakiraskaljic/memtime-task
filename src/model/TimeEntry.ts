import { dayjs, type Dayjs } from "../utils/DayjsConfig";
import Model from "./Model";

export interface TTimeEntry {
  id: number;
  taskId: number;
  userId: string;
  comment: string;
  start: Dayjs;
  end: Dayjs;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
}

export interface ITimeEntry extends TTimeEntry {
  create(value: Partial<TTimeEntry>): ITimeEntry;
}

const ValidateObject = (obj: Partial<TTimeEntry>): TTimeEntry => {
  if (!obj.id) throw new Error("TimeEntry id is required");
  if (!obj.taskId) throw new Error("TimeEntry taskId is required");
  if (!obj.userId) throw new Error("TimeEntry userId is required");
  if (!obj.start) throw new Error("TimeEntry start time is required");
  if (!obj.end) throw new Error("TimeEntry end time is required");

  return {
    id: obj.id,
    taskId: obj.taskId,
    userId: obj.userId,
    comment: obj.comment || "",
    start: obj.start,
    end: obj.end,
    createdAt: obj.createdAt || dayjs(),
    updatedAt: obj.updatedAt || dayjs()
  };
};

const TimeEntry = Model((model: TTimeEntry): ITimeEntry => {
  const _entry: TTimeEntry = { ...model };

  const create = (value: Partial<TTimeEntry>): ITimeEntry => {
    const obj = ValidateObject({ ..._entry, ...value });
    return TimeEntry(obj);
  };

  return {
    get id() {
      return _entry.id;
    },
    set id(value) {
      _entry.id = value;
    },
    get taskId() {
      return _entry.taskId;
    },
    set taskId(value) {
      _entry.taskId = value;
    },
    get userId() {
      return _entry.userId;
    },
    set userId(value) {
      _entry.userId = value;
    },
    get comment() {
      return _entry.comment;
    },
    set comment(value) {
      _entry.comment = value;
    },
    get start() {
      return _entry.start;
    },
    set start(value) {
      _entry.start = value;
    },
    get end() {
      return _entry.end;
    },
    set end(value) {
      _entry.end = value;
    },
    get createdAt() {
      return _entry.createdAt;
    },
    set createdAt(value) {
      _entry.createdAt = value;
    },
    get updatedAt() {
      return _entry.updatedAt;
    },
    set updatedAt(value) {
      _entry.updatedAt = value;
    },
    create
  };
});

export default TimeEntry;
