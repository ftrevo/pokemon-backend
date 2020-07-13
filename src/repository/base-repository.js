module.exports = class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async exists(data) {
    const exists = await this.model.exists(data);

    return exists;
  }

  async create(data, populateData) {
    const created = await this.model.create(data);

    if (created && populateData) {
      await created.populate(populateData).execPopulate();
    }

    return created.toJSON();
  }

  async findOne(data, projectionFields, populateData) {
    const found = await this.model.findOne(data, projectionFields);

    if (found && populateData) {
      await found.populate(populateData).execPopulate();
    }

    return found;
  }

  async findOneAndUpdate(queryData, updateData, populateData) {
    const found = await this.model
      .findOneAndUpdate(queryData, updateData, { new: true, useFindAndModify: false }).exec();

    if (found && populateData) {
      await found.populate(populateData).execPopulate();
    }

    return found.toJSON();
  }
};
