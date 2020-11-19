import App from "./src";
import { Provider } from "react-native-paper";
import React from "react";
import theme from "./src/core/theme";

const Main = () => {
  return (
    <Provider theme={theme}>
      <App />
    </Provider>
  );
};

export default Main;
