module.exports = class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async exists(data) {
    const exists = await this.model.exists(data);

    return exists;
  }

  async create(data) {
    const created = await this.model.create(data);

    return created.toJSON();
  }

  async findOne(data, projectionFields) {
    const found = await this.model.findOne(data, projectionFields);

    return found;
  }

  async findOneAndUpdate(queryData, updateData, populateData) {
    const found = await this.model
      .findOneAndUpdate(queryData, updateData, { new: true, useFindAndModify: false }).exec();

    if (populateData) {
      await found.populate(populateData).execPopulate();
    }

    return found.toJSON();
  }
};
