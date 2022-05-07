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
  return db.addColumn('cameras_orders', 'subtotal', {
    type: 'int',
    unsigned: true,
    notNull: false
  })
};

exports.down = function (db) {
  return db.dropColumn('subtotal')
};

exports._meta = {
  "version": 1
};