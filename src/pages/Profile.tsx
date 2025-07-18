
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Settings, 
  Crown, 
  Star, 
  Calendar, 
  Award,
  TrendingUp,
  Heart,
  Target,
  Zap,
  Bell,
  Shield,
  LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  tier: string | null;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, tier')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "Come back soon!"
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again"
      });
    }
  };

  const stats = [
    { label: 'Health Score', value: 82, unit: '/100', color: 'text-green-600', icon: Heart },
    { label: 'Wealth Score', value: 91, unit: '/100', color: 'text-blue-600', icon: TrendingUp },
    { label: 'Relations Score', value: 89, unit: '/100', color: 'text-purple-600', icon: Target },
    { label: 'Overall Wellness', value: 87, unit: '/100', color: 'text-orange-600', icon: Star }
  ];

  const achievements = [
    { title: 'First Week Complete', emoji: '🎯', description: 'Completed your first week of tracking', earned: true },
    { title: 'Health Master', emoji: '💚', description: 'Maintained 80+ health score for 5 days', earned: true },
    { title: 'Wealth Builder', emoji: '💎', description: 'Set up your first financial goal', earned: true },
    { title: 'Social Butterfly', emoji: '🤝', description: 'Connected with 3 different people this week', earned: false },
    { title: 'Consistency King', emoji: '👑', description: 'Track daily for 30 days straight', earned: false },
    { title: 'Triple Threat', emoji: '⭐', description: 'Score 90+ in all three pillars', earned: false }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="ios-card bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary/20">
                {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email?.split('@')[0] || 'User'
                }
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Free Plan
                </Badge>
                <Badge variant="outline">Member since Dec 2024</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Your Wellness Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 rounded-xl bg-muted/30">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}<span className="text-sm text-muted-foreground">{stat.unit}</span></div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="ios-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/health')}
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">Health Hub</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/wealth')}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs">Wealth Center</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => navigate('/relations')}
            >
              <Target className="h-5 w-5" />
              <span className="text-xs">Relations</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex-col gap-2"
              onClick={() => toast({ title: "Settings", description: "Settings panel coming soon!" })}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-4">
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-xl border-2 ${
                achievement.earned ? 'border-primary bg-primary/5' : 'border-muted bg-muted/20'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                    {achievement.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge variant="default" className="text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <Card className="ios-card">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Profile editor", description: "Profile editing coming soon!" })}
          >
            <Settings className="h-4 w-4 mr-3" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Notifications", description: "Notification settings coming soon!" })}
          >
            <Bell className="h-4 w-4 mr-3" />
            Notifications
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start h-12"
            onClick={() => toast({ title: "Privacy", description: "Privacy settings coming soon!" })}
          >
            <Shield className="h-4 w-4 mr-3" />
            Privacy & Security
          </Button>
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Free Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You're currently on the free plan with access to basic features.
            </p>
            <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
            <p className="text-xs text-muted-foreground">
              Premium plans with advanced features will be available soon!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="ios-card border-red-200 dark:border-red-900">
        <CardContent className="p-4">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              <div className="ios-large-title">Profile 👤</div>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 haptic-light">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 safe-area-left safe-area-right pb-32">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="mt-0">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            {renderAchievements()}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            {renderSettings()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Tab Navigation - Full Width */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border/30">
        <div className="w-full px-2 py-2" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-14 grid grid-cols-3 bg-muted/50 rounded-xl p-1">
              <TabsTrigger 
                value="overview" 
                className="flex-1 py-3 px-2 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="flex-1 py-3 px-2 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex-1 py-3 px-2 text-xs font-medium transition-all duration-200 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
