import { Button, Divider, List } from "react-native-paper";
import { PermissionsAndroid, Platform, ScrollView, Text, View } from "react-native";

import BleManagerContext from '../core/BleManagerContext'
import React from "react";
import theme from "../core/theme";

const DeviceListScreen = ({ navigation }) => {
  // BLE Manager for performing tasks
  bleManager = React.useContext(BleManagerContext);

  // Whether currently scanning or not
  const [scanning, setScanning] = React.useState(false);

  // A list of all discovered devices. Device count is only to force a re-render.
  const devices = React.useRef([]);
  const [deviceCount, setDeviceCount] = React.useState(0);

  // Currently selected device
  const [selectedDevice, SelectDevice] = React.useState({ id: null });

  // Functions to start and stop scans
  const startScan = (callback) => {
    if (!scanning) {
      setScanning(true);
      bleManager.startDeviceScan(null, { allowDuplicates: false }, callback);
    }
  };

  const stopScan = () => {
    if (scanning) {
      setScanning(false);
      bleManager.stopDeviceScan();
    }
  };

  // Callback to start and stop scanning
  const scan = () => {
    if (!scanning) {
      startScan((error, newDevice) => {
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
      stopScan();
    }
  };

  // callback to connect to the selected Device
  const connect = React.useCallback(() => {
    stopScan();

    selectedDevice
      .connect({ timeout: 1000 })
      .then((device) => {
        return device.discoverAllServicesAndCharacteristics();
      })
      .then((device) => {
        navigation.navigate("services", device.id);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedDevice]);

  // Set the scan and connect buttons
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

export default DeviceListScreen;
