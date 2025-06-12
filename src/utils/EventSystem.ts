
import { GameEvent, SystemLog } from '../types/CoreTypes';

export class EventSystem {
  private eventLog: GameEvent[] = [];
  private systemLogs: SystemLog[] = [];

  logEvent(event: GameEvent) {
    this.eventLog.push(event);
    console.log(`[EventSystem] Event logged: ${event.title || event.type}`);
  }

  logSystemEvent(log: SystemLog) {
    this.systemLogs.push(log);
    console.log(`[EventSystem] System Log: ${log.action}`);
  }

  getEventLog(): GameEvent[] {
    return [...this.eventLog];
  }

  getSystemLogs(): SystemLog[] {
    return [...this.systemLogs];
  }

  clearEventLog() {
    this.eventLog = [];
    console.warn('[EventSystem] Event log cleared');
  }

  clearSystemLogs() {
    this.systemLogs = [];
    console.warn('[EventSystem] System logs cleared');
  }
}

export const eventSystem = new EventSystem();
