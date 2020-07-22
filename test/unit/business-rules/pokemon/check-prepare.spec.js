/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const { Types: { ObjectId } } = require('mongoose');
const CheckPrepare = require('../../../../src/business-rules/pokemon/check-prepare');
const { pokedex } = require('../../../../src/helpers/pokemon-utils');

const testUtils = require('./pokemon-br-test-util');
const { Unprocessable } = require('../../../../src/domains/errors/exceptions');
const { sortAsc } = require('../../../../src/helpers/utils');

const cp = new CheckPrepare();

const runTests = () => {
  describe('CheckPrepare', () => {
    describe('Captured unique', () => {
      it('success', async () => {
        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[83],
          pokemons: [testUtils.getDBPokemon(4)],
          starterPokemon: 4,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            inputData.pokemons[0],
            {
              number: inputData.captured.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: true,
              merged: [inputData.captured.number],
            },
          ],
        });
      });

      it('max pokemon exception', async () => {
        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[83],
          pokemons: testUtils.fullActiveAndBag,
          starterPokemon: 4,
        };

        try {
          await cp.execute(inputData);
          throw new Error('Should not reach this');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Quantidade máxima de pokémons alcançada');
        }
      });

      it('evolution slot exception', async () => {
        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[83],
          pokemons: testUtils.fullBaseOneEmptySlot,
          starterPokemon: 4,
        };

        try {
          await cp.execute(inputData);
          throw new Error('Should not reach this');
        } catch (err) {
          expect(err).toBeInstanceOf(Unprocessable);
          expect(err).toHaveProperty('message', 'Você possui 9 pokémons base(evoluídos ou não), seu 10º deve ser uma evolução sem base');
        }
      });
    });

    describe('Simple capture', () => {
      describe('Evolution', () => {
        it('success ', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[105],
            pokemons: [testUtils.getDBPokemon(4)],
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: [
              inputData.pokemons[0],
              {
                number: inputData.captured.number,
                hasBase: false,
                fullyEvolved: false,
                isActive: false,
                merged: [inputData.captured.number],
              },
            ],
          });
        });

        it('max pokemon exception', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[105],
            pokemons: testUtils.fullActiveAndBag,
            starterPokemon: 4,
          };

          try {
            await cp.execute(inputData);
            throw new Error('Should not reach this');
          } catch (err) {
            expect(err).toBeInstanceOf(Unprocessable);
            expect(err).toHaveProperty('message', 'Quantidade máxima de pokémons alcançada');
          }
        });

        it('max evolution exception', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[105],
            pokemons: [testUtils.getDBPokemon(4), ...testUtils.fourEvolutionOnly],
            starterPokemon: 4,
          };

          try {
            await cp.execute(inputData);
            throw new Error('Should not reach this');
          } catch (err) {
            expect(err).toBeInstanceOf(Unprocessable);
            expect(err).toHaveProperty('message', 'Você já possui 4 evoluções sem base');
          }
        });
      });

      describe('Base', () => {
        it('success ', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[104],
            pokemons: [testUtils.getDBPokemon(4)],
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: [
              inputData.pokemons[0],
              {
                number: inputData.captured.number,
                hasBase: true,
                fullyEvolved: false,
                isActive: true,
                merged: [inputData.captured.number],
              },
            ],
          });
        });

        it('max pokemon exception', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[104],
            pokemons: testUtils.fullActiveAndBag,
            starterPokemon: 4,
          };

          try {
            await cp.execute(inputData);
            throw new Error('Should not reach this');
          } catch (err) {
            expect(err).toBeInstanceOf(Unprocessable);
            expect(err).toHaveProperty('message', 'Quantidade máxima de pokémons alcançada');
          }
        });

        it('reserved slot for evolution exception', async () => {
          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[104],
            pokemons: testUtils.fullBaseOneEmptySlot,
            starterPokemon: 4,
          };

          try {
            await cp.execute(inputData);
            throw new Error('Should not reach this');
          } catch (err) {
            expect(err).toBeInstanceOf(Unprocessable);
            expect(err).toHaveProperty('message', 'Você possui 9 pokémons base(evoluídos ou não), seu 10º deve ser uma evolução sem base');
          }
        });
      });
    });

    describe('Has base and evolution', () => {
      it('success', async () => {
        const bulbasaur = testUtils.getDBPokemon(1);
        const venosaur = testUtils.getDBPokemon(3, false, false);

        const inputData = {
          _id: new ObjectId().toString(),
          previous: bulbasaur,
          captured: pokedex[2],
          evolution: venosaur,
          pokemons: [testUtils.getDBPokemon(4), bulbasaur, venosaur],
          starterPokemon: 4,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            inputData.pokemons[0],
            {
              number: venosaur.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: true,
              merged: [bulbasaur.number, inputData.captured.number, venosaur.number],
            },
          ],
        });
      });

      it('success change base', async () => {
        const charmander = testUtils.getDBPokemon(4);
        const charizard = testUtils.getDBPokemon(6, false, false);

        const inputData = {
          _id: new ObjectId().toString(),
          previous: charmander,
          captured: pokedex[5],
          evolution: charizard,
          pokemons: [charmander, charizard],
          starterPokemon: charmander.number,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            {
              number: charizard.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: true,
              merged: [charmander.number, inputData.captured.number, charizard.number],
            },
          ],
          starterPokemon: charizard.number,
        });
      });
    });

    describe('Have evolution', () => {
      describe('Captured base', () => {
        it('success will turn to active', async () => {
          const ivysaur = testUtils.getDBPokemon(2, false, false);

          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[1],
            evolution: ivysaur,
            pokemons: [testUtils.getDBPokemon(4), ivysaur],
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: [
              inputData.pokemons[0],
              {
                number: ivysaur.number,
                hasBase: true,
                fullyEvolved: false,
                isActive: true,
                merged: [inputData.captured.number, ivysaur.number],
              },
            ],
          });
        });

        it('success will not turn to active', async () => {
          const ivysaur = testUtils.getDBPokemon(2, false, false);

          const pokemons = testUtils.fullBaseOneEmptySlot.slice(0, 7);
          pokemons[0] = ivysaur;
          pokemons[6].isActive = true;

          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[1],
            evolution: ivysaur,
            pokemons,
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: testUtils.fullBaseOneEmptySlot.slice(1, 7).concat([{
              number: ivysaur.number,
              hasBase: true,
              fullyEvolved: false,
              isActive: false,
              merged: [inputData.captured.number, ivysaur.number],
            }]),
          });
        });

        it('success will fully evolve', async () => {
          const venosaur = testUtils.getDBPokemon(3, false, false, [2]);

          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[1],
            evolution: venosaur,
            pokemons: [testUtils.getDBPokemon(4), venosaur],
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: [
              inputData.pokemons[0],
              {
                number: venosaur.number,
                hasBase: true,
                fullyEvolved: true,
                isActive: true,
                merged: [inputData.captured.number, ...venosaur.merged].sort(sortAsc),
              },
            ],
          });
        });

        it('can not capture due to reserved slot for evolution', async () => {
          const sandslash = testUtils.getDBPokemon(28, false, false);

          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[27],
            evolution: sandslash,
            pokemons: testUtils.fullActiveAndBag,
            starterPokemon: 4,
          };

          try {
            await cp.execute(inputData);
            throw new Error('Should not reach this');
          } catch (err) {
            expect(err).toBeInstanceOf(Unprocessable);
            expect(err).toHaveProperty('message', 'Um slot deve ser reservado para uma evolução apenas');
          }
        });
      });

      describe('Captured first evolution', () => {
        it('success', async () => {
          const venosaur = testUtils.getDBPokemon(2, false, false);

          const inputData = {
            _id: new ObjectId().toString(),
            captured: pokedex[2],
            evolution: venosaur,
            pokemons: [testUtils.getDBPokemon(4), venosaur],
            starterPokemon: 4,
          };

          const output = await cp.execute(inputData);

          expect(output).toHaveProperty('_id', inputData._id);
          expect(output).toHaveProperty('changes', {
            pokemons: [
              inputData.pokemons[0],
              {
                number: venosaur.number,
                hasBase: false,
                fullyEvolved: false,
                isActive: false,
                merged: [inputData.captured.number, venosaur.number],
              },
            ],
          });
        });
      });
    });

    describe('Captured evolution and have base', () => {
      it('success', async () => {
        const bulbasaur = testUtils.getDBPokemon(1);

        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[2],
          previous: bulbasaur,
          pokemons: [testUtils.getDBPokemon(4), bulbasaur],
          starterPokemon: 4,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            inputData.pokemons[0],
            {
              number: inputData.captured.number,
              hasBase: true,
              fullyEvolved: false,
              isActive: true,
              merged: [bulbasaur.number, inputData.captured.number],
            },
          ],
        });
      });

      it('success will fully evolve', async () => {
        const ivysaur = testUtils.getDBPokemon(2, true, true, [1]);

        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[3],
          previous: ivysaur,
          pokemons: [testUtils.getDBPokemon(4), ivysaur],
          starterPokemon: 4,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            inputData.pokemons[0],
            {
              number: inputData.captured.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: true,
              merged: [inputData.captured.number, ...ivysaur.merged].sort(sortAsc),
            },
          ],
        });
      });

      it('success will change base', async () => {
        const charmeleon = testUtils.getDBPokemon(5, true, true, [4]);

        const inputData = {
          _id: new ObjectId().toString(),
          captured: pokedex[6],
          previous: charmeleon,
          pokemons: [charmeleon],
          starterPokemon: 5,
        };

        const output = await cp.execute(inputData);

        expect(output).toHaveProperty('_id', inputData._id);
        expect(output).toHaveProperty('changes', {
          pokemons: [
            {
              number: inputData.captured.number,
              hasBase: true,
              fullyEvolved: true,
              isActive: true,
              merged: [...charmeleon.merged, inputData.captured.number].sort(sortAsc),
            },
          ],
          starterPokemon: inputData.captured.number,
        });
      });
    });
  });
};

module.exports = runTests;
