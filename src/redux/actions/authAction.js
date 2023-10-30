
import AuthService from "../../services/auth.service";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
  
  export const register = (data,toast) => (dispatch) => {
    return AuthService.register(data).then(
      (response) => {
        toast.success('Register successful', {
        });
        dispatch({
          type: REGISTER_SUCCESS,
          payload: response.data,
        });
        return Promise.resolve();
      }
    ).catch(
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.errors) ||
          error.message ||
          error.toString();
        
        toast.error(message, {
        });
  
        dispatch({
          type: REGISTER_FAIL,
        });
       
        return Promise.reject();
      }
    );
  };
  
  export const login = (email, password,toast) => (dispatch) => {
    return AuthService.login(email, password).then(
      (data) => {
        toast.success('Login successful', {
        });
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data.data,
        });
        return Promise.resolve();
      }
    ).catch(
      (error) => {
        console.log(error)
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.errors) ||
          error.message ||
          error.toString();
  
        toast.error(message, {
        });
        dispatch({
          type: LOGIN_FAIL,
        });
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
      type: LOGOUT,
    });
  };