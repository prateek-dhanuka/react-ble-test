import { Button, Divider, List } from "react-native-paper";
import { PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { BleManager } from "react-native-ble-plx";
import React from "react";
import theme from "../core/theme";

const DeviceListScreen = ({ route, navigation }) => {
  // BLE Manager for performing tasks
  const [bleManager, setManager] = React.useState(new BleManager());

  // Whether currently scanning or not
  const [scanning, setScanning] = React.useState(false);

  // A list of all discovered devices. Device count is only to force a re-render.
  const devices = React.useRef([]);
  const [deviceCount, setDeviceCount] = React.useState(0);

  // Currently selected device
  const [selectedDevice, SelectDevice] = React.useState({ id: null });

  // Callback to start and stop scanning
  const scan = () => {
    if (!scanning) {
      setScanning(true);

      bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, newDevice) => {
        const deviceIndex = devices.current.findIndex((device) => device.id === newDevice.id);

        // If a device is rediscovered, update its rssi
        if (deviceIndex === -1) {
          devices.current.push(newDevice);
          setDeviceCount(deviceCount + 1);
        } else {
          devices.current[deviceIndex].rssi = newDevice.rssi;
          setDeviceCount(deviceCount);
        }
      });
    } else {
      setScanning(false);

      bleManager.stopDeviceScan();
    }
  };

  // callback to connect to the selected Device
  const connect = React.useCallback(() => {
    // console.log(`Trying to connect to ${selectedDevice.name}(${selectedDevice.id}). All details: `);
    // console.log(selectedDevice);
    selectedDevice
      .connect({ timeout: 1000 })
      .then((device) => {
        // console.log("Device = ", device);
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        // console.log("Device = ", device);
        return device.services();
      })
      .then((services) => {
        console.log(services);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedDevice]);

  // Set the scan button
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Button onPress={scan}>{scanning ? "Stop Scan" : "Scan"}</Button>
          <Button onPress={connect}>Connect</Button>
        </View>
      ),
    });
  }, [scanning, connect]);

  // Make sure we have permissions to use BLE
  React.useEffect(() => {
    if (Platform.OS === "android") {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`Permission granted`);
      }
    }
  }, []);

  return (
    <ScrollView>
      {devices.current.map((device) => (
        <React.Fragment key={device.id}>
          <List.Item
            title={device.name ? device.name : "null"}
            titleStyle={{
              color: device.id === selectedDevice.id ? theme.colors.accent : theme.colors.text,
            }}
            description={device.id}
            descriptionStyle={{
              color: device.id === selectedDevice.id ? theme.colors.accent : theme.colors.text,
            }}
            left={(props) => (
              <List.Icon
                style={props.style}
                color={device.id === selectedDevice.id ? theme.colors.accent : props.color}
                icon="bluetooth"
              />
            )}
            right={() => (
              <Text
                style={{
                  color: device.id === selectedDevice.id ? theme.colors.accent : theme.colors.text,
                  alignSelf: "center",
                  fontSize: 16,
                }}
              >
                {device.rssi}
              </Text>
            )}
            style={
              device.id === selectedDevice.id ? { backgroundColor: theme.colors.primary } : null
            }
            onPress={() => SelectDevice(device)}
          />
          <Divider />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default DeviceListScreen;
