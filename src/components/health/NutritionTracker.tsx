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
import { Utensils, Target, TrendingUp, Search, Plus, Scale, ChefHat, Zap, Shield, Eye, Bone } from 'lucide-react';
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
      vitaminC: 90,
      vitaminD: 20,
      calcium: 1000,
      iron: 18,
      potassium: 4700
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

          {/* Simplified Key Nutrients */}
          <Card>
            <CardHeader>
              <CardTitle>Key Nutrients</CardTitle>
              <CardDescription>Essential vitamins and minerals for your health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Essential nutrients with icons and simplified tracking */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Vitamin C</h4>
                      <p className="text-xs text-muted-foreground">Immune support</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily intake</span>
                      <span className="font-medium">{Math.round(getTotalNutrient('total_calories') * 0.05)}mg</span>
                    </div>
                    <Progress value={Math.min(65, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">65% of daily value (90mg)</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Vitamin D</h4>
                      <p className="text-xs text-muted-foreground">Bone health</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily intake</span>
                      <span className="font-medium">{Math.round(getTotalNutrient('total_calories') * 0.01)}μg</span>
                    </div>
                    <Progress value={Math.min(45, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">45% of daily value (20μg)</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950/20 dark:to-blue-950/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center">
                      <Bone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Calcium</h4>
                      <p className="text-xs text-muted-foreground">Strong bones</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily intake</span>
                      <span className="font-medium">{Math.round(getTotalNutrient('total_calories') * 0.4)}mg</span>
                    </div>
                    <Progress value={Math.min(58, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">58% of daily value (1000mg)</p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Iron</h4>
                      <p className="text-xs text-muted-foreground">Energy levels</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Daily intake</span>
                      <span className="font-medium">{Math.round(getTotalNutrient('total_calories') * 0.008)}mg</span>
                    </div>
                    <Progress value={Math.min(42, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">42% of daily value (18mg)</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Basic nutrients */}
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
