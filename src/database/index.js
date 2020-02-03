import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Repicient from '../app/models/Repicient';
import Deliveryman from '../app/models/Deliveryman';
import Delivery from '../app/models/Delivery';

const models = [User, File, Repicient, Deliveryman, Delivery];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
