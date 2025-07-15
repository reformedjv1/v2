import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Moon, 
  Utensils, 
  Dumbbell, 
  Brain, 
  TrendingUp, 
  Plus, 
  Calendar,
  Target,
  Zap,
  Heart,
  BarChart3,
  Settings,
  Home,
  DollarSign,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  CreditCard,
  TrendingDown
} from 'lucide-react';

export default function Wealth() {
  const [activeTab, setActiveTab] = useState('overview');

  const wealthMetrics = [
    { label: 'Net Worth', value: 127000, unit: '', icon: Wallet, color: 'bg-green-500', trend: '+24%', prefix: '$' },
    { label: 'Monthly Income', value: 6500, unit: '', icon: ArrowUpRight, color: 'bg-blue-500', trend: '+12%', prefix: '$' },
    { label: 'Savings Rate', value: 35, unit: '%', icon: PiggyBank, color: 'bg-purple-500', trend: '+8%', prefix: '' },
    { label: 'Investment Growth', value: 12.4, unit: '%', icon: TrendingUp, color: 'bg-orange-500', trend: '+2.1%', prefix: '+' }
  ];

  const quickActions = [
    { label: 'Add Transaction', icon: Plus, action: () => {} },
    { label: 'Pay Bills', icon: CreditCard, action: () => {} },
    { label: 'Transfer Savings', icon: PiggyBank, action: () => {} },
    { label: 'Invest Funds', icon: TrendingUp, action: () => {} }
  ];

  const navItems = [
    { label: 'Overview', value: 'overview', icon: BarChart3 },
    { label: 'Investments', value: 'investments', icon: TrendingUp },
    { label: 'Expenses', value: 'expenses', icon: CreditCard },
    { label: 'Goals', value: 'goals', icon: Target }
  ];

  const investments = [
    { name: '📈 S&P 500 ETF', value: 45000, allocation: 60, change: '+12.4%', positive: true },
    { name: '🌍 International ETF', value: 22500, allocation: 30, change: '+8.7%', positive: true },
    { name: '🏦 Bonds ETF', value: 7500, allocation: 10, change: '+3.2%', positive: true }
  ];

  const expenses = [
    { category: '🏠 Housing', amount: 1800, percentage: 43 },
    { category: '🍽️ Food', amount: 800, percentage: 19 },
    { category: '🚗 Transportation', amount: 400, percentage: 10 },
    { category: '🎬 Entertainment', amount: 300, percentage: 7 },
    { category: '📦 Other', amount: 900, percentage: 21 }
  ];

  const goals = [
    { name: '🚨 Emergency Fund', target: 25000, current: 18000, progress: 72 },
    { name: '🏡 House Down Payment', target: 50000, current: 32000, progress: 64 },
    { name: '👴 Retirement Fund', target: 1000000, current: 75000, progress: 7.5 }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Wealth 💎</h1>
            <p className="text-sm text-muted-foreground">Sunday, Dec 15</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Daily Score */}
        <Card className="wealth-gradient text-white overflow-hidden">
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm">Today's Wealth Score</p>
                <h2 className="text-3xl font-bold">91</h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-white/90">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+7 from yesterday</span>
                </div>
                <p className="text-xs text-white/70 mt-1">Excellent growth</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Financial wellness</span>
                <span>91%</span>
              </div>
              <Progress value={91} className="h-2 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Wealth Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {wealthMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="metric-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg ${metric.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-green-600 font-medium">{metric.trend}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-lg font-bold">
                    {metric.prefix}{metric.value.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Goals */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Financial Goals</h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily spending limit</span>
                  <span>$85 / $100</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Investment allocation</span>
                  <span>$500 / $500</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Savings target</span>
                  <span>$1,200 / $1,500</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="action-button flex-col gap-2 h-16"
                    onClick={action.action}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Investments Overview */}
        {activeTab === 'investments' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Investment Portfolio</h3>
              <div className="space-y-3">
                {investments.map((investment, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{investment.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{investment.name.split(' ').slice(1).join(' ')}</p>
                      <p className="text-xs text-muted-foreground">${investment.value.toLocaleString()} • {investment.allocation}%</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${investment.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {investment.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses Overview */}
        {activeTab === 'expenses' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Monthly Expenses</h3>
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{expense.category.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{expense.category.split(' ').slice(1).join(' ')}</p>
                      <p className="text-xs text-muted-foreground">${expense.amount} • {expense.percentage}%</p>
                    </div>
                    <div className="w-16">
                      <Progress value={expense.percentage} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals Overview */}
        {activeTab === 'goals' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Financial Goals</h3>
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{goal.name}</h4>
                      <span className="text-xs font-medium">{goal.progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                    </p>
                    <Progress value={goal.progress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      ${(goal.target - goal.current).toLocaleString()} remaining
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Summary */}
        {activeTab === 'overview' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Monthly Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Income</span>
                  <span className="font-semibold text-green-600">+$6,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Expenses</span>
                  <span className="font-semibold text-red-600">-$4,200</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Net Income</span>
                  <span className="font-bold text-green-600">+$2,300</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Savings Rate</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="floating-nav">
        <div className="flex items-center justify-around p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;
            return (
              <Button
                key={item.value}
                variant="ghost"
                size="sm"
                className={`flex flex-col gap-1 h-12 px-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setActiveTab(item.value)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}