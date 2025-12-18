import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsCardLayout from "../component/DetailsCardLayout";
import { ClientService } from "../service/ClientService";
import type { IClient } from "../model/Client";
import { notification } from "antd";

const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<IClient>();
  const [loading, setLoading] = useState(true);
  const clientService = ClientService();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    clientService
      .getClientById(id)
      .then(setClient)
      .catch(() => {
        notification.error({
          title: "Error",
          description: "User not found",
          placement: "topRight"
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!client && loading) {
    return <DetailsCardLayout loading={true} backTo="/clients" />;
  }

  return <DetailsCardLayout loading={false} backTo="/clients" model={client} />;
};

export default ClientDetailsPage;
