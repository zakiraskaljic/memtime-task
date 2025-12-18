import { dayjs } from "../utils/DayjsConfig";
import type { ITimeEntry } from "../model/TimeEntry";
import TimeEntry from "../model/TimeEntry";
import { API_BASE_URL, API_KEY } from "../utils/config";
import { cache as LocalStorageCache } from "../utils/LocalStorageCache";

export interface ITimeEntryService {
  getTimeEntries(params?: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    order?: "asc" | "desc";
  }): Promise<{ data: ITimeEntry[]; total: number }>;
  getTimeEntryById(id: string): Promise<ITimeEntry>;
  createTimeEntry(timeEntry: ITimeEntry): Promise<ITimeEntry>;
  updateTimeEntry(id: number, timeEntry: ITimeEntry): Promise<ITimeEntry>;
  deleteTimeEntry(id: number): Promise<void>;
}

const TimeEntryMapper = (json: any): ITimeEntry => {
  const entry = TimeEntry(json);
  entry.start = dayjs(json.start);
  entry.end = dayjs(json.end);
  entry.createdAt = dayjs(json.createdAt);
  entry.updatedAt = json.updatedat ? dayjs(json.updatedAt) : undefined;
  return entry;
};

const TimeEntryListMapper = (jsonList: any[] = []): ITimeEntry[] => {
  return jsonList.map(TimeEntryMapper);
};

export const TimeEntryService = (): ITimeEntryService => {
  const basePath = `${API_BASE_URL}/time-entries`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  };

  return {
    async getTimeEntries(params?: {
      limit?: number;
      offset?: number;
      sortBy?: string;
      order?: "asc" | "desc";
    }) {
      const query = new URLSearchParams();
      if (params?.limit) query.set("limit", params.limit.toString());
      if (params?.offset) query.set("offset", params.offset.toString());
      if (params?.sortBy) query.set("sortBy", params.sortBy);
      if (params?.order) query.set("order", params.order);

      const cacheKey = `timeEntries_${query.toString()}`;
      const cached = LocalStorageCache.get<ITimeEntry[]>(cacheKey);
      if (cached)
        return { data: TimeEntryListMapper(cached), total: cached.length };

      const response = await fetch(`${basePath}?${query.toString()}`, {
        headers
      });

      if (!response.ok) throw new Error("Failed to fetch time entries");

      const data = await response.json();
      const mapped = TimeEntryListMapper(data.items ?? data);

      LocalStorageCache.set(cacheKey, mapped, 180_000);
      return { data: mapped, total: mapped.length };
    },
    async getTimeEntryById(id: string): Promise<ITimeEntry> {
      const cacheKey = `timeEntry_${id}`;
      const cached = LocalStorageCache.get<ITimeEntry>(cacheKey);
      if (cached) return cached;

      const response = await fetch(`${basePath}/${id}`, { headers });
      if (!response.ok)
        throw new Error("Time entry not found or does not belong to user");

      const data = await response.json();
      const mapped = TimeEntryMapper(data);

      LocalStorageCache.set(cacheKey, mapped, 180_000);
      return mapped;
    },
    async createTimeEntry(timeEntry: ITimeEntry): Promise<ITimeEntry> {
      const response = await fetch(basePath, {
        method: "POST",
        headers,
        body: JSON.stringify(timeEntry)
      });

      if (!response.ok) {
        throw new Error(`Failed to create time entry`);
      }

      const data = await response.json();
      Object.keys(localStorage)
        .filter((key) => key.startsWith("timeEntries_"))
        .forEach((key) => localStorage.removeItem(key));
      return TimeEntryMapper(data);
    },
    async updateTimeEntry(
      id: number,
      timeEntry: ITimeEntry
    ): Promise<ITimeEntry> {
      if (!id || id === 0) {
        throw new Error("Cannot update time entry without a valid ID");
      }
      const response = await fetch(`${basePath}/${id.toString()}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(timeEntry)
      });
      if (!response.ok) throw new Error("Failed to update time entry");

      const data = await response.json();
      const mapped = TimeEntryMapper(data);

      Object.keys(localStorage)
        .filter((key) => key.startsWith("timeEntries_"))
        .forEach((key) => localStorage.removeItem(key));

      LocalStorageCache.clear(`timeEntry_${id}`);
      return mapped;
    },

    async deleteTimeEntry(id: number): Promise<void> {
      const response = await fetch(`${basePath}/${id}`, {
        method: "DELETE",
        headers
      });
      if (!response.ok) throw new Error("Failed to delete time entry");

      Object.keys(localStorage)
        .filter((key) => key.startsWith("timeEntries_"))
        .forEach((key) => localStorage.removeItem(key));
      LocalStorageCache.clear(`timeEntry_${id}`);
    }
  };
};
