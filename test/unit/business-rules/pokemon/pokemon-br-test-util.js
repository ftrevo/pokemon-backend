const getDBPokemon = (number, isActive = true, hasBase = true, merged = []) => ({
  number,
  isActive,
  merged: [number, ...merged],
  hasBase,
  fullyEvolved: false,
});

const fullActiveAndBag = [
  getDBPokemon(1),
  getDBPokemon(4),
  getDBPokemon(7),
  getDBPokemon(10),
  getDBPokemon(16),
  getDBPokemon(19),
  getDBPokemon(21, false),
  getDBPokemon(23, false),
  getDBPokemon(25, false),
  getDBPokemon(28, false, false),
];

const fourEvolutionOnly = [
  getDBPokemon(110, false, false),
  getDBPokemon(112, false, false),
  getDBPokemon(117, false, false),
  getDBPokemon(119, false, false),
];

const fullBaseOneEmptySlot = fullActiveAndBag.slice(0, 9);

module.exports = {
  getDBPokemon,
  fullActiveAndBag,
  fullBaseOneEmptySlot,
  fourEvolutionOnly,
};
