'use client';

import { Calculator, TrendingUp, PiggyBank, CreditCard, Building2, Users, ArrowUpDown, Calendar, Target, BarChart3, Shield, Zap, Smartphone, DollarSign, CheckCircle, Star, ArrowRight, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculators = [
    {
      name: "SIP Calculator",
      description: "Systematic Investment Plan returns",
      icon: TrendingUp,
      href: "/sip",
      color: "from-blue-500 to-cyan-500",
      keywords: "SIP calculator, mutual fund calculator, systematic investment plan"
    },
    {
      name: "EMI Calculator",
      description: "Loan monthly installments",
      icon: CreditCard,
      href: "/emi",
      color: "from-green-500 to-emerald-500",
      keywords: "EMI calculator, loan calculator, monthly installment calculator"
    },
    {
      name: "FD Calculator",
      description: "Fixed Deposit returns",
      icon: PiggyBank,
      href: "/fd",
      color: "from-yellow-500 to-orange-500",
      keywords: "FD calculator, fixed deposit calculator, bank deposit calculator"
    },
    {
      name: "Lumpsum Return",
      description: "One-time investment returns",
      icon: BarChart3,
      href: "/lumpsum",
      color: "from-purple-500 to-pink-500",
      keywords: "lumpsum calculator, one time investment calculator"
    },
    {
      name: "PPF Calculator",
      description: "Public Provident Fund",
      icon: Building2,
      href: "/ppf",
      color: "from-indigo-500 to-blue-500",
      keywords: "PPF calculator, public provident fund calculator"
    },
    {
      name: "EPF Calculator",
      description: "Employees' Provident Fund",
      icon: Users,
      href: "/epf",
      color: "from-teal-500 to-cyan-500",
      keywords: "EPF calculator, employee provident fund calculator"
    },
    {
      name: "SWP Calculator",
      description: "Systematic Withdrawal Plan",
      icon: ArrowUpDown,
      href: "/swp",
      color: "from-red-500 to-pink-500",
      keywords: "SWP calculator, systematic withdrawal plan calculator"
    },
    {
      name: "RD Calculator",
      description: "Recurring Deposit returns",
      icon: Calendar,
      href: "/rd",
      color: "from-violet-500 to-purple-500",
      keywords: "RD calculator, recurring deposit calculator"
    },
    {
      name: "NPS Calculator",
      description: "National Pension System",
      icon: Target,
      href: "/nps",
      color: "from-amber-500 to-yellow-500",
      keywords: "NPS calculator, national pension system calculator"
    },
    {
      name: "Step-up SIP",
      description: "Increasing SIP investments",
      icon: TrendingUp,
      href: "/stepup-sip",
      color: "from-emerald-500 to-green-500",
      keywords: "step up SIP calculator, increasing SIP calculator"
    },
    {
      name: "In-hand Salary (Old Regime)",
      description: "Net salary after tax (Old Regime)",
      icon: DollarSign,
      href: "/inhand-old",
      color: "from-orange-500 to-amber-500",
      keywords: "salary calculator, tax calculator, old regime calculator"
    },
    {
      name: "In-hand Salary (New Regime)",
      description: "Net salary after tax (New Regime)",
      icon: DollarSign,
      href: "/inhand-new",
      color: "from-pink-500 to-violet-500",
      keywords: "salary calculator, tax calculator, new regime calculator"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section with SEO Content */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className={`p-3 bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-lg ${isClient ? 'animate-pulse' : ''}`}>
                <Calculator className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-3 ${isClient ? 'animate-fade-in' : ''}`}>
              Free Financial Calculator
              <span className="block text-primary">SIP, EMI, FD, PPF, EPF, Tax</span>
            </h1>
            <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 ${isClient ? 'animate-fade-in-delay' : ''}`}>
              Comprehensive online financial calculators for SIP, EMI, FD, PPF, EPF, tax calculation, and more. 
              Calculate your investments, loans, and tax savings with our free financial tools. No registration required.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">✓ Free to Use</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">✓ No Registration</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">✓ Privacy First</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">✓ Instant Results</span>
            </div>
            {/* FAQ Link */}
            <div className="flex justify-center">
              <a href="/faq" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                <HelpCircle className="h-5 w-5" />
                View FAQ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Financial Calculators</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive suite of financial calculators designed to help you make informed investment and financial decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calculators.map((calculator, index) => {
            const IconComponent = calculator.icon;
            return (
              <a
                key={calculator.name}
                href={calculator.href}
                className={`group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 ${isClient ? 'animate-fade-in-up' : ''}`}
                style={isClient ? { animationDelay: `${index * 50}ms` } : {}}
                title={calculator.keywords}
              >
                <div className="p-5">
                  <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-r ${calculator.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                    {calculator.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {calculator.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            );
          })}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Why Use Our Financial Calculator?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Comprehensive Financial Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    From SIP and EMI calculators to FD, PPF, EPF, and tax calculators - we cover all your financial calculation needs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Accurate Calculations</h3>
                  <p className="text-sm text-muted-foreground">
                    Our calculators use precise formulas and up-to-date tax rates to provide accurate financial projections.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Privacy & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    All calculations happen locally in your browser. We don&apos;t store or track any of your financial data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Free & Accessible</h3>
                  <p className="text-sm text-muted-foreground">
                    No registration required. Access all our financial calculators instantly without any cost.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-xl font-bold mb-4">Popular Financial Calculators</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">SIP Calculator</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">EMI Calculator</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">FD Calculator</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="font-medium">Tax Calculator</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Choose Our Financial Tools?</h2>
          <p className="text-muted-foreground">Built with privacy and simplicity in mind</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">No data collection, no tracking. All calculations happen locally in your browser.</p>
          </div>
          <div className="text-center p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Instant calculations with real-time updates and beautiful visualizations.</p>
          </div>
          <div className="text-center p-5 rounded-lg bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-sm text-muted-foreground">Responsive design that works perfectly on all devices and screen sizes.</p>
          </div>
        </div>
      </section>

      {/* SEO Footer Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center">Free Financial Calculator - Your Complete Financial Planning Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">Investment Calculators</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• SIP Calculator - Calculate Systematic Investment Plan returns</li>
                <li>• Lumpsum Calculator - One-time investment returns</li>
                <li>• FD Calculator - Fixed Deposit interest calculation</li>
                <li>• PPF Calculator - Public Provident Fund returns</li>
                <li>• EPF Calculator - Employee Provident Fund calculation</li>
                <li>• NPS Calculator - National Pension System returns</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Loan & Tax Calculators</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• EMI Calculator - Loan monthly installment calculation</li>
                <li>• SWP Calculator - Systematic Withdrawal Plan</li>
                <li>• RD Calculator - Recurring Deposit returns</li>
                <li>• Salary Calculator - Old and New Tax Regime</li>
                <li>• Tax Calculator - Income tax calculation</li>
                <li>• Step-up SIP Calculator - Increasing SIP investments</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
