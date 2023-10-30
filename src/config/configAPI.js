import axios from 'axios';
import config from '../config';
import store from '../store'; 

const state = store.getState();
const token = state.user.token;
const instance = axios.create({
    baseURL: config.API,
    headers: { 'Authorization': 'Bearer ' + token }
});

export default instance;