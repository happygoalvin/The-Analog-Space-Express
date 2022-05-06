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
  return db.addForeignKey('users', 'addresses', 'users_address_fk', {
    address_id: 'id',
  }, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
};

exports.down = async function (db) {
  await db.removeForeignKey('users_address_fk')
};

exports._meta = {
  "version": 1
};