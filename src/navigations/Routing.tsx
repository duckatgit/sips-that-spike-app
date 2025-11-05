import { Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { AdminLayout } from "../components/AdminLayout";
import Learn from "../components/Learn";
import { Login } from "../pages/Login";
export const Routing = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/learn"
          element={
            <AdminLayout>
              <Learn />
            </AdminLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};
