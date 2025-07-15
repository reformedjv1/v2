import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Moon, 
  Utensils, 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  Plus, 
  Calendar,
  Target,
  Zap,
  Heart,
  BarChart3,
  Settings,
  Home,
  MessageCircle,
  Users,
  BookOpen,
  Clock
} from 'lucide-react';

export default function Relations() {
  const [activeTab, setActiveTab] = useState('overview');

  const relationshipMetrics = [
    { label: 'Connection Score', value: 92, unit: '/100', icon: Heart, color: 'bg-red-500', trend: '+8%' },
    { label: 'Social Energy', value: 87, unit: '%', icon: Zap, color: 'bg-yellow-500', trend: '+15%' },
    { label: 'Quality Time', value: 74, unit: 'hrs/week', icon: Clock, color: 'bg-green-500', trend: '+5%' },
    { label: 'Empathy Score', value: 89, unit: '/100', icon: Brain, color: 'bg-purple-500', trend: '+12%' }
  ];

  const quickActions = [
    { label: 'Gratitude Journal', icon: Heart, action: () => {} },
    { label: 'Send Message', icon: MessageCircle, action: () => {} },
    { label: 'Schedule Time', icon: Calendar, action: () => {} },
    { label: 'Express Love', icon: Users, action: () => {} }
  ];

  const navItems = [
    { label: 'Overview', value: 'overview', icon: BarChart3 },
    { label: 'Connections', value: 'connections', icon: Users },
    { label: 'Activities', value: 'activities', icon: Heart },
    { label: 'Growth', value: 'growth', icon: BookOpen }
  ];

  const relationships = [
    { name: '❤️ Partner', type: 'Romantic', lastContact: '2 hours ago', strength: 95, status: 'Strong' },
    { name: '👨‍👩‍👧‍👦 Family', type: 'Family', lastContact: '1 day ago', strength: 88, status: 'Good' },
    { name: '👥 Close Friends', type: 'Friendship', lastContact: '3 days ago', strength: 82, status: 'Good' },
    { name: '💼 Colleagues', type: 'Professional', lastContact: '1 day ago', strength: 75, status: 'Stable' }
  ];

  const activities = [
    { title: '🙏 Daily Gratitude', description: 'Write 3 things you\'re grateful for', completed: true },
    { title: '⏰ Quality Time', description: 'Spend 30 minutes with loved ones', completed: true },
    { title: '👂 Active Listening', description: 'Practice mindful listening today', completed: false },
    { title: '💝 Express Appreciation', description: 'Tell someone why they matter', completed: false }
  ];

  const learningModules = [
    { title: 'Love Languages', description: 'Discover your primary love language', time: '10 min', completed: false },
    { title: 'Conflict Resolution', description: 'Learn healthy dispute techniques', time: '15 min', completed: true },
    { title: 'Emotional Intelligence', description: 'Build empathy and awareness', time: '20 min', completed: false }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Relations 🤝</h1>
            <p className="text-sm text-muted-foreground">Sunday, Dec 15</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Daily Score */}
        <Card className="relations-gradient text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Today's Connection Score</p>
                <h2 className="text-3xl font-bold">89</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/90">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+8 from yesterday</span>
                </div>
                <p className="text-xs text-white/70 mt-1">Strong bonds</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Relationship wellness</span>
                <span>89%</span>
              </div>
              <Progress value={89} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Relationship Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {relationshipMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="metric-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">{metric.trend}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-lg font-bold">
                    {metric.value}<span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Goals */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Connection Goals</h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Quality conversations</span>
                  <span>2 / 3</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Gratitude expressions</span>
                  <span>3 / 3</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active listening moments</span>
                  <span>1 / 2</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="action-button flex-col gap-2 h-16"
                    onClick={action.action}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Relationships Overview */}
        {activeTab === 'overview' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Key Relationships</h3>
              <div className="space-y-3">
                {relationships.map((relationship, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{relationship.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{relationship.name.split(' ').slice(1).join(' ')}</p>
                      <p className="text-xs text-muted-foreground">{relationship.type} • {relationship.lastContact}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{relationship.strength}%</div>
                      <div className="text-xs text-muted-foreground">{relationship.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Activities */}
        {activeTab === 'activities' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Today's Activities</h3>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      activity.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {activity.completed && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    {activity.completed && <span className="text-xs text-green-600 font-medium">Done</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Modules */}
        {activeTab === 'growth' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Growth Modules</h3>
              <div className="space-y-3">
                {learningModules.map((module, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{module.title}</h4>
                      <span className="text-xs text-muted-foreground">{module.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{module.description}</p>
                    {module.completed ? (
                      <div className="text-xs text-green-600 font-medium">✓ Completed</div>
                    ) : (
                      <Button size="sm" className="w-full">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Start Module
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="floating-nav">
        <div className="flex items-center justify-around p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;
            return (
              <Button
                key={item.value}
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-12 px-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab(item.value)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}