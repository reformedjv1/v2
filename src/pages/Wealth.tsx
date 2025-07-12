import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/Navigation";
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from 'lucide-react';

export default function Wealth() {
  const [netWorth] = useState(127000);
  const [monthlyIncome] = useState(6500);
  const [monthlyExpenses] = useState(4200);
  const [savingsRate] = useState(35);

  const financialMetrics = [
    {
      title: 'Net Worth',
      value: netWorth,
      unit: '',
      icon: Wallet,
      color: 'text-green-500',
      trend: '+24%',
      prefix: '$'
    },
    {
      title: 'Monthly Income',
      value: monthlyIncome,
      unit: '',
      icon: ArrowUpRight,
      color: 'text-blue-500',
      trend: '+12%',
      prefix: '$'
    },
    {
      title: 'Savings Rate',
      value: savingsRate,
      unit: '%',
      icon: PiggyBank,
      color: 'text-purple-500',
      trend: '+8%',
      prefix: ''
    }
  ];

  const investments = [
    { name: 'S&P 500 ETF', value: 45000, allocation: 60, change: '+12.4%' },
    { name: 'International ETF', value: 22500, allocation: 30, change: '+8.7%' },
    { name: 'Bonds ETF', value: 7500, allocation: 10, change: '+3.2%' }
  ];

  const expenses = [
    { category: 'Housing', amount: 1800, percentage: 43, icon: '🏠' },
    { category: 'Food', amount: 800, percentage: 19, icon: '🍽️' },
    { category: 'Transportation', amount: 400, percentage: 10, icon: '🚗' },
    { category: 'Entertainment', amount: 300, percentage: 7, icon: '🎬' },
    { category: 'Other', amount: 900, percentage: 21, icon: '📦' }
  ];

  const goals = [
    { name: 'Emergency Fund', target: 25000, current: 18000, progress: 72 },
    { name: 'House Down Payment', target: 50000, current: 32000, progress: 64 },
    { name: 'Retirement Fund', target: 1000000, current: 75000, progress: 7.5 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Wealth Dashboard</h1>
          <p className="text-muted-foreground">Build generational wealth through science-backed strategies</p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {financialMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metric.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <div className="text-2xl font-bold">
                    {metric.prefix}{metric.value.toLocaleString()}<span className="text-sm font-normal">{metric.unit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Monthly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Income</span>
                    <span className="font-semibold text-green-600">${monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expenses</span>
                    <span className="font-semibold text-red-600">-${monthlyExpenses.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Net Income</span>
                    <span className="font-bold text-green-600">${(monthlyIncome - monthlyExpenses).toLocaleString()}</span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Savings Rate</span>
                      <span>{savingsRate}%</span>
                    </div>
                    <Progress value={savingsRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transaction
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Bills
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <PiggyBank className="h-4 w-4 mr-2" />
                    Transfer to Savings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="investments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {investments.map((investment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{investment.name}</CardTitle>
                    <CardDescription>{investment.allocation}% allocation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-2xl font-bold">${investment.value.toLocaleString()}</div>
                      <Badge variant={investment.change.startsWith('+') ? 'default' : 'destructive'}>
                        {investment.change}
                      </Badge>
                    </div>
                    <Progress value={investment.allocation} className="h-2 mb-3" />
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expenses.map((expense, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{expense.icon}</span>
                      <Badge variant="outline">{expense.percentage}%</Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{expense.category}</h4>
                    <p className="text-2xl font-bold mb-3">${expense.amount}</p>
                    <Progress value={expense.percentage} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{goal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{goal.progress}%</Badge>
                    </div>
                    <Progress value={goal.progress} className="h-3 mb-3" />
                    <div className="flex justify-between text-sm">
                      <span>${(goal.target - goal.current).toLocaleString()} remaining</span>
                      <Button size="sm" variant="outline">
                        Adjust Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}