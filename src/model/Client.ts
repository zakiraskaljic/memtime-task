import { dayjs, type Dayjs } from "../utils/DayjsConfig";
import Model from "./Model";

export interface TClient {
  id: number;
  name: string;
  description?: string;
  status?: string;
  createdAt: Dayjs;
  updatedAt?: Dayjs;
}

export interface IClient extends TClient {
  create(value: Partial<TClient>): IClient;
}

const ValidateObject = (obj: Partial<TClient>): TClient => {
  if (!obj.id) throw new Error("Client id is required");
  if (!obj.name) throw new Error("Client name is required");
  return {
    id: obj.id,
    name: obj.name,
    description: obj.description,
    status: obj.status,
    createdAt: obj.createdAt || dayjs(),
    updatedAt: obj.updatedAt || dayjs()
  };
};

const Client = Model((model: TClient): IClient => {
  const _client: TClient = { ...model };

  const create = (value: Partial<TClient>): IClient => {
    const obj = ValidateObject({ ..._client, ...value });
    return Client(obj);
  };

  return {
    get id() {
      return _client.id;
    },
    set id(value) {
      _client.id = value;
    },
    get name() {
      return _client.name;
    },
    set name(value) {
      _client.name = value;
    },
    get description() {
      return _client.description;
    },
    set description(value) {
      _client.description = value;
    },
    get status() {
      return _client.status;
    },
    set status(value) {
      _client.status = value;
    },
    get createdAt() {
      return _client.createdAt;
    },
    set createdAt(value) {
      _client.createdAt = value;
    },
    get updatedAt() {
      return _client.updatedAt;
    },
    set updatedAt(value) {
      _client.updatedAt = value;
    },
    create
  };
});

export default Client;
