import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: journalArticles } = useQuery({
    queryKey: ["/api/journal/articles"],
  });

  const categories = [
    { id: "guidelines", name: "Clinical Guidelines", icon: "fas fa-book-medical", color: "medical-blue" },
    { id: "protocols", name: "Protocols", icon: "fas fa-clipboard-list", color: "medical-teal" },
    { id: "research", name: "Research Papers", icon: "fas fa-microscope", color: "medical-green" },
    { id: "procedures", name: "Procedure Videos", icon: "fas fa-video", color: "purple" },
    { id: "quiz", name: "Daily Quiz", icon: "fas fa-question-circle", color: "orange" },
    { id: "references", name: "Quick References", icon: "fas fa-bookmark", color: "red" },
  ];

  // Sample data for demonstration
  const sampleGuidelines = [
    {
      id: "1",
      title: "COPD Management Guidelines 2024",
      description: "Comprehensive guidelines for the diagnosis and management of chronic obstructive pulmonary disease",
      category: "guidelines",
      lastUpdated: "2024-01-15",
      type: "pdf",
      size: "2.3 MB",
    },
    {
      id: "2",
      title: "Pneumonia Treatment Protocol",
      description: "Evidence-based protocol for community-acquired pneumonia treatment",
      category: "protocols",
      lastUpdated: "2024-01-10",
      type: "pdf",
      size: "1.8 MB",
    },
    {
      id: "3",
      title: "Bronchoscopy Procedure Manual",
      description: "Step-by-step guide for performing diagnostic and therapeutic bronchoscopy",
      category: "procedures",
      lastUpdated: "2024-01-05",
      type: "pdf",
      size: "3.1 MB",
    },
  ];

  const sampleResearch = journalArticles || [
    {
      id: "1",
      title: "Novel Approaches to Pulmonary Rehabilitation",
      authors: "Smith J, Johnson M, Wilson K",
      journal: "Respiratory Medicine",
      publishedDate: "2024-01-20",
      doi: "10.1016/j.rmed.2024.01.001",
      summary: "This study explores innovative techniques in pulmonary rehabilitation for COPD patients...",
      tags: ["COPD", "rehabilitation", "exercise"],
    },
    {
      id: "2",
      title: "Advances in Bronchoscopic Interventions",
      authors: "Davis L, Brown R, Taylor S",
      journal: "Chest",
      publishedDate: "2024-01-18",
      doi: "10.1016/j.chest.2024.01.002",
      summary: "Recent developments in bronchoscopic techniques for lung cancer diagnosis and treatment...",
      tags: ["bronchoscopy", "lung cancer", "intervention"],
    },
  ];

  const sampleVideos = [
    {
      id: "1",
      title: "Bronchoscopy Technique Masterclass",
      duration: "45:30",
      instructor: "Dr. Sarah Johnson",
      views: 1243,
      category: "procedures",
      difficulty: "advanced",
    },
    {
      id: "2",
      title: "Chest Tube Insertion Guidelines",
      duration: "25:15",
      instructor: "Dr. Michael Chen",
      views: 856,
      category: "procedures",
      difficulty: "intermediate",
    },
    {
      id: "3",
      title: "Pulmonary Function Test Interpretation",
      duration: "35:20",
      instructor: "Dr. Lisa Wang",
      views: 2134,
      category: "education",
      difficulty: "beginner",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "green";
      case "intermediate": return "yellow";
      case "advanced": return "red";
      default: return "gray";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || "fas fa-file";
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || "gray";
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Library</h1>
          <p className="text-gray-600 mt-2">Guidelines, protocols, research, and educational resources</p>
        </div>
        <Button className="medical-gradient text-white">
          <i className="fas fa-plus mr-2"></i>
          Add Resource
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <Input
            placeholder="Search guidelines, protocols, research papers..."
            className="pl-10 pr-4 py-3 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          className={`h-20 flex-col space-y-2 ${selectedCategory === "all" ? "medical-gradient text-white" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          <i className="fas fa-th-large text-xl"></i>
          <span className="text-sm">All Resources</span>
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`h-20 flex-col space-y-2 ${
              selectedCategory === category.id ? `bg-${category.color}-500 text-white` : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <i className={`${category.icon} text-xl`}></i>
            <span className="text-sm text-center">{category.name}</span>
          </Button>
        ))}
      </div>

      <Tabs defaultValue="guidelines" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guidelines">
            <i className="fas fa-book-medical mr-2"></i>Guidelines & Protocols
          </TabsTrigger>
          <TabsTrigger value="research">
            <i className="fas fa-microscope mr-2"></i>Research Papers
          </TabsTrigger>
          <TabsTrigger value="videos">
            <i className="fas fa-video mr-2"></i>Video Library
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <i className="fas fa-question-circle mr-2"></i>Daily Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guidelines">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleGuidelines.map((guideline) => (
              <Card key={guideline.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 bg-${getCategoryColor(guideline.category)}-100 rounded-lg flex items-center justify-center`}>
                      <i className={`${getCategoryIcon(guideline.category)} text-${getCategoryColor(guideline.category)}-600 text-lg`}></i>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {guideline.type.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{guideline.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{guideline.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Updated: {new Date(guideline.lastUpdated).toLocaleDateString()}</span>
                    <span>{guideline.size}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-eye mr-2"></i>View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-download mr-2"></i>Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="research">
          <div className="space-y-6">
            {sampleResearch.map((paper) => (
              <Card key={paper.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{paper.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Authors:</strong> {paper.authors}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Journal:</strong> {paper.journal} • {new Date(paper.publishedDate).toLocaleDateString()}
                      </p>
                      {paper.doi && (
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>DOI:</strong> {paper.doi}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 mb-4">{paper.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.tags?.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="w-16 h-16 bg-medical-green-100 rounded-lg flex items-center justify-center ml-4">
                      <i className="fas fa-microscope text-medical-green-600 text-2xl"></i>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <i className="fas fa-external-link-alt mr-2"></i>View Paper
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-bookmark mr-2"></i>Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <i className="fas fa-share mr-2"></i>Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVideos.map((video) => (
              <Card key={video.id} className="card-hover">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-play-circle text-6xl text-medical-blue-500 mb-2"></i>
                      <p className="text-sm text-gray-600">{video.duration}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`absolute top-2 right-2 bg-${getDifficultyColor(video.difficulty)}-100 text-${getDifficultyColor(video.difficulty)}-800`}
                  >
                    {video.difficulty}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {video.instructor}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span><i className="fas fa-eye mr-1"></i>{video.views.toLocaleString()} views</span>
                    <Badge variant="secondary" className="text-xs">{video.category}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <i className="fas fa-play mr-2"></i>Watch
                    </Button>
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-bookmark"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quiz">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Quiz */}
            <div className="lg:col-span-2">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-question-circle text-orange-600"></i>
                    <span>Daily Quiz - January 20, 2025</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h3 className="font-medium text-gray-900 mb-3">Question 1 of 5</h3>
                      <p className="text-gray-700 mb-4">
                        Which of the following is the most common cause of community-acquired pneumonia in adults?
                      </p>
                      <div className="space-y-2">
                        {["Streptococcus pneumoniae", "Haemophilus influenzae", "Mycoplasma pneumoniae", "Legionella pneumophila"].map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="question1" value={option} className="text-orange-600" />
                            <span className="text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline">
                        <i className="fas fa-arrow-left mr-2"></i>Previous
                      </Button>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                        Next <i className="fas fa-arrow-right ml-2"></i>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-trophy text-yellow-600"></i>
                    <span>Leaderboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Dr. Sarah Johnson", score: 485, rank: 1 },
                      { name: "Dr. Michael Chen", score: 472, rank: 2 },
                      { name: "Dr. Lisa Wang", score: 451, rank: 3 },
                      { name: "Dr. James Wilson", score: 438, rank: 4 },
                      { name: "You", score: 425, rank: 5 },
                    ].map((user, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        user.name === "You" ? "bg-medical-blue-50 border border-medical-blue-200" : "bg-gray-50"
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            user.rank === 1 ? "bg-yellow-100 text-yellow-600" :
                            user.rank === 2 ? "bg-gray-100 text-gray-600" :
                            user.rank === 3 ? "bg-orange-100 text-orange-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {user.rank <= 3 ? <i className="fas fa-trophy"></i> : user.rank}
                          </div>
                          <span className={`text-sm font-medium ${user.name === "You" ? "text-medical-blue-600" : "text-gray-900"}`}>
                            {user.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">{user.score}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quizzes Completed</span>
                        <span>23/30</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-medical-blue-500 h-2 rounded-full" style={{ width: "77%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Score</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-medical-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">Current Streak: <span className="font-semibold text-orange-600">7 days</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
