
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Heart, 
  Plus, 
  Smile,
  Frown,
  Meh,
  Battery,
  Moon,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface MentalHealthLog {
  id: string;
  mood_rating: number | null;
  stress_level: number | null;
  anxiety_level: number | null;
  energy_level: number | null;
  sleep_quality_rating: number | null;
  thoughts: string | null;
  activities: string[] | null;
  triggers: string[] | null;
  coping_strategies: string[] | null;
  notes: string | null;
  logged_at: string | null;
  created_at: string;
}

export function MentalHealth() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<MentalHealthLog[]>([]);
  const [moodRating, setMoodRating] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [thoughts, setThoughts] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const commonActivities = [
    'Exercise', 'Reading', 'Meditation', 'Socializing', 'Work', 'Hobbies',
    'Nature walk', 'Music', 'Cooking', 'Gaming', 'Shopping', 'Relaxing'
  ];

  const commonTriggers = [
    'Work stress', 'Relationships', 'Financial concerns', 'Health issues',
    'Sleep problems', 'Social situations', 'Technology', 'Weather', 'Traffic', 'Deadlines'
  ];

  const commonCopingStrategies = [
    'Deep breathing', 'Meditation', 'Exercise', 'Talking to friends',
    'Journaling', 'Listening to music', 'Taking a break', 'Going outside',
    'Positive self-talk', 'Seeking help'
  ];

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('mental_health_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('logged_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching mental health logs:', error);
    }
  };

  const logMentalHealth = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('mental_health_logs')
        .insert({
          user_id: user.id,
          mood_rating: moodRating,
          stress_level: stressLevel,
          anxiety_level: anxietyLevel,
          energy_level: energyLevel,
          sleep_quality_rating: sleepQuality,
          thoughts: thoughts || null,
          activities: activities.length > 0 ? activities : null,
          triggers: triggers.length > 0 ? triggers : null,
          coping_strategies: copingStrategies.length > 0 ? copingStrategies : null,
          notes: notes || null,
          logged_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Mental health logged successfully",
        description: "Your mental health data has been recorded"
      });

      // Reset form
      setMoodRating(5);
      setStressLevel(5);
      setAnxietyLevel(5);
      setEnergyLevel(5);
      setSleepQuality(5);
      setThoughts('');
      setActivities([]);
      setTriggers([]);
      setCopingStrategies([]);
      setNotes('');
      
      fetchLogs();
    } catch (error) {
      console.error('Error logging mental health:', error);
      toast({
        title: "Error logging mental health",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayItem = (item: string, array: string[], setArray: (arr: string[]) => void) => {
    setArray(
      array.includes(item) 
        ? array.filter(i => i !== item)
        : [...array, item]
    );
  };

  const getMoodIcon = (rating: number) => {
    if (rating <= 3) return <Frown className="h-5 w-5 text-red-500" />;
    if (rating <= 7) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Smile className="h-5 w-5 text-green-500" />;
  };

  const getRatingColor = (rating: number, isStress = false) => {
    if (isStress) {
      if (rating <= 3) return 'text-green-600';
      if (rating <= 7) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (rating <= 3) return 'text-red-600';
    if (rating <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAverageRatings = () => {
    if (logs.length === 0) return null;
    
    const recentLogs = logs.slice(0, 7); // Last 7 entries
    return {
      mood: recentLogs.reduce((sum, log) => sum + (log.mood_rating || 0), 0) / recentLogs.length,
      stress: recentLogs.reduce((sum, log) => sum + (log.stress_level || 0), 0) / recentLogs.length,
      anxiety: recentLogs.reduce((sum, log) => sum + (log.anxiety_level || 0), 0) / recentLogs.length,
      energy: recentLogs.reduce((sum, log) => sum + (log.energy_level || 0), 0) / recentLogs.length
    };
  };

  const averages = getAverageRatings();

  return (
    <div className="space-y-6 px-4 pb-6">
      {/* Mental Health Tracker Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Brain className="h-5 w-5 text-purple-500" />
            </div>
            Mental Health Tracker
          </CardTitle>
          <CardDescription className="text-sm">Track your mental wellbeing and mood patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              {getMoodIcon(moodRating)}
              Mood Rating
            </Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Very Low</span>
                <Badge variant="secondary" className={`px-3 py-1 ${getRatingColor(moodRating)}`}>
                  {moodRating}/10
                </Badge>
                <span>Very High</span>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stress Level
            </Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>No Stress</span>
                <Badge variant="secondary" className={`px-3 py-1 ${getRatingColor(stressLevel, true)}`}>
                  {stressLevel}/10
                </Badge>
                <span>Very Stressed</span>
              </div>
            </div>
          </div>

          {/* Anxiety Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Anxiety Level
            </Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={anxietyLevel}
                onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Calm</span>
                <Badge variant="secondary" className={`px-3 py-1 ${getRatingColor(anxietyLevel, true)}`}>
                  {anxietyLevel}/10
                </Badge>
                <span>Very Anxious</span>
              </div>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Battery className="h-5 w-5 text-green-500" />
              Energy Level
            </Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Exhausted</span>
                <Badge variant="secondary" className={`px-3 py-1 ${getRatingColor(energyLevel)}`}>
                  {energyLevel}/10
                </Badge>
                <span>Energized</span>
              </div>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-500" />
              Sleep Quality
            </Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Poor</span>
                <Badge variant="secondary" className={`px-3 py-1 ${getRatingColor(sleepQuality)}`}>
                  {sleepQuality}/10
                </Badge>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Thoughts */}
          <div className="space-y-2">
            <Label htmlFor="thoughts" className="text-sm font-medium">Current Thoughts</Label>
            <Textarea
              id="thoughts"
              placeholder="How are you feeling today? What's on your mind?"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Activities */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Today's Activities</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonActivities.map((activity) => (
                <Button
                  key={activity}
                  variant={activities.includes(activity) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem(activity, activities, setActivities)}
                  className="text-xs h-8"
                >
                  {activity}
                </Button>
              ))}
            </div>
          </div>

          {/* Triggers */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Stress Triggers</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonTriggers.map((trigger) => (
                <Button
                  key={trigger}
                  variant={triggers.includes(trigger) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem(trigger, triggers, setTriggers)}
                  className="text-xs h-8"
                >
                  {trigger}
                </Button>
              ))}
            </div>
          </div>

          {/* Coping Strategies */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Coping Strategies Used</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonCopingStrategies.map((strategy) => (
                <Button
                  key={strategy}
                  variant={copingStrategies.includes(strategy) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleArrayItem(strategy, copingStrategies, setCopingStrategies)}
                  className="text-xs h-8"
                >
                  {strategy}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional thoughts or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Log Button */}
          <Button 
            onClick={logMentalHealth} 
            disabled={isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Mental Health
          </Button>
        </CardContent>
      </Card>

      {/* Mental Health Insights */}
      {averages && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg Mood</span>
                  <Badge variant="secondary" className={getRatingColor(averages.mood)}>
                    {averages.mood.toFixed(1)}/10
                  </Badge>
                </div>
                <Progress value={averages.mood * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg Energy</span>
                  <Badge variant="secondary" className={getRatingColor(averages.energy)}>
                    {averages.energy.toFixed(1)}/10
                  </Badge>
                </div>
                <Progress value={averages.energy * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg Stress</span>
                  <Badge variant="secondary" className={getRatingColor(averages.stress, true)}>
                    {averages.stress.toFixed(1)}/10
                  </Badge>
                </div>
                <Progress value={averages.stress * 10} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Avg Anxiety</span>
                  <Badge variant="secondary" className={getRatingColor(averages.anxiety, true)}>
                    {averages.anxiety.toFixed(1)}/10
                  </Badge>
                </div>
                <Progress value={averages.anxiety * 10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Logs */}
      {logs.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getMoodIcon(log.mood_rating || 5)}
                      <span className="text-sm font-medium">
                        {log.logged_at ? new Date(log.logged_at).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mood: {log.mood_rating || 'N/A'} • Stress: {log.stress_level || 'N/A'} • Energy: {log.energy_level || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
