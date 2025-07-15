
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Activity, DollarSign, Heart, ArrowUpRight, Sparkles, Target, Brain, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const pillars = [
    {
      id: 'health',
      title: 'Health',
      icon: Activity,
      description: 'Optimize your body and mind',
      emoji: '💚',
      gradient: 'pillar-health',
      stats: { value: '85%', label: 'Optimized' }
    },
    {
      id: 'wealth',
      title: 'Wealth',
      icon: DollarSign,
      description: 'Build financial freedom',
      emoji: '💎',
      gradient: 'pillar-wealth',
      stats: { value: '92%', label: 'Growing' }
    },
    {
      id: 'relations',
      title: 'Relations',
      icon: Heart,
      description: 'Strengthen connections',
      emoji: '🤝',
      gradient: 'pillar-relations',
      stats: { value: '78%', label: 'Connected' }
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <main className="px-4 py-6 sm:px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="mb-4">
            <h1 className="text-3xl sm:text-5xl font-bold mb-2 gradient-text">
              Trinity
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground/80 uppercase tracking-wider">
              Life Optimization System
            </p>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            Transform your life through the trinity of human optimization: Health, Wealth, and Relations
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-xs sm:text-sm">
              <Target className="h-3 w-3" />
              <span>Science-Based</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-xs sm:text-sm">
              <Brain className="h-3 w-3" />
              <span>Personalized</span>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Card 
                key={pillar.id} 
                className="glass-card group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:glow-effect"
                onClick={() => navigate(`/${pillar.id}`)}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${pillar.gradient} flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg`}>
                      {pillar.emoji}
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-bold">{pillar.stats.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{pillar.stats.label}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:gradient-text transition-all">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                    {pillar.description}
                  </p>
                  
                  <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Optimize now</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Insights */}
        <Card className="glass-card mb-8 sm:mb-12">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Today's Insights</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Your daily optimization recommendations
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-primary/5">
                <div className="text-2xl mb-2">💚</div>
                <div className="text-sm font-medium mb-1">Sleep Score</div>
                <div className="text-xs text-muted-foreground">Get 30min more sleep for +15% energy</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/5">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-sm font-medium mb-1">Savings Rate</div>
                <div className="text-xs text-muted-foreground">Increase by 5% to hit your goal faster</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-primary/5">
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-sm font-medium mb-1">Social Score</div>
                <div className="text-xs text-muted-foreground">Schedule quality time this weekend</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 glow-effect"
            onClick={() => navigate('/health')}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Start Your Optimization Journey
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            Begin with a comprehensive health assessment
          </p>
        </div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Index;
