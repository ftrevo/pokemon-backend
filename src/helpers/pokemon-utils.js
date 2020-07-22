const pokedex = require('../domains/pokemons.json');
const { getUnprocessable } = require('../domains/errors/exceptions');
const { sortAsc } = require('./utils');

const playerHasPrevious = (captured, ownedPokemons) => {
  if (!captured.previous) {
    return false;
  }

  return ownedPokemons.find(
    (candidate) => !candidate.hasFullyEvolved && candidate.number === captured.previous,
  );
};

const playerHasEvolution = (captured, ownedPokemons) => {
  if (!captured.evolution) {
    return false;
  }

  if (captured.evolution.length > 2) { // Eevee detected
    return ownedPokemons.find(
      (candidate) => !candidate.hasFullyEvolved && captured.evolution.includes(candidate.number),
    );
  }

  return ownedPokemons.find(
    (candidate) => candidate.merged.some((pkm) => pkm === captured.evolution[0]),
  );
};

const checkLengthAndAdditional = (array, length, error, additional = true) => {
  if (array.length === length && additional) throw error;
};

const captureCheckMaxQuantity = (playerOwnedPokemons) => checkLengthAndAdditional(
  playerOwnedPokemons,
  10,
  getUnprocessable('Quantidade máxima de pokémons alcançada'),
);

const captureEvolutionCheckHasMaxEvolution = (playerOwnedEvolutions) => checkLengthAndAdditional(
  playerOwnedEvolutions,
  4,
  getUnprocessable('Você já possui 4 evoluções sem base'),
);

const captureBaseCheckHasEvolution = (
  playerOwnedPokemons,
  playerOwnedEvolutions,
) => checkLengthAndAdditional(
  playerOwnedPokemons,
  9,
  getUnprocessable('Você possui 9 pokémons base(evoluídos ou não), seu 10º deve ser uma evolução sem base'),
  playerOwnedEvolutions.length === 0,
);

const capturedBaseCheckEvolutionCanReceiveBase = (
  allPokemons, capturedEvolutions, evolutionNumber,
) => checkLengthAndAdditional(
  allPokemons,
  10,
  getUnprocessable('Um slot deve ser reservado para uma evolução apenas'),
  !capturedEvolutions.some((cand) => cand.number !== evolutionNumber),
);

const removePokemons = (array, pokemonOne, pokemonTwo) => array.filter(
  (pokemon) => !(pokemonTwo === pokemon.number || pokemonOne === pokemon.number),
);

const isFullyEvolved = (captured, previouslyMerged) => {
  const all = [captured, ...previouslyMerged].sort(sortAsc);

  if (all[0] === 133) { // Yeah, Eevee
    return true;
  }

  let lower = pokedex[all[0]];

  if (lower.previous) {
    lower = pokedex[lower.previous];
  }

  return all.length === (lower.evolution.length + 1);
};

module.exports = {
  playerHasPrevious,
  playerHasEvolution,
  pokedex,
  isFullyEvolved,
  captureCheckMaxQuantity,
  captureBaseCheckHasEvolution,
  captureEvolutionCheckHasMaxEvolution,
  capturedBaseCheckEvolutionCanReceiveBase,
  removePokemons,
  sortAsc,
};
