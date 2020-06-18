class Controller {
  constructor() {
    this.state = {};
  }

  // Creates and manages a local state using the Observer pattern
  createState(name, value) {
    this.state[name] = {
      value,
      effects: [],
      // Adds an effect to run when the state is updated
      addEffect(callback) {
        if (this.effects.some(effect => effect === callback)) return;

        this.effects.push(callback);
      },
      // Removes an effect
      removeEffect(callback) {
        const index = this.effects.indexOf(callback);

        if (index === -1) return;

        this.effects.splice(index, 1);
      },
      // Updates the state and runs all its effects
      updateState(value) {
        // if (value === this.value) return;

        this.value = value;

        this.effects.forEach(effect => effect(this.value));
      }
    };

    return this.state[name];
  }
}

export default new Controller();
