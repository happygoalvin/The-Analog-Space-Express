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
  return db.addForeignKey('orders', 'cameras', 'orders_camera_fk', {
    camera_id: 'id',
  }, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  })
};

exports.down = async function (db) {
  await db.removeForeignKey('orders_camera_fk')
};

exports._meta = {
  "version": 1
};