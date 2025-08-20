import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Communication() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const messageTypes = [
    { id: "direct", name: "Direct Messages", icon: "fas fa-user-friends", color: "medical-blue" },
    { id: "group", name: "Group Chats", icon: "fas fa-users", color: "medical-teal" },
    { id: "announcements", name: "Announcements", icon: "fas fa-bullhorn", color: "medical-green" },
    { id: "handover", name: "Handover Notes", icon: "fas fa-clipboard-list", color: "purple" },
  ];

  const urgencyLevels = [
    { id: "low", name: "Low", color: "green" },
    { id: "normal", name: "Normal", color: "blue" },
    { id: "high", name: "High", color: "yellow" },
    { id: "urgent", name: "Urgent", color: "red" },
  ];

  // Sample data for demonstration
  const sampleMessages = messages || [
    {
      id: "1",
      subject: "Patient Transfer - ICU to Ward",
      content: "Patient John Doe requires transfer from ICU to general ward. All vitals stable.",
      senderId: "user1",
      recipientId: "user2",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
      urgency: "high",
    },
    {
      id: "2",
      subject: "Equipment Maintenance Schedule",
      content: "Ventilator maintenance scheduled for tomorrow 2 PM. Please ensure backup equipment is available.",
      senderId: "user2",
      recipientId: "user1",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      urgency: "normal",
    },
  ];

  const sampleAnnouncements = [
    {
      id: "1",
      title: "New COVID-19 Protocols",
      content: "Updated guidelines for COVID-19 patient management are now available in the medical library.",
      type: "protocol",
      priority: "high",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "CME Session - Pulmonary Rehabilitation",
      content: "Join us tomorrow at 2 PM in Conference Room A for the latest updates on pulmonary rehabilitation techniques.",
      type: "education",
      priority: "normal",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ];

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

  const getUrgencyColor = (urgency: string) => {
    const level = urgencyLevels.find(l => l.id === urgency);
    return level?.color || "gray";
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communication Hub</h1>
          <p className="text-gray-600 mt-2">Messages, announcements, and handover notes</p>
        </div>
        <Button className="medical-gradient text-white">
          <i className="fas fa-plus mr-2"></i>
          New Message
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-medical-blue-600">
                  {sampleMessages.filter(m => !m.isRead).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-blue-500 to-medical-teal-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-envelope text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Conversations</p>
                <p className="text-3xl font-bold text-medical-teal-600">8</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-teal-500 to-medical-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent Messages</p>
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Announcements</p>
                <p className="text-3xl font-bold text-medical-green-600">{sampleAnnouncements.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-medical-green-500 to-medical-green-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-bullhorn text-white text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="messages" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages" className="text-sm">
                <i className="fas fa-inbox mr-2"></i>Messages
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-sm">
                <i className="fas fa-bullhorn mr-2"></i>Announcements
              </TabsTrigger>
              <TabsTrigger value="handover" className="text-sm">
                <i className="fas fa-clipboard-list mr-2"></i>Handover
              </TabsTrigger>
              <TabsTrigger value="sent" className="text-sm">
                <i className="fas fa-paper-plane mr-2"></i>Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-inbox text-medical-blue-600"></i>
                    <span>Inbox</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleMessages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                          !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                        }`}
                        onClick={() => setSelectedConversation(message.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.subject}
                            </span>
                            {!message.isRead && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">New</Badge>
                            )}
                            <Badge 
                              variant="outline" 
                              className={`text-xs bg-${getUrgencyColor(message.urgency)}-100 text-${getUrgencyColor(message.urgency)}-800`}
                            >
                              {message.urgency}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{getTimeAgo(message.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">From: Dr. Smith</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-reply mr-1"></i>Reply
                            </Button>
                            <Button variant="ghost" size="sm">
                              <i className="fas fa-forward mr-1"></i>Forward
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-bullhorn text-medical-green-600"></i>
                    <span>Department Announcements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                announcement.priority === "high" 
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                              }`}
                            >
                              {announcement.priority} priority
                            </Badge>
                            <span className="text-xs text-gray-500">{getTimeAgo(announcement.createdAt)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">
                            {announcement.type}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <i className="fas fa-eye mr-1"></i>View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="handover">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-clipboard-list text-purple-600"></i>
                    <span>Handover Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-clipboard-list text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Handover Notes</h3>
                    <p>Patient handover notes will appear here when transfers are completed.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <i className="fas fa-paper-plane text-medical-teal-600"></i>
                    <span>Sent Messages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-paper-plane text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Sent Messages</h3>
                    <p>Your sent messages will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compose Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Compose</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">To</label>
                <Input placeholder="Select recipient..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Subject</label>
                <Input placeholder="Message subject..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                <Textarea 
                  placeholder="Type your message..."
                  className="min-h-[100px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Urgency</label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                  {urgencyLevels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
              <Button className="w-full medical-gradient text-white">
                <i className="fas fa-paper-plane mr-2"></i>
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Online Staff */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Online Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Lisa Wang", "Dr. James Wilson"].map((name, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 bg-medical-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">
                        {index % 3 === 0 ? "Consultant" : "Resident"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <i className="fas fa-comment"></i>
                    </Button>
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
