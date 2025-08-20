import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState("duty");

  const { data: procedures } = useQuery({
    queryKey: ["/api/procedures"],
  });

  const { data: cmeEvents } = useQuery({
    queryKey: ["/api/cme/events"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const scheduleTypes = [
    { id: "duty", name: "Duty Roster", icon: "fas fa-user-clock", color: "medical-blue" },
    { id: "academic", name: "Academic Schedule", icon: "fas fa-graduation-cap", color: "medical-teal" },
    { id: "procedures", name: "Procedures", icon: "fas fa-stethoscope", color: "medical-green" },
    { id: "cme", name: "CME Events", icon: "fas fa-chalkboard-teacher", color: "purple" },
  ];

  const shifts = [
    { id: "morning", name: "Morning Shift", time: "07:00 - 15:00", color: "blue" },
    { id: "evening", name: "Evening Shift", time: "15:00 - 23:00", color: "orange" },
    { id: "night", name: "Night Shift", time: "23:00 - 07:00", color: "purple" },
  ];

  const wards = [
    { id: "icu", name: "ICU", color: "ward-red" },
    { id: "non-icu", name: "Non-ICU", color: "ward-blue" },
    { id: "tb-wing", name: "TB Wing", color: "ward-green" },
    { id: "backside", name: "Backside Ward", color: "ward-orange" },
  ];

  // Sample duty roster data
  const dutyRoster = [
    {
      id: "1",
      date: new Date().toISOString().split('T')[0],
      shift: "morning",
      ward: "icu",
      doctor: "Dr. Sarah Johnson",
      role: "Consultant",
      status: "assigned",
    },
    {
      id: "2",
      date: new Date().toISOString().split('T')[0],
      shift: "evening",
      ward: "non-icu",
      doctor: "Dr. Michael Chen",
      role: "Resident",
      status: "assigned",
    },
    {
      id: "3",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shift: "morning",
      ward: "tb-wing",
      doctor: "Dr. Lisa Wang",
      role: "Resident",
      status: "assigned",
    },
  ];

  // Sample academic schedule
  const academicSchedule = [
    {
      id: "1",
      title: "Journal Club",
      date: new Date().toISOString().split('T')[0],
      time: "14:00",
      duration: "60",
      location: "Conference Room A",
      presenter: "Dr. James Wilson",
      topic: "Latest COPD Research",
      type: "journal_club",
    },
    {
      id: "2",
      title: "Grand Rounds",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: "08:00",
      duration: "90",
      location: "Main Auditorium",
      presenter: "Dr. Sarah Johnson",
      topic: "Complex Pulmonary Cases",
      type: "grand_rounds",
    },
  ];

  const getShiftColor = (shift: string) => {
    const shiftData = shifts.find(s => s.id === shift);
    return shiftData?.color || "gray";
  };

  const getWardColor = (ward: string) => {
    const wardData = wards.find(w => w.id === ward);
    return wardData?.color || "gray";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "green";
      case "pending": return "yellow";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "journal_club": return "fas fa-book";
      case "grand_rounds": return "fas fa-users";
      case "lecture": return "fas fa-chalkboard-teacher";
      case "workshop": return "fas fa-tools";
      default: return "fas fa-calendar";
    }
  };

  const getTodaySchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      duty: dutyRoster.filter(d => d.date === today),
      academic: academicSchedule.filter(a => a.date === today),
      procedures: procedures?.filter(p => 
        new Date(p.scheduledDate).toISOString().split('T')[0] === today
      ) || [],
    };
  };

  const todaySchedule = getTodaySchedule();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-2">Manage duty roster, academic schedule, and daily procedures</p>
        </div>
        <Button className="medical-gradient text-white">
          <i className="fas fa-plus mr-2"></i>
          Add Schedule
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Duties</p>
                <p className="text-3xl font-bold text-medical-blue-600">{todaySchedule.duty.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-clock text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Academic Sessions</p>
                <p className="text-3xl font-bold text-medical-teal-600">{todaySchedule.academic.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-teal-500 to-medical-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Procedures</p>
                <p className="text-3xl font-bold text-medical-green-600">{todaySchedule.procedures.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-green-500 to-medical-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-stethoscope text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CME Events</p>
                <p className="text-3xl font-bold text-purple-600">{cmeEvents?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-chalkboard-teacher text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Schedule Content */}
        <div className="lg:col-span-3">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              {scheduleTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-sm">
                  <i className={`${type.icon} mr-2`}></i>
                  {type.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="duty">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-user-clock text-medical-blue-600"></i>
                    <span>Duty Roster</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dutyRoster.map((duty) => {
                      const ward = wards.find(w => w.id === duty.ward);
                      const shift = shifts.find(s => s.id === duty.shift);
                      const statusColor = getStatusColor(duty.status);
                      
                      return (
                        <div key={duty.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-center min-w-0">
                                <div className="text-sm font-bold text-gray-900">
                                  {new Date(duty.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(duty.date).toLocaleDateString([], { weekday: 'short' })}
                                </div>
                              </div>
                              <div className={`w-12 h-12 bg-${getShiftColor(duty.shift)}-100 rounded-lg flex items-center justify-center`}>
                                <i className={`fas fa-clock text-${getShiftColor(duty.shift)}-600 text-lg`}></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{duty.doctor}</span>
                                  <Badge variant="outline" className="text-xs">{duty.role}</Badge>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-${ward?.color} border-${ward?.color}`}
                                  >
                                    {ward?.name}
                                  </Badge>
                                  <span>•</span>
                                  <span>{shift?.name} ({shift?.time})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={`bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200`}
                              >
                                {duty.status}
                              </Badge>
                              <Button variant="outline" size="sm">
                                <i className="fas fa-edit mr-2"></i>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-graduation-cap text-medical-teal-600"></i>
                    <span>Academic Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academicSchedule.map((session) => (
                      <div key={session.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center min-w-0">
                              <div className="text-sm font-bold text-gray-900">
                                {session.time}
                              </div>
                              <div className="text-xs text-gray-500">
                                {session.duration} min
                              </div>
                            </div>
                            <div className="w-12 h-12 bg-medical-teal-100 rounded-lg flex items-center justify-center">
                              <i className={`${getTypeIcon(session.type)} text-medical-teal-600 text-lg`}></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{session.title}</span>
                                <Badge variant="outline" className="text-xs">{session.type.replace('_', ' ')}</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <p><strong>Topic:</strong> {session.topic}</p>
                                <p><strong>Presenter:</strong> {session.presenter}</p>
                                <p><strong>Location:</strong> {session.location}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-2"></i>
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-edit mr-2"></i>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="procedures">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-stethoscope text-medical-green-600"></i>
                    <span>Procedure Schedule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySchedule.procedures.length > 0 ? (
                      todaySchedule.procedures.map((procedure) => (
                        <div key={procedure.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-center min-w-0">
                                <div className="text-sm font-bold text-gray-900">
                                  {new Date(procedure.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <div className="w-12 h-12 bg-medical-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-stethoscope text-medical-green-600 text-lg"></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{procedure.title}</span>
                                  <Badge variant="outline" className="text-xs">{procedure.status}</Badge>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {procedure.description}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-eye mr-2"></i>
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Procedures Scheduled</h3>
                        <p>No procedures are scheduled for the selected date.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cme">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-chalkboard-teacher text-purple-600"></i>
                    <span>CME Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cmeEvents && cmeEvents.length > 0 ? (
                      cmeEvents.map((event) => (
                        <div key={event.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-center min-w-0">
                                <div className="text-sm font-bold text-gray-900">
                                  {new Date(event.eventDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-chalkboard-teacher text-purple-600 text-lg"></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{event.title}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <p>{event.description}</p>
                                  {event.location && <p><strong>Location:</strong> {event.location}</p>}
                                  {event.maxAttendees && <p><strong>Max Attendees:</strong> {event.maxAttendees}</p>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <i className="fas fa-vote-yea mr-2"></i>
                                Vote
                              </Button>
                              <Button variant="outline" size="sm">
                                <i className="fas fa-eye mr-2"></i>
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-chalkboard-teacher text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No CME Events</h3>
                        <p>No CME events are currently scheduled.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule Calendar</CardTitle>
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

          {/* Quick Schedule Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-medical-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Duty Shifts</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{todaySchedule.duty.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-medical-teal-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Academic Sessions</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{todaySchedule.academic.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-medical-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Procedures</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{todaySchedule.procedures.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shift Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shift Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shifts.map((shift) => (
                  <div key={shift.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-8 h-8 bg-${shift.color}-100 rounded-lg flex items-center justify-center`}>
                      <i className={`fas fa-clock text-${shift.color}-600 text-sm`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{shift.name}</p>
                      <p className="text-xs text-gray-600">{shift.time}</p>
                    </div>
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
