import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Moon, Clock, Plus, Bell, Lightbulb, Thermometer, Volume2, Brain, Calendar, Flame } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface SleepRecord {
  id: string;
  bedtime: string;
  wake_time: string;
  sleep_duration_hours: number;
  sleep_quality: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export function SleepTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepQuality, setSleepQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sleepStreak, setSleepStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      fetchSleepRecords();
      calculateSleepStreak();
    }
  }, [user]);

  const fetchSleepRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;
      setSleepRecords(data || []);
    } catch (error) {
      console.error('Error fetching sleep records:', error);
    }
  };

  const calculateSleepStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('created_at, sleep_duration_hours')
        .eq('user_id', user?.id)
        .gte('sleep_duration_hours', 6) // Minimum 6 hours for streak
        .order('created_at', { ascending: false });

      if (error) throw error;

      let streak = 0;
      const today = new Date();
      
      for (let i = 0; i < (data?.length || 0); i++) {
        const recordDate = new Date(data![i].created_at);
        const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }
      
      setSleepStreak(streak);
    } catch (error) {
      console.error('Error calculating sleep streak:', error);
    }
  };
  const calculateSleepDuration = (bedtime: string, wakeTime: string) => {
    if (!bedtime || !wakeTime) return 0;
    
    const bedDate = new Date(`2000-01-01 ${bedtime}`);
    let wakeDate = new Date(`2000-01-01 ${wakeTime}`);
    
    // If wake time is earlier than bedtime, assume it's the next day
    if (wakeDate < bedDate) {
      wakeDate = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const diffMs = wakeDate.getTime() - bedDate.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const logSleep = async () => {
    if (!user || !bedtime || !wakeTime || !selectedDate) return;

    setIsLoading(true);
    try {
      const duration = calculateSleepDuration(bedtime, wakeTime);
      const bedtimeDate = new Date(selectedDate);
      const wakeTimeDate = new Date(selectedDate);
      
      // Set bedtime to yesterday if wake time suggests next day
      const [bedHour, bedMin] = bedtime.split(':').map(Number);
      const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
      
      if (wakeHour < bedHour) {
        bedtimeDate.setDate(bedtimeDate.getDate() - 1);
      }
      
      bedtimeDate.setHours(bedHour, bedMin, 0, 0);
      wakeTimeDate.setHours(wakeHour, wakeMin, 0, 0);

      const { error } = await supabase
        .from('sleep_records')
        .insert({
          user_id: user.id,
          bedtime: bedtimeDate.toISOString(),
          wake_time: wakeTimeDate.toISOString(),
          sleep_duration_hours: duration,
          sleep_quality: sleepQuality,
          notes
        });

      if (error) throw error;

      toast({
        title: "Sleep logged successfully",
        description: `${duration} hours of sleep recorded`
      });

      // Reset form
      setBedtime('');
      setWakeTime('');
      setSleepQuality(5);
      setNotes('');
      
      fetchSleepRecords();
      calculateSleepStreak();
    } catch (error) {
      console.error('Error logging sleep:', error);
      toast({
        title: "Error logging sleep",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedBedtime = () => {
    if (!wakeTime) return null;
    
    const [hours, minutes] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);
    
    // Subtract 8 hours for optimal sleep
    const suggestedBedtime = new Date(wakeDate.getTime() - 8 * 60 * 60 * 1000);
    
    // If bedtime would be the previous day, adjust
    if (suggestedBedtime.getDate() !== wakeDate.getDate()) {
      suggestedBedtime.setDate(suggestedBedtime.getDate() + 1);
    }
    
    return suggestedBedtime.toTimeString().slice(0, 5);
  };

  const getSleepTips = () => [
    {
      icon: Thermometer,
      title: "Optimal Temperature",
      tip: "Keep your bedroom between 60-67°F (15-19°C) for the best sleep quality.",
      science: "Core body temperature naturally drops to initiate sleep."
    },
    {
      icon: Volume2,
      title: "Sound Environment", 
      tip: "Aim for under 30 decibels. Use white noise or earplugs if needed.",
      science: "Noise above 35dB can fragment sleep and reduce deep sleep stages."
    },
    {
      icon: Moon,
      title: "Light Control",
      tip: "Complete darkness or use blackout curtains and eye masks.",
      science: "Light exposure suppresses melatonin production, delaying sleep onset."
    },
    {
      icon: Brain,
      title: "Sleep Hygiene",
      tip: "No screens 1 hour before bed. Blue light disrupts circadian rhythm.",
      science: "Blue light wavelengths (480nm) most strongly suppress melatonin."
    }
  ];

  const getAverageSleep = () => {
    if (sleepRecords.length === 0) return 0;
    const total = sleepRecords.reduce((sum, record) => sum + record.sleep_duration_hours, 0);
    return Math.round((total / sleepRecords.length) * 100) / 100;
  };

  const getAverageQuality = () => {
    if (sleepRecords.length === 0) return 0;
    const total = sleepRecords.reduce((sum, record) => sum + record.sleep_quality, 0);
    return Math.round((total / sleepRecords.length) * 10) / 10;
  };

  const suggestedBedtime = getSuggestedBedtime();

  return (
    <div className="space-y-6 px-4 pb-6">
      {/* Log Sleep Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            Sleep Tracker
          </CardTitle>
          <CardDescription className="text-sm">Track your sleep patterns and quality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sleep-date" className="text-sm font-medium">Sleep Date</Label>
              <Input
                id="sleep-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-12"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wake-time" className="text-sm font-medium">Wake Time</Label>
              <Input
                id="wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            
            {/* Suggested Bedtime */}
            {suggestedBedtime && (
              <Alert className="bg-blue-50 border-blue-200">
                <Bell className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Suggested bedtime:</strong> {suggestedBedtime} (for 8 hours of sleep)
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="bedtime" className="text-sm font-medium">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="h-12 text-lg"
                placeholder={suggestedBedtime || ''}
              />
              {suggestedBedtime && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBedtime(suggestedBedtime)}
                  className="text-xs"
                >
                  Use suggested time
                </Button>
              )}
            </div>
          </div>

          {/* Sleep Quality Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Sleep Quality</Label>
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
                <Badge variant="secondary" className="px-3 py-1">{sleepQuality}/10</Badge>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Duration Display */}
          {bedtime && wakeTime && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Duration: {calculateSleepDuration(bedtime, wakeTime)} hours
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did you sleep? Any disturbances?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Log Button */}
          <Button 
            onClick={logSleep} 
            disabled={!bedtime || !wakeTime || !selectedDate || isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      {/* Sleep Tips Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
            </div>
            Sleep Optimization Tips
          </CardTitle>
          <CardDescription className="text-sm">Science-backed recommendations for better sleep</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {getSleepTips().map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{tip.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{tip.tip}</p>
                <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                  <strong>Science:</strong> {tip.science}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Sleep Summary Card */}
      {sleepRecords.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sleep Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Sleep Streak */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    Sleep Streak
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    {sleepStreak} {sleepStreak === 1 ? 'day' : 'days'} of quality sleep
                  </p>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {sleepStreak}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{getAverageSleep()}h</div>
                <p className="text-xs text-muted-foreground mt-1">Avg Sleep</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{getAverageQuality()}/10</div>
                <p className="text-xs text-muted-foreground mt-1">Avg Quality</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{sleepRecords.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Records</p>
              </div>
            </div>

            {/* Recent Records */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recent Sleep Records</h4>
              {sleepRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Quality: {record.sleep_quality}/10 • {new Date(record.bedtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(record.wake_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 font-medium">
                    {record.sleep_duration_hours}h
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
