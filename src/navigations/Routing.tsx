import { Routes, Route } from "react-router-dom";
import { Header } from "./Header";
import { AdminLayout } from "../components/AdminLayout";
import Learn from "../components/Learn";
import { Login } from "../pages/Login";
import { AppProvider } from "@/context/appContext";
export const Routing = () => {
  return (
    <div>
      <AppProvider>
        <Header />
      </AppProvider>
      <Routes>
        <Route
          path="/learn"
          element={
            <AppProvider>
              <AdminLayout>
                <Learn />
              </AdminLayout>
            </AppProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
};
