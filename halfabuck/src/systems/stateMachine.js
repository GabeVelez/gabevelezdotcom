export class StateMachine {
  constructor(initialState, possibleStates, stateArgs = []) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.state = null;

    // hook up references
    for (const state of Object.values(this.possibleStates)) {
      state.stateMachine = this;
    }
  }

  step(...stepArgs) {
    if (!this.state) {
      this.state = this.possibleStates[this.initialState];
      this.state.enter?.(...this.stateArgs);
    }
    this.state.execute?.(...this.stateArgs, ...stepArgs);
  }

  transition(newState, ...enterArgs) {
    if (this.state && this.state.exit) this.state.exit(...this.stateArgs);
    this.state = this.possibleStates[newState];
    this.state.enter?.(...this.stateArgs, ...enterArgs);
  }
}
