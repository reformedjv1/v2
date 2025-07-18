
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  User
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionTracker } from "@/components/health/NutritionTracker";
import { ExerciseTracker } from "@/components/health/ExerciseTracker";
import { SleepTracker } from "@/components/health/SleepTracker";
import { WomensHealth } from "@/components/health/WomensHealth";
import { MentalHealth } from "@/components/health/MentalHealth";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export default function Health() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userGender, setUserGender] = useState<string | null>(null);

  const healthMetrics = [
    { label: 'Sleep Score', value: 78, unit: '/100', icon: Moon, color: 'bg-blue-500', trend: '+5%' },
    { label: 'Energy Level', value: 85, unit: '%', icon: Zap, color: 'bg-yellow-500', trend: '+12%' },
    { label: 'Steps Today', value: 8420, unit: '', icon: Activity, color: 'bg-green-500', trend: '+2.3k' },
    { label: 'Heart Rate', value: 72, unit: 'bpm', icon: Heart, color: 'bg-red-500', trend: 'normal' }
  ];

  const quickActions = [
    { label: 'Log Sleep', icon: Moon, action: () => setActiveTab('sleep') },
    { label: 'Track Meal', icon: Utensils, action: () => setActiveTab('nutrition') },
    { label: 'Record Workout', icon: Dumbbell, action: () => setActiveTab('fitness') },
    { label: 'Mood Check', icon: Brain, action: () => setActiveTab('mental-health') }
  ];

  const todaysGoals = [
    { label: 'Steps', current: 8420, target: 10000, unit: '' },
    { label: 'Water intake', current: 6, target: 8, unit: ' glasses' },
    { label: 'Sleep target', current: 7.5, target: 8, unit: ' hours' }
  ];

  const recentActivity = [
    {
      icon: Moon,
      color: 'bg-blue-100 text-blue-600',
      title: 'Sleep logged',
      description: '7h 30m • Good quality',
      time: '2h ago'
    },
    {
      icon: Utensils,
      color: 'bg-green-100 text-green-600',
      title: 'Breakfast logged',
      description: 'Oatmeal with berries • 320 cal',
      time: '4h ago'
    },
    {
      icon: Dumbbell,
      color: 'bg-purple-100 text-purple-600',
      title: 'Workout completed',
      description: '45min strength training',
      time: '6h ago'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserGender();
    }
  }, [user]);

  const fetchUserGender = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_health')
        .select('gender')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user gender:', error);
        return;
      }
      
      if (data) {
        setUserGender(data.gender);
      }
    } catch (error) {
      console.error('Error fetching user gender:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Daily Score */}
      <Card className="health-gradient text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Today's Health Score</p>
              <h2 className="text-4xl font-bold">82</h2>
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
            <Card key={index} className="metric-card haptic-light">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${metric.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
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
      <Card className="ios-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today's Goals</h3>
          <Target className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {todaysGoals.map((goal, index) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{goal.label}</span>
                  <span>{goal.current.toLocaleString()}/{goal.target.toLocaleString()}{goal.unit}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="ios-card">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="ios-button-secondary haptic-medium h-16 flex-col gap-2"
                onClick={action.action}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="ios-card">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <div className={`w-10 h-10 rounded-xl ${activity.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );

  const isWoman = userGender === 'female';
  const tabsCount = isWoman ? 6 : 5;

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom ios-scroll">
      {/* iOS-style Header */}
      <div className="ios-header safe-area-left safe-area-right">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 p-0 haptic-light"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="ios-large-title">Health 💚</div>
              <p className="text-sm text-muted-foreground">Sunday, Dec 15</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 safe-area-left safe-area-right pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="nutrition" className="mt-0">
            <NutritionTracker />
          </TabsContent>

          <TabsContent value="fitness" className="mt-0">
            <ExerciseTracker />
          </TabsContent>

          <TabsContent value="sleep" className="mt-0">
            <SleepTracker />
          </TabsContent>

          <TabsContent value="mental-health" className="mt-0">
            <MentalHealth />
          </TabsContent>

          {isWoman && (
            <TabsContent value="womens-health" className="mt-0">
              <WomensHealth />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Bottom Tab Navigation - Fixed Horizontal Layout */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/30">
        <div className="w-full px-2 py-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`w-full h-14 grid grid-cols-${tabsCount} bg-muted/50 rounded-xl p-1`}>
              <TabsTrigger 
                value="overview" 
                className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="nutrition" 
                className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Nutrition
              </TabsTrigger>
              <TabsTrigger 
                value="fitness" 
                className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Fitness
              </TabsTrigger>
              <TabsTrigger 
                value="sleep" 
                className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Sleep
              </TabsTrigger>
              <TabsTrigger 
                value="mental-health" 
                className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Mental
              </TabsTrigger>
              {isWoman && (
                <TabsTrigger 
                  value="womens-health" 
                  className="flex-1 py-3 px-1 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Women's
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
