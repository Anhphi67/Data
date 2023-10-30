import { SET_CURRENCY } from "../actions/currencyActions";

const initState = {
  currencySymbol: "đ",
  currencyName: "VND",
  currencyRate: 1
};

const currencyReducer = (state = initState, action) => {
  if (action.type === SET_CURRENCY) {
    const currencyName = action.payload.currencyName;
    if (currencyName === "VND") {
      return {
        ...state,
        currencySymbol: "đ",
        currencyRate: action.payload.currencyRate,
        currencyName
      };
    }
    if (currencyName === "USD") {
      return {
        ...state,
        currencySymbol: "đ",
        currencyRate: action.payload.currencyRate,
        currencyName
      };
    }
    if (currencyName === "EUR") {
      return {
        ...state,
        currencySymbol: "đ",
        currencyRate: action.payload.currencyRate,
        currencyName
      };
    }
    if (currencyName === "GBP") {
      return {
        ...state,
        currencySymbol: "đ",
        currencyRate: action.payload.currencyRate,
        currencyName
      };
    }
  }

  return state;
};

export default currencyReducer;
