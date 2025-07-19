import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Activity, DollarSign, Heart, ArrowUpRight, Sparkles, Target, Brain, ChevronRight, Bell, User } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [healthScore, setHealthScore] = useState(0);
  const [wealthScore, setWealthScore] = useState(0);
  const [relationsScore, setRelationsScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch recent health data
      const { data: sleepData } = await supabase
        .from('sleep_records')
        .select('sleep_quality, sleep_duration_hours')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(7);

      const { data: exerciseData } = await supabase
        .from('exercise_records')
        .select('duration_minutes')
        .eq('user_id', user?.id)
        .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('completed_at', { ascending: false });

      const { data: mentalHealthData } = await supabase
        .from('mental_health_logs')
        .select('mood_rating, stress_level, energy_level')
        .eq('user_id', user?.id)
        .order('logged_at', { ascending: false })
        .limit(7);

      // Calculate health score
      let healthScore = 50; // Base score
      
      if (sleepData && sleepData.length > 0) {
        const avgSleepQuality = sleepData.reduce((sum, record) => sum + (record.sleep_quality || 0), 0) / sleepData.length;
        const avgSleepDuration = sleepData.reduce((sum, record) => sum + (record.sleep_duration_hours || 0), 0) / sleepData.length;
        healthScore += (avgSleepQuality * 2) + (avgSleepDuration >= 7 ? 15 : avgSleepDuration * 2);
      }

      if (exerciseData && exerciseData.length > 0) {
        const totalExercise = exerciseData.reduce((sum, record) => sum + (record.duration_minutes || 0), 0);
        healthScore += Math.min(totalExercise / 10, 20); // Up to 20 points for exercise
      }

      if (mentalHealthData && mentalHealthData.length > 0) {
        const avgMood = mentalHealthData.reduce((sum, record) => sum + (record.mood_rating || 0), 0) / mentalHealthData.length;
        const avgStress = mentalHealthData.reduce((sum, record) => sum + (record.stress_level || 0), 0) / mentalHealthData.length;
        healthScore += (avgMood * 1.5) - (avgStress * 0.5);
      }

      setHealthScore(Math.min(Math.max(Math.round(healthScore), 0), 100));

      // Calculate wealth score (placeholder calculation)
      setWealthScore(92);

      // Calculate relations score (placeholder calculation)
      setRelationsScore(78);

      // Calculate overall score
      const overall = Math.round((healthScore + 92 + 78) / 3);
      setOverallScore(overall);

      // Generate insights based on data
      const newInsights = [];
      
      if (sleepData && sleepData.length > 0) {
        const avgSleep = sleepData.reduce((sum, record) => sum + (record.sleep_duration_hours || 0), 0) / sleepData.length;
        if (avgSleep < 7) {
          newInsights.push({
            emoji: '💤',
            title: 'Sleep Optimization',
            description: `Increase sleep by ${(7 - avgSleep).toFixed(1)}h for better recovery`,
            action: 'Improve',
            pillar: 'health'
          });
        }
      }

      if (exerciseData && exerciseData.length < 3) {
        newInsights.push({
          emoji: '💪',
          title: 'Exercise Frequency',
          description: 'Add more workouts to reach weekly goals',
          action: 'Exercise',
          pillar: 'health'
        });
      }

      newInsights.push({
        emoji: '💎',
        title: 'Investment Growth',
        description: 'Portfolio performing above market average',
        action: 'Review',
        pillar: 'wealth'
      });

      setInsights(newInsights);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const pillars = [
    {
      id: 'health',
      title: 'Health',
      icon: Activity,
      description: 'Optimize your body and mind',
      emoji: '💚',
      gradient: 'health-gradient',
      stats: { value: `${healthScore}%`, label: 'Optimized', trend: loading ? '...' : '+5%' },
      color: 'text-green-500'
    },
    {
      id: 'wealth',
      title: 'Wealth',
      icon: DollarSign,
      description: 'Build financial freedom',
      emoji: '💎',
      gradient: 'wealth-gradient',
      stats: { value: `${wealthScore}%`, label: 'Growing', trend: '+12%' },
      color: 'text-blue-500'
    },
    {
      id: 'relations',
      title: 'Relations',
      icon: Heart,
      description: 'Strengthen connections',
      emoji: '🤝',
      gradient: 'relations-gradient',
      stats: { value: `${relationsScore}%`, label: 'Connected', trend: '+8%' },
      color: 'text-purple-500'
    }
  ];


  return (
    <div className="min-h-screen safe-area-top safe-area-bottom ios-scroll">
      {/* iOS-style Header */}
      <div className="ios-header safe-area-left safe-area-right">
        <div className="flex items-center justify-between w-full px-4">
          <div>
            <div className="ios-large-title gradient-text">Trinity</div>
            <p className="text-sm text-muted-foreground">Life Optimization System</p>
          </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-10 w-10 p-0 haptic-light"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
        </div>
      </div>

      <main className="px-4 py-6 safe-area-left safe-area-right pb-32">
        {/* Hero Section - Optimized for mobile */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary/10 text-xs">
              <Sparkles className="h-3 w-3" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-primary/10 text-xs">
              <Target className="h-3 w-3" />
              <span>Science-Based</span>
            </div>
          </div>
          <p className="text-base text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
            Transform your life through the trinity of human optimization
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="glass-card mb-6 haptic-light">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{loading ? '...' : overallScore}</div>
              <p className="text-sm text-muted-foreground mb-4">Overall Trinity Score</p>
              <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span>{loading ? 'Loading...' : '+8% from last week'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pillars Grid - Optimized for mobile */}
        <div className="space-y-4 mb-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={pillar.id} 
                className="ios-list-item haptic-medium cursor-pointer"
                onClick={() => navigate(`/${pillar.id}`)}
              >
                <div className={`w-12 h-12 rounded-2xl ${pillar.gradient} flex items-center justify-center text-white text-xl shadow-lg mr-4`}>
                  {pillar.emoji}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold">{pillar.title}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold">{pillar.stats.value}</div>
                      <div className={`text-xs ${pillar.color}`}>{pillar.stats.trend}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{pillar.description}</p>
                  <div className="text-xs text-muted-foreground">{pillar.stats.label}</div>
                </div>
                
                <ChevronRight className="h-5 w-5 text-muted-foreground ml-2" />
              </Card>
            );
          })}
        </div>

        {/* Today's Insights */}
        {insights.length > 0 && (
          <Card className="ios-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Today's Insights</h2>
            <Brain className="h-5 w-5 text-primary" />
          </div>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="ios-list-item haptic-selection">
                <div className="text-2xl mr-3">{insight.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{insight.title}</div>
                  <div className="text-xs text-muted-foreground">{insight.description}</div>
                </div>
                <Button size="sm" variant="outline" className="haptic-light">
                  {insight.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button 
            className="ios-button-primary haptic-medium h-16 flex-col gap-2"
            onClick={() => navigate('/health')}
          >
            <Activity className="h-5 w-5" />
            <span className="text-sm">Track Health</span>
          </Button>
          <Button 
            className="ios-button-secondary haptic-medium h-16 flex-col gap-2"
            onClick={() => navigate('/wealth')}
          >
            <DollarSign className="h-5 w-5" />
            <span className="text-sm">Check Wealth</span>
          </Button>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="ios-button-primary w-full haptic-heavy"
            onClick={() => navigate('/health')}
          >
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Start Your Optimization Journey
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Begin with a comprehensive health assessment
          </p>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;