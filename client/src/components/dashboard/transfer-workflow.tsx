import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Transfer {
  id: string;
  patientId: string;
  fromWardId?: string;
  toWardId: string;
  status: string;
  requestedAt: string;
  reason?: string;
  patient?: {
    name: string;
    patientId: string;
  };
  fromWard?: {
    name: string;
    type: string;
  };
  toWard?: {
    name: string;
    type: string;
  };
}

interface TransferWorkflowProps {
  transfers: Transfer[];
}

export default function TransferWorkflow({ transfers }: TransferWorkflowProps) {
  const getWardColor = (wardType: string) => {
    switch (wardType) {
      case "ICU": return "ward-red";
      case "Non-ICU": return "ward-blue";
      case "TB Wing": return "ward-green";
      case "Backside": return "ward-orange";
      default: return "gray";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "medical-green";
      case "pending": return "yellow";
      case "in_progress": return "blue";
      default: return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "fas fa-check-circle";
      case "pending": return "fas fa-clock";
      case "in_progress": return "fas fa-spinner animate-spin";
      default: return "fas fa-question-circle";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} mins ago`;
    }
    return `${diffInHours} hours ago`;
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Recent Ward Transfers</CardTitle>
          <Button className="medical-gradient text-white hover:opacity-90 transition-opacity text-sm font-medium">
            <i className="fas fa-plus mr-2"></i>New Transfer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transfers.slice(0, 5).map((transfer) => {
            const statusColor = getStatusColor(transfer.status);
            const statusIcon = getStatusIcon(transfer.status);
            
            return (
              <div key={transfer.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg animate-slide-up hover:bg-gray-100 transition-colors cursor-pointer">
                <div className={`w-10 h-10 ${
                  transfer.status === "completed" ? "bg-medical-green-100" : 
                  transfer.status === "pending" ? "bg-yellow-100" : "bg-blue-100"
                } rounded-full flex items-center justify-center`}>
                  <i className={`${statusIcon} ${
                    transfer.status === "completed" ? "text-medical-green-600" : 
                    transfer.status === "pending" ? "text-yellow-600" : "text-blue-600"
                  }`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {transfer.patient?.name || "Unknown Patient"} (ID: {transfer.patient?.patientId || "N/A"})
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200`}
                    >
                      {transfer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    {transfer.fromWard && (
                      <Badge 
                        variant="outline" 
                        className={`text-${getWardColor(transfer.fromWard.type)} border-${getWardColor(transfer.fromWard.type)}`}
                      >
                        {transfer.fromWard.name}
                      </Badge>
                    )}
                    <i className="fas fa-arrow-right text-gray-400"></i>
                    {transfer.toWard && (
                      <Badge 
                        variant="outline" 
                        className={`text-${getWardColor(transfer.toWard.type)} border-${getWardColor(transfer.toWard.type)}`}
                      >
                        {transfer.toWard.name}
                      </Badge>
                    )}
                    <span>•</span>
                    <span>{getTimeAgo(transfer.requestedAt)}</span>
                  </div>
                  {transfer.reason && (
                    <p className="text-xs text-gray-500 mt-1">{transfer.reason}</p>
                  )}
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            );
          })}
          
          {transfers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-exchange-alt text-4xl text-gray-300 mb-2"></i>
              <p>No recent transfers</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
