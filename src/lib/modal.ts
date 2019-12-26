import { createMachine, interpret, StateMachine } from "@xstate/fsm";

export function modal(id: string): any {
  const toggleMachine = createMachine({
    id,
    initial: "inactive",
    states: {
      inactive: { on: { TOGGLE: "active" } },
      active: { on: { TOGGLE: "inactive" } }
    }
  });

  const toggleService = interpret(toggleMachine).start();

  toggleService.subscribe(state => {
    console.log(state.value);
  });

  toggleService.send("TOGGLE");
  // => logs 'active'

  toggleService.send("TOGGLE");
  // => logs 'inactive'

  toggleService.stop();
}
