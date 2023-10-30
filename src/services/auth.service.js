import axios from "axios";
import config from '../config'
const API_URL = config.API;
class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "AuthManagement/Login", { email, password })
      .then((response) => {
        return response;
      });
  }
  logout() {
  }
  register(data) {
    return axios.post(API_URL + "AuthManagement/Register", data).then((response) => {
      return response;
    });;
  }
}

export default new AuthService();