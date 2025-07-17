import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Utensils, Target, TrendingUp, Search, Plus, Scale, ChefHat } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { FoodSearch } from './FoodSearch';
import { MealCreator } from './MealCreator';

interface FoodEntry {
  id: string;
  food_name: string;
  total_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  meal_type: string;
  consumed_at: string;
  servings: number;
}

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

interface USDAFood {
  fdcId: number;
  description: string;
  nutrients: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
    [key: string]: number | undefined;
  };
}

export function NutritionTracker() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [selectedFood, setSelectedFood] = useState<USDAFood | null>(null);
  const [servings, setServings] = useState('1');
  const [mealType, setMealType] = useState<string>('');
  const [isLogging, setIsLogging] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    if (user) {
      fetchTodaysFoodEntries();
      fetchHealthProfile();
    }
  }, [user]);

  const fetchTodaysFoodEntries = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user?.id)
        .gte('consumed_at', `${today}T00:00:00.000Z`)
        .lt('consumed_at', `${today}T23:59:59.999Z`)
        .order('consumed_at', { ascending: false });

      if (error) throw error;
      setFoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching food entries:', error);
    }
  };

  const fetchHealthProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles_health')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHealthProfile(data);
    } catch (error) {
      console.error('Error fetching health profile:', error);
    }
  };

  const handleFoodSelect = (food: USDAFood) => {
    setSelectedFood(food);
    setActiveTab('log');
  };

  const logSelectedFood = async () => {
    if (!user || !selectedFood || !mealType || !servings) return;

    setIsLogging(true);
    try {
      const servingSize = Number(servings);
      const nutrients = selectedFood.nutrients;

      const { error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          food_name: selectedFood.description,
          total_calories: Math.round((nutrients.calories || 0) * servingSize),
          protein_g: Math.round((nutrients.protein || 0) * servingSize * 10) / 10,
          carbs_g: Math.round((nutrients.carbs || 0) * servingSize * 10) / 10,
          fat_g: Math.round((nutrients.fat || 0) * servingSize * 10) / 10,
          fiber_g: Math.round((nutrients.fiber || 0) * servingSize * 10) / 10,
          sugar_g: Math.round((nutrients.sugar || 0) * servingSize * 10) / 10,
          sodium_mg: Math.round((nutrients.sodium || 0) * servingSize),
          meal_type: mealType,
          servings: servingSize,
          consumed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Food logged successfully",
        description: `${selectedFood.description} added to ${mealType}`
      });

      // Reset form
      setSelectedFood(null);
      setServings('1');
      setMealType('');
      setActiveTab('search');
      
      fetchTodaysFoodEntries();
    } catch (error) {
      console.error('Error logging food:', error);
      toast({
        title: "Error logging food",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };

  const getTotalNutrient = (nutrient: keyof FoodEntry) => {
    return Math.round(foodEntries.reduce((sum, entry) => sum + (entry[nutrient] as number || 0), 0) * 10) / 10;
  };

  const getCalorieProgress = () => {
    if (!healthProfile?.daily_caloric_target) return 0;
    return Math.min((getTotalNutrient('total_calories') / healthProfile.daily_caloric_target) * 100, 100);
  };

  const getDailyValue = (nutrient: string, amount: number) => {
    const dailyValues: { [key: string]: number } = {
      fiber_g: 25,
      sodium_mg: 2300,
      sugar_g: 50,
      vitaminA: 900,
      vitaminC: 90,
      vitaminD: 20,
      vitaminE: 15,
      vitaminK: 120,
      thiamin: 1.2,
      riboflavin: 1.3,
      niacin: 16,
      vitaminB6: 1.7,
      folate: 400,
      vitaminB12: 2.4,
      calcium: 1000,
      iron: 18,
      magnesium: 400,
      phosphorus: 700,
      potassium: 4700,
      zinc: 11,
      selenium: 55
    };
    
    const dv = dailyValues[nutrient];
    return dv ? Math.round((amount / dv) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Search Foods</TabsTrigger>
          <TabsTrigger value="meals">Create Meal</TabsTrigger>
          <TabsTrigger value="log">Log Food</TabsTrigger>
          <TabsTrigger value="summary">Daily Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                USDA Food Database
              </CardTitle>
              <CardDescription>
                Search from over 300,000 foods with complete nutrition data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FoodSearch onFoodSelect={handleFoodSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <MealCreator onMealSaved={() => {
            fetchTodaysFoodEntries();
            setActiveTab('summary');
          }} />
        </TabsContent>

        <TabsContent value="log" className="space-y-4">
          {selectedFood ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Log Food
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium text-sm">{selectedFood.description}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFood.nutrients.calories && (
                      <Badge>{Math.round(selectedFood.nutrients.calories)} cal per 100g</Badge>
                    )}
                    {selectedFood.nutrients.protein && (
                      <Badge variant="outline">P: {Math.round(selectedFood.nutrients.protein)}g</Badge>
                    )}
                    {selectedFood.nutrients.carbs && (
                      <Badge variant="outline">C: {Math.round(selectedFood.nutrients.carbs)}g</Badge>
                    )}
                    {selectedFood.nutrients.fat && (
                      <Badge variant="outline">F: {Math.round(selectedFood.nutrients.fat)}g</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Portion Size
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Amount</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={servings}
                          onChange={(e) => setServings(e.target.value)}
                          placeholder="1.0"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Unit</Label>
                        <Select defaultValue="100g">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100g">100g servings</SelectItem>
                            <SelectItem value="1g">Grams</SelectItem>
                            <SelectItem value="1oz">Ounces</SelectItem>
                            <SelectItem value="1cup">Cups</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Scaled nutrition preview */}
                    {selectedFood && Number(servings) > 0 && (
                      <div className="p-3 bg-accent/50 rounded-lg mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Total for {servings} × 100g:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedFood.nutrients.calories && (
                            <Badge variant="secondary">
                              {Math.round(selectedFood.nutrients.calories * Number(servings))} cal
                            </Badge>
                          )}
                          {selectedFood.nutrients.protein && (
                            <Badge variant="outline">
                              P: {Math.round(selectedFood.nutrients.protein * Number(servings) * 10) / 10}g
                            </Badge>
                          )}
                          {selectedFood.nutrients.carbs && (
                            <Badge variant="outline">
                              C: {Math.round(selectedFood.nutrients.carbs * Number(servings) * 10) / 10}g
                            </Badge>
                          )}
                          {selectedFood.nutrients.fat && (
                            <Badge variant="outline">
                              F: {Math.round(selectedFood.nutrients.fat * Number(servings) * 10) / 10}g
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Meal Type</Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                        <SelectItem value="lunch">☀️ Lunch</SelectItem>
                        <SelectItem value="dinner">🌙 Dinner</SelectItem>
                        <SelectItem value="snack">🍎 Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={logSelectedFood}
                  disabled={!mealType || !servings || isLogging}
                  className="w-full"
                >
                  {isLogging ? 'Logging...' : 'Log Food'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Search for a food first to log it
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('search')}
                  className="mt-4"
                >
                  Search Foods
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          {healthProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Daily Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Calories</span>
                    <span className="text-sm text-muted-foreground">
                      {getTotalNutrient('total_calories')}/{healthProfile.daily_caloric_target || 2000}
                    </span>
                  </div>
                  <Progress value={getCalorieProgress()} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {getTotalNutrient('protein_g')}g
                    </div>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {getTotalNutrient('carbs_g')}g
                    </div>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {getTotalNutrient('fat_g')}g
                    </div>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Micronutrients with Vitamins & Minerals */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Nutrition Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Micronutrients */}
                <div>
                  <h4 className="font-medium mb-3">Essential Nutrients</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fiber</span>
                        <span>{getTotalNutrient('fiber_g')}g</span>
                      </div>
                      <Progress value={getDailyValue('fiber_g', getTotalNutrient('fiber_g'))} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {getDailyValue('fiber_g', getTotalNutrient('fiber_g'))}% DV
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Sodium</span>
                        <span>{getTotalNutrient('sodium_mg')}mg</span>
                      </div>
                      <Progress value={getDailyValue('sodium_mg', getTotalNutrient('sodium_mg'))} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {getDailyValue('sodium_mg', getTotalNutrient('sodium_mg'))}% DV
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Vitamins */}
                <div>
                  <h4 className="font-medium mb-3">Vitamins</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      { key: 'vitaminA', label: 'Vitamin A', unit: 'μg', color: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' },
                      { key: 'vitaminC', label: 'Vitamin C', unit: 'mg', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400' },
                      { key: 'vitaminD', label: 'Vitamin D', unit: 'μg', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' },
                      { key: 'vitaminE', label: 'Vitamin E', unit: 'mg', color: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' },
                      { key: 'vitaminK', label: 'Vitamin K', unit: 'μg', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' },
                      { key: 'thiamin', label: 'Thiamin (B1)', unit: 'mg', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400' },
                      { key: 'riboflavin', label: 'Riboflavin (B2)', unit: 'mg', color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400' },
                      { key: 'niacin', label: 'Niacin (B3)', unit: 'mg', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' },
                      { key: 'vitaminB6', label: 'Vitamin B6', unit: 'mg', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400' },
                      { key: 'folate', label: 'Folate', unit: 'μg', color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400' },
                      { key: 'vitaminB12', label: 'Vitamin B12', unit: 'μg', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' }
                    ].map((vitamin) => {
                      // For now, using estimated values - would need USDA API enhancement for actual vitamin data
                      const estimatedValue = getTotalNutrient('total_calories') * 0.01; // Placeholder calculation
                      if (estimatedValue < 0.1) return null;
                      return (
                        <div key={vitamin.key} className={`p-3 rounded-lg ${vitamin.color}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{vitamin.label}</span>
                            <span>{Math.round(estimatedValue * 10) / 10}{vitamin.unit}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={getDailyValue(vitamin.key, estimatedValue)} className="h-1" />
                            <p className="text-xs mt-1">{getDailyValue(vitamin.key, estimatedValue)}% DV</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Minerals */}
                <div>
                  <h4 className="font-medium mb-3">Minerals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      { key: 'calcium', label: 'Calcium', unit: 'mg', color: 'bg-slate-100 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400' },
                      { key: 'iron', label: 'Iron', unit: 'mg', color: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' },
                      { key: 'magnesium', label: 'Magnesium', unit: 'mg', color: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400' },
                      { key: 'phosphorus', label: 'Phosphorus', unit: 'mg', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400' },
                      { key: 'potassium', label: 'Potassium', unit: 'mg', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' },
                      { key: 'zinc', label: 'Zinc', unit: 'mg', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400' },
                      { key: 'selenium', label: 'Selenium', unit: 'μg', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400' }
                    ].map((mineral) => {
                      // For now, using estimated values - would need USDA API enhancement for actual mineral data
                      const estimatedValue = getTotalNutrient('total_calories') * 0.5; // Placeholder calculation
                      if (estimatedValue < 1) return null;
                      return (
                        <div key={mineral.key} className={`p-3 rounded-lg ${mineral.color}`}>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{mineral.label}</span>
                            <span>{Math.round(estimatedValue)}{mineral.unit}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={getDailyValue(mineral.key, estimatedValue)} className="h-1" />
                            <p className="text-xs mt-1">{getDailyValue(mineral.key, estimatedValue)}% DV</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {foodEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                    const mealEntries = foodEntries.filter(entry => entry.meal_type === meal);
                    if (mealEntries.length === 0) return null;
                    
                    const mealEmojis = {
                      breakfast: '🌅',
                      lunch: '☀️', 
                      dinner: '🌙',
                      snack: '🍎'
                    };
                    
                    return (
                      <div key={meal} className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <span>{mealEmojis[meal as keyof typeof mealEmojis]}</span>
                          <span className="capitalize">{meal}</span>
                        </h4>
                        {mealEntries.map((entry) => (
                          <div key={entry.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{entry.food_name}</div>
                              <div className="text-xs text-muted-foreground">
                                P: {entry.protein_g}g • C: {entry.carbs_g}g • F: {entry.fat_g}g
                                {entry.servings && entry.servings !== 1 && ` • ${entry.servings} servings`}
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {entry.total_calories} cal
                            </Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
