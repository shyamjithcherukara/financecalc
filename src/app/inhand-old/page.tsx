'use client';

import { useState } from 'react';
import { Calculator, ArrowLeft, BarChart3, DollarSign, Info, TrendingUp, TrendingDown, Building2, Home, Receipt, Shield, CreditCard } from 'lucide-react';
import { numberToWords } from '@/lib/utils';

function calculateOldRegimeTax(taxableIncome: number): number {
  let tax = 0;
  
  // Old Tax Regime Slabs (FY 2024-25)
  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 12500 + (taxableIncome - 500000) * 0.2;
  } else {
    tax = 112500 + (taxableIncome - 1000000) * 0.3;
  }
  
  // Rebate under 87A - Full rebate if total income ≤ 5L
  if (taxableIncome <= 500000) {
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

function calculateHRAExemption(actualHRA: number, rentPaid: number, basicSalary: number, isMetro: boolean): number {
  const metroRate = 0.5; // 50% for metro cities
  const nonMetroRate = 0.4; // 40% for non-metro cities
  const rate = isMetro ? metroRate : nonMetroRate;
  
  const hraExemption1 = actualHRA;
  const hraExemption2 = rentPaid - (basicSalary * 0.1);
  const hraExemption3 = basicSalary * rate;
  
  return Math.min(hraExemption1, hraExemption2, hraExemption3);
}

export default function InHandOldSalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [basic, setBasic] = useState(400000);
  const [hra, setHra] = useState(200000);
  const [special, setSpecial] = useState(200000);
  const [other, setOther] = useState(200000);
  const [sec80c, setSec80c] = useState(150000);
  const [sec80d, setSec80d] = useState(25000);
  const [sec80t, setSec80t] = useState(10000);
  const [rentPaid, setRentPaid] = useState(120000);
  const [isMetro, setIsMetro] = useState(true);
  const [stdDed, setStdDed] = useState(50000);

  // Gross Salary
  const gross = basic + hra + special + other;
  
  // HRA Exemption calculation
  const hraExemption = calculateHRAExemption(hra, rentPaid, basic, isMetro);
  
  // Deductions
  const totalDed = Math.min(sec80c, 150000) + Math.min(sec80d, 25000) + Math.min(sec80t, 10000) + stdDed + hraExemption;
  
  // Taxable Income
  const taxable = Math.max(gross - totalDed, 0);
  
  // Tax
  const tax = calculateOldRegimeTax(taxable);
  
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
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg">
              <Calculator className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            In-hand Salary Calculator
          </h1>
          <p className="text-xl text-muted-foreground mb-2">Old Tax Regime (FY 2024-25)</p>
          <p className="text-sm text-muted-foreground">Calculate your take-home salary with all available deductions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salary Components */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-blue-500" />
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
                    <input type="number" value={ctc} onChange={e => setCtc(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Basic Salary</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={basic} onChange={e => setBasic(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">HRA (House Rent Allowance)</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={hra} onChange={e => setHra(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Special Allowance</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={special} onChange={e => setSpecial(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Other Allowances</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={other} onChange={e => setOther(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Standard Deduction</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={stdDed} onChange={e => setStdDed(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Deductions */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-green-500" />
                <h2 className="text-xl font-bold">Tax Deductions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>Section 80C</span>
                    <div className="relative group/tooltip">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Max ₹1.5L (ELSS, PPF, EPF, etc.)
                      </div>
                    </div>
                  </label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={sec80c} onChange={e => setSec80c(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>Section 80D</span>
                    <div className="relative group/tooltip">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Health Insurance (Max ₹25K)
                      </div>
                    </div>
                  </label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={sec80d} onChange={e => setSec80d(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>Section 80TTA</span>
                    <div className="relative group/tooltip">
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        Savings Account Interest (Max ₹10K)
                      </div>
                    </div>
                  </label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={sec80t} onChange={e => setSec80t(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">Rent Paid</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg font-medium">₹</span>
                    <input type="number" value={rentPaid} onChange={e => setRentPaid(Number(e.target.value))} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 text-lg font-medium" />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold mb-2">City Type</label>
                  <div className="relative group-hover:scale-[1.02] transition-transform duration-300">
                    <select value={isMetro ? "true" : "false"} onChange={e => setIsMetro(e.target.value === "true")} className="w-full pl-12 pr-6 py-4 bg-background/80 border-2 border-border/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500/50 transition-all duration-300 text-lg font-medium">
                      <option value="true">Metro City (50% HRA)</option>
                      <option value="false">Non-Metro City (40% HRA)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold">Salary Summary</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-blue-700">Gross Salary:</span>
                  <span className="font-bold text-blue-700">₹{gross.toLocaleString('en-IN')}</span>
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
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
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
                  <span>HRA Exemption:</span>
                  <span className="font-semibold">₹{hraExemption.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Section 80C:</span>
                  <span className="font-semibold">₹{Math.min(sec80c, 150000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Section 80D:</span>
                  <span className="font-semibold">₹{Math.min(sec80d, 25000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Section 80TTA:</span>
                  <span className="font-semibold">₹{Math.min(sec80t, 10000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Deduction:</span>
                  <span className="font-semibold">₹{stdDed.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 