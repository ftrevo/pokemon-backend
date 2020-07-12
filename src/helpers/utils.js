const { randomBytes } = require('crypto');

const getDefaultResData = ({ inboundTime, requestId }) => ({
  inboundTime: inboundTime.toISOString(),
  requestId,
  requestDuration: new Date().getTime() - inboundTime.getTime(),
});

const getToken = () => ([
  randomBytes(2).toString('hex'),
  '-',
  randomBytes(2).toString('hex'),
  '-',
  randomBytes(2).toString('hex'),
].join(''));

const objectIdBaseString = '[0-9a-fA-F]{24}';
const tokenBaseString = '[0-9a-fA-F]{4}(-[0-9a-fA-F]{4}){2}';

const objectIdBaseRegex = new RegExp(objectIdBaseString); // /[0-9a-fA-F]{24}/;
const tokenBaseRegex = new RegExp(tokenBaseString); // /[0-9a-fA-F]{4}(-[0-9a-fA-F]{4}){2}/;

const idRegex = new RegExp(`^${objectIdBaseString}$`); // /^[0-9a-fA-F]{24}$/;
const tokenRegex = new RegExp(`^${tokenBaseString}$`); // /^[0-9a-fA-F]{4}(-[0-9a-fA-F]{4}){2}$/;

const getReplacedRouteString = (path) => path
  .replace(objectIdBaseRegex, '{id}')
  .replace(tokenBaseRegex, '{token}');

const doUserTransformation = (isPopulated, userData) => {
  if (isPopulated) {
    const { password, ...userToBeSet } = userData;
    return userToBeSet;
  }
  return userData.toString();
};

const transformUser = (document, toBeReturned, fieldName) => (
  doUserTransformation(document.populated(fieldName), toBeReturned[fieldName]));

module.exports = {
  getDefaultResData,
  getToken,
  getReplacedRouteString,
  idRegex,
  tokenRegex,
  transformUser,
  doUserTransformation,
};
