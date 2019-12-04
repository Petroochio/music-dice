const beats = {
  'Bass-A': [
    1, 0, 1, 0,
    1, 0, 1, 0,
    1, 0, 1, 0,
    1, 0, 1, 0,
  ],

  'Bass-B': [
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
  ],

  'Lead-1-C-1': [
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
  ],

  'Lead-1-C-2': [
    1, 0, 0, 1,
    0, 1, 0, 0,
    1, 0, 0, 1,
    0, 1, 0, 0,
  ],

  'Lead-1-A-1': [
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
  ],

  'Lead-1-B-1': [
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
  ],

  'Lead-2-C-1': [
    1, 0, 0, 1,
    0, 1, 0, 0,
    1, 0, 0, 1,
    0, 1, 0, 0,
  ],

  'Lead-2-A-1': [
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
  ],

  'Lead-2-A-2': [
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 1, 1, 1,
    1, 0, 0, 1,
  ],

  'Lead-2-B-1': [
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
  ],
};

export function getBeat(key) {
  console.log(key);
  return beats[key];
}

const combos = [
  ['Bass-A', 'Lead-1-C-1', 'Lead-2-C-1'],
  ['Bass-A', 'Lead-1-C-2', 'Lead-2-C-1'],
  ['Bass-A', 'Lead-1-A-1', 'Lead-2-C-1'],
  ['Bass-A', 'Lead-1-C-1', 'Lead-2-A-1'],
  ['Bass-A', 'Lead-1-C-2', 'Lead-2-A-1'],
  ['Bass-A', 'Lead-1-A-1', 'Lead-2-A-1'],
  ['Bass-A', 'Lead-1-C-1', 'Lead-2-A-2'],
  ['Bass-A', 'Lead-1-C-2', 'Lead-2-A-2'],
  ['Bass-A', 'Lead-1-A-1', 'Lead-2-A-2'],

  ['Bass-B', 'Lead-1-C-1', 'Lead-2-C-1'],
  ['Bass-B', 'Lead-1-C-2', 'Lead-2-C-1'],
  ['Bass-B', 'Lead-1-B-1', 'Lead-2-C-1'],
  ['Bass-B', 'Lead-1-C-1', 'Lead-2-B-1'],
  ['Bass-B', 'Lead-1-C-2', 'Lead-2-B-1'],
  ['Bass-B', 'Lead-1-B-1', 'Lead-2-B-1'],
];

const markups = [
  [1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0,],
];

export function getRandomTracks() {
  return combos[Math.round(Math.random() * (combos.length -1))];
}

export default markups;
