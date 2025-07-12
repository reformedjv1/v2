import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp,
  Plus,
  BookOpen,
  Star,
  Clock
} from 'lucide-react';

export default function Relations() {
  const [connectionScore] = useState(92);
  const [relationshipHealth] = useState(87);
  const [socialEnergy] = useState(74);

  const relationshipMetrics = [
    {
      title: 'Connection Score',
      value: connectionScore,
      unit: '/100',
      icon: Heart,
      color: 'text-red-500',
      trend: '+8%'
    },
    {
      title: 'Relationship Health',
      value: relationshipHealth,
      unit: '/100',
      icon: Users,
      color: 'text-blue-500',
      trend: '+15%'
    },
    {
      title: 'Social Energy',
      value: socialEnergy,
      unit: '/100',
      icon: Star,
      color: 'text-purple-500',
      trend: '+5%'
    }
  ];

  const relationships = [
    { name: 'Partner', type: 'Romantic', lastContact: '2 hours ago', strength: 95, status: 'Strong' },
    { name: 'Family', type: 'Family', lastContact: '1 day ago', strength: 88, status: 'Good' },
    { name: 'Close Friends', type: 'Friendship', lastContact: '3 days ago', strength: 82, status: 'Good' },
    { name: 'Colleagues', type: 'Professional', lastContact: '1 day ago', strength: 75, status: 'Stable' }
  ];

  const activities = [
    { title: 'Daily Gratitude', description: 'Write 3 things you\'re grateful for', completed: true },
    { title: 'Quality Time', description: 'Spend 30 minutes with loved ones', completed: true },
    { title: 'Active Listening', description: 'Practice mindful listening today', completed: false },
    { title: 'Express Appreciation', description: 'Tell someone why they matter', completed: false }
  ];

  const communications = [
    { type: 'Love Language Quiz', description: 'Discover your primary love language', time: '10 min' },
    { type: 'Conflict Resolution', description: 'Learn healthy dispute techniques', time: '15 min' },
    { type: 'Emotional Intelligence', description: 'Build empathy and awareness', time: '20 min' }
  ];

  const upcomingEvents = [
    { title: 'Date Night', time: 'Tonight 7:00 PM', type: 'Romantic' },
    { title: 'Family Dinner', time: 'Sunday 6:00 PM', type: 'Family' },
    { title: 'Friends Meetup', time: 'Friday 8:00 PM', type: 'Social' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Relations Dashboard</h1>
          <p className="text-muted-foreground">Strengthen bonds and emotional resilience through proven methods</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {relationshipMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className="text-2xl font-bold">
                    {metric.value}<span className="text-sm font-normal">{metric.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Quality Time
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Send Appreciation
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Gratitude Journal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-4">
            <div className="space-y-4">
              {relationships.map((relationship, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{relationship.name}</h4>
                        <p className="text-sm text-muted-foreground">{relationship.type}</p>
                      </div>
                      <Badge variant={relationship.status === 'Strong' ? 'default' : 'secondary'}>
                        {relationship.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Connection Strength</span>
                        <span>{relationship.strength}%</span>
                      </div>
                      <Progress value={relationship.strength} className="h-2" />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">
                          Last contact: {relationship.lastContact}
                        </span>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          activity.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {activity.completed && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                        </div>
                        <h4 className="font-semibold">{activity.title}</h4>
                      </div>
                      {activity.completed && <Badge variant="secondary">Done</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                    {!activity.completed && (
                      <Button size="sm" className="w-full">
                        Mark Complete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {communications.map((comm, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{comm.type}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {comm.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{comm.description}</p>
                    <Button className="w-full">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}