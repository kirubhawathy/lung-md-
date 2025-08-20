import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

export default function Procedures() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: allProcedures } = useQuery({
    queryKey: ["/api/procedures"],
  });

  const { data: todayProcedures } = useQuery({
    queryKey: ["/api/procedures/today"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const procedureTypes = [
    { id: "bronchoscopy", name: "Bronchoscopy", icon: "fas fa-lungs", color: "medical-blue" },
    { id: "thoracoscopy", name: "Thoracoscopy", icon: "fas fa-stethoscope", color: "medical-teal" },
    { id: "pleural_biopsy", name: "Pleural Biopsy", icon: "fas fa-microscope", color: "medical-green" },
    { id: "chest_tube", name: "Chest Tube", icon: "fas fa-procedures", color: "purple" },
    { id: "pulmonary_rehab", name: "Pulmonary Rehab", icon: "fas fa-dumbbell", color: "orange" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "blue";
      case "in_progress": return "yellow";
      case "completed": return "green";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled": return "fas fa-calendar-check";
      case "in_progress": return "fas fa-spinner";
      case "completed": return "fas fa-check-circle";
      case "cancelled": return "fas fa-times-circle";
      default: return "fas fa-question-circle";
    }
  };

  const getTodayStats = () => {
    if (!todayProcedures) return { total: 0, scheduled: 0, inProgress: 0, completed: 0 };
    
    return {
      total: todayProcedures.length,
      scheduled: todayProcedures.filter(p => p.status === "scheduled").length,
      inProgress: todayProcedures.filter(p => p.status === "in_progress").length,
      completed: todayProcedures.filter(p => p.status === "completed").length,
    };
  };

  const getUpcomingProcedures = () => {
    if (!allProcedures) return [];
    const now = new Date();
    return allProcedures
      .filter(p => new Date(p.scheduledDate) > now && p.status === "scheduled")
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  };

  const stats = getTodayStats();
  const upcomingProcedures = getUpcomingProcedures();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procedures</h1>
          <p className="text-gray-600 mt-2">Schedule and manage daily medical procedures</p>
        </div>
        <Button className="medical-gradient text-white">
          <i className="fas fa-plus mr-2"></i>
          Schedule Procedure
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Procedures</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-procedures text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-medical-blue-600">{stats.scheduled}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-check text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-spinner text-white text-xl animate-spin"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-medical-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-green-500 to-medical-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-calendar-day text-medical-blue-600"></i>
                <span>Today's Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayProcedures?.map((procedure) => {
                  const patient = patients?.find(p => p.id === procedure.patientId);
                  const procedureType = procedureTypes.find(t => t.id === procedure.procedureType) || procedureTypes[0];
                  const statusColor = getStatusColor(procedure.status);
                  const statusIcon = getStatusIcon(procedure.status);
                  const scheduledTime = new Date(procedure.scheduledDate);
                  
                  return (
                    <div key={procedure.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center min-w-0">
                            <div className="text-lg font-bold text-gray-900">
                              {scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {scheduledTime.toLocaleTimeString([], { hour12: true }).split(' ')[1]}
                            </div>
                          </div>
                          <div className={`w-12 h-12 bg-${procedureType.color}-100 rounded-lg flex items-center justify-center`}>
                            <i className={`${procedureType.icon} text-${procedureType.color}-600 text-lg`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{procedure.title}</span>
                              <Badge 
                                variant="outline" 
                                className={`bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200`}
                              >
                                <i className={`${statusIcon} mr-1`}></i>
                                {procedure.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Patient: {patient?.name} ({patient?.patientId})
                            </div>
                            {procedure.description && (
                              <div className="text-sm text-gray-500 mt-1">{procedure.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <i className="fas fa-edit mr-2"></i>
                            Edit
                          </Button>
                          {procedure.status === "scheduled" && (
                            <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                              <i className="fas fa-play mr-2"></i>
                              Start
                            </Button>
                          )}
                          {procedure.status === "in_progress" && (
                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                              <i className="fas fa-check mr-2"></i>
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {(!todayProcedures || todayProcedures.length === 0) && (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Procedures Today</h3>
                    <p>No procedures are scheduled for today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Procedure Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Upcoming Procedures */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingProcedures.map((procedure) => {
                  const patient = patients?.find(p => p.id === procedure.patientId);
                  const procedureType = procedureTypes.find(t => t.id === procedure.procedureType) || procedureTypes[0];
                  const scheduledDate = new Date(procedure.scheduledDate);
                  
                  return (
                    <div key={procedure.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${procedureType.color}-100 rounded-lg flex items-center justify-center`}>
                          <i className={`${procedureType.icon} text-${procedureType.color}-600 text-sm`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{procedure.title}</div>
                          <div className="text-xs text-gray-600">{patient?.name}</div>
                          <div className="text-xs text-gray-500">
                            {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {upcomingProcedures.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <i className="fas fa-calendar-check text-3xl text-gray-300 mb-2"></i>
                    <p className="text-sm">No upcoming procedures</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Procedure Types */}
          <Card>
            <CardHeader>
              <CardTitle>Procedure Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {procedureTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                      <i className={`${type.icon} text-${type.color}-600 text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
