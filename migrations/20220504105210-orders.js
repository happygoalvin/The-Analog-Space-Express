'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('orders', {
    id: {
      type: 'int',
      primaryKey: true,
      unsigned: true,
      autoIncrement: true,
      notNull: true
    },
    created_datetime: {
      type: 'datetime',
      notNull: false
    },
    completed_datetime: {
      type: 'datetime',
      notNull: false
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    }
  });
};

exports.down = function (db) {
  return db.dropTable('orders')
};

exports._meta = {
  "version": 1
};