import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/AdminLayout";
import Learn from "../components/Learn";
import { Login } from "../pages/Login";
import Faq from "@/components/Faq";
export const Routing = () => {
  return (
    <>
      <Routes>
        <Route
          path="/learn"
          element={
            <AdminLayout>
              <Learn />
            </AdminLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <AdminLayout>
              <Faq />
            </AdminLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};
