import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TransferDialog from "@/components/ward/transfer-dialog";

export default function WardManagement() {
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const { data: wards } = useQuery({
    queryKey: ["/api/wards"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: transfers } = useQuery({
    queryKey: ["/api/transfers"],
  });

  const getWardColor = (wardType: string) => {
    switch (wardType) {
      case "ICU": return "ward-red";
      case "Non-ICU": return "ward-blue";
      case "TB Wing": return "ward-green";
      case "Backside": return "ward-orange";
      default: return "gray";
    }
  };

  const getWardIcon = (wardType: string) => {
    switch (wardType) {
      case "ICU": return "fas fa-heartbeat";
      case "Non-ICU": return "fas fa-bed";
      case "TB Wing": return "fas fa-lungs";
      case "Backside": return "fas fa-hospital";
      default: return "fas fa-bed";
    }
  };

  const getPatientsByWard = (wardId: string) => {
    return patients?.filter(p => p.currentWardId === wardId && p.status === "active") || [];
  };

  const getPendingTransfers = () => {
    return transfers?.filter(t => t.status === "pending") || [];
  };

  const getOccupancyPercentage = (ward: any) => {
    return ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ward Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage patient distribution across all wards</p>
        </div>
        <Button 
          className="medical-gradient text-white"
          onClick={() => setTransferDialogOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          New Transfer
        </Button>
      </div>

      {/* Ward Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {wards?.map((ward) => {
          const occupancyPercentage = getOccupancyPercentage(ward);
          const wardPatients = getPatientsByWard(ward.id);
          const colorClass = getWardColor(ward.type);
          
          return (
            <Card 
              key={ward.id} 
              className={`card-hover cursor-pointer border-l-4 border-${colorClass} ${
                selectedWard === ward.id ? 'ring-2 ring-medical-blue-500' : ''
              }`}
              onClick={() => setSelectedWard(selectedWard === ward.id ? null : ward.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className={`${getWardIcon(ward.type)} text-${colorClass}`}></i>
                    <CardTitle className="text-lg">{ward.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className={`bg-${colorClass}/10 text-${colorClass}`}>
                    {ward.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Occupancy</span>
                    <span className="font-semibold text-gray-900">
                      {ward.occupiedBeds}/{ward.totalBeds}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${colorClass} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{occupancyPercentage}% Full</span>
                    <span className={`font-medium ${
                      occupancyPercentage > 90 ? 'text-red-600' : 
                      occupancyPercentage > 75 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {ward.totalBeds - ward.occupiedBeds} available
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-users text-medical-blue-600"></i>
                <span>
                  {selectedWard 
                    ? `Patients in ${wards?.find(w => w.id === selectedWard)?.name}`
                    : "All Patients"
                  }
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(selectedWard ? getPatientsByWard(selectedWard) : patients?.filter(p => p.status === "active") || [])
                  .map((patient) => {
                    const ward = wards?.find(w => w.id === patient.currentWardId);
                    const wardColor = ward ? getWardColor(ward.type) : "gray";
                    
                    return (
                      <div 
                        key={patient.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-medical-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-medical-blue-600 font-semibold text-sm">
                              {patient.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{patient.name}</span>
                              <span className="text-sm text-gray-500">({patient.patientId})</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>{patient.age}y, {patient.gender}</span>
                              <span>•</span>
                              <span>Bed {patient.bedNumber}</span>
                              {ward && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className={`text-${wardColor} border-${wardColor}`}>
                                    {ward.name}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setTransferDialogOpen(true);
                            }}
                          >
                            <i className="fas fa-exchange-alt mr-2"></i>
                            Transfer
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Requests */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <i className="fas fa-clock text-yellow-600"></i>
                <span>Pending Transfers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getPendingTransfers().map((transfer) => {
                  const patient = patients?.find(p => p.id === transfer.patientId);
                  const fromWard = wards?.find(w => w.id === transfer.fromWardId);
                  const toWard = wards?.find(w => w.id === transfer.toWardId);
                  
                  return (
                    <div key={transfer.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{patient?.name}</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        {fromWard && (
                          <Badge variant="outline" className={`text-${getWardColor(fromWard.type)}`}>
                            {fromWard.name}
                          </Badge>
                        )}
                        <i className="fas fa-arrow-right text-gray-400"></i>
                        {toWard && (
                          <Badge variant="outline" className={`text-${getWardColor(toWard.type)}`}>
                            {toWard.name}
                          </Badge>
                        )}
                      </div>
                      {transfer.reason && (
                        <p className="text-sm text-gray-600 mb-3">{transfer.reason}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                          <i className="fas fa-check mr-1"></i>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                          <i className="fas fa-times mr-1"></i>
                          Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {getPendingTransfers().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-check-circle text-4xl text-green-500 mb-2"></i>
                    <p>No pending transfers</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TransferDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        selectedPatient={selectedPatient}
        wards={wards || []}
        onTransferCreated={() => {
          setTransferDialogOpen(false);
          setSelectedPatient(null);
        }}
      />
    </main>
  );
}
