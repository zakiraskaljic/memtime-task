import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsCardLayout from "../component/DetailsCardLayout";
import { ProjectService } from "../service/ProjectService";
import type { IProject } from "../model/Project";
import { notification } from "antd";

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<IProject>();
  const [loading, setLoading] = useState(true);
  const projectService = ProjectService();

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    projectService
      .getProjectById(id)
      .then(setProject)
      .catch(() => {
        notification.error({
          title: "Error",
          description: "Project not found",
          placement: "topRight"
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!project && loading) {
    return <DetailsCardLayout loading={true} backTo="/clients" />;
  }

  return (
    <DetailsCardLayout loading={false} backTo="/clients" model={project} />
  );
};

export default ProjectDetailsPage;
