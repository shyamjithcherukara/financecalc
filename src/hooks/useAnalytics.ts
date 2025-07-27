import { useEffect, useRef } from 'react';
import { 
  trackCalculatorUsage, 
  trackCalculation, 
  trackTimeSpent, 
  trackConversion,
  trackError 
} from '@/lib/analytics';

export const useCalculatorAnalytics = (calculatorName: string) => {
  const startTime = useRef<number>(Date.now());
  const hasTrackedUsage = useRef<boolean>(false);

  // Track when user starts using the calculator
  useEffect(() => {
    if (!hasTrackedUsage.current) {
      trackCalculatorUsage(calculatorName, 'started');
      hasTrackedUsage.current = true;
    }

    // Track time spent when component unmounts
    return () => {
      const timeSpent = (Date.now() - startTime.current) / 1000; // Convert to seconds
      if (timeSpent > 5) { // Only track if user spent more than 5 seconds
        trackTimeSpent(calculatorName, timeSpent);
      }
    };
  }, [calculatorName]);

  // Track calculation events
  const trackCalculationEvent = (inputValues: Record<string, unknown>, resultType: string) => {
    try {
      trackCalculation(calculatorName, inputValues);
      trackConversion(calculatorName, resultType);
    } catch (error) {
      trackError('calculation_tracking_error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  // Track input changes
  const trackInputChange = (inputName: string) => {
    trackCalculatorUsage(calculatorName, `input_changed_${inputName}`);
  };

  // Track result viewing
  const trackResultView = (resultType: string) => {
    trackCalculatorUsage(calculatorName, `viewed_${resultType}_result`);
  };

  return {
    trackCalculationEvent,
    trackInputChange,
    trackResultView,
  };
};

export const usePageAnalytics = (pageName: string) => {
  useEffect(() => {
    // Track page view
    trackCalculatorUsage(pageName, 'page_viewed');
  }, [pageName]);
};

export const useErrorTracking = () => {
  const trackErrorEvent = (error: Error, context: string) => {
    trackError('application_error', `${context}: ${error.message}`);
  };

  return { trackErrorEvent };
}; 