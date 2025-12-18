import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsCardLayout from "../component/DetailsCardLayout";
import { notification } from "antd";
import type { ITimeEntry } from "../model/TimeEntry";
import { TimeEntryService } from "../service/TimeEntryService";

const TimeEntryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [timeEntry, setTimeEntry] = useState<ITimeEntry>();
  const [loading, setLoading] = useState(true);
  const timeEntryService = TimeEntryService();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    timeEntryService
      .getTimeEntryById(id)
      .then(setTimeEntry)
      .catch(() => {
        notification.error({
          title: "Error",
          description: "Time entry not found or does not belong to user",
          placement: "topRight"
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!timeEntry && loading) {
    return <DetailsCardLayout loading={true} backTo="/time-entries" />;
  }

  return (
    <DetailsCardLayout loading={false} backTo="/clients" model={timeEntry} />
  );
};

export default TimeEntryDetailsPage;
