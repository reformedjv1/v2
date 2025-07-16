import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Moon, Clock, Plus, Bell } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      fetchSleepRecords();
    }
  }, [user]);

  const fetchSleepRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      setSleepRecords(data || []);
    } catch (error) {
      console.error('Error fetching sleep records:', error);
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
    if (!user || !bedtime || !wakeTime) return;

    setIsLoading(true);
    try {
      const duration = calculateSleepDuration(bedtime, wakeTime);
      const bedtimeDate = new Date();
      const wakeTimeDate = new Date();
      
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
              <Label htmlFor="bedtime" className="text-sm font-medium">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="h-12 text-lg"
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
            disabled={!bedtime || !wakeTime || isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      {/* Sleep Summary Card */}
      {sleepRecords.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sleep Summary</CardTitle>
          </CardHeader>
          <CardContent>
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
              {sleepRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Quality: {record.sleep_quality}/10
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