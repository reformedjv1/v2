import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  ArrowLeft, 
  Settings, 
  Crown, 
  Check, 
  Star,
  Shield,
  Zap,
  Target,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  LogOut,
  Bell,
  Lock,
  CreditCard,
  Gift,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  tier: string;
  created_at: string;
  updated_at: string;
}

interface HealthProfile {
  height_cm: number | null;
  weight_kg: number | null;
  target_weight_kg: number | null;
  goal_type: string | null;
  activity_level: string | null;
  gender: string | null;
  birth_date: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    height_cm: null,
    weight_kg: null,
    target_weight_kg: null,
    goal_type: null,
    activity_level: null,
    gender: null,
    birth_date: null
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: ''
  });

  const plans = [
    {
      id: 'Free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Gift,
      color: 'bg-gray-500',
      features: [
        'Basic health tracking',
        'Simple goal setting',
        'Weekly insights',
        'Community access'
      ],
      limits: 'Limited features'
    },
    {
      id: 'Premium',
      name: 'Premium',
      price: '$9.99',
      period: 'month',
      icon: Star,
      color: 'bg-blue-500',
      features: [
        'Advanced analytics',
        'Personalized recommendations',
        'Daily insights',
        'Priority support',
        'Export data',
        'Custom goals'
      ],
      limits: 'Full access',
      popular: true
    },
    {
      id: 'Advanced',
      name: 'Advanced',
      price: '$19.99',
      period: 'month',
      icon: Zap,
      color: 'bg-purple-500',
      features: [
        'AI-powered coaching',
        'Real-time optimization',
        'Advanced integrations',
        'Custom meal plans',
        'Workout programs',
        'Health consultations'
      ],
      limits: 'Premium + AI features'
    },
    {
      id: 'Elite',
      name: 'Elite',
      price: '$39.99',
      period: 'month',
      icon: Crown,
      color: 'bg-gold-500',
      features: [
        'Personal health coach',
        'Custom optimization plans',
        'Priority everything',
        'Unlimited features',
        'White-glove support',
        'Early access to features'
      ],
      limits: 'Everything included'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchHealthProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          email: user?.email || '',
          phone: '',
          location: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      
      if (data) {
        setHealthProfile({
          height_cm: data.height_cm,
          weight_kg: data.weight_kg,
          target_weight_kg: data.target_weight_kg,
          goal_type: data.goal_type,
          activity_level: data.activity_level,
          gender: data.gender,
          birth_date: data.birth_date
        });
      }
    } catch (error) {
      console.error('Error fetching health profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully."
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateHealthProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles_health')
        .upsert({
          user_id: user.id,
          ...healthProfile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Health profile updated",
        description: "Your health information has been saved."
      });
    } catch (error) {
      console.error('Error updating health profile:', error);
      toast({
        title: "Error updating health profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTier = async (newTier: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          tier: newTier,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Plan updated",
        description: `Successfully upgraded to ${newTier} plan!`
      });

      fetchProfile();
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({
        title: "Error updating plan",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const calculateAge = () => {
    if (!healthProfile.birth_date) return null;
    const today = new Date();
    const birthDate = new Date(healthProfile.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!healthProfile.height_cm || !healthProfile.weight_kg) return null;
    const heightM = healthProfile.height_cm / 100;
    return Math.round((healthProfile.weight_kg / (heightM * heightM)) * 10) / 10;
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="ios-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                {profile?.tier || 'Free'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Member since {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024'}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="haptic-light"
          >
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>

        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="ios-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="ios-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="ios-input"
              />
            </div>
            <Button
              onClick={updateProfile}
              disabled={isLoading}
              className="ios-button-primary w-full haptic-medium"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </Card>

      {/* Health Stats */}
      <Card className="ios-card">
        <h3 className="font-semibold mb-4">Health Profile</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={healthProfile.gender || ''} 
                onValueChange={(value) => setHealthProfile({...healthProfile, gender: value})}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={healthProfile.birth_date || ''}
                onChange={(e) => setHealthProfile({...healthProfile, birth_date: e.target.value})}
                className="ios-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={healthProfile.height_cm || ''}
                onChange={(e) => setHealthProfile({...healthProfile, height_cm: Number(e.target.value)})}
                className="ios-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.0"
                value={healthProfile.weight_kg || ''}
                onChange={(e) => setHealthProfile({...healthProfile, weight_kg: Number(e.target.value)})}
                className="ios-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                placeholder="65.0"
                value={healthProfile.target_weight_kg || ''}
                onChange={(e) => setHealthProfile({...healthProfile, target_weight_kg: Number(e.target.value)})}
                className="ios-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goalType">Goal</Label>
              <Select 
                value={healthProfile.goal_type || ''} 
                onValueChange={(value) => setHealthProfile({...healthProfile, goal_type: value})}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select 
              value={healthProfile.activity_level || ''} 
              onValueChange={(value) => setHealthProfile({...healthProfile, activity_level: value})}
            >
              <SelectTrigger className="ios-input">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light Activity</SelectItem>
                <SelectItem value="moderate">Moderate Activity</SelectItem>
                <SelectItem value="active">Very Active</SelectItem>
                <SelectItem value="very_active">Extremely Active</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Health Metrics Display */}
          {(healthProfile.height_cm && healthProfile.weight_kg) && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-lg font-bold">{calculateAge() || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">Age</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-lg font-bold">{calculateBMI() || 'N/A'}</div>
                <div className="text-xs text-muted-foreground">BMI</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-xl">
                <div className="text-lg font-bold">
                  {healthProfile.target_weight_kg && healthProfile.weight_kg 
                    ? Math.abs(healthProfile.weight_kg - healthProfile.target_weight_kg).toFixed(1)
                    : 'N/A'
                  }kg
                </div>
                <div className="text-xs text-muted-foreground">To Goal</div>
              </div>
            </div>
          )}

          <Button
            onClick={updateHealthProfile}
            disabled={isLoading}
            className="ios-button-primary w-full haptic-medium"
          >
            {isLoading ? 'Saving...' : 'Save Health Profile'}
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderPlansTab = () => (
    <div className="space-y-4">
      {plans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = profile?.tier === plan.id;
        
        return (
          <Card key={plan.id} className={`ios-card relative ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.limits}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{plan.price}</div>
                <div className="text-xs text-muted-foreground">/{plan.period}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {isCurrentPlan ? (
              <Button disabled className="ios-button-secondary w-full">
                <Check className="h-4 w-4 mr-2" />
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => updateTier(plan.id)}
                disabled={isLoading}
                className="ios-button-primary w-full haptic-medium"
              >
                {plan.id === 'Free' ? 'Downgrade' : 'Upgrade'} to {plan.name}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      {/* Account Settings */}
      <Card className="ios-card">
        <h3 className="font-semibold mb-4">Account Settings</h3>
        <div className="space-y-3">
          <div className="ios-list-item haptic-selection">
            <Bell className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="flex-1">Notifications</span>
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
          <div className="ios-list-item haptic-selection">
            <Lock className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="flex-1">Privacy & Security</span>
            <span className="text-muted-foreground">></span>
          </div>
          <div className="ios-list-item haptic-selection">
            <CreditCard className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="flex-1">Billing & Payments</span>
            <span className="text-muted-foreground">></span>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="ios-card">
        <h3 className="font-semibold mb-4">Support</h3>
        <div className="space-y-3">
          <div className="ios-list-item haptic-selection">
            <HelpCircle className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="flex-1">Help Center</span>
            <span className="text-muted-foreground">></span>
          </div>
          <div className="ios-list-item haptic-selection">
            <Mail className="h-5 w-5 text-muted-foreground mr-3" />
            <span className="flex-1">Contact Support</span>
            <span className="text-muted-foreground">></span>
          </div>
        </div>
      </Card>

      {/* Sign Out */}
      <Card className="ios-card">
        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="w-full haptic-medium"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom ios-scroll">
      {/* iOS-style Header */}
      <div className="ios-header safe-area-left safe-area-right">
        <div className="flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 p-0 haptic-light"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="ios-large-title">Profile</div>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-4 safe-area-left safe-area-right pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="ios-segmented mb-6">
            <TabsTrigger value="profile" className="ios-segment">Profile</TabsTrigger>
            <TabsTrigger value="plans" className="ios-segment">Plans</TabsTrigger>
            <TabsTrigger value="settings" className="ios-segment">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            {renderProfileTab()}
          </TabsContent>

          <TabsContent value="plans" className="mt-0">
            {renderPlansTab()}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            {renderSettingsTab()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}