
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";


import store from './store';



ReactDOM.render(
  <BrowserRouter store={store}>
    <ScrollToTop />
    <HomePage />
  </BrowserRouter>,
  document.getElementById("root")
);
