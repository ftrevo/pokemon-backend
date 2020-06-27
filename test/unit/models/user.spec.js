/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const expect = require('expect');
const faker = require('faker');

const User = require('../../../src/models/user');

const runTests = () => {
  describe('User', () => {
    describe('Save hook', () => {
      const password = faker.internet.password();

      const baseUser = new User({
        name: faker.name.findName(),
        password,
        email: faker.internet.email(),
      });

      it('crypt password', async () => {
        await baseUser.save();

        expect(baseUser.password).not.toEqual(password);
      });

      it('do not double crypt password', async () => {
        const encryptedPassword = `${baseUser.password}`;
        const newName = faker.name.findName();
        baseUser.name = newName;

        await baseUser.save();

        expect(baseUser.password).toEqual(encryptedPassword);
      });
    });
  });
};

module.exports = runTests;
