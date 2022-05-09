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
    order_date: {
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
    },
    status_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_order_status_fk',
        table: 'order_statuses',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        }
      }
    },
    payment_status: {
      type: 'string',
      length: '30',
      notNull: false
    },
    total_paid: {
      type: 'string',
      length: '30',
      notNull: false
    },
    stripe_payment_id: {
      type: 'string',
      length: '150',
      notNull: false
    }
  });
};

exports.down = function (db) {
  return db.dropTable('orders')
};

exports._meta = {
  "version": 1
};