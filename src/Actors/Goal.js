class Goal {
  constructor(position) {
    this.position = position;
    this.conditions = ['NULL', 'NULL', 'NULL'];
  }

  setGoal(a, b, c) {
    this.conditions[0] = a;
    this.conditions[1] = b;
    this.conditions[2] = c;
  }
}