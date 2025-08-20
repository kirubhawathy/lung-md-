import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/stat-card";
import WardCensus from "@/components/dashboard/ward-census";
import TransferWorkflow from "@/components/dashboard/transfer-workflow";
import EquipmentStatus from "@/components/dashboard/equipment-status";
import NotificationCenter from "@/components/dashboard/notification-center";
import DailySchedule from "@/components/dashboard/daily-schedule";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivities from "@/components/dashboard/recent-activities";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: wards } = useQuery({
    queryKey: ["/api/wards"],
  });

  const { data: recentTransfers } = useQuery({
    queryKey: ["/api/transfers/recent"],
  });

  const { data: equipment } = useQuery({
    queryKey: ["/api/equipment"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications/unread"],
  });

  const { data: todayProcedures } = useQuery({
    queryKey: ["/api/procedures/today"],
  });

  if (statsLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          subtitle="+8 today"
          icon="fas fa-user-injured"
          color="medical-blue"
          trend="up"
        />
        <StatCard
          title="ICU Patients"
          value={stats?.icuPatients || 0}
          subtitle="Critical care"
          icon="fas fa-heartbeat"
          color="ward-red"
        />
        <StatCard
          title="Procedures Today"
          value={stats?.procedures || 0}
          subtitle="Scheduled"
          icon="fas fa-procedures"
          color="medical-teal"
        />
        <StatCard
          title="Pending Reports"
          value={stats?.pendingReports || 0}
          subtitle="Awaiting review"
          icon="fas fa-file-alt"
          color="yellow"
          trend="clock"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <WardCensus wards={wards || []} />
          <TransferWorkflow transfers={recentTransfers || []} />
          <EquipmentStatus equipment={equipment || []} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <NotificationCenter notifications={notifications || []} />
          <DailySchedule procedures={todayProcedures || []} />
          <QuickActions />
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-8">
        <RecentActivities />
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col space-y-3">
          <button className="w-12 h-12 bg-medical-blue-500 hover:bg-medical-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center" title="Quick Message">
            <i className="fas fa-comment"></i>
          </button>
          <button className="w-14 h-14 medical-gradient text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 flex items-center justify-center" title="Emergency Call">
            <i className="fas fa-phone text-xl"></i>
          </button>
        </div>
      </div>
    </main>
  );
}
