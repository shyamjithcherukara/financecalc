'use client';

import { useState } from 'react';
import { Calculator, ArrowLeft, BarChart3, DollarSign, Info, TrendingUp, Building2, Receipt, Shield } from 'lucide-react';
import { numberToWords } from '@/lib/utils';

function calculateNewRegimeTax(taxableIncome: number): number {
  let tax = 0;
  
  // New Tax Regime Slabs (FY 2024-25)
  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = 15000 + (taxableIncome - 600000) * 0.1;
  } else if (taxableIncome <= 1200000) {
    tax = 45000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 90000 + (taxableIncome - 1200000) * 0.2;
  } else {
    tax = 150000 + (taxableIncome - 1500000) * 0.3;
  }
  
  // Rebate under 87A - Full rebate if total income ≤ 7L
  if (taxableIncome <= 700000) {
    tax = 0;
  }
  
  // Surcharge
  let surcharge = 0;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    surcharge = tax * 0.1;
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    surcharge = tax * 0.15;
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    surcharge = tax * 0.25;
  } else if (taxableIncome > 50000000) {
    surcharge = tax * 0.37;
  }
  
  // Health and Education Cess (4%)
  const cess = (tax + surcharge) * 0.04;
  
  return Math.round(tax + surcharge + cess);
}

export default function InHandNewSalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [basic, setBasic] = useState(400000);
  const [hra, setHra] = useState(200000);
  const [special, setSpecial] = useState(200000);
  const [other, setOther] = useState(200000);
  const [stdDed, setStdDed] = useState(50000);

  // Gross Salary
  const gross = basic + hra + special + other;
  
  // Deductions (only standard deduction allowed in new regime)
  const totalDed = stdDed;
  
  // Taxable Income
  const taxable = Math.max(gross - totalDed, 0);
  
  // Tax
  const tax = calculateNewRegimeTax(taxable);
  
  // In-hand
  const inHandYearly = gross - tax;
  const inHandMonthly = Math.round(inHandYearly / 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button onClick={() => window.history.back()} className="group flex items-center gap-3 px-6 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground border rounded-xl transition-all duration-300 hover:bg-background/50">
            <ArrowLeft className="h-5 w-5" />
            Back to Calculators
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full shadow-lg">
              <Calculator className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
            In-hand Salary Calculator
          </h1>
          <p className="text-xl text-muted-foreground mb-2">New Tax Regime (FY 2024-25)</p>
          <p className="text-sm text-muted-foreground">Calculate your take-home salary with simplified tax structure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salary Components */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-pink-500" />
                <h2 className="text-xl font-bold">Salary Components</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>CTC (Cost to Company)</span>
                    <div className="relative group/tooltip">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Total cost to company including all benefits
                      </div>
                    </div>
                  </label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={ctc} onChange={e => setCtc(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Basic Salary</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={basic} onChange={e => setBasic(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">HRA (House Rent Allowance)</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={hra} onChange={e => setHra(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Special Allowance</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={special} onChange={e => setSpecial(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Other Allowances</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={other} onChange={e => setOther(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>Standard Deduction</span>
                    <div className="relative group/tooltip">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Only deduction allowed in new regime
                      </div>
                    </div>
                  </label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={stdDed} onChange={e => setStdDed(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
              </div>
            </div>

            {/* New Regime Info */}
            <div className="bg-gradient-to-r from-pink-50 to-violet-50 rounded-2xl p-6 border border-pink-200 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-pink-500" />
                <h2 className="text-xl font-bold text-pink-700">New Tax Regime Benefits</h2>
              </div>
              <div className="space-y-2 text-sm text-pink-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Lower tax rates with simplified structure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>No need to maintain investment proofs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Only standard deduction of ₹50,000 allowed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Rebate available up to ₹7 lakhs income</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-pink-500" />
                <h2 className="text-xl font-bold">Salary Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="font-semibold text-pink-700">Gross Salary:</span>
                  <span className="font-bold text-pink-700">₹{gross.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-semibold text-green-700">Total Deductions:</span>
                  <span className="font-bold text-green-700">₹{totalDed.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-semibold text-orange-700">Taxable Income:</span>
                  <span className="font-bold text-orange-700">₹{taxable.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-semibold text-red-700">Income Tax:</span>
                  <span className="font-bold text-red-700">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* In-hand Salary Card */}
            <div className="bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6" />
                <h2 className="text-xl font-bold">Your In-hand Salary</h2>
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">₹{inHandMonthly.toLocaleString('en-IN')}</div>
                  <div className="text-sm opacity-90">per month</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">₹{inHandYearly.toLocaleString('en-IN')}</div>
                  <div className="text-sm opacity-90">per year</div>
                </div>
                <div className="text-xs opacity-75 text-center mt-2">
                  {inHandYearly > 0 && `${numberToWords(inHandYearly)} Rupees per year`}
                </div>
              </div>
            </div>

            {/* Tax Breakdown */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="h-6 w-6 text-purple-500" />
                <h2 className="text-xl font-bold">Tax Breakdown</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Standard Deduction:</span>
                  <span className="font-semibold">₹{stdDed.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Rate:</span>
                  <span className="font-semibold">As per new regime slabs</span>
                </div>
                <div className="flex justify-between">
                  <span>Rebate (≤7L):</span>
                  <span className="font-semibold">{taxable <= 700000 ? 'Available' : 'Not Available'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surcharge:</span>
                  <span className="font-semibold">{taxable > 5000000 ? 'Applicable' : 'Not Applicable'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 