
import { GameState, GameEvent } from '../types/GameTypes';

interface EventTemplate {
  id: string;
  title: string;
  description: string;
  probability: number;
  type: 'security' | 'story' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  trigger: 'active_hack' | 'mission_complete' | 'level_up';
}

const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: 'security_sweep',
    title: 'Security Sweep Detected',
    description: 'Government security sweep in progress. Trace speeds increased.',
    probability: 0.05,
    type: 'security',
    severity: 'high',
    trigger: 'active_hack'
  },
  {
    id: 'trace_storm',
    title: 'Trace Storm Warning',
    description: 'Massive security operation detected. All traces doubled.',
    probability: 0.02,
    type: 'security',
    severity: 'critical',
    trigger: 'active_hack'
  },
  {
    id: 'faction_contact',
    title: 'Faction Contact',
    description: 'A faction representative wants to establish contact.',
    probability: 0.03,
    type: 'story',
    severity: 'medium',
    trigger: 'level_up'
  }
];

export class EventSystem {
  private activeEvents: Set<string> = new Set();

  checkForEvents(trigger: EventTemplate['trigger'], gameState: GameState): GameEvent[] {
    const possibleEvents = EVENT_TEMPLATES.filter(
      template => template.trigger === trigger && !this.activeEvents.has(template.id)
    );

    const triggeredEvents: GameEvent[] = [];

    possibleEvents.forEach(template => {
      if (Math.random() < template.probability) {
        const event: GameEvent = {
          id: `${template.id}_${Date.now()}`,
          title: template.title,
          description: template.description,
          timestamp: Date.now(),
          type: template.type,
          severity: template.severity,
          active: true
        };

        triggeredEvents.push(event);
        this.activeEvents.add(template.id);

        // Auto-remove after some time
        setTimeout(() => {
          this.activeEvents.delete(template.id);
        }, 300000); // 5 minutes
      }
    });

    return triggeredEvents;
  }

  applyEventEffects(event: GameEvent, gameState: GameState, updateGameState: (updates: Partial<GameState>) => void) {
    const updates: Partial<GameState> = {
      eventLog: [...(gameState.eventLog || []), event]
    };

    // Apply effects based on event type
    if (event.id.includes('security_sweep')) {
      updates.traceMultiplier = 1.5;
    } else if (event.id.includes('trace_storm')) {
      updates.traceMultiplier = 2.0;
    }

    updateGameState(updates);
  }
}

export const eventSystem = new EventSystem();
