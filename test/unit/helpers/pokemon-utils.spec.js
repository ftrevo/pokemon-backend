const expect = require('expect');
const pkmUtils = require('../../../src/helpers/pokemon-utils');
const { sortAsc } = require('../../../src/helpers/utils');
const { Unprocessable } = require('../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('Pokemon Utils', () => {
    const { pokedex } = pkmUtils;

    const getDbPokemon = (number, mergedArray = [], hasFullyEvolved = false) => (
      {
        ...pokedex[number],
        hasFullyEvolved,
        merged: [number, ...mergedArray].sort(sortAsc),
      }
    );

    describe('playerHasPrevious', () => {
      it('previous found', () => {
        const jolteon = pokedex[135];

        const doesIt = pkmUtils.playerHasPrevious(jolteon, [getDbPokemon(133)]);

        expect(doesIt).toBeTruthy();
      });

      it('captured does not have previous', () => {
        const eevee = pokedex[133];

        const doesIt = pkmUtils.playerHasPrevious(eevee, []);

        expect(doesIt).toBeFalsy();
      });

      it('captured has previous', () => {
        const jolteon = pokedex[135];

        const doesIt = pkmUtils.playerHasPrevious(jolteon, [getDbPokemon(1), getDbPokemon(4)]);

        expect(doesIt).toBeFalsy();
      });

      it('player has fully evolved', () => {
        const jolteon = pokedex[135];

        const doesIt = pkmUtils.playerHasPrevious(jolteon, [getDbPokemon(3, [1, 2], true)]);

        expect(doesIt).toBeFalsy();
      });
    });

    describe('playerHasEvolution', () => {
      it('simple evolution found', () => {
        const pikachu = pokedex[25];

        const doesIt = pkmUtils.playerHasEvolution(pikachu, [getDbPokemon(26)]);

        expect(doesIt).toBeTruthy();
      });

      it('evolved evolution found', () => {
        const charmander = pokedex[4];

        const doesIt = pkmUtils.playerHasEvolution(charmander, [getDbPokemon(6, [5])]);

        expect(doesIt).toBeTruthy();
      });

      it('fully evolved', () => {
        const ivysaur = pokedex[2];

        const doesIt = pkmUtils.playerHasEvolution(
          ivysaur,
          [
            getDbPokemon(6, [4, 5], true),
            getDbPokemon(1),
          ],
        );

        expect(doesIt).toBeFalsy();
      });

      it('captured does not have evolution', () => {
        const farfetch = pokedex[83];

        const doesIt = pkmUtils.playerHasEvolution(farfetch, []);

        expect(doesIt).toBeFalsy();
      });

      describe('eevee', () => {
        it('evolution found', () => {
          const eevee = pokedex[133];

          const doesIt = pkmUtils.playerHasEvolution(eevee, [getDbPokemon(135)]);

          expect(doesIt).toBeTruthy();
        });

        it('fully evolved', () => {
          const eevee = pokedex[133];

          const doesIt = pkmUtils.playerHasEvolution(eevee, [getDbPokemon(6, [4, 5], true)]);

          expect(doesIt).toBeFalsy();
        });
      });
    });
  });

  describe('isFullyEvolved', () => {
    it('eevee evolved', () => {
      const doesIt = pkmUtils.isFullyEvolved(135, [133]); // Evolving an eevee

      expect(doesIt).toBeTruthy();
    });

    it('captured evolution, has base', () => {
      const doesIt = pkmUtils.isFullyEvolved(25, [26]);

      expect(doesIt).toBeTruthy();
    });

    it('captured evolution, has base', () => {
      const doesIt = pkmUtils.isFullyEvolved(26, [25]);

      expect(doesIt).toBeTruthy();
    });

    it('captured second evolution, has base and first evolution', () => {
      const doesIt = pkmUtils.isFullyEvolved(3, [1, 2]);

      expect(doesIt).toBeTruthy();
    });

    it('captured base, has first and second evolution', () => {
      const doesIt = pkmUtils.isFullyEvolved(1, [2, 3]);

      expect(doesIt).toBeTruthy();
    });

    it('captured second evolution, has first evolution but not base', () => {
      const doesIt = pkmUtils.isFullyEvolved(3, [2]);

      expect(doesIt).toBeFalsy();
    });

    it('captured first evolution, has base but not have second evolution', () => {
      const doesIt = pkmUtils.isFullyEvolved(1, [2]);

      expect(doesIt).toBeFalsy();
    });
  });

  describe('removePokemons', () => {
    it('remove first', () => {
      const captured = [{ number: 1 }, { number: 2 }, { number: 4 }];

      const filtered = pkmUtils.removePokemons(captured, 1, 10);

      expect(filtered).toEqual([captured[1], captured[2]]);
    });

    it('remove second', () => {
      const captured = [{ number: 1 }, { number: 2 }, { number: 4 }];

      const filtered = pkmUtils.removePokemons(captured, 10, 1);

      expect(filtered).toEqual([captured[1], captured[2]]);
    });

    it('remove both', () => {
      const captured = [{ number: 1 }, { number: 2 }, { number: 4 }];

      const filtered = pkmUtils.removePokemons(captured, 1, 2);

      expect(filtered).toEqual([captured[2]]);
    });

    it('remove none', () => {
      const captured = [{ number: 1 }, { number: 2 }, { number: 4 }];

      const filtered = pkmUtils.removePokemons(captured, 10, 20);

      expect(filtered).toEqual(captured);
    });
  });

  describe('captureCheckMaxQuantity', () => {
    it('success', () => {
      try {
        pkmUtils.captureCheckMaxQuantity([0, 1, 2, 3]);
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('failiure', () => {
      try {
        pkmUtils.captureCheckMaxQuantity([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      } catch (err) {
        expect(err).toBeInstanceOf(Unprocessable);
        expect(err).toHaveProperty('message', 'Quantidade máxima de pokémons alcançada');
      }
    });
  });

  describe('captureEvolutionCheckHasMaxEvolution', () => {
    it('success', () => {
      try {
        pkmUtils.captureEvolutionCheckHasMaxEvolution([0, 1]);
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('failiure', () => {
      try {
        pkmUtils.captureEvolutionCheckHasMaxEvolution([0, 1, 2, 3]);
      } catch (err) {
        expect(err).toBeInstanceOf(Unprocessable);
        expect(err).toHaveProperty('message', 'Você já possui 4 evoluções sem base');
      }
    });
  });

  describe('captureBaseCheckHasEvolution', () => {
    it('success 8 base no evolution', () => {
      try {
        pkmUtils.captureBaseCheckHasEvolution([0, 1, 2, 3, 4, 5, 6, 7], []);
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('success 8 base and 1 evolution', () => {
      try {
        pkmUtils.captureBaseCheckHasEvolution([0, 1, 2, 3, 4, 5, 6], [0]);
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('failiure 9 base no evolution', () => {
      try {
        pkmUtils.captureBaseCheckHasEvolution([0, 1, 2, 3, 4, 5, 6, 7, 8], []);
      } catch (err) {
        expect(err).toBeInstanceOf(Unprocessable);
        expect(err).toHaveProperty('message', 'Você possui 9 pokémons base(evoluídos ou não), seu 10º deve ser uma evolução sem base');
      }
    });
  });

  describe('capturedBaseCheckEvolutionCanReceiveBase', () => {
    it('success has empty slots', () => {
      try {
        pkmUtils.capturedBaseCheckEvolutionCanReceiveBase([0, 1], [{ number: 5 }]);
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('success no empty slots but have other evolution', () => {
      try {
        pkmUtils.capturedBaseCheckEvolutionCanReceiveBase(
          [0, 1, 3, 4, 5, 6, 7, 8, 9],
          [{ number: 50 }],
          50,
        );
      } catch (err) {
        throw new Error('Should not reach this');
      }
    });

    it('failiure', () => {
      try {
        pkmUtils.capturedBaseCheckEvolutionCanReceiveBase(
          [0, 1, 3, 4, 5, 6, 7, 8, 9],
          [{ number: 5 }],
          50,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(Unprocessable);
        expect(err).toHaveProperty('message', 'Um slot deve ser reservado para uma evolução apenas');
      }
    });
  });
};

module.exports = runTests;
