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
  return db.addColumn('orders', 'order_status_id', {
    type: 'int',
    unsigned: true,
    notNull: false
  })
};

exports.down = function (db) {
  return db.dropColumn('orders')
};

exports._meta = {
  "version": 1
};