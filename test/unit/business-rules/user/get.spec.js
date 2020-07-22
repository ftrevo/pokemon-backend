const expect = require('expect');
const faker = require('faker');
const Get = require('../../../../src/business-rules/user/get');
const { Unauthorized } = require('../../../../src/domains/errors/exceptions');

const runTests = () => {
  describe('Get', () => {
    const getMockedJson = (
      name = faker.name.findName(),
      email = faker.internet.email(),
      password = faker.internet.password(),
    ) => ({ name, email, password });

    const getMockedUser = (user, comparePwdResult = true) => ({
      toJSON: () => user,
      comparePwd: () => comparePwdResult,
    });

    const getMockedRepo = (findOneResult) => ({ findOne: () => findOneResult });

    it('success', async () => {
      const mockedJsonUser = getMockedJson();
      const mockedRepo = getMockedRepo(getMockedUser(mockedJsonUser));

      const get = new Get(mockedRepo);

      const returned = await get.getUserValidPwd(
        { email: mockedJsonUser.email, password: mockedJsonUser.password },
      );

      expect(returned).toHaveProperty('name', mockedJsonUser.name);
      expect(returned).toHaveProperty('email', mockedJsonUser.email);
      expect(returned.password).toBeUndefined();
    });

    describe('error', () => {
      it('unexisting user', async () => {
        const mockedRepo = getMockedRepo();

        const get = new Get(mockedRepo);

        try {
          await get.getUserValidPwd({ email: 0, password: 0 });
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unauthorized);
          expect(err).toHaveProperty('message', 'Usuário(a) e/ou senha invalido(a)');
        }
      });

      it('non matching password', async () => {
        const mockedRepo = getMockedRepo(getMockedUser({}, false));

        const get = new Get(mockedRepo);

        try {
          await get.getUserValidPwd({ email: 0, password: 0 });
          throw new Error('Fail');
        } catch (err) {
          expect(err).toBeInstanceOf(Unauthorized);
          expect(err).toHaveProperty('message', 'Usuário(a) e/ou senha invalido(a)');
        }
      });
    });
  });
};

module.exports = runTests;
