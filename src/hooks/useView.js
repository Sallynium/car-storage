import { useState } from 'react';

export function useView() {
  const [currentView, setCurrentView] = useState('floor');
  return { currentView, setCurrentView };
}
