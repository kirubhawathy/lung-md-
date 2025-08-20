import { useLocation } from "wouter";

export default function Navigation() {
  const [location, setLocation] = useLocation();

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "fas fa-tachometer-alt" },
    { path: "/ward-management", label: "Ward Management", icon: "fas fa-bed" },
    { path: "/reports", label: "Reports", icon: "fas fa-file-medical" },
    { path: "/procedures", label: "Procedures", icon: "fas fa-stethoscope" },
    { path: "/communication", label: "Communication", icon: "fas fa-comments" },
    { path: "/library", label: "Library", icon: "fas fa-book-medical" },
    { path: "/schedule", label: "Schedule", icon: "fas fa-calendar-alt" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? "border-medical-blue-500 text-medical-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
