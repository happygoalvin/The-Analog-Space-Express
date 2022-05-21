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

exports.up = async function (db) {
  db.addColumn('orders', 'address_line1', {
    type: 'string',
    length: 100
  });
  db.addColumn('orders', 'address_line2', {
    type: 'string',
    length: 100
  })
  db.addColumn('orders', 'address_postal_code', {
    type: 'string',
    length: 20
  })
  return
};

exports.down = function (db) {
  db.removeColumn('orders', 'address_line1')
  db.removeColumn('orders', 'address_line2')
  db.removeColumn('orders', 'address_postal_code')
  return
};

exports._meta = {
  "version": 1
};