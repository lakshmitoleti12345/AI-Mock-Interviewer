import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import Button from "../../components/ui/Button";
import { useAuth } from "../../shared/context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/interview/setup", label: "New Interview" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
  { to: "/settings", label: "Settings" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-surface-950">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-surface-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">{user?.full_name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600/20 text-blue-300"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
