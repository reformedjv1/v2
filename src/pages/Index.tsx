
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { PillarCard } from "@/components/PillarCard";
import { Activity, DollarSign, Heart, ArrowRight, Star, Target, TrendingUp } from "lucide-react";

const Index = () => {
  const pillars = [
    {
      id: 'health',
      title: 'Health',
      icon: Activity,
      description: 'Transform biomarkers into daily habits for longevity and energy',
      color: 'bg-green-500',
      features: ['Sleep Optimization', 'Movement Tracking', 'Nutrition Science', 'Biomarker Analysis'],
      stats: { metric: 'Sleep Score', value: '85/100', trend: '+12%' }
    },
    {
      id: 'wealth',
      title: 'Wealth',
      icon: DollarSign,
      description: 'Build generational wealth through science-backed financial strategies',
      color: 'bg-blue-500',
      features: ['Smart Budgeting', 'Investment Analysis', 'Tax Optimization', 'Financial Planning'],
      stats: { metric: 'Net Worth', value: '$127k', trend: '+24%' }
    },
    {
      id: 'relations',
      title: 'Relations',
      icon: Heart,
      description: 'Strengthen bonds and emotional resilience through proven methods',
      color: 'bg-purple-500',
      features: ['Communication Skills', 'Conflict Resolution', 'Emotional Intelligence', 'Relationship Health'],
      stats: { metric: 'Connection Score', value: '92/100', trend: '+8%' }
    }
  ];

  const synergies = [
    { from: 'Health', to: 'Wealth', insight: 'High cortisol? Automate savings to reduce stress.' },
    { from: 'Wealth', to: 'Relations', insight: 'Schedule weekly "money dates" with your partner.' },
    { from: 'Relations', to: 'Health', insight: 'Loneliness? Join a fitness challenge.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            TrinityOS
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Data-driven, science-backed optimization for the three pillars of human well-being: 
            Health, Wealth, and Relations
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm">
              <Star className="h-3 w-3 mr-1" />
              Science-First Approach
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <Target className="h-3 w-3 mr-1" />
              Personalized Insights
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              Proven Results
            </Badge>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>

        {/* Cross-Pillar Synergies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Cross-Pillar Synergies
            </CardTitle>
            <CardDescription>
              Discover how optimizing one pillar enhances the others
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {synergies.map((synergy, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{synergy.from}</Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">{synergy.to}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{synergy.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-6">Ready to Optimize Your Life?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-green-500 hover:bg-green-600">
              Start Health Assessment
            </Button>
            <Button size="lg" variant="outline">
              View Pricing Tiers
            </Button>
            <Button size="lg" variant="ghost">
              Learn the Science
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
