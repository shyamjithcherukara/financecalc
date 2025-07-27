"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, TrendingUp, DollarSign } from "lucide-react";
import { numberToWords } from "../../lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell
} from "recharts";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [breakdown, setBreakdown] = useState<Array<{ month: number; principal: number; interest: number; balance: number }>>([]);

  useEffect(() => {
    const monthlyRate = rate / 12 / 100;
    const numberOfPayments = tenure * 12;
    let emiAmount = 0;
    if (monthlyRate === 0) {
      emiAmount = principal / numberOfPayments;
    } else {
      emiAmount = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }
    setEmi(emiAmount);
    const totalAmountValue = emiAmount * numberOfPayments;
    setTotalAmount(totalAmountValue);
    setTotalInterest(totalAmountValue - principal);
    // Calculate breakdown
    let balance = principal;
    const newBreakdown = [];
    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principalPaid = emiAmount - interest;
      balance -= principalPaid;
      newBreakdown.push({
        month,
        principal: principalPaid > 0 ? principalPaid : 0,
        interest: interest > 0 ? interest : 0,
        balance: balance > 0 ? balance : 0,
      });
    }
    setBreakdown(newBreakdown);
  }, [principal, rate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const trendData = breakdown.slice(0, 24).map(row => ({
    month: row.month,
    principal: Math.round(row.principal),
    interest: Math.round(row.interest),
  }));
  const pieData = [
    { name: "Principal", value: principal, color: "#3B82F6" },
    { name: "Interest", value: Math.round(totalInterest), color: "#EF4444" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="group relative flex items-center gap-3 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-950/20 dark:hover:to-orange-950/20 rounded-xl border border-border/50 hover:border-red-200/50 dark:hover:border-red-800/30 hover:shadow-lg hover:shadow-red-500/10 transform hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <ArrowLeft className="relative h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">Back</span>
              <span className="group-hover:opacity-0 transition-opacity duration-300">Back</span>
            </span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">EMI Calculator</h1>
          <p className="text-muted-foreground">Calculate your Equated Monthly Installment</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Loan Details
                  </h2>
                  <p className="text-sm text-muted-foreground">Configure your loan parameters</p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Loan Amount */}
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-foreground/80">Loan Amount</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      max={1000000000}
                      className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 text-lg font-medium"
                      placeholder="Enter loan amount (max: 100 Crore)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {principal > 0 && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {numberToWords(principal)} Rupees
                      </p>
                    </div>
                  )}
                </div>
                {/* Interest Rate */}
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-foreground/80">Interest Rate (p.a)</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      min={0}
                      max={50}
                      step={0.1}
                      className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 text-lg font-medium"
                      placeholder="Enter interest rate (e.g., 8.5)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {rate > 0 && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {rate}% p.a.
                      </p>
                    </div>
                  )}
                </div>
                {/* Tenure */}
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-foreground/80">Loan Tenure (years)</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <input
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      min={1}
                      max={40}
                      className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500/50 transition-all duration-300 text-lg font-medium"
                      placeholder="Enter tenure (years)"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  {tenure > 0 && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-lg border border-blue-200/30 dark:border-blue-800/30 animate-fade-in-up">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {tenure} years
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Right Column: Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl p-8 border border-border/50 shadow-xl backdrop-blur-sm animate-fade-in">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    EMI Results
                  </h2>
                  <p className="text-sm text-muted-foreground">Your monthly payment and totals</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50/50 to-cyan-50/30 dark:from-blue-950/20 dark:to-cyan-950/10 rounded-2xl border border-blue-200/50 dark:border-blue-800/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Monthly EMI</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(emi)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-950/20 dark:to-emerald-950/10 rounded-2xl border border-green-200/50 dark:border-green-800/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Payment</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-50/50 to-orange-50/30 dark:from-red-950/20 dark:to-orange-950/10 rounded-2xl border border-red-200/50 dark:border-red-800/30">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Interest</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalInterest)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-medium">Total Payment (in words):</p>
                  <p className="text-lg font-semibold text-green-700 dark:text-green-300">{numberToWords(Math.round(totalAmount))} Rupees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Second Row: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Trend Chart */}
          <div>
            <h3 className="text-lg font-bold mb-2">Principal vs Interest Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="principal" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Principal Paid" />
                <Area type="monotone" dataKey="interest" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Interest Paid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-bold mb-2">Payment Composition</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Payment Table (First 12 Months) */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Payment Composition (First 12 Months)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-border rounded-xl">
              <thead>
                <tr className="bg-muted">
                  <th className="px-2 py-1">Month</th>
                  <th className="px-2 py-1">Principal Paid</th>
                  <th className="px-2 py-1">Interest Paid</th>
                  <th className="px-2 py-1">Balance</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.slice(0, 12).map((row) => (
                  <tr key={row.month} className="even:bg-muted/50">
                    <td className="px-2 py-1 text-center">{row.month}</td>
                    <td className="px-2 py-1 text-right">{formatCurrency(row.principal)}</td>
                    <td className="px-2 py-1 text-right">{formatCurrency(row.interest)}</td>
                    <td className="px-2 py-1 text-right">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 