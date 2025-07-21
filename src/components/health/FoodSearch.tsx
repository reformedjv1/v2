import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
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

interface FoodSearchProps {
  onClose: () => void;
  onFoodLogged: () => void;
}

export function FoodSearch({ onClose, onFoodLogged }: FoodSearchProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<USDAFood[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFood, setSelectedFood] = useState<USDAFood | null>(null);
  const [mealType, setMealType] = useState('');
  const [servingSize, setServingSize] = useState('1');
  const [isLogging, setIsLogging] = useState(false);

  const searchFoods = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-food', {
        body: { query: searchQuery, pageSize: 20 }
      });

      if (error) throw error;

      setSearchResults(data.foods || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching foods:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchFoods();
    }
  };

  const handleFoodSelect = (food: USDAFood) => {
    setSelectedFood(food);
  };

  const logFoodToDatabase = async () => {
    if (!user || !selectedFood || !mealType) {
      toast({
        title: "Missing information",
        description: "Please select a meal type",
        variant: "destructive"
      });
      return;
    }

    setIsLogging(true);
    try {
      const servings = parseFloat(servingSize) || 1;
      
      const { error } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          food_name: selectedFood.description,
          total_calories: Math.round((selectedFood.nutrients.calories || 0) * servings),
          protein_g: Math.round((selectedFood.nutrients.protein || 0) * servings * 10) / 10,
          carbs_g: Math.round((selectedFood.nutrients.carbs || 0) * servings * 10) / 10,
          fat_g: Math.round((selectedFood.nutrients.fat || 0) * servings * 10) / 10,
          fiber_g: Math.round((selectedFood.nutrients.fiber || 0) * servings * 10) / 10,
          sugar_g: Math.round((selectedFood.nutrients.sugar || 0) * servings * 10) / 10,
          sodium_mg: Math.round((selectedFood.nutrients.sodium || 0) * servings),
          meal_type: mealType,
          servings: servings,
          consumed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Food logged successfully",
        description: `${selectedFood.description} added to ${mealType}`
      });

      onFoodLogged();
      onClose();
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

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Search Food</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
        
      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for foods (e.g., chicken breast, apple)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={searchFoods} 
          disabled={isSearching || !searchQuery.trim()}
          className="px-4"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-3">
          {searchResults.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} foods
              </p>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {searchResults.map((food) => (
                  <Card key={food.fdcId} className="p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-5 line-clamp-2">
                          {food.description}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {food.nutrients.calories && (
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(food.nutrients.calories)} cal
                            </Badge>
                          )}
                          {food.nutrients.protein && (
                            <Badge variant="outline" className="text-xs">
                              P: {Math.round(food.nutrients.protein)}g
                            </Badge>
                          )}
                          {food.nutrients.carbs && (
                            <Badge variant="outline" className="text-xs">
                              C: {Math.round(food.nutrients.carbs)}g
                            </Badge>
                          )}
                          {food.nutrients.fat && (
                            <Badge variant="outline" className="text-xs">
                              F: {Math.round(food.nutrients.fat)}g
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleFoodSelect(food)}
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No foods found. Try a different search term.
            </p>
          )}
        </div>
      )}

      {/* Food Selection Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedFood.description}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFood.nutrients.calories && (
                    <Badge variant="secondary">
                      {Math.round(selectedFood.nutrients.calories)} cal per 100g
                    </Badge>
                  )}
                  {selectedFood.nutrients.protein && (
                    <Badge variant="outline">
                      P: {Math.round(selectedFood.nutrients.protein)}g
                    </Badge>
                  )}
                  {selectedFood.nutrients.carbs && (
                    <Badge variant="outline">
                      C: {Math.round(selectedFood.nutrients.carbs)}g
                    </Badge>
                  )}
                  {selectedFood.nutrients.fat && (
                    <Badge variant="outline">
                      F: {Math.round(selectedFood.nutrients.fat)}g
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="serving-size">Serving Size (100g portions)</Label>
                  <Input
                    id="serving-size"
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedFood(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={logFoodToDatabase}
                  disabled={!mealType || isLogging}
                  className="flex-1"
                >
                  {isLogging ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {isLogging ? 'Logging...' : 'Log Food'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}