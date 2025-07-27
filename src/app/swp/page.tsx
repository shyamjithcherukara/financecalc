'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calculator, BarChart3, DollarSign, Calendar, Target, PieChart, ArrowLeft, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { numberToWords } from '@/lib/utils';

interface ChartDataItem {
  year: number;
  corpus: number;
  withdrawal: number;
  remainingCorpus: number;
  interestEarned: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export default function SWPCalculator() {
  const [corpusAmount, setCorpusAmount] = useState(10000000);
  const [withdrawalRate, setWithdrawalRate] = useState(6);
  const [interestRate, setInterestRate] = useState(8);
  const [timePeriod, setTimePeriod] = useState(20);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [remainingCorpus, setRemainingCorpus] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([
    { name: 'Total Withdrawal', value: 0, color: '#3B82F6' },
    { name: 'Remaining Corpus', value: 0, color: '#10B981' },
    { name: 'Interest Earned', value: 0, color: '#F59E0B' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // SWP Formula: Monthly withdrawal with corpus depletion
  // Monthly withdrawal = Corpus × (Withdrawal Rate / 100) / 12
  // Remaining corpus decreases with each withdrawal
  const calculateSWP = () => {
    setIsLoading(true);
    
    // Ensure we have valid inputs
    const safeCorpusAmount = corpusAmount || 0;
    const safeWithdrawalRate = withdrawalRate || 0;
    const safeInterestRate = interestRate || 0;
    const safeTimePeriod = timePeriod || 0;
    
    if (safeCorpusAmount <= 0 || safeWithdrawalRate <= 0 || safeInterestRate <= 0 || safeTimePeriod <= 0) {
      setMonthlyWithdrawal(0);
      setTotalWithdrawal(0);
      setRemainingCorpus(0);
      setTotalInterest(0);
      setChartData([]);
      generatePieData(0, 0, 0);
      setIsLoading(false);
      return;
    }
    
    const annualWithdrawalRate = safeWithdrawalRate / 100;
    const annualInterestRate = safeInterestRate / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    
    // Calculate monthly withdrawal
    const monthlyWithdrawalAmount = (safeCorpusAmount * annualWithdrawalRate) / 12;
    const totalWithdrawalAmount = monthlyWithdrawalAmount * safeTimePeriod * 12;
    
    // Calculate remaining corpus and interest
    let remainingCorpusAmount = safeCorpusAmount;
    let totalInterestEarned = 0;
    
    for (let year = 1; year <= safeTimePeriod; year++) {
      for (let month = 1; month <= 12; month++) {
        // Calculate interest earned this month
        const monthlyInterest = remainingCorpusAmount * monthlyInterestRate;
        totalInterestEarned += monthlyInterest;
        
        // Add interest to corpus
        remainingCorpusAmount += monthlyInterest;
        
        // Subtract monthly withdrawal
        remainingCorpusAmount -= monthlyWithdrawalAmount;
        
        // Ensure corpus doesn't go negative
        if (remainingCorpusAmount < 0) {
          remainingCorpusAmount = 0;
        }
      }
    }
    
    setMonthlyWithdrawal(monthlyWithdrawalAmount);
    setTotalWithdrawal(totalWithdrawalAmount);
    setRemainingCorpus(remainingCorpusAmount);
    setTotalInterest(totalInterestEarned);

    // Generate chart data
    generateChartData(safeCorpusAmount, monthlyWithdrawalAmount, monthlyInterestRate, safeTimePeriod);
    generatePieData(totalWithdrawalAmount, remainingCorpusAmount, totalInterestEarned);
    setIsLoading(false);
  };

  const generateChartData = (initialCorpus: number, monthlyWithdrawal: number, monthlyInterestRate: number, years: number) => {
    const data: ChartDataItem[] = [];

    // Ensure we have valid inputs
    if (initialCorpus <= 0 || monthlyWithdrawal <= 0 || monthlyInterestRate <= 0 || years <= 0) {
      setChartData([]);
      return;
    }

    let corpus = initialCorpus;
    let totalWithdrawn = 0;
    let totalInterestEarned = 0;

    for (let year = 1; year <= years; year++) {
      let yearWithdrawal = 0;
      let yearInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        // Calculate interest earned this month
        const monthlyInterest = corpus * monthlyInterestRate;
        yearInterest += monthlyInterest;
        totalInterestEarned += monthlyInterest;
        
        // Add interest to corpus
        corpus += monthlyInterest;
        
        // Subtract monthly withdrawal
        corpus -= monthlyWithdrawal;
        yearWithdrawal += monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
        
        // Ensure corpus doesn't go negative
        if (corpus < 0) {
          corpus = 0;
        }
      }

      data.push({
        year: year,
        corpus: corpus,
        withdrawal: yearWithdrawal,
        remainingCorpus: corpus,
        interestEarned: yearInterest
      });
    }

    setChartData(data);
  };

  const generatePieData = (withdrawal: number, remaining: number, interest: number) => {
    // Ensure we have valid values
    const safeWithdrawal = withdrawal || 0;
    const safeRemaining = remaining || 0;
    const safeInterest = interest || 0;
    
    setPieData([
      { name: 'Total Withdrawal', value: safeWithdrawal, color: '#3B82F6' },
      { name: 'Remaining Corpus', value: safeRemaining, color: '#10B981' },
      { name: 'Interest Earned', value: safeInterest, color: '#F59E0B' }
    ]);
  };

  useEffect(() => {
    calculateSWP();
  }, [corpusAmount, withdrawalRate, interestRate, timePeriod]);

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

      const corpusData = payload.find((item: any) => item.dataKey === 'corpus');
      const withdrawalData = payload.find((item: any) => item.dataKey === 'withdrawal');
      const interestData = payload.find((item: any) => item.dataKey === 'interestEarned');
      
      const corpus = corpusData?.value ?? 0;
      const withdrawal = withdrawalData?.value ?? 0;
      const interest = interestData?.value ?? 0;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Year {label || 0}</p>
          <p className="text-sm text-blue-500">
            Withdrawal: {formatCurrency(withdrawal)}
          </p>
          <p className="text-sm text-green-500">
            Remaining: {formatCurrency(corpus)}
          </p>
          <p className="text-sm text-yellow-500">
            Interest: {formatCurrency(interest)}
          </p>
        </div>
      );
    } catch (error) {
      console.error('Tooltip error:', error);
      return null;
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="group relative flex items-center gap-3 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-950/20 dark:hover:to-cyan-950/20 rounded-xl border border-border/50 hover:border-teal-200/50 dark:hover:border-teal-800/30 hover:shadow-lg hover:shadow-teal-500/10 transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <ArrowLeft className="relative h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
            </div>
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">Back</span>
              <span className="group-hover:opacity-0 transition-opacity duration-300">Back</span>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </button>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg">
              <Download className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">SWP Calculator</h1>
          <p className="text-muted-foreground">Calculate your Systematic Withdrawal Plan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    SWP Details
                  </h2>
                  <p className="text-sm text-muted-foreground">Configure your withdrawal plan</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Corpus Amount */}
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-foreground/80">Corpus Amount</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input
                      type="number"
                      value={corpusAmount}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= 1000000000) { // 100 Crore limit
                          setCorpusAmount(value);
                        }
                      }}
                      max={1000000000}
                      className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500/50 transition-all duration-300 text-lg font-medium"
                      placeholder="Enter corpus amount (max: 100 Crore)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {corpusAmount > 0 && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20 rounded-lg border border-teal-200/30 dark:border-teal-800/30 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
                        {numberToWords(corpusAmount)} Rupees
                      </p>
                    </div>
                  )}
                </div>

                {/* Withdrawal Rate */}
                <div className="group">
                  <Slider
                    value={withdrawalRate}
                    onValueChange={setWithdrawalRate}
                    min={1}
                    max={12}
                    step={0.5}
                    label="Annual Withdrawal Rate"
                    unit="%"
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Interest Rate */}
                <div className="group">
                  <Slider
                    value={interestRate}
                    onValueChange={setInterestRate}
                    min={5}
                    max={12}
                    step={0.25}
                    label="Expected Return Rate (p.a)"
                    unit="%"
                    className="group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>

                {/* Time Period */}
                <div className="group">
                  <Slider
                    value={timePeriod}
                    onValueChange={setTimePeriod}
                    min={5}
                    max={30}
                    step={1}
                    label="Withdrawal Period"
                    unit=" years"
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
                    SWP Summary
                  </h2>
                  <p className="text-sm text-muted-foreground">Your withdrawal plan projection</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Monthly Withdrawal */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <Download className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Monthly Withdrawal</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(monthlyWithdrawal)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Monthly income</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{withdrawalRate}% p.a.</p>
                  </div>
                </div>

                {/* Total Withdrawal */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl border border-green-200/50 dark:border-green-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Total Withdrawal</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalWithdrawal)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total withdrawn</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{timePeriod} years</p>
                  </div>
                </div>

                {/* Interest Earned */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-yellow-50/50 to-amber-50/30 dark:from-yellow-950/20 dark:to-amber-950/10 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Interest Earned</p>
                      <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(totalInterest)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total returns</p>
                    <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">{interestRate}% p.a.</p>
                  </div>
                </div>

                {/* Remaining Corpus */}
                <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Remaining Corpus</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(remainingCorpus)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Final balance</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{timePeriod} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Corpus Depletion Chart */}
          <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Corpus Depletion Over Time
                </h3>
                <p className="text-sm text-muted-foreground">Visualize your corpus depletion</p>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="year" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
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
                    dataKey="corpus" 
                    name="Remaining Corpus"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="withdrawal" 
                    name="Annual Withdrawal"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-muted-foreground">Remaining Corpus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Annual Withdrawal</span>
              </div>
            </div>
          </div>

          {/* SWP Composition Chart */}
          <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SWP Composition
                </h3>
                <p className="text-sm text-muted-foreground">Breakdown of your SWP plan</p>
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

        {/* Third Row: SWP Benefits and Investment Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* SWP Benefits */}
          <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/30 shadow-xl backdrop-blur-sm animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  SWP Benefits
                </h3>
                <p className="text-sm text-muted-foreground">Why SWP is ideal for retirement income</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: '💰', text: 'Regular monthly income', delay: 0 },
                { icon: '📈', text: 'Continues earning interest', delay: 100 },
                { icon: '🎯', text: 'Systematic withdrawal plan', delay: 200 },
                { icon: '🛡️', text: 'Capital preservation', delay: 300 }
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
                  SWP Breakdown
                </h3>
                <p className="text-sm text-muted-foreground">Detailed SWP parameters</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Initial Corpus', value: formatCurrency(corpusAmount), icon: '💰' },
                { label: 'Withdrawal Rate', value: `${withdrawalRate}% p.a.`, icon: '📉' },
                { label: 'Interest Rate', value: `${interestRate}% p.a.`, icon: '📈' },
                { label: 'Withdrawal Period', value: `${timePeriod} years`, icon: '⏰' },
                { label: 'Monthly Income', value: formatCurrency(monthlyWithdrawal), icon: '💸' }
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
                How SWP Calculator Works
              </h3>
              <p className="text-sm text-muted-foreground">Understanding the mathematics behind SWP</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">SWP Formula:</h4>
              <div className="p-6 bg-white/50 dark:bg-white/5 rounded-2xl border border-indigo-200/30 dark:border-indigo-800/20">
                <p className="text-lg font-mono text-center text-indigo-600 dark:text-indigo-400 mb-4">
                  Monthly Withdrawal = Corpus × (Rate / 100) / 12
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">Corpus</span> = Initial investment amount</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">Rate</span> = Annual withdrawal rate</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">Interest</span> = Earned on remaining corpus</p>
                  <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">Balance</span> = Corpus - Withdrawal + Interest</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Key Features:</h4>
              <div className="space-y-3">
                {[
                  { icon: '💰', text: 'Regular income' },
                  { icon: '📈', text: 'Interest earning' },
                  { icon: '🎯', text: 'Systematic withdrawal' },
                  { icon: '🛡️', text: 'Capital preservation' },
                  { icon: '💪', text: 'Retirement planning' }
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