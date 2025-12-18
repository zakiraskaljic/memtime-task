import type { IClient } from "../model/Client";
import Client from "../model/Client";
import type { IProject } from "../model/Project";
import { ProjectListMapper } from "./ProjectService";
import { dayjs } from "../utils/DayjsConfig";
import { API_BASE_URL, API_KEY } from "../utils/config";
import { cache as LocalStorageCache } from "../utils/LocalStorageCache";
import type { IQueryParams } from "../interface/IQueryParams";

export interface IClientService {
  getClients(
    queryParam?: IQueryParams
  ): Promise<{ data: IClient[]; total: number }>;
  getClientById(id: string): Promise<IClient>;
  getClientProjects(
    contractId: number
  ): Promise<{ data: IProject[]; total: number }>;
}

const ClientMapper = (json: any): IClient => {
  let client = Client(json);
  client.createdAt = dayjs(json.createdAt);
  client.updatedAt = json.updatedAt ? dayjs(json.updatedAt) : undefined;
  return client;
};

const ClientListMapper = (jsonList: any[] = []): IClient[] => {
  return jsonList.map(ClientMapper);
};

export const ClientService = (): IClientService => {
  const basePath = `${API_BASE_URL}/clients`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  return {
    async getClients(queryParam?: IQueryParams) {
      const query = new URLSearchParams();
      if (queryParam?.limit) query.set("limit", queryParam.limit.toString());
      if (queryParam?.offset) query.set("offset", queryParam.offset.toString());
      if (queryParam?.sortBy) query.set("sortBy", queryParam.sortBy);
      if (queryParam?.order) query.set("order", queryParam.order);

      const cacheKey = `clients_${query.toString()}`;
      const cached = LocalStorageCache.get<IClient[]>(cacheKey);
      if (cached)
        return { data: ClientListMapper(cached), total: cached.length };

      const response = await fetch(`${basePath}?${query.toString()}`, {
        headers
      });
      if (!response.ok) throw new Error("Failed to fetch clients");

      const data = await response.json();
      const mapped = ClientListMapper(data.items ?? data);

      LocalStorageCache.set(cacheKey, mapped, 60_000);
      return { data: mapped, total: mapped.length };
    },

    async getClientById(id: string) {
      const cacheKey = `client_${id}`;
      const cached = LocalStorageCache.get<IClient>(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${basePath}/${id}`, { headers });
      if (!response.ok) throw new Error("Client not found");

      const data = await response.json();
      const mapped = ClientMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 60_000);
      return mapped;
    },

    async getClientProjects(contractId: number, queryParam?: IQueryParams) {
      const query = new URLSearchParams();
      if (queryParam?.limit) query.set("limit", queryParam.limit.toString());
      if (queryParam?.offset) query.set("offset", queryParam.offset.toString());
      if (queryParam?.sortBy) query.set("sortBy", queryParam.sortBy);
      if (queryParam?.order) query.set("order", queryParam.order);

      const cacheKey = `client_${contractId}_projects_${query.toString()}`;
      const cached = LocalStorageCache.get<IProject[]>(cacheKey);
      if (cached)
        return { data: ProjectListMapper(cached), total: cached.length };

      const response = await fetch(
        `${basePath}/${contractId.toString()}/projects?${query.toString()}`,
        {
          headers
        }
      );
      if (!response.ok) throw new Error("Projects not found for client");

      const data = await response.json();
      const mapped = ProjectListMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 60_000);
      return { data: mapped, total: mapped.length };
    }
  };
};
