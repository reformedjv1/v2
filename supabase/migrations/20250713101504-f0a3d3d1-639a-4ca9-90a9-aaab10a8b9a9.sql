-- Create tables for comprehensive health tracking

-- Sleep tracking table
CREATE TABLE public.sleep_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bedtime TIMESTAMP WITH TIME ZONE,
  wake_time TIMESTAMP WITH TIME ZONE,
  sleep_duration_hours DECIMAL(4,2),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Diet and nutrition tracking
CREATE TABLE public.user_profiles_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  target_weight_kg DECIMAL(5,2),
  goal_type TEXT CHECK (goal_type IN ('lose', 'gain', 'maintain')) DEFAULT 'maintain',
  daily_caloric_target INTEGER,
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')) DEFAULT 'moderate',
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Food intake tracking
CREATE TABLE public.food_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  food_name TEXT NOT NULL,
  calories_per_serving DECIMAL(7,2),
  servings DECIMAL(5,2) DEFAULT 1,
  total_calories DECIMAL(7,2),
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fat_g DECIMAL(6,2),
  fiber_g DECIMAL(6,2),
  sugar_g DECIMAL(6,2),
  sodium_mg DECIMAL(8,2),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Exercise tracking
CREATE TABLE public.exercise_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'sports')),
  exercise_name TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned DECIMAL(6,2),
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high')),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily step tracking
CREATE TABLE public.step_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  steps INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Female health tracking
CREATE TABLE public.menstrual_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_start_date DATE NOT NULL,
  cycle_end_date DATE,
  cycle_length_days INTEGER,
  period_length_days INTEGER,
  flow_intensity TEXT CHECK (flow_intensity IN ('light', 'moderate', 'heavy')),
  symptoms TEXT[], -- Array of symptoms
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Mental health tracking
CREATE TABLE public.mental_health_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  sleep_quality_rating INTEGER CHECK (sleep_quality_rating >= 1 AND sleep_quality_rating <= 10),
  physical_symptoms TEXT[],
  thoughts TEXT,
  activities TEXT[],
  triggers TEXT[],
  coping_strategies TEXT[],
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Health goals and reminders
CREATE TABLE public.health_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('sleep', 'diet', 'exercise', 'mental_health', 'female_health')),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT,
  target_date DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications and reminders
CREATE TABLE public.health_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('bedtime', 'caffeine_cutoff', 'screen_time', 'meal', 'exercise', 'medication', 'checkup')),
  title TEXT NOT NULL,
  message TEXT,
  scheduled_time TIME,
  days_of_week INTEGER[], -- Array of integers 0-6 (Sunday-Saturday)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menstrual_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- Sleep records policies
CREATE POLICY "Users can view their own sleep records" ON public.sleep_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sleep records" ON public.sleep_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sleep records" ON public.sleep_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sleep records" ON public.sleep_records FOR DELETE USING (auth.uid() = user_id);

-- Health profiles policies
CREATE POLICY "Users can view their own health profile" ON public.user_profiles_health FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own health profile" ON public.user_profiles_health FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health profile" ON public.user_profiles_health FOR UPDATE USING (auth.uid() = user_id);

-- Food entries policies
CREATE POLICY "Users can view their own food entries" ON public.food_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own food entries" ON public.food_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own food entries" ON public.food_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own food entries" ON public.food_entries FOR DELETE USING (auth.uid() = user_id);

-- Exercise records policies
CREATE POLICY "Users can view their own exercise records" ON public.exercise_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exercise records" ON public.exercise_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercise records" ON public.exercise_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercise records" ON public.exercise_records FOR DELETE USING (auth.uid() = user_id);

-- Step records policies
CREATE POLICY "Users can view their own step records" ON public.step_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own step records" ON public.step_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own step records" ON public.step_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own step records" ON public.step_records FOR DELETE USING (auth.uid() = user_id);

-- Menstrual cycles policies
CREATE POLICY "Users can view their own menstrual cycles" ON public.menstrual_cycles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own menstrual cycles" ON public.menstrual_cycles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own menstrual cycles" ON public.menstrual_cycles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own menstrual cycles" ON public.menstrual_cycles FOR DELETE USING (auth.uid() = user_id);

-- Mental health logs policies
CREATE POLICY "Users can view their own mental health logs" ON public.mental_health_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mental health logs" ON public.mental_health_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mental health logs" ON public.mental_health_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mental health logs" ON public.mental_health_logs FOR DELETE USING (auth.uid() = user_id);

-- Health goals policies
CREATE POLICY "Users can view their own health goals" ON public.health_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own health goals" ON public.health_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health goals" ON public.health_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health goals" ON public.health_goals FOR DELETE USING (auth.uid() = user_id);

-- Health reminders policies
CREATE POLICY "Users can view their own health reminders" ON public.health_reminders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own health reminders" ON public.health_reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own health reminders" ON public.health_reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own health reminders" ON public.health_reminders FOR DELETE USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_sleep_records_updated_at BEFORE UPDATE ON public.sleep_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_profiles_health_updated_at BEFORE UPDATE ON public.user_profiles_health FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menstrual_cycles_updated_at BEFORE UPDATE ON public.menstrual_cycles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_goals_updated_at BEFORE UPDATE ON public.health_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_reminders_updated_at BEFORE UPDATE ON public.health_reminders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();