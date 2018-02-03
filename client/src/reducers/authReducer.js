import { FETCH_USER } from '../actions/types';

export default (state = null, action) => {
  switch(action.type) {
    case FETCH_USER:
      // 如果用户没有登录，返回 false；如果用户登录，返回用户 id；如果一脸懵逼，返回 null（初始值）
      // 如果 action.payload 是空字符串，就返回 false
      return action.payload || false;
    default:
      return state;
  }
};