import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, Calculator } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface HealthProfile {
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number;
  goal_type: string;
  daily_caloric_target: number;
  activity_level: string;
  gender: string;
  birth_date: string;
}

export function HealthProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<HealthProfile>({
    height_cm: 0,
    weight_kg: 0,
    target_weight_kg: 0,
    goal_type: 'maintain',
    daily_caloric_target: 2000,
    activity_level: 'moderate',
    gender: '',
    birth_date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHealthProfile();
    }
  }, [user]);

  const fetchHealthProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_health')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile({
          height_cm: data.height_cm || 0,
          weight_kg: data.weight_kg || 0,
          target_weight_kg: data.target_weight_kg || 0,
          goal_type: data.goal_type || 'maintain',
          daily_caloric_target: data.daily_caloric_target || 2000,
          activity_level: data.activity_level || 'moderate',
          gender: data.gender || '',
          birth_date: data.birth_date || ''
        });
        setHasProfile(true);
      }
    } catch (error) {
      console.error('Error fetching health profile:', error);
    }
  };

  const calculateBMR = () => {
    if (!profile.height_cm || !profile.weight_kg || !profile.birth_date || !profile.gender) return 0;
    
    const age = new Date().getFullYear() - new Date(profile.birth_date).getFullYear();
    
    // Harris-Benedict Equation
    let bmr;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight_kg) + (4.799 * profile.height_cm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight_kg) + (3.098 * profile.height_cm) - (4.330 * age);
    }
    
    // Activity level multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return Math.round(bmr * multipliers[profile.activity_level as keyof typeof multipliers]);
  };

  const calculateBMI = () => {
    if (!profile.height_cm || !profile.weight_kg) return 0;
    const heightM = profile.height_cm / 100;
    return Math.round((profile.weight_kg / (heightM * heightM)) * 10) / 10;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const saveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const calculatedCalories = calculateBMR();
      let adjustedCalories = calculatedCalories;

      // Adjust calories based on goal
      if (profile.goal_type === 'lose') {
        adjustedCalories = calculatedCalories - 500; // 500 calorie deficit for 1lb/week loss
      } else if (profile.goal_type === 'gain') {
        adjustedCalories = calculatedCalories + 500; // 500 calorie surplus for 1lb/week gain
      }

      const profileData = {
        user_id: user.id,
        height_cm: profile.height_cm,
        weight_kg: profile.weight_kg,
        target_weight_kg: profile.target_weight_kg,
        goal_type: profile.goal_type,
        daily_caloric_target: adjustedCalories,
        activity_level: profile.activity_level,
        gender: profile.gender,
        birth_date: profile.birth_date
      };

      const { error } = await supabase
        .from('user_profiles_health')
        .upsert(profileData);

      if (error) throw error;

      toast({
        title: "Profile saved successfully",
        description: `Daily caloric target: ${adjustedCalories} calories`
      });

      setHasProfile(true);
    } catch (error) {
      console.error('Error saving health profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Health Profile
        </CardTitle>
        <CardDescription>
          Set up your profile to get personalized nutrition and fitness recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="birth-date">Birth Date</Label>
            <Input
              id="birth-date"
              type="date"
              value={profile.birth_date}
              onChange={(e) => setProfile({...profile, birth_date: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              value={profile.height_cm || ''}
              onChange={(e) => setProfile({...profile, height_cm: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="weight">Current Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70.0"
              value={profile.weight_kg || ''}
              onChange={(e) => setProfile({...profile, weight_kg: Number(e.target.value)})}
            />
          </div>
          <div>
            <Label htmlFor="target-weight">Target Weight (kg)</Label>
            <Input
              id="target-weight"
              type="number"
              step="0.1"
              placeholder="65.0"
              value={profile.target_weight_kg || ''}
              onChange={(e) => setProfile({...profile, target_weight_kg: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="goal-type">Goal</Label>
            <Select value={profile.goal_type} onValueChange={(value) => setProfile({...profile, goal_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="activity-level">Activity Level</Label>
            <Select value={profile.activity_level} onValueChange={(value) => setProfile({...profile, activity_level: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very_active">Very Active (very hard exercise & physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {bmi > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" />
              <span className="font-semibold">Health Metrics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold">BMI: {bmi}</div>
                <div className={`text-sm ${bmiInfo.color}`}>{bmiInfo.category}</div>
              </div>
              <div>
                <div className="text-xl font-bold">{calculateBMR()}</div>
                <div className="text-sm text-muted-foreground">Estimated Daily Calories</div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  {profile.target_weight_kg > 0 ? Math.abs(profile.weight_kg - profile.target_weight_kg).toFixed(1) : 0}kg
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.target_weight_kg > profile.weight_kg ? 'To Gain' : 'To Lose'}
                </div>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={saveProfile} 
          disabled={!profile.height_cm || !profile.weight_kg || !profile.gender || !profile.birth_date || isLoading}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {hasProfile ? 'Update Profile' : 'Save Profile'}
        </Button>
      </CardContent>
    </Card>
  );
}