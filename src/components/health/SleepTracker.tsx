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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sleep Tracker
          </CardTitle>
          <CardDescription>Track your sleep patterns and quality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wake-time">Wake Time</Label>
              <Input
                id="wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Sleep Quality (1-10)</Label>
            <Input
              type="range"
              min="1"
              max="10"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="mt-2"
            />
            <div className="text-center mt-1">
              <Badge variant="outline">{sleepQuality}/10</Badge>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did you sleep? Any disturbances?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {bedtime && wakeTime && (
            <div className="text-center">
              <Badge className="bg-primary text-primary-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Duration: {calculateSleepDuration(bedtime, wakeTime)} hours
              </Badge>
            </div>
          )}

          <Button 
            onClick={logSleep} 
            disabled={!bedtime || !wakeTime || isLoading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Log Sleep
          </Button>
        </CardContent>
      </Card>

      {sleepRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sleep Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{getAverageSleep()}h</div>
                <p className="text-sm text-muted-foreground">Average Sleep</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{getAverageQuality()}/10</div>
                <p className="text-sm text-muted-foreground">Average Quality</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{sleepRecords.length}</div>
                <p className="text-sm text-muted-foreground">Records</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Recent Sleep Records</h4>
              {sleepRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="text-sm">
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {record.sleep_duration_hours}h • Quality: {record.sleep_quality}/10
                    </div>
                  </div>
                  <Badge variant="outline">{record.sleep_duration_hours}h</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}