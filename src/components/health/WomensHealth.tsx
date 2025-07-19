
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, 
  Calendar, 
  Plus, 
  Droplet, 
  ThermometerSun, 
  Moon,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface MenstrualCycle {
  id: string;
  cycle_start_date: string;
  cycle_end_date: string | null;
  cycle_length_days: number | null;
  period_length_days: number | null;
  flow_intensity: string | null;
  pain_level: number | null;
  mood_rating: number | null;
  symptoms: string[] | null;
  notes: string | null;
  created_at: string;
}

export function WomensHealth() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cycles, setCycles] = useState<MenstrualCycle[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flowIntensity, setFlowIntensity] = useState<string>('');
  const [painLevel, setPainLevel] = useState(1);
  const [moodRating, setMoodRating] = useState(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const commonSymptoms = [
    'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Mood swings',
    'Breast tenderness', 'Back pain', 'Nausea', 'Food cravings', 'Acne'
  ];

  useEffect(() => {
    if (user) {
      fetchCycles();
    }
  }, [user]);

  const fetchCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('menstrual_cycles')
        .select('*')
        .eq('user_id', user?.id)
        .order('cycle_start_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCycles(data || []);
    } catch (error) {
      console.error('Error fetching cycles:', error);
    }
  };

  const logCycle = async () => {
    if (!user || !startDate) return;

    setIsLoading(true);
    try {
      const cycleLengthDays = endDate && startDate 
        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      const { error } = await supabase
        .from('menstrual_cycles')
        .insert({
          user_id: user.id,
          cycle_start_date: startDate,
          cycle_end_date: endDate || null,
          cycle_length_days: cycleLengthDays,
          flow_intensity: flowIntensity || null,
          pain_level: painLevel,
          mood_rating: moodRating,
          symptoms: symptoms.length > 0 ? symptoms : null,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Cycle logged successfully",
        description: "Your menstrual cycle data has been recorded"
      });

      // Reset form
      setStartDate('');
      setEndDate('');
      setFlowIntensity('');
      setPainLevel(1);
      setMoodRating(5);
      setSymptoms([]);
      setNotes('');
      
      fetchCycles();
    } catch (error) {
      console.error('Error logging cycle:', error);
      toast({
        title: "Error logging cycle",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getNextPredictedPeriod = () => {
    if (cycles.length < 2) return null;
    
    const avgCycleLength = cycles
      .filter(c => c.cycle_length_days)
      .reduce((sum, c) => sum + (c.cycle_length_days || 0), 0) / cycles.length;
    
    const lastCycle = cycles[0];
    if (!lastCycle.cycle_start_date) return null;
    
    const nextDate = new Date(lastCycle.cycle_start_date);
    nextDate.setDate(nextDate.getDate() + Math.round(avgCycleLength));
    
    return nextDate;
  };

  const predictedDate = getNextPredictedPeriod();
  const daysUntilNext = predictedDate 
    ? Math.ceil((predictedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6 px-4 pb-6">
      {/* Cycle Tracker Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            Women's Health Tracker
          </CardTitle>
          <CardDescription className="text-sm">Track your menstrual cycle and symptoms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium">Period Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium">Period End Date (optional)</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12"
              />
            </div>
          </div>

          {/* Flow Intensity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Flow Intensity</Label>
            <Select value={flowIntensity} onValueChange={setFlowIntensity}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select flow intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pain Level */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Pain Level</Label>
            <div className="px-3">
              <Input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>No Pain</span>
                <Badge variant="secondary" className="px-3 py-1">{painLevel}/10</Badge>
                <span>Severe</span>
              </div>
            </div>
          </div>

          {/* Mood Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Mood Rating</Label>
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
                <span>Poor</span>
                <Badge variant="secondary" className="px-3 py-1">{moodRating}/10</Badge>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Symptoms</Label>
            <div className="grid grid-cols-2 gap-2">
              {commonSymptoms.map((symptom) => (
                <Button
                  key={symptom}
                  variant={symptoms.includes(symptom) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSymptom(symptom)}
                  className="text-xs h-8"
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about your cycle"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Log Button */}
          <Button 
            onClick={logCycle} 
            disabled={!startDate || isLoading}
            className="w-full h-12 text-base font-medium"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Cycle
          </Button>
        </CardContent>
      </Card>

      {/* Cycle Summary */}
      {cycles.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Cycle Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Next Period Prediction */}
            {predictedDate && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-pink-800">Next Period Predicted</h4>
                    <p className="text-sm text-pink-600">
                      {predictedDate.toLocaleDateString()} 
                      {daysUntilNext && daysUntilNext > 0 && (
                        <span> ({daysUntilNext} days)</span>
                      )}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-pink-500" />
                </div>
              </div>
            )}

            {/* Recent Cycles */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recent Cycles</h4>
              {cycles.slice(0, 3).map((cycle) => (
                <div key={cycle.id} className="flex justify-between items-center p-3 bg-card border rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {new Date(cycle.cycle_start_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {cycle.flow_intensity && `${cycle.flow_intensity} flow`}
                      {cycle.pain_level && ` • Pain: ${cycle.pain_level}/10`}
                    </div>
                  </div>
                  {cycle.cycle_length_days && (
                    <Badge variant="outline" className="px-3 py-1 font-medium">
                      {cycle.cycle_length_days} days
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
