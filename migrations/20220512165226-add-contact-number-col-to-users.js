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
  return db.addColumn('users', 'contact_number', {
    type: 'string',
    length: '30',
    notNull: false
  })
};

exports.down = function (db) {
  return db.dropColumn('contact_number');
};

exports._meta = {
  "version": 1
};