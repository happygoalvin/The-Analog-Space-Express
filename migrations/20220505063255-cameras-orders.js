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
  return db.createTable('cameras_orders', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    camera_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'cameras_orders_camera_fk',
        table: 'cameras',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
    order_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'cameras_orders_order_fk',
        table: 'orders',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    }
  })
};

exports.down = function (db) {
  return db.dropTable('cameras_orders');
};

exports._meta = {
  "version": 1
};