import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Plus, Activity, Timer, Target } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ExerciseRecord {
  id: string;
  exercise_type: string;
  exercise_name: string;
  duration_minutes: number;
  calories_burned: number;
  intensity: string;
  notes: string;
  completed_at: string;
}

interface StepRecord {
  id: string;
  steps: number;
  date: string;
}

export function ExerciseTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exerciseRecords, setExerciseRecords] = useState<ExerciseRecord[]>([]);
  const [todaySteps, setTodaySteps] = useState<StepRecord | null>(null);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const weeklyExerciseGoal = 150; // WHO recommended minutes per week

  useEffect(() => {
    if (user) {
      fetchWeeklyExerciseRecords();
      fetchTodaySteps();
    }
  }, [user]);

  const fetchWeeklyExerciseRecords = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('exercise_records')
        .select('*')
        .gte('completed_at', oneWeekAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setExerciseRecords(data || []);
    } catch (error) {
      console.error('Error fetching exercise records:', error);
    }
  };

  const fetchTodaySteps = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('step_records')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setTodaySteps(data);
    } catch (error) {
      console.error('Error fetching step records:', error);
    }
  };

  const addExerciseRecord = async () => {
    if (!user || !exerciseName || !exerciseType || !duration || !intensity) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('exercise_records')
        .insert({
          user_id: user.id,
          exercise_name: exerciseName,
          exercise_type: exerciseType,
          duration_minutes: Number(duration),
          calories_burned: Number(calories) || 0,
          intensity,
          notes,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Exercise logged successfully",
        description: `${exerciseName} - ${duration} minutes`
      });

      // Reset form
      setExerciseName('');
      setExerciseType('');
      setDuration('');
      setCalories('');
      setIntensity('');
      setNotes('');
      
      fetchWeeklyExerciseRecords();
    } catch (error) {
      console.error('Error adding exercise record:', error);
      toast({
        title: "Error logging exercise",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSteps = async () => {
    if (!user || !steps) return;

    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('step_records')
        .upsert({
          user_id: user.id,
          steps: Number(steps),
          date: today
        });

      if (error) throw error;

      toast({
        title: "Steps updated successfully",
        description: `${steps} steps recorded for today`
      });

      setSteps('');
      fetchTodaySteps();
    } catch (error) {
      console.error('Error updating steps:', error);
      toast({
        title: "Error updating steps",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyExerciseMinutes = () => {
    return exerciseRecords.reduce((sum, record) => sum + (record.duration_minutes || 0), 0);
  };

  const getWeeklyCaloriesBurned = () => {
    return exerciseRecords.reduce((sum, record) => sum + (record.calories_burned || 0), 0);
  };

  const getExerciseProgress = () => {
    const weeklyMinutes = getWeeklyExerciseMinutes();
    return Math.min((weeklyMinutes / weeklyExerciseGoal) * 100, 100);
  };

  const getStepProgress = () => {
    const dailyStepGoal = 10000;
    if (!todaySteps) return 0;
    return Math.min((todaySteps.steps / dailyStepGoal) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Log Exercise
            </CardTitle>
            <CardDescription>Record your workout sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exercise-name">Exercise Name</Label>
              <Input
                id="exercise-name"
                placeholder="e.g., Push-ups, Running, Yoga"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exercise-type">Type</Label>
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="intensity">Intensity</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories (optional)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="300"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did the workout feel?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button 
              onClick={addExerciseRecord} 
              disabled={!exerciseName || !exerciseType || !duration || !intensity || isLoading}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Log Exercise
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Steps
            </CardTitle>
            <CardDescription>Track your daily step count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                {todaySteps?.steps.toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground">steps today</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Goal</span>
                <span>{todaySteps?.steps || 0}/10,000</span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
            </div>

            <div>
              <Label htmlFor="steps">Update Steps</Label>
              <Input
                id="steps"
                type="number"
                placeholder="8432"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>

            <Button 
              onClick={updateSteps} 
              disabled={!steps || isLoading}
              className="w-full"
            >
              <Activity className="h-4 w-4 mr-2" />
              Update Steps
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Exercise Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weekly Exercise Goal</span>
                <span>{getWeeklyExerciseMinutes()}/{weeklyExerciseGoal} min</span>
              </div>
              <Progress value={getExerciseProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{getWeeklyExerciseMinutes()}</div>
                <p className="text-sm text-muted-foreground">Minutes This Week</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{exerciseRecords.length}</div>
                <p className="text-sm text-muted-foreground">Workouts</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round(getWeeklyCaloriesBurned())}</div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
              </div>
            </div>

            {exerciseRecords.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Recent Workouts</h4>
                {exerciseRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">{record.exercise_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {record.exercise_type} • {record.intensity} intensity
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{record.duration_minutes} min</Badge>
                      {record.calories_burned > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {record.calories_burned} cal
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}