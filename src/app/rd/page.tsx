'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calculator, BarChart3, DollarSign, Calendar, Target, PieChart, ArrowLeft, PiggyBank } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { numberToWords } from '@/lib/utils';

interface ChartDataItem {
  month: number;
  invested: number;
  totalValue: number;
  returns: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export default function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(10000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [timePeriod, setTimePeriod] = useState(60);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([
    { name: 'Total Invested', value: 0, color: '#3B82F6' },
    { name: 'Interest Earned', value: 0, color: '#10B981' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // RD Formula: Compound interest with monthly deposits
  // A = P × (1 + r/n)^(n×t) + PMT × ((1 + r/n)^(n×t) - 1) / (r/n)
  // Where: A = Maturity amount, P = Initial amount, r = Annual rate, n = Compounding frequency, t = Time, PMT = Monthly deposit
  const calculateRD = () => {
    setIsLoading(true);
    
    // Ensure we have valid inputs
    const safeMonthlyDeposit = monthlyDeposit || 0;
    const safeInterestRate = interestRate || 0;
    const safeTimePeriod = timePeriod || 0;
    
    if (safeMonthlyDeposit <= 0 || safeInterestRate <= 0 || safeTimePeriod <= 0) {
      setTotalInvested(0);
      setTotalInterest(0);
      setMaturityAmount(0);
      setChartData([]);
      generatePieData(0, 0);
      setIsLoading(false);
      return;
    }
    
    const monthlyRate = safeInterestRate / 100 / 12; // Convert annual rate to monthly
    const totalMonths = safeTimePeriod;
    
    // Calculate total invested
    const totalInvestedAmount = safeMonthlyDeposit * totalMonths;
    
    // Calculate maturity amount using compound interest formula
    const maturityValue = safeMonthlyDeposit * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const interestEarned = maturityValue - totalInvestedAmount;
    
    setTotalInvested(totalInvestedAmount);
    setTotalInterest(interestEarned);
    setMaturityAmount(maturityValue);

    // Generate chart data
    generateChartData(safeMonthlyDeposit, monthlyRate, totalMonths);
    generatePieData(totalInvestedAmount, interestEarned);
    setIsLoading(false);
  };

  const generateChartData = (monthlyDeposit: number, monthlyRate: number, totalMonths: number) => {
    const data: ChartDataItem[] = [];

    // Ensure we have valid inputs
    if (monthlyDeposit <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      setChartData([]);
      return;
    }

    let totalInvested = 0;
    let totalValue = 0;

    for (let month = 1; month <= totalMonths; month++) {
      totalInvested += monthlyDeposit;
      totalValue = monthlyDeposit * 
        ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * 
        (1 + monthlyRate);

      data.push({
        month: month,
        invested: totalInvested,
        totalValue: totalValue,
        returns: totalValue - totalInvested
      });
    }

    setChartData(data);
  };

  const generatePieData = (invested: number, interest: number) => {
    // Ensure we have valid values
    const safeInvested = invested || 0;
    const safeInterest = interest || 0;
    
    setPieData([
      { name: 'Total Invested', value: safeInvested, color: '#3B82F6' },
      { name: 'Interest Earned', value: safeInterest, color: '#10B981' }
    ]);
  };

  useEffect(() => {
    calculateRD();
  }, [monthlyDeposit, interestRate, timePeriod]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeAmount);
  };

  const formatNumber = (amount: number) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-IN').format(safeAmount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    try {
      if (!active || !payload || !Array.isArray(payload) || payload.length === 0) {
        return null;
      }

      const totalValueData = payload.find((item: any) => item.dataKey === 'totalValue');
      const investedData = payload.find((item: any) => item.dataKey === 'invested');
      
      const totalValue = totalValueData?.value ?? 0;
      const investedValue = investedData?.value ?? 0;
      const returnsValue = totalValue - investedValue;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Month {label || 0}</p>
          <p className="text-sm text-purple-500">
            Total Value: {formatCurrency(totalValue)}
          </p>
          <p className="text-sm text-blue-500">
            Invested: {formatCurrency(investedValue)}
          </p>
          <p className="text-sm text-green-500">
            Returns: {formatCurrency(returnsValue)}
          </p>
        </div>
      );
    } catch (error) {
      console.error('Tooltip error:', error);
      return null;
    }
  };

  const COLORS = ['#3B82F6', '#10B981'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="group relative flex items-center gap-3 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-950/20 dark:hover:to-teal-950/20 rounded-xl border border-border/50 hover:border-emerald-200/50 dark:hover:border-emerald-800/30 hover:shadow-lg hover:shadow-emerald-500/10 transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <ArrowLeft className="relative h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
            </div>
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">Back</span>
              <span className="group-hover:opacity-0 transition-opacity duration-300">Back</span>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg">
              <PiggyBank className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">RD Calculator</h1>
          <p className="text-muted-foreground">Calculate your Recurring Deposit returns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    RD Details
                  </h2>
                  <p className="text-sm text-muted-foreground">Configure your RD parameters</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Monthly Deposit */}
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-foreground/80">Monthly Deposit</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input
                      type="number"
                      value={monthlyDeposit}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= 1000000) { // 10 Lakh limit
                          setMonthlyDeposit(value);
                        }
                      }}
                      max={1000000}
                      className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500/50 transition-all duration-300 text-lg font-medium"
                      placeholder="Enter monthly deposit (max: ₹10 Lakh)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {monthlyDeposit > 0 && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-lg border border-emerald-200/30 dark:border-emerald-800/30 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {numberToWords(monthlyDeposit)} Rupees
                      </p>
                    </div>
                  )}
                </div>

                {/* Interest Rate */}
                <div className="group">
                  <Slider
                    value={interestRate}
                    onValueChange={setInterestRate}
                    min={5.0}
                    max={9.0}
                    step={0.1}
                    label="Interest Rate (p.a)"
                    unit="%"
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Time Period */}
                <div className="group">
                  <Slider
                    value={timePeriod}
                    onValueChange={setTimePeriod}
                    min={6}
                    max={120}
                    step={6}
                    label="RD Tenure"
                    unit=" months"
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Results */}
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    RD Summary
                  </h2>
                  <p className="text-sm text-muted-foreground">Your investment growth projection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Total Invested */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Invested</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalInvested)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total deposits</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{timePeriod} months</p>
                  </div>
                </div>

                {/* Interest Earned */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl border border-green-200/50 dark:border-green-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Interest Earned</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalInterest)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total returns</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{interestRate}% p.a.</p>
                  </div>
                </div>

                {/* Maturity Amount */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Maturity Amount</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(maturityAmount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Final value</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{timePeriod} months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Investment Growth Chart */}
          <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  RD Growth Over Time
                </h3>
                <p className="text-sm text-muted-foreground">Visualize your RD growth journey</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                    label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="totalValue" 
                    name="Total Value"
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    name="Invested Amount"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-muted-foreground">Total Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Invested Amount</span>
              </div>
            </div>
          </div>

          {/* Investment Composition Chart */}
          <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Investment Composition
                </h3>
                <p className="text-sm text-muted-foreground">Breakdown of your maturity amount</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#1F2937',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: RD Benefits and Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* RD Benefits */}
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/30 shadow-xl backdrop-blur-sm animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  RD Benefits
                </h3>
                <p className="text-sm text-muted-foreground">Why RD is a disciplined savings option</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: '💰', text: 'Disciplined monthly savings', delay: 0 },
                { icon: '📈', text: 'Compound interest benefits', delay: 100 },
                { icon: '🎯', text: 'Fixed interest rates', delay: 200 },
                { icon: '🛡️', text: 'Low-risk investment', delay: 300 }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-green-200/30 dark:border-green-800/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${benefit.delay}ms` }}
                >
                  <span className="text-xl">{benefit.icon}</span>
                  <span className="text-sm font-medium text-foreground/80">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Investment Breakdown */}
          <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-amber-950/10 rounded-2xl p-8 border border-orange-200/50 dark:border-orange-800/30 shadow-xl backdrop-blur-sm animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Investment Breakdown
                </h3>
                <p className="text-sm text-muted-foreground">Detailed RD parameters</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Monthly Deposit', value: formatCurrency(monthlyDeposit), icon: '💰' },
                { label: 'Interest Rate', value: `${interestRate}% p.a.`, icon: '📈' },
                { label: 'RD Tenure', value: `${timePeriod} months`, icon: '⏰' },
                { label: 'Total Deposits', value: formatCurrency(totalInvested), icon: '💸' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-orange-200/30 dark:border-orange-800/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium text-foreground/80">{item.label}:</span>
                  </div>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formula Section */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 rounded-2xl p-8 border border-indigo-200/50 dark:border-indigo-800/30 shadow-xl backdrop-blur-sm animate-fade-in-delay">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                How RD Calculator Works
              </h3>
              <p className="text-sm text-muted-foreground">Understanding the mathematics behind RD</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">RD Formula:</h4>
              <div className="p-6 bg-white/50 dark:bg-white/5 rounded-2xl border border-indigo-200/30 dark:border-indigo-800/20">
                <p className="text-lg font-mono text-center text-indigo-600 dark:text-indigo-400 mb-4">
                  A = PMT × ((1 + r/n)^(n×t) - 1) / (r/n)
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">A</span> = Maturity amount</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">PMT</span> = Monthly deposit</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">r</span> = Annual interest rate</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">n</span> = Compounding frequency</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">t</span> = Time in years</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Key Features:</h4>
              <div className="space-y-3">
                {[
                  { icon: '💰', text: 'Monthly deposits' },
                  { icon: '📈', text: 'Compound interest' },
                  { icon: '🎯', text: 'Fixed returns' },
                  { icon: '🛡️', text: 'Low risk' },
                  { icon: '💪', text: 'Disciplined saving' }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-purple-200/30 dark:border-purple-800/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-foreground/80">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 