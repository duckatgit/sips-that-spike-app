import React from "react";
import { Sidebar } from "./Sidebar";
import { useAppContext } from "@/context/appContext";

interface Props {
  children?: React.ReactNode;
}

export const AdminLayout = ({ children }: Props) => {
  const { setSidebarOpen, sidebarOpen } = useAppContext();

  return (
    <div className="flex bg-gradient-to-br from-gray-50 via-white to-gray-100 font-inter ">

      <aside
        className={`fixed inset-y-0  left-0 z-30 w-64 transform bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-r border-gray-700/50 overflow-hidden transition-transform duration-300 ease-in-out
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:inset-auto`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)] pointer-events-none " />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 md:hidden">
            <div className="text-white font-semibold">Menu</div>
            <button
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-white/10 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-4">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
          <div className="border-t border-gray-700/50 p-4 text-gray-400 text-xs">
            © {new Date().getFullYear()} Dashboard Inc.
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 w-full overflow-auto h-[576px]">
        {children}
      </main>
    </div>
  );
};
