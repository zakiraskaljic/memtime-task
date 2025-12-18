import { Routes, Route } from "react-router-dom";
import ClientsPage from "./page/ClientsPage";
import Navigation from "./component/Navigation";
import ContentNotFoundPage from "./page/ContentNotFoundPage";
import ClientDetailsPage from "./page/ClientDetailsPage";
import ProjectDetailsPage from "./page/ProjectDetailsPage";
import TaskDetailsPage from "./page/TaskDetailsPage";
import TimeEntriesPage from "./page/TimeEntriesPage";
import TimeEntryDetailsPage from "./page/TimeEntryDetailsPage";

const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<ClientsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="/time-entries" element={<TimeEntriesPage />} />
        <Route path="/time-entries/:id" element={<TimeEntryDetailsPage />} />
        <Route path="*" element={<ContentNotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
