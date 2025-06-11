
import { counterAttackSystem } from '../CounterAttack';

export class DefenseCommands {
  handleFirewall(args: string[]): string[] {
    if (counterAttackSystem.isCurrentlyUnderAttack()) {
      counterAttackSystem.executeDefense('firewall');
      return ['Firewall activated! Incoming connections blocked.'];
    }
    return ['Firewall already active or no threats detected.'];
  }

  handleIsolate(args: string[]): string[] {
    if (counterAttackSystem.isCurrentlyUnderAttack()) {
      counterAttackSystem.executeDefense('isolate');
      return ['System isolated from network. All external connections terminated.'];
    }
    return ['System already isolated or no threats detected.'];
  }

  handleTraceBlock(args: string[]): string[] {
    if (counterAttackSystem.isCurrentlyUnderAttack()) {
      counterAttackSystem.executeDefense('trace_block');
      return ['Trace blocking activated. Incoming traces redirected.'];
    }
    return ['Trace blocking already active or no threats detected.'];
  }

  handleCounterHack(args: string[]): string[] {
    if (counterAttackSystem.isCurrentlyUnderAttack()) {
      counterAttackSystem.executeDefense('counter_hack');
      return ['Counter-hack initiated! Reversing attack vector...'];
    }
    return ['No active threats to counter-attack.'];
  }
}
