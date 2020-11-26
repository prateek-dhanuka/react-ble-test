import { BleManager } from "react-native-ble-plx";
import BleManagerContext from "../core/BleManagerContext";
import { List } from "react-native-paper";
import React from "react";
import { Text } from "react-native";

const ServicesListScreen = ({ route }) => {
  // BLE Manager for performing tasks
  const bleManager = React.useContext(BleManagerContext);

  // List of Services
  const [services, setServices] = React.useState({});

  React.useEffect(() => {
    async function getServices() {
      const devices = await bleManager.devices([route.params]);
      if (devices.length > 0) {
        let device = devices[0];
        device = await device.discoverAllServicesAndCharacteristics();
        const receivedServices = await device.services();

        const overallServices = {};
        for (let i = 0; i < receivedServices.length; ++i) {
					const char = service.characteristics();
					overallServices[service.uuid] = char.uuid;
				}
        setServices(overallServices);
      } else {
        console.log("No devices found!");
      }
    }
    getServices();
    // serviceList = await devices.services();
    // setServices(serviceList);
    // console.log("Got services = ", serviceList);
  }, []);

  return Object.keys(services).map((service) => (
    <List.Accordion title={service}>
      {services[service].map((char) => (
        <List.Item title={char} />
      ))}
    </List.Accordion>
  ));
};

export default ServicesListScreen;
