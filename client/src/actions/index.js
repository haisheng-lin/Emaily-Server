import axios from 'axios';
import { FETCH_USER } from './types';

// redux-thunk 相当于一个中间件，它可以不会马上返回 action，而是做一些动作
// if what we return is function，redux-thunk will automatically call the dispatch function
// then send to all reducers
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};