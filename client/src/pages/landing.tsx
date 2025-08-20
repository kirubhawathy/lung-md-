import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-50 via-white to-medical-teal-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 medical-gradient rounded-2xl flex items-center justify-center">
              <i className="fas fa-lungs text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">PulmoMed</h1>
              <p className="text-lg text-gray-600">Pulmonary Medicine Department</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Professional Medical
              <span className="text-medical-blue-600"> Department Management</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive management system for pulmonary medicine departments with real-time patient tracking, 
              ward transfers, medical reports, and seamless collaboration tools designed for medical professionals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bed text-white text-xl"></i>
                </div>
                <CardTitle>Ward Management</CardTitle>
                <CardDescription>
                  Real-time patient tracking and inter-ward transfers with comprehensive census management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-medical-teal-500 to-medical-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-medical text-white text-xl"></i>
                </div>
                <CardTitle>Medical Reports</CardTitle>
                <CardDescription>
                  Upload and manage biopsy, bronchoscopy, thoracoscopy, and FNAC reports with collaboration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-medical-green-500 to-ward-green rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-stethoscope text-white text-xl"></i>
                </div>
                <CardTitle>Procedures</CardTitle>
                <CardDescription>
                  Schedule and track daily procedures with comprehensive procedure management system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-comments text-white text-xl"></i>
                </div>
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                  Real-time messaging, announcements, and handover notes for seamless collaboration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book-medical text-white text-xl"></i>
                </div>
                <CardTitle>Medical Library</CardTitle>
                <CardDescription>
                  Access guidelines, protocols, journal articles, and educational resources
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-ward-red to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heartbeat text-white text-xl"></i>
                </div>
                <CardTitle>Equipment Monitoring</CardTitle>
                <CardDescription>
                  Track ventilators, monitors, and other critical medical equipment status
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join your pulmonary medicine department colleagues and streamline your medical workflows today.
            </p>
            <Button 
              size="lg" 
              className="medical-gradient text-white hover:opacity-90 transition-opacity"
              onClick={() => window.location.href = '/api/login'}
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In to Get Started
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500">
            <p>&copy; 2025 PulmoMed Department Management System. Designed for medical professionals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
