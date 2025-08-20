import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Reports() {
  const [selectedReportType, setSelectedReportType] = useState<string>("all");

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const reportTypes = [
    { id: "biopsy", name: "Biopsy Reports", icon: "fas fa-microscope", color: "medical-blue" },
    { id: "bronchoscopy", name: "Bronchoscopy", icon: "fas fa-lungs", color: "medical-teal" },
    { id: "thoracoscopy", name: "Thoracoscopy", icon: "fas fa-stethoscope", color: "medical-green" },
    { id: "fnac", name: "FNAC Reports", icon: "fas fa-syringe", color: "purple" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "yellow";
      case "reviewed": return "blue";
      case "approved": return "green";
      default: return "gray";
    }
  };

  const getFilteredReports = () => {
    if (!reports) return [];
    if (selectedReportType === "all") return reports;
    return reports.filter(report => report.reportType === selectedReportType);
  };

  const getReportStats = () => {
    if (!reports) return { total: 0, pending: 0, reviewed: 0, approved: 0 };
    
    return {
      total: reports.length,
      pending: reports.filter(r => r.status === "pending").length,
      reviewed: reports.filter(r => r.status === "reviewed").length,
      approved: reports.filter(r => r.status === "approved").length,
    };
  };

  const stats = getReportStats();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600 mt-2">Upload, review, and manage patient medical reports</p>
        </div>
        <Button className="medical-gradient text-white">
          <i className="fas fa-upload mr-2"></i>
          Upload Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-medical text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-3xl font-bold text-medical-blue-600">{stats.reviewed}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-blue-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-eye text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-medical-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-green-500 to-medical-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Filter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              variant={selectedReportType === "all" ? "default" : "outline"}
              className={`h-20 flex-col space-y-2 ${selectedReportType === "all" ? "medical-gradient text-white" : ""}`}
              onClick={() => setSelectedReportType("all")}
            >
              <i className="fas fa-files text-xl"></i>
              <span className="text-sm">All Reports</span>
            </Button>
            
            {reportTypes.map((type) => {
              const count = reports?.filter(r => r.reportType === type.id).length || 0;
              
              return (
                <Button
                  key={type.id}
                  variant={selectedReportType === type.id ? "default" : "outline"}
                  className={`h-20 flex-col space-y-2 ${
                    selectedReportType === type.id ? `bg-${type.color}-500 text-white` : ""
                  }`}
                  onClick={() => setSelectedReportType(type.id)}
                >
                  <i className={`${type.icon} text-xl`}></i>
                  <div className="text-center">
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-xs opacity-75">{count} reports</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-list text-medical-blue-600"></i>
            <span>
              {selectedReportType === "all" 
                ? "All Reports" 
                : reportTypes.find(t => t.id === selectedReportType)?.name
              }
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredReports().map((report) => {
              const patient = patients?.find(p => p.id === report.patientId);
              const reportType = reportTypes.find(t => t.id === report.reportType);
              const statusColor = getStatusColor(report.status);
              
              return (
                <div key={report.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${reportType?.color}-100 rounded-lg flex items-center justify-center`}>
                        <i className={`${reportType?.icon} text-${reportType?.color}-600 text-lg`}></i>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{report.title}</span>
                          <Badge 
                            variant="outline" 
                            className={`bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200`}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <span>{patient?.name} ({patient?.patientId})</span>
                          <span>•</span>
                          <span>{reportType?.name}</span>
                          <span>•</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <i className="fas fa-download mr-2"></i>
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="fas fa-eye mr-2"></i>
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <i className="fas fa-comment mr-2"></i>
                        Comments
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {getFilteredReports().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-file-medical text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
                <p>No reports found for the selected category.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
