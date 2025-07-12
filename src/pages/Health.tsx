import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { 
  Activity, 
  Heart, 
  Moon, 
  Utensils, 
  Dumbbell, 
  TrendingUp,
  Plus,
  Timer,
  Target
} from 'lucide-react';

export default function Health() {
  const [sleepScore] = useState(85);
  const [steps] = useState(8432);
  const [calories] = useState(1847);

  const healthMetrics = [
    {
      title: 'Sleep Quality',
      value: sleepScore,
      unit: '/100',
      icon: Moon,
      color: 'text-blue-500',
      trend: '+12%'
    },
    {
      title: 'Daily Steps',
      value: steps,
      unit: ' steps',
      icon: Activity,
      color: 'text-green-500',
      trend: '+5%'
    },
    {
      title: 'Calories Burned',
      value: calories,
      unit: ' kcal',
      icon: Heart,
      color: 'text-red-500',
      trend: '+8%'
    }
  ];

  const workouts = [
    { name: '7-Min HIIT', duration: '7 min', difficulty: 'Beginner', type: 'Cardio' },
    { name: 'Strength Training', duration: '30 min', difficulty: 'Intermediate', type: 'Strength' },
    { name: 'Yoga Flow', duration: '20 min', difficulty: 'Beginner', type: 'Flexibility' }
  ];

  const nutritionTips = [
    { title: 'Hydration Goal', description: 'Drink 8 glasses of water today', completed: 6 },
    { title: 'Protein Intake', description: 'Add lean protein to every meal', completed: 2 },
    { title: 'Fiber Rich Foods', description: 'Include 5 servings of fruits/vegetables', completed: 3 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Transform biomarkers into daily habits for longevity</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {healthMetrics.map((metric, index) => (
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
                    {metric.value.toLocaleString()}<span className="text-sm font-normal">{metric.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Daily Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Steps</span>
                      <span>{steps}/10,000</span>
                    </div>
                    <Progress value={(steps / 10000) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sleep</span>
                      <span>7.5/8 hours</span>
                    </div>
                    <Progress value={93.75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water</span>
                      <span>6/8 glasses</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Meal
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Timer className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Moon className="h-4 w-4 mr-2" />
                    Sleep Tracker
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workouts.map((workout, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <CardDescription>{workout.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{workout.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Level:</span>
                        <Badge variant="secondary">{workout.difficulty}</Badge>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nutritionTips.map((tip, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Utensils className="h-5 w-5 text-orange-500" />
                      <Badge variant="outline">{tip.completed}/3</Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                    <Progress value={(tip.completed / 3) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Sleep Analysis
                </CardTitle>
                <CardDescription>Last 7 nights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">{sleepScore}/100</div>
                    <p className="text-sm text-muted-foreground">Sleep Score</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold">7h 24m</div>
                      <p className="text-sm text-muted-foreground">Average Sleep</p>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">23:15</div>
                      <p className="text-sm text-muted-foreground">Avg Bedtime</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    View Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}