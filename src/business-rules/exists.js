module.exports = class BaseExists {
  /**
   * @param repo repository a ser usado
   */
  constructor(repo) {
    this.repo = repo;
  }

  async exists(data, throwCondition, exception) {
    const dataExists = await this.repo.exists(data);

    if (dataExists === throwCondition) {
      throw exception;
    }

    return dataExists;
  }
};
