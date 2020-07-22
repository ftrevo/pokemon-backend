module.exports = class BaseExists {
  /**
   * @param repo repository a ser usado
   */
  constructor(repo) {
    this.repo = repo;
  }

  async exists(query, throwCondition, exception) {
    const dataExists = await this.repo.exists(query);

    if (dataExists === throwCondition) {
      throw exception;
    }

    return dataExists;
  }

  async findOne(query, shouldThrow, exception, projection, populateData) {
    const returned = await this.repo.findOne(query, projection, populateData);

    if (shouldThrow && !returned) {
      throw exception;
    }

    return returned;
  }
};
