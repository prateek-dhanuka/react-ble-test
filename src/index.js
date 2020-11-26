import { BleManager } from "react-native-ble-plx";
import BleManagerContext from "./core/BleManagerContext";
import DeviceListScreen from "./screens/DeviceListScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import ServicesListScreen from "./screens/ServicesListScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Main = () => {
  const [bleManager, setManager] = React.useState(new BleManager());

  return (
    <BleManagerContext.Provider value={bleManager}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="device-list">
          <Stack.Screen
            name="device-list"
            component={DeviceListScreen}
            options={{ title: "Devices" }}
          />
          <Stack.Screen
            name="services"
            component={ServicesListScreen}
            options={{ title: "Services" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </BleManagerContext.Provider>
  );
};

export default Main;
