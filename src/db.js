import Dexie from 'dexie';
import 'dexie-observable';
const db = new Dexie('friend_optimizer');
db.version(1).stores({
  friend: 'id,active,whitelisted,username,like_count,comment_count',
  unfriended: 'id',
  campaign: '++id',
  config: 'id',
  newfriend: 'id',
  post: 'id',
});

export default db;
