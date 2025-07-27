'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Calculator, HelpCircle, TrendingUp, CreditCard, PiggyBank, DollarSign } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData: FAQItem[] = [
    // SIP Calculator FAQs
    {
      question: "What is SIP Calculator and how does it work?",
      answer: "SIP (Systematic Investment Plan) Calculator helps you calculate the returns on your regular monthly investments in mutual funds. It uses the compound interest formula to show how your money grows over time. Simply enter your monthly investment amount, expected annual return rate, and investment period to see your potential wealth growth.",
      category: "SIP Calculator"
    },
    {
      question: "How accurate is the SIP Calculator?",
      answer: "Our SIP Calculator uses the standard SIP formula: Maturity Amount = P × ([(1 + i)^n - 1] / i) × (1 + i), where P is monthly investment, i is monthly rate, and n is total months. The calculations are mathematically accurate, but actual returns may vary based on market performance.",
      category: "SIP Calculator"
    },
    {
      question: "What is the difference between SIP and Lumpsum investment?",
      answer: "SIP involves investing a fixed amount regularly (monthly), while lumpsum is a one-time investment. SIP helps in rupee cost averaging and reduces market timing risk, while lumpsum can be beneficial when markets are low. Use our SIP vs Lumpsum calculator to compare both approaches.",
      category: "SIP Calculator"
    },
    // EMI Calculator FAQs
    {
      question: "How does EMI Calculator work?",
      answer: "EMI (Equated Monthly Installment) Calculator calculates your monthly loan payments. It uses the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is principal amount, r is monthly interest rate, and n is total number of months. Enter loan amount, interest rate, and tenure to get your EMI.",
      category: "EMI Calculator"
    },
    {
      question: "What factors affect EMI calculation?",
      answer: "EMI depends on three main factors: Principal amount (loan amount), Interest rate (annual rate converted to monthly), and Loan tenure (in months). Higher principal or interest rate increases EMI, while longer tenure reduces EMI but increases total interest paid.",
      category: "EMI Calculator"
    },
    // FD Calculator FAQs
    {
      question: "How is Fixed Deposit interest calculated?",
      answer: "FD interest is calculated using the compound interest formula: A = P(1 + r/n)^(nt), where A is maturity amount, P is principal, r is annual interest rate, n is compounding frequency, and t is time in years. Our FD Calculator shows both simple and compound interest options.",
      category: "FD Calculator"
    },
    {
      question: "What is the difference between simple and compound interest in FD?",
      answer: "Simple interest is calculated only on the principal amount, while compound interest is calculated on principal plus accumulated interest. Compound interest generally provides higher returns over time. Most banks offer compound interest on FDs.",
      category: "FD Calculator"
    },
    // Tax Calculator FAQs
    {
      question: "What is the difference between Old and New Tax Regime?",
      answer: "Old Tax Regime allows various deductions (80C, 80D, HRA, etc.) with higher tax rates, while New Tax Regime has lower tax rates but only allows standard deduction of ₹50,000. Choose based on your deductions and tax liability.",
      category: "Tax Calculator"
    },
    {
      question: "How is HRA exemption calculated?",
      answer: "HRA exemption is the minimum of: 1) Actual HRA received, 2) Rent paid minus 10% of basic salary, 3) 50% of basic salary for metro cities or 40% for non-metro cities. Our salary calculator automatically calculates this exemption.",
      category: "Tax Calculator"
    },
    // General FAQs
    {
      question: "Are these calculators free to use?",
      answer: "Yes, all our financial calculators are completely free to use. No registration, no hidden charges, and no data collection. All calculations happen locally in your browser for complete privacy.",
      category: "General"
    },
    {
      question: "How accurate are the calculations?",
      answer: "Our calculators use standard financial formulas and up-to-date tax rates. While mathematically accurate, actual results may vary due to market conditions, policy changes, or individual circumstances. Always consult a financial advisor for important decisions.",
      category: "General"
    },
    {
      question: "Do you store my financial data?",
      answer: "No, we don't store any of your financial data. All calculations happen locally in your browser, and no information is sent to our servers. Your privacy and data security are our top priorities.",
      category: "General"
    },
    {
      question: "Can I use these calculators on mobile?",
      answer: "Yes, all our calculators are fully responsive and work perfectly on mobile devices, tablets, and desktops. The interface adapts to your screen size for the best user experience.",
      category: "General"
    },
    {
      question: "Which calculator should I use for investment planning?",
      answer: "For mutual fund investments, use SIP Calculator. For one-time investments, use Lumpsum Calculator. For retirement planning, use PPF or NPS Calculator. For tax planning, use our Salary Calculator. Each calculator is designed for specific financial goals.",
      category: "General"
    },
    {
      question: "How often are the tax rates updated?",
      answer: "We update our calculators with the latest tax rates and rules as soon as they are officially announced. Currently, our calculators use FY 2024-25 tax rates and slabs for accurate calculations.",
      category: "General"
    }
  ];

  const categories = ['All', 'SIP Calculator', 'EMI Calculator', 'FD Calculator', 'Tax Calculator', 'General'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SIP Calculator': return <TrendingUp className="h-5 w-5" />;
      case 'EMI Calculator': return <CreditCard className="h-5 w-5" />;
      case 'FD Calculator': return <PiggyBank className="h-5 w-5" />;
      case 'Tax Calculator': return <DollarSign className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

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
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our financial calculators
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-blue-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-card rounded-xl border border-border/50 shadow-sm">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-blue-500 mt-1">
                    {getCategoryIcon(faq.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {faq.question}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-card rounded-2xl p-8 border border-border/50 shadow-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our calculators are designed to be intuitive, 
              but if you need help, here are some additional resources:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Calculator Guides</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed explanations of how each calculator works and when to use them.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Financial Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Tips and strategies for effective financial planning and investment.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Privacy & Security</h3>
                <p className="text-sm text-muted-foreground">
                  Learn about our privacy-first approach and data security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 