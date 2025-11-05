import { User } from "lucide-react";
import { useAppContext } from "@/context/appContext";

export const Header = () => {
  const authentication: any = localStorage.getItem("isAuth");
  const isAuth = JSON.parse(authentication);
  const { setSidebarOpen } = useAppContext();
  return (
    <nav className="backdrop-blur-md bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg border-b border-gray-700">
      <div className="text-2xl font-bold tracking-wide text-indigo-400 flex items-center gap-2">
        <span className="bg-indigo-500/20 px-2 py-1 rounded-md">⚡</span>
        <div>Admin Panel</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-semibold shadow-md">
          <User size={18} />
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-300">
          {authentication ? isAuth.role : ""}
        </span>
        <header className="md:hidden  flex items-center justify-between p-3 ">
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
  );
};
