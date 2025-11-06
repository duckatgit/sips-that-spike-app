import { LogOut, User } from "lucide-react";
import { useAppContext } from "@/context/appContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

export const Header = () => {
  const { setSidebarOpen, user, resetStates } = useAppContext();
  const [showHeader, setShowHeader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setShowHeader(true);
    else setShowHeader(false);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    resetStates && resetStates();
    navigate("/login");
  };

  return (
    <>
      {showHeader && (
        <nav className="backdrop-blur-md bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-700">
          <div className="text-2xl font-bold tracking-wide text-indigo-400 flex items-center gap-2">
            <span className="bg-indigo-500/20 px-2 py-1 rounded-md">⚡</span>
            <div>Admin Panel</div>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger className="outline-none">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-semibold shadow-md hover:opacity-90 transition cursor-pointer">
                  <User size={18} />
                </div>
              </PopoverTrigger>
              {/* <PopoverContent className="w-48 p-0 bg-gray-900 border border-gray-700">
              
                <div className="p-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2 rounded transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </PopoverContent> */}
            </Popover>
            <header className="md:hidden flex items-center justify-between p-3">
              <button
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md bg-white hover:bg-gray-100 transition"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </header>
          </div>
        </nav>
      )}
    </>
  );
};
