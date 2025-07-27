// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-xxxxxxx', {
      page_path: url,
    });
  }
};

// Track calculator usage
export const trackCalculatorUsage = (calculatorName: string, action: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_usage', {
      calculator_name: calculatorName,
      action: action,
      event_category: 'Calculator',
      event_label: `${calculatorName} - ${action}`,
    });
  }
};

// Track calculation events
export const trackCalculation = (calculatorName: string, inputValues: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculation_performed', {
      calculator_name: calculatorName,
      event_category: 'Calculation',
      event_label: calculatorName,
      // Don't track sensitive financial data
      custom_parameters: {
        has_inputs: Object.keys(inputValues).length > 0,
      },
    });
  }
};

// Track user engagement
export const trackEngagement = (action: string, label: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'Engagement',
      event_label: label,
    });
  }
};

// Track FAQ interactions
export const trackFAQInteraction = (question: string, action: 'view' | 'expand') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'faq_interaction', {
      question: question,
      action: action,
      event_category: 'FAQ',
      event_label: `${question} - ${action}`,
    });
  }
};

// Track mobile vs desktop usage
export const trackDeviceUsage = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    window.gtag('event', 'device_usage', {
      device_type: isMobile ? 'mobile' : 'desktop',
      event_category: 'User',
      event_label: isMobile ? 'Mobile User' : 'Desktop User',
    });
  }
};

// Track calculator navigation
export const trackCalculatorNavigation = (fromCalculator: string, toCalculator: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_navigation', {
      from_calculator: fromCalculator,
      to_calculator: toCalculator,
      event_category: 'Navigation',
      event_label: `${fromCalculator} → ${toCalculator}`,
    });
  }
};

// Track time spent on calculator
export const trackTimeSpent = (calculatorName: string, timeSpent: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'time_spent', {
      calculator_name: calculatorName,
      time_spent_seconds: timeSpent,
      event_category: 'Engagement',
      event_label: `${calculatorName} - ${Math.round(timeSpent)}s`,
    });
  }
};

// Track error events
export const trackError = (errorType: string, errorMessage: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'error', {
      error_type: errorType,
      error_message: errorMessage,
      event_category: 'Error',
      event_label: errorType,
    });
  }
};

// Track conversion events (when users complete calculations)
export const trackConversion = (calculatorName: string, resultType: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      calculator_name: calculatorName,
      result_type: resultType,
      event_category: 'Conversion',
      event_label: `${calculatorName} - ${resultType}`,
    });
  }
};

// Initialize analytics on page load
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    // Track initial page load
    trackPageView(window.location.pathname);
    
    // Track device usage
    trackDeviceUsage();
    
    // Track user engagement with the site
    trackEngagement('page_view', 'Homepage');
  }
}; 