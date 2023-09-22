import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import TeachersPage from "./pages/TeachersPage";
import StudentsPage from "./pages/StudentsPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./components/layout/AdminLayout";
import AllStudentsPage from "./pages/AllStudentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="teachers" element={<TeachersPage />} />
          <Route path="students/:id" element={<StudentsPage />} />
          <Route path="allstudents" element={<AllStudentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
