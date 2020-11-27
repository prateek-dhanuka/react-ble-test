import { Button, Divider, List } from "react-native-paper";
import { PermissionsAndroid, Platform, ScrollView } from "react-native";

import BleManagerContext from "../core/BleManagerContext";
import React from "react";

const DeviceListScreen = ({ navigation }) => {
  // BLE Manager for performing tasks
  bleManager = React.useContext(BleManagerContext);

  // Whether currently scanning or not
  const [scanning, setScanning] = React.useState(false);

  // A list of all discovered devices. Device count is only to force a re-render.
  const devices = React.useRef([]);
  const [deviceCount, setDeviceCount] = React.useState(0);

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
        if (error) {
          console.error(error);
          return;
        }

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

  // callback to connect to the Device
  const connect = (device) => {
    stopScan();

    device
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
  };

  // Set the scan and connect buttons
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={scan}>{scanning ? "Stop Scan" : "Scan"}</Button>,
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
      {devices.current.map((device) => {
        return (
          <React.Fragment key={device.id}>
            <List.Item
              title={device.name ? device.name : "null"}
              description={device.id}
              left={(props) => <List.Icon style={props.style} icon="bluetooth" />}
              right={() => <Button onPress={() => connect(device)}>Connect</Button>}
            />
            <Divider />
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
};

export default DeviceListScreen;
