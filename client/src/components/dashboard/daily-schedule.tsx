import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Procedure {
  id: string;
  title: string;
  procedureType: string;
  scheduledDate: string;
  status: string;
  description?: string;
  patient?: {
    name: string;
    patientId: string;
  };
}

interface DailyScheduleProps {
  procedures: Procedure[];
}

export default function DailySchedule({ procedures }: DailyScheduleProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "medical-blue";
      case "in_progress": return "medical-teal";
      case "completed": return "medical-green";
      case "cancelled": return "red";
      default: return "gray";
    }
  };

  const getProcedureIcon = (type: string) => {
    switch (type) {
      case "bronchoscopy": return "fas fa-lungs";
      case "thoracoscopy": return "fas fa-stethoscope";
      case "biopsy": return "fas fa-microscope";
      case "ward_rounds": return "fas fa-walking";
      case "journal_club": return "fas fa-book";
      default: return "fas fa-procedures";
    }
  };

  const getProcedureColor = (type: string) => {
    switch (type) {
      case "bronchoscopy": return "medical-blue";
      case "thoracoscopy": return "medical-teal";
      case "biopsy": return "medical-green";
      case "ward_rounds": return "purple";
      case "journal_club": return "orange";
      default: return "gray";
    }
  };

  // Show sample schedule if no procedures exist
  const displayProcedures = procedures.length > 0 ? procedures : [
    {
      id: "1",
      title: "Bronchoscopy",
      procedureType: "bronchoscopy",
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      status: "confirmed",
      description: "Diagnostic bronchoscopy",
      patient: { name: "Jane Doe", patientId: "12345" },
    },
    {
      id: "2",
      title: "Ward Rounds",
      procedureType: "ward_rounds",
      scheduledDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      status: "in_progress",
      description: "ICU and Non-ICU units",
    },
    {
      id: "3",
      title: "Journal Club",
      procedureType: "journal_club",
      scheduledDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      description: "Latest COPD research findings",
    },
  ];

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Today's Schedule</CardTitle>
          <Button variant="ghost" className="text-medical-blue-600 hover:text-medical-blue-700 text-sm">
            Full calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayProcedures.slice(0, 5).map((procedure) => {
            const scheduledTime = new Date(procedure.scheduledDate);
            const statusColor = getStatusColor(procedure.status);
            const procedureColor = getProcedureColor(procedure.procedureType);
            const procedureIcon = getProcedureIcon(procedure.procedureType);
            
            return (
              <div key={procedure.id} className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="flex-shrink-0 text-center min-w-0">
                  <div className="text-sm font-bold text-gray-900">
                    {scheduledTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {scheduledTime.toLocaleTimeString([], { hour12: true }).split(' ')[1]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 bg-${procedureColor}-500 rounded-full flex-shrink-0`}></div>
                    <p className="text-sm font-medium text-gray-900">{procedure.title}</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {procedure.patient 
                      ? `Patient: ${procedure.patient.name} - Room ${procedure.patient.patientId}`
                      : procedure.description
                    }
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs mt-1 bg-${statusColor}-100 text-${statusColor}-600 border-${statusColor}-200`}
                  >
                    {procedure.status}
                  </Badge>
                </div>
              </div>
            );
          })}
          
          {procedures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-calendar-times text-4xl text-gray-300 mb-2"></i>
              <p>No procedures scheduled for today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
