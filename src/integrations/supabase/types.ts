export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      exercise_records: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string
          duration_minutes: number | null
          exercise_name: string
          exercise_type: string | null
          id: string
          intensity: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          exercise_name: string
          exercise_type?: string | null
          id?: string
          intensity?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number | null
          exercise_name?: string
          exercise_type?: string | null
          id?: string
          intensity?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_entries: {
        Row: {
          calories_per_serving: number | null
          carbs_g: number | null
          consumed_at: string | null
          created_at: string
          fat_g: number | null
          fiber_g: number | null
          food_name: string
          id: string
          meal_type: string | null
          protein_g: number | null
          servings: number | null
          sodium_mg: number | null
          sugar_g: number | null
          total_calories: number | null
          user_id: string
        }
        Insert: {
          calories_per_serving?: number | null
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string
          fat_g?: number | null
          fiber_g?: number | null
          food_name: string
          id?: string
          meal_type?: string | null
          protein_g?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          total_calories?: number | null
          user_id: string
        }
        Update: {
          calories_per_serving?: number | null
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string
          fat_g?: number | null
          fiber_g?: number | null
          food_name?: string
          id?: string
          meal_type?: string | null
          protein_g?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          total_calories?: number | null
          user_id?: string
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          goal_type: string | null
          id: string
          status: string | null
          target_date: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type?: string | null
          id?: string
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type?: string | null
          id?: string
          status?: string | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_reminders: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          id: string
          is_active: boolean | null
          message: string | null
          reminder_type: string | null
          scheduled_time: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_type?: string | null
          scheduled_time?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          id?: string
          is_active?: boolean | null
          message?: string | null
          reminder_type?: string | null
          scheduled_time?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      menstrual_cycles: {
        Row: {
          created_at: string
          cycle_end_date: string | null
          cycle_length_days: number | null
          cycle_start_date: string
          flow_intensity: string | null
          id: string
          mood_rating: number | null
          notes: string | null
          pain_level: number | null
          period_length_days: number | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length_days?: number | null
          cycle_start_date: string
          flow_intensity?: string | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          pain_level?: number | null
          period_length_days?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length_days?: number | null
          cycle_start_date?: string
          flow_intensity?: string | null
          id?: string
          mood_rating?: number | null
          notes?: string | null
          pain_level?: number | null
          period_length_days?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mental_health_logs: {
        Row: {
          activities: string[] | null
          anxiety_level: number | null
          coping_strategies: string[] | null
          created_at: string
          energy_level: number | null
          id: string
          logged_at: string | null
          mood_rating: number | null
          notes: string | null
          physical_symptoms: string[] | null
          sleep_quality_rating: number | null
          stress_level: number | null
          thoughts: string | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          activities?: string[] | null
          anxiety_level?: number | null
          coping_strategies?: string[] | null
          created_at?: string
          energy_level?: number | null
          id?: string
          logged_at?: string | null
          mood_rating?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          sleep_quality_rating?: number | null
          stress_level?: number | null
          thoughts?: string | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          activities?: string[] | null
          anxiety_level?: number | null
          coping_strategies?: string[] | null
          created_at?: string
          energy_level?: number | null
          id?: string
          logged_at?: string | null
          mood_rating?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          sleep_quality_rating?: number | null
          stress_level?: number | null
          thoughts?: string | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_records: {
        Row: {
          bedtime: string | null
          created_at: string
          id: string
          notes: string | null
          sleep_duration_hours: number | null
          sleep_quality: number | null
          updated_at: string
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          updated_at?: string
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          sleep_duration_hours?: number | null
          sleep_quality?: number | null
          updated_at?: string
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      step_records: {
        Row: {
          created_at: string
          date: string
          id: string
          steps: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          steps: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          steps?: number
          user_id?: string
        }
        Relationships: []
      }
      user_profiles_health: {
        Row: {
          activity_level: string | null
          birth_date: string | null
          created_at: string
          daily_caloric_target: number | null
          gender: string | null
          goal_type: string | null
          height_cm: number | null
          id: string
          target_weight_kg: number | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          daily_caloric_target?: number | null
          gender?: string | null
          goal_type?: string | null
          height_cm?: number | null
          id?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          daily_caloric_target?: number | null
          gender?: string | null
          goal_type?: string | null
          height_cm?: number | null
          id?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
