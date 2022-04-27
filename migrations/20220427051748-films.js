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
  return db.createTable('films', {
    id: {
      type: 'int',
      primaryKey: true,
      unsigned: true,
      notNull: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      length: '100',
    },
    film_iso: {
      type: 'smallint',
      unsigned: true,
    },
    color: {
      type: 'string',
      length: '30'
    }
  })
};

exports.down = function (db) {
  return db.dropTable('films')
};

exports._meta = {
  "version": 1
};