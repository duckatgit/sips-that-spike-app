import { Link, useLocation } from "react-router-dom";
import { BookOpen, HelpCircle } from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const location = useLocation();

  const links = [
    { name: "Learn", path: "/learn", icon: <BookOpen size={20} /> },
    // { name: "Faq", path: "/faq", icon: <HelpCircle  size={20} /> },
  ];

  return (
    <nav className="flex flex-col gap-2 px-3 py-4">
      {links.map((link) => {
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => onNavigate && onNavigate()}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-sm"
              }`}
          >
            <span className={`${isActive ? "text-white" : "text-indigo-400"}`}>
              {link.icon}
            </span>
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
