import { useState, useEffect } from 'react';

export function useGuidance() {
  const [guidanceState, setGuidanceState] = useState(() => {
    const saved = localStorage.getItem('leaproad-guidance');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      showWelcomeBanner: true,
      showTooltips: true,
      completedSteps: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('leaproad-guidance', JSON.stringify(guidanceState));
  }, [guidanceState]);

  const dismissWelcomeBanner = () => {
    setGuidanceState(prev => ({ ...prev, showWelcomeBanner: false }));
  };

  const markStepCompleted = (step) => {
    setGuidanceState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, step].filter((v, i, a) => a.indexOf(v) === i)
    }));
  };

  const isStepCompleted = (step) => {
    return guidanceState.completedSteps.includes(step);
  };

  const toggleTooltips = () => {
    setGuidanceState(prev => ({ ...prev, showTooltips: !prev.showTooltips }));
  };

  const resetGuidance = () => {
    setGuidanceState({
      showWelcomeBanner: true,
      showTooltips: true,
      completedSteps: [],
    });
  };

  return {
    ...guidanceState,
    dismissWelcomeBanner,
    markStepCompleted,
    isStepCompleted,
    toggleTooltips,
    resetGuidance,
  };
}