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
  Home
} from 'lucide-react';

export default function Health() {
  const [activeTab, setActiveTab] = useState('overview');

  const healthMetrics = [
    { label: 'Sleep Score', value: 78, unit: '/100', icon: Moon, color: 'bg-blue-500', trend: '+5%' },
    { label: 'Energy Level', value: 85, unit: '%', icon: Zap, color: 'bg-yellow-500', trend: '+12%' },
    { label: 'Steps Today', value: 8420, unit: '', icon: Activity, color: 'bg-green-500', trend: '+2.3k' },
    { label: 'Heart Rate', value: 72, unit: 'bpm', icon: Heart, color: 'bg-red-500', trend: 'normal' }
  ];

  const quickActions = [
    { label: 'Log Sleep', icon: Moon, action: () => {} },
    { label: 'Track Meal', icon: Utensils, action: () => {} },
    { label: 'Record Workout', icon: Dumbbell, action: () => {} },
    { label: 'Mood Check', icon: Brain, action: () => {} }
  ];

  const navItems = [
    { label: 'Overview', value: 'overview', icon: BarChart3 },
    { label: 'Sleep', value: 'sleep', icon: Moon },
    { label: 'Nutrition', value: 'nutrition', icon: Utensils },
    { label: 'Fitness', value: 'fitness', icon: Dumbbell }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Health</h1>
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
        <Card className="health-gradient text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Today's Health Score</p>
                <h2 className="text-3xl font-bold">82</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/90">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+5 from yesterday</span>
                </div>
                <p className="text-xs text-white/70 mt-1">Above average</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Overall wellness</span>
                <span>82%</span>
              </div>
              <Progress value={82} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {healthMetrics.map((metric, index) => {
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
                    {metric.value.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
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
              <h3 className="font-semibold">Today's Goals</h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Steps</span>
                  <span>8,420 / 10,000</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Water intake</span>
                  <span>6 / 8 glasses</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sleep target</span>
                  <span>7.5 / 8 hours</span>
                </div>
                <Progress value={94} className="h-2" />
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

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Moon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sleep logged</p>
                  <p className="text-xs text-muted-foreground">7h 30m • Good quality</p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Utensils className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Breakfast logged</p>
                  <p className="text-xs text-muted-foreground">Oatmeal with berries • 320 cal</p>
                </div>
                <span className="text-xs text-muted-foreground">4h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
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