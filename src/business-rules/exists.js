module.exports = class BaseExists {
  /**
   * @param repo repository a ser usado
   */
  constructor(repo) {
    this.repo = repo;
  }

  async exists(data, throwCondition, exception) {
    const userExists = await this.repo.exists(data);

    if (userExists === throwCondition) {
      throw exception;
    }

    return userExists;
  }
};
