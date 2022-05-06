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
  return db.createTable('addresses', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    street_name: {
      type: 'string',
      length: '100',
      notNull: false
    },
    unit_no: {
      type: 'string',
      length: '20',
      notNull: false
    },
    postal_code: {
      type: 'string',
      length: '20',
      notNull: false
    },
    state: {
      type: 'string',
      length: '100',
      notNull: false
    },
    city: {
      type: 'string',
      length: '120',
      notNull: false
    },
    country: {
      type: 'string',
      length: '100',
      notNull: false
    }
  })
};

exports.down = function (db) {
  return db.dropTable('addresses')
};

exports._meta = {
  "version": 1
};