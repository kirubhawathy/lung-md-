interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: string;
  trend?: "up" | "down" | "clock";
}

export default function StatCard({ title, value, subtitle, icon, color, trend }: StatCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "medical-blue":
        return "from-medical-blue-500 to-medical-teal-500";
      case "ward-red":
        return "from-red-500 to-red-600";
      case "medical-teal":
        return "from-medical-teal-500 to-medical-green-500";
      case "yellow":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "fas fa-arrow-up text-medical-green-600";
      case "down":
        return "fas fa-arrow-down text-red-600";
      case "clock":
        return "fas fa-clock text-yellow-600";
      default:
        return "";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-medical-green-600";
      case "down":
        return "text-red-600";
      case "clock":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 card-hover animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color.includes("ward") ? `text-${color}` : "text-gray-900"}`}>
            {value.toLocaleString()}
          </p>
          <p className={`text-xs font-medium mt-1 ${getTrendColor()}`}>
            {trend && <i className={`${getTrendIcon()} mr-1`}></i>}
            {subtitle}
          </p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(color)} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );
}
