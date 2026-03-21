import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuditPage from "./pages/AuditPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuditPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
