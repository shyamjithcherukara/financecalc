'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calculator, BarChart3, DollarSign, Calendar, Target, PieChart, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Slider } from '@/components/ui/slider';
import { numberToWords } from '@/lib/utils';
import Head from 'next/head';

interface ChartDataItem {
  year: number;
  invested: number;
  totalValue: number;
  returns: number;
}

interface PieDataItem {
  name: string;
  value: number;
  color: string;
}

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(5);
  const [investedAmount, setInvestedAmount] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [pieData, setPieData] = useState<PieDataItem[]>([
    { name: 'Invested Amount', value: 0, color: '#3B82F6' },
    { name: 'Returns', value: 0, color: '#10B981' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // SIP Formula: M = P × ([(1 + i)^n - 1] / i) × (1 + i)
  // Where: M = Maturity amount, P = Monthly investment, i = Monthly rate, n = Total months
  const calculateSIP = () => {
    setIsLoading(true);
    
    // Ensure we have valid inputs
    const safeMonthlyInvestment = monthlyInvestment || 0;
    const safeExpectedReturn = expectedReturn || 0;
    const safeTimePeriod = timePeriod || 0;
    
    if (safeMonthlyInvestment <= 0 || safeExpectedReturn <= 0 || safeTimePeriod <= 0) {
      setInvestedAmount(0);
      setEstimatedReturns(0);
      setTotalValue(0);
      setChartData([]);
      generatePieData(0, 0);
      setIsLoading(false);
      return;
    }
    
    const monthlyRate = safeExpectedReturn / 100 / 12; // Convert annual rate to monthly
    const totalMonths = safeTimePeriod * 12;
    const totalInvested = safeMonthlyInvestment * totalMonths;
    
    // SIP Formula
    const maturityAmount = safeMonthlyInvestment * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
      (1 + monthlyRate);
    
    const returns = maturityAmount - totalInvested;
    
    setInvestedAmount(totalInvested);
    setEstimatedReturns(returns);
    setTotalValue(maturityAmount);

    // Generate chart data
    generateChartData(totalMonths, safeMonthlyInvestment, monthlyRate);
    generatePieData(totalInvested, returns);
    setIsLoading(false);
  };

  const generateChartData = (totalMonths: number, monthlyInvestment: number, monthlyRate: number) => {
    const data: ChartDataItem[] = [];
    let invested = 0;
    let totalValue = 0;

    // Ensure we have valid inputs
    if (totalMonths <= 0 || monthlyInvestment <= 0 || monthlyRate <= 0) {
      setChartData([]);
      return;
    }

    for (let month = 1; month <= totalMonths; month++) {
      invested += monthlyInvestment;
      totalValue = monthlyInvestment * 
        ((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * 
        (1 + monthlyRate);

      if (month % 12 === 0 || month === totalMonths) { // Show yearly data points
        data.push({
          year: month / 12,
          invested: invested,
          totalValue: totalValue,
          returns: totalValue - invested
        });
      }
    }

    setChartData(data);
  };

  const generatePieData = (invested: number, returns: number) => {
    // Ensure we have valid values
    const safeInvested = invested || 0;
    const safeReturns = returns || 0;
    
    setPieData([
      { name: 'Invested Amount', value: safeInvested, color: '#3B82F6' },
      { name: 'Returns', value: safeReturns, color: '#10B981' }
    ]);
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

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

      // Find the correct data from payload
      const totalValueData = payload.find((item: any) => item.dataKey === 'totalValue');
      const investedData = payload.find((item: any) => item.dataKey === 'invested');
      
      const totalValue = totalValueData?.value ?? 0;
      const investedValue = investedData?.value ?? 0;
      const returnsValue = totalValue - investedValue;
      
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Year {label || 0}</p>
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
    <>
      <Head>
        <title>SIP Calculator - Systematic Investment Plan Calculator | Finance Calculator</title>
        <meta name="description" content="Free SIP Calculator - Calculate Systematic Investment Plan returns, maturity amount, and wealth growth. Plan your mutual fund investments with our accurate SIP calculator." />
        <meta name="keywords" content="SIP calculator, systematic investment plan calculator, mutual fund calculator, investment calculator, wealth calculator, SIP returns calculator" />
        <meta property="og:title" content="SIP Calculator - Systematic Investment Plan Calculator" />
        <meta property="og:description" content="Free SIP Calculator - Calculate Systematic Investment Plan returns, maturity amount, and wealth growth. Plan your mutual fund investments with our accurate SIP calculator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fincalc.cleanstack.dev/sip" />
        <meta name="twitter:title" content="SIP Calculator - Systematic Investment Plan Calculator" />
        <meta name="twitter:description" content="Free SIP Calculator - Calculate Systematic Investment Plan returns, maturity amount, and wealth growth." />
        <link rel="canonical" href="https://fincalc.cleanstack.dev/sip" />
        
        {/* Structured Data for SIP Calculator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SIP Calculator",
              "description": "Free SIP Calculator - Calculate Systematic Investment Plan returns, maturity amount, and wealth growth. Plan your mutual fund investments with our accurate SIP calculator.",
              "url": "https://fincalc.cleanstack.dev/sip",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "SIP Returns Calculation",
                "Maturity Amount Calculator",
                "Wealth Growth Projection",
                "Investment Planning Tool",
                "Mutual Fund Calculator"
              ],
              "author": {
                "@type": "Organization",
                "name": "Finance Calculator"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Finance Calculator"
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="group relative flex items-center gap-3 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/20 dark:hover:to-cyan-950/20 rounded-xl border border-border/50 hover:border-blue-200/50 dark:hover:border-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10 transform hover:scale-105 active:scale-95"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
                <ArrowLeft className="relative h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </div>
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">Back</span>
                <span className="group-hover:opacity-0 transition-opacity duration-300">Back</span>
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          </div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SIP Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your Systematic Investment Plan returns and plan your wealth growth with our comprehensive SIP calculator
            </p>
          </div>

          {/* SEO Content Section */}
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-4">What is SIP Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Systematic Investment Plan (SIP)</h3>
                <p className="mb-3">
                  SIP is a method of investing in mutual funds where you invest a fixed amount regularly (monthly) 
                  instead of investing a lump sum amount. This approach helps in rupee cost averaging and 
                  building wealth over time.
                </p>
                <h3 className="font-semibold text-foreground mb-2">Benefits of SIP</h3>
                <ul className="space-y-1">
                  <li>• Rupee Cost Averaging</li>
                  <li>• Disciplined Investing</li>
                  <li>• Power of Compounding</li>
                  <li>• Lower Investment Barrier</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">How SIP Calculator Works</h3>
                <p className="mb-3">
                  Our SIP calculator uses the standard SIP formula to calculate your investment returns:
                </p>
                <div className="bg-muted p-3 rounded-lg font-mono text-xs">
                  Maturity Amount = P × ([(1 + i)^n - 1] / i) × (1 + i)
                </div>
                <p className="mt-3 text-xs">
                  Where: P = Monthly Investment, i = Monthly Rate, n = Total Months
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      Investment Details
                    </h2>
                    <p className="text-sm text-muted-foreground">Configure your SIP parameters</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Monthly Investment */}
                  <div className="group">
                    <label className="block text-sm font-semibold mb-3 text-foreground/80">Monthly Investment</label>
                    <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                      <input
                        type="number"
                        value={monthlyInvestment}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value <= 1000000000) { // 100 Crore limit
                            setMonthlyInvestment(value);
                          }
                        }}
                        max={1000000000}
                        className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary/50 transition-all duration-300 text-lg font-medium"
                        placeholder="Enter monthly investment (max: 100 Crore)"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                    {monthlyInvestment > 0 && (
                      <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 animate-fade-in-up">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {numberToWords(monthlyInvestment)} Rupees
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expected Return Rate */}
                  <div className="group">
                    <Slider
                      value={expectedReturn}
                      onValueChange={setExpectedReturn}
                      min={1}
                      max={30}
                      step={0.5}
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
                      min={1}
                      max={40}
                      step={1}
                      label="Time Period"
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
                      Investment Summary
                    </h2>
                    <p className="text-sm text-muted-foreground">Your wealth growth projection</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Invested Amount */}
                  <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Invested Amount</p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(investedAmount)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total invested</p>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatNumber(timePeriod * 12)} months</p>
                    </div>
                  </div>

                  {/* Estimated Returns */}
                  <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl border border-green-200/50 dark:border-green-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Estimated Returns</p>
                        <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(estimatedReturns)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total returns</p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">{expectedReturn}% p.a.</p>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="group flex justify-between items-center p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 rounded-2xl border border-purple-200/50 dark:border-purple-800/30 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Total Value</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalValue)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Maturity amount</p>
                      <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{timePeriod} years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Wealth Growth Over Time Chart */}
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Wealth Growth Over Time
                  </h3>
                  <p className="text-sm text-muted-foreground">Visualize your investment journey</p>
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
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
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
                  <p className="text-sm text-muted-foreground">Breakdown of your portfolio</p>
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

          {/* Third Row: SIP Benefits and Investment Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* SIP Benefits */}
            <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/30 shadow-xl backdrop-blur-sm animate-fade-in-delay">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    SIP Benefits
                  </h3>
                  <p className="text-sm text-muted-foreground">Why SIP is a smart choice</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: '💰', text: 'Disciplined approach to investing', delay: 0 },
                  { icon: '📈', text: 'Rupee cost averaging benefits', delay: 100 },
                  { icon: '⚡', text: 'Power of compounding over time', delay: 200 },
                  { icon: '🛡️', text: 'Lower risk compared to lump sum', delay: 300 }
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
                  <p className="text-sm text-muted-foreground">Detailed investment parameters</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Monthly Investment', value: formatCurrency(monthlyInvestment), icon: '💰' },
                  { label: 'Total Months', value: `${timePeriod * 12}`, icon: '📅' },
                  { label: 'Expected Return', value: `${expectedReturn}% p.a.`, icon: '📈' },
                  { label: 'Investment Period', value: `${timePeriod} years`, icon: '⏰' }
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
                  How SIP Calculator Works
                </h3>
                <p className="text-sm text-muted-foreground">Understanding the mathematics behind SIP</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">SIP Formula:</h4>
                <div className="p-6 bg-white/50 dark:bg-white/5 rounded-2xl border border-indigo-200/30 dark:border-indigo-800/20">
                  <p className="text-lg font-mono text-center text-indigo-600 dark:text-indigo-400 mb-4">
                    M = P × ([(1 + i)^n - 1] / i) × (1 + i)
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">M</span> = Maturity amount</p>
                    <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">P</span> = Monthly investment amount</p>
                    <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">i</span> = Monthly interest rate</p>
                    <p><span className="font-semibold text-indigo-600 dark:text-indigo-400">n</span> = Total number of months</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Key Benefits:</h4>
                <div className="space-y-3">
                  {[
                    { icon: '🎯', text: 'Disciplined investment approach' },
                    { icon: '⚖️', text: 'Rupee cost averaging' },
                    { icon: '📈', text: 'Power of compounding' },
                    { icon: '🛡️', text: 'Lower market timing risk' },
                    { icon: '💪', text: 'Flexible investment amounts' }
                  ].map((benefit, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-purple-200/30 dark:border-purple-800/20 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-xl">{benefit.icon}</span>
                      <span className="text-sm font-medium text-foreground/80">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 