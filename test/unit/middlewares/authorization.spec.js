const { sign } = require('jsonwebtoken');
const expect = require('expect');
const faker = require('faker');
const auth = require('../../../src/middlewares/authorization');
const { Unauthorized } = require('../../../src/domains/errors/exceptions');

const getResMock = () => ({ locals: {} });
const getReqMock = (authToken) => ({ headers: { authorization: authToken } });
const getNextMock = (stash) => ((nextError) => {
  if (nextError) {
    stash.push(nextError);
  }
});

let validToken;
let invalidSignToken;

const user = {
  id: faker.random.alphaNumeric(24),
  name: faker.name.findName(),
  email: faker.internet.email(),
};

const runTests = () => {
  describe('authorization', () => {
    before(async () => {
      validToken = await sign(user, process.env.SECRET);
      invalidSignToken = await sign(user, faker.random.alphaNumeric(5));
    });

    it('success', async () => {
      const stash = [];
      const next = getNextMock(stash);

      const res = getResMock();
      const req = getReqMock(`${process.env.TOKEN_TYPE} ${validToken}`);

      await auth(req, res, next);

      expect(stash).toHaveLength(0);
      expect(res).toHaveProperty('locals.user.id', user.id);
      expect(res).toHaveProperty('locals.user.email', user.email);
      expect(res).toHaveProperty('locals.user.name', user.name);
      expect(res).toHaveProperty('locals.user.iat');
      expect(res.locals.user.iat).toBeGreaterThan(0);
    });


    describe('error', () => {
      it('no token', async () => {
        const stash = [];
        const next = getNextMock(stash);

        const res = getResMock();
        const req = getReqMock();

        await auth(req, res, next);

        expect(stash[0]).toBeInstanceOf(Unauthorized);
        expect(stash).toHaveProperty('0.message', 'Não autorizado');
      });

      it('token no prefix', async () => {
        const stash = [];
        const next = getNextMock(stash);

        const res = getResMock();
        const req = getReqMock(validToken);

        await auth(req, res, next);

        expect(stash[0]).toBeInstanceOf(Unauthorized);
        expect(stash).toHaveProperty('0.message', 'Não autorizado');
      });

      it('token wrong prefix', async () => {
        const stash = [];
        const next = getNextMock(stash);

        const res = getResMock();
        const req = getReqMock(`${faker.random.alphaNumeric(10)} ${validToken}`);

        await auth(req, res, next);

        expect(stash[0]).toBeInstanceOf(Unauthorized);
        expect(stash).toHaveProperty('0.message', 'Não autorizado');
      });

      it('token signed with different secret', async () => {
        const stash = [];
        const next = getNextMock(stash);

        const res = getResMock();
        const req = getReqMock(`${process.env.TOKEN_TYPE} ${invalidSignToken}`);

        await auth(req, res, next);

        expect(stash[0]).toBeInstanceOf(Unauthorized);
        expect(stash).toHaveProperty('0.message', 'Não autorizado');
        expect(stash).toHaveProperty('0.errorDecoding', 'invalid signature');
      });

      it('token random string', async () => {
        const stash = [];
        const next = getNextMock(stash);

        const res = getResMock();
        const req = getReqMock(`${process.env.TOKEN_TYPE} ${faker.random.alphaNumeric(30)}`);

        await auth(req, res, next);

        expect(stash[0]).toBeInstanceOf(Unauthorized);
        expect(stash).toHaveProperty('0.message', 'Não autorizado');
        expect(stash).toHaveProperty('0.errorDecoding', 'jwt malformed');
      });
    });
  });
};

module.exports = runTests;
