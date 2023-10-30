import { REGISTER_SUCCESS,LOGIN_SUCCESS,LOGOUT} from "../actions/authAction";
const initState = {
  user: {},
  token:""
};
const authReducer = (state=initState, action) => {
  if (action.type === LOGIN_SUCCESS || action.type === REGISTER_SUCCESS) {
      return {
        user: action.payload.user,
        token:action.payload.token,
      };
  }
  if (action.type === LOGOUT) {
    return {
      user: {},
      token:"",
    };
}
  return state;
};

export default authReducer;
