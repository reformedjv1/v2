import { Navigation } from "@/components/Navigation";
import { SleepTracker } from "@/components/health/SleepTracker";
import { DietTracker } from "@/components/health/DietTracker";
import { ExerciseTracker } from "@/components/health/ExerciseTracker";
import { HealthProfile } from "@/components/health/HealthProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from 'lucide-react';

export default function Health() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Transform biomarkers into daily habits for longevity</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="exercise">Exercise</TabsTrigger>
            <TabsTrigger value="mental">Mental</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <HealthProfile />
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4">
            <SleepTracker />
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <DietTracker />
          </TabsContent>

          <TabsContent value="exercise" className="space-y-4">
            <ExerciseTracker />
          </TabsContent>

          <TabsContent value="mental" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Mental Health Support</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Track your mental wellbeing and access support resources.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">• Mood tracking and patterns</div>
                  <div className="text-sm">• Stress and anxiety management</div>
                  <div className="text-sm">• Guided meditation and breathing exercises</div>
                  <div className="text-sm">• Professional therapy recommendations</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <h3 className="font-semibold">Women's Health</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive tracking for female health and wellness.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">• Menstrual cycle tracking</div>
                  <div className="text-sm">• Ovulation and fertility insights</div>
                  <div className="text-sm">• Hormonal health monitoring</div>
                  <div className="text-sm">• Nutritional recommendations by cycle phase</div>
                </div>
              </div>
            </div>
            
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mental Health & Women's Health Features</h3>
              <p className="text-muted-foreground mb-4">
                Advanced tracking for mental wellness and women's health coming soon.
              </p>
              <p className="text-sm text-muted-foreground">
                These features will include mood tracking, cycle monitoring, and personalized health insights.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}