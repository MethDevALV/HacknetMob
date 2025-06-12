
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { HorizontalTopNav } from './HorizontalTopNav';
import { VerticalLeftNav } from './VerticalLeftNav';
import { DockBottomNav } from './DockBottomNav';
import { SliderRightNav } from './SliderRightNav';
import { CircularCornerNav } from './CircularCornerNav';

interface AdaptiveNavigationProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
}

export const AdaptiveNavigation: React.FC<AdaptiveNavigationProps> = ({
  activePanel,
  onPanelChange,
}) => {
  const { currentTheme } = useTheme();

  switch (currentTheme.navigationType) {
    case 'horizontal-top':
      return <HorizontalTopNav activePanel={activePanel} onPanelChange={onPanelChange} />;
    case 'vertical-left':
      return <VerticalLeftNav activePanel={activePanel} onPanelChange={onPanelChange} />;
    case 'dock-bottom':
      return <DockBottomNav activePanel={activePanel} onPanelChange={onPanelChange} />;
    case 'slider-right':
      return <SliderRightNav activePanel={activePanel} onPanelChange={onPanelChange} />;
    case 'circular-corner':
      return <CircularCornerNav activePanel={activePanel} onPanelChange={onPanelChange} />;
    default:
      return <HorizontalTopNav activePanel={activePanel} onPanelChange={onPanelChange} />;
  }
};
