import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Ward {
  id: string;
  name: string;
  type: "ICU" | "Non-ICU" | "TB Wing" | "Backside";
  totalBeds: number;
  occupiedBeds: number;
  color: string;
}

interface WardCensusProps {
  wards: Ward[];
}

export default function WardCensus({ wards }: WardCensusProps) {
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

  const getOccupancyPercentage = (ward: Ward) => {
    return ward.totalBeds > 0 ? Math.round((ward.occupiedBeds / ward.totalBeds) * 100) : 0;
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">Ward Census Overview</CardTitle>
          <Button variant="ghost" className="text-medical-blue-600 hover:text-medical-blue-700 text-sm font-medium">
            View Details <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {wards.map((ward) => {
            const occupancyPercentage = getOccupancyPercentage(ward);
            const colorClass = getWardColor(ward.type);
            
            return (
              <div key={ward.id} className={`bg-gradient-to-br from-${colorClass}/10 to-${colorClass}/20 p-4 rounded-lg border-l-4 border-${colorClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold text-${colorClass} text-sm`}>{ward.type}</h3>
                  <i className={`${getWardIcon(ward.type)} text-${colorClass}`}></i>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{ward.occupiedBeds}</p>
                  <p className="text-xs text-gray-600">of {ward.totalBeds} beds</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${colorClass} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
