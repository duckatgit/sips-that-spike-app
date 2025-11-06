import api from "@/API/backapi";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

type AppContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: any | null;
  setUser?: React.Dispatch<React.SetStateAction<any | null>>;
  setForceFetch?: React.Dispatch<React.SetStateAction<boolean>>;
  resetStates?: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null); //?should be null
  const [forceFetch, setForceFetch] = useState(false);
  const nav = useNavigate();

  const resetStates = () => {
    setUser(null);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const fetctMe = async () => {
      if (localStorage.getItem("token") === null) {
        nav("/login");
        return;
      }

      try {
        const resp = await api.get("/admin/me");
        const body = resp.data;
        console.log(body);

        if (body.user) {
          setUser(body.user);
        } else {
          nav("/login");
        }
      } catch (error) {
        nav("/login");
        console.log(error);
      }
    };

    if(user === null  ){
      nav("/login");  
    }

    // fetctMe();
  }, [forceFetch]);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        user,
        setUser,
        setForceFetch,
        resetStates,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
};
