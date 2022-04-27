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
  return db.addColumn('cameras', 'manufacturer_id', {
    type: 'int',
    unsigned: true,
    notNull: true
  })
};

exports.down = async function (db) {
  await db.removeForeignKey('manufacturer_id');
  db.dropColumn('type_id')
};

exports._meta = {
  "version": 1
};