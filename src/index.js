import DeviceListScreen from "./screens/DeviceListScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="device-list">
        <Stack.Screen
          name="device-list"
          component={DeviceListScreen}
          options={{ title: "Devices" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
