/* eslint-disable no-param-reassign */
const fs = require('fs');
const j2s = require('joi-to-swagger');

const scanFolderForFileWithExtension = (dir, extension, list = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      list = scanFolderForFileWithExtension(`${dir}/${file}/`, extension, list);
    } else if (file.endsWith(extension)) {
      list.push(require(`${dir}${file}`.replace('//', '/'))); // eslint-disable-line global-require,import/no-dynamic-require
    }
  });
  return list;
};

/**
 * Compila os arquivos com o sufixo definido e adiciona no contexto do swagger.
 *
 * @param {Object} originalSwagger Objeto oriundo do swagger.
 * @param {String} scanSourceDir Origem e onde o projeto será varrido para procurar pelos arquivos.
 * Default = __dirname
 * @param {String} [joiFileSufix=.joi.js] - Sufixo dos arquivos do Joi.
 * Default = ".joi.js".
 * @param {String} [destinationObject=components] Objeto destino dentro do objeto "originalSwagger".
 * Default = "joiComponents".
 */
const joiCompiler = (originalSwagger, scanSourceDir = __dirname, joiFileSufix = '.joi.js', destinationObject = 'joiComponents') => {
  if (!originalSwagger[destinationObject]) {
    originalSwagger[destinationObject] = {};
  }
  const joiFiles = scanFolderForFileWithExtension(scanSourceDir, joiFileSufix);

  joiFiles.forEach((singleFile) => {
    const { components: { schemas } } = j2s(singleFile);
    Object.assign(originalSwagger[destinationObject], schemas);
  });
};

// --------------------- Module Exports --------------------- //
module.exports = joiCompiler;
