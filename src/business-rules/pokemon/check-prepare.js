const pkmnUtils = require('../../helpers/pokemon-utils');

module.exports = class CheckPrepare {
  constructor(utils = pkmnUtils) {
    this.utils = utils;
  }

  execute({
    _id, previous, captured, evolution, pokemons, starterPokemon,
  }) {
    return new Promise((resolve, reject) => {
      try {
        const capturedUnique = captured.previous === undefined
          && captured.evolution === undefined;

        const playerOwnedEvolutions = pokemons.filter((candidate) => !candidate.hasBase);
        const activeAmmount = pokemons.length - playerOwnedEvolutions.length;

        if (capturedUnique) { // Simple capture unique pokémon
          this.utils.captureCheckMaxQuantity(pokemons);
          this.utils.captureBaseCheckHasEvolution(pokemons, playerOwnedEvolutions);

          return resolve({
            _id,
            changes: {
              pokemons: pokemons.concat([{
                number: captured.number,
                hasBase: true,
                fullyEvolved: true,
                isActive: activeAmmount < 6,
                merged: [captured.number],
              }]),
            },
          });
        }

        if (!previous && !evolution) { // Simple capture - player doesn't have related
          this.utils.captureCheckMaxQuantity(pokemons);

          if (captured.previous) { // Is evolution
            this.utils.captureEvolutionCheckHasMaxEvolution(playerOwnedEvolutions);
            return resolve({
              _id,
              changes: {
                pokemons: pokemons.concat([{
                  number: captured.number,
                  hasBase: false,
                  fullyEvolved: false,
                  isActive: false, // Allways false when capturing an evolution
                  merged: [captured.number],
                }]),
              },
            });
          }

          // Is base
          this.utils.captureBaseCheckHasEvolution(pokemons, playerOwnedEvolutions);
          return resolve({
            _id,
            changes: {
              pokemons: pokemons.concat([{
                number: captured.number,
                hasBase: true,
                fullyEvolved: false,
                isActive: activeAmmount < 6,
                merged: [captured.number],
              }]),
            },
          });
        }

        if (previous && evolution) { // Will join two, only happens when there are 3
          const changes = {
            pokemons: this.utils.removePokemons(
              pokemons,
              previous.number,
              evolution.number,
            ).concat([{
              number: evolution.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: previous.isActive,
              merged: [
                previous.number,
                captured.number,
                evolution.number,
              ].sort(this.utils.sortAsc),
            }]),
          };

          if (previous.number === starterPokemon) {
            changes.starterPokemon = changes.pokemons[changes.pokemons.length - 1].number;
          }

          return resolve({ _id, changes });
        }

        if (evolution) { // Player already has evolution, will mark it as evolved
          if (!captured.previous) { // Captured base, can transform evolution to base?
            this.utils.capturedBaseCheckEvolutionCanReceiveBase(
              pokemons,
              playerOwnedEvolutions,
              evolution.number,
            );
          }

          return resolve({
            _id,
            changes: {
              pokemons: this.utils.removePokemons(pokemons, evolution.number)
                .concat([{
                  number: evolution.number,
                  hasBase: !captured.previous,
                  fullyEvolved: this.utils.isFullyEvolved(
                    captured.number,
                    evolution.merged,
                  ),
                  isActive: !captured.previous && activeAmmount < 6,
                  merged: [captured.number, ...evolution.merged].sort(this.utils.sortAsc),
                }]),
            },
          });
        }

        // Has previous, will only evolve previous
        const changes = {
          pokemons: this.utils.removePokemons(pokemons, previous.number)
            .concat([{
              number: captured.number,
              hasBase: previous.hasBase,
              fullyEvolved: this.utils.isFullyEvolved(captured.number, previous.merged),
              isActive: previous.isActive,
              merged: [captured.number, ...previous.merged].sort(this.utils.sortAsc),
            }]),
        };

        if (previous.number === starterPokemon) {
          changes.starterPokemon = changes.pokemons[changes.pokemons.length - 1].number;
        }

        return resolve({ _id, changes });
      } catch (err) {
        return reject(err);
      }
    });
  }
};
