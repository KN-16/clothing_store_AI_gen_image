import axios from 'axios';

const authService = {
  login: (email, password) => {
    return axios.post('/api/login', { email, password });
  },
};

export default authService;