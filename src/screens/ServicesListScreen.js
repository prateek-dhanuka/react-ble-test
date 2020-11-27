import BleManagerContext from "../core/BleManagerContext";
import { List } from "react-native-paper";
import React from "react";
import { ScrollView } from "react-native";
import ServiceComponent from "../components/ServiceComponent";

const ServicesListScreen = ({ route }) => {
  // BLE Manager for performing tasks
  const bleManager = React.useContext(BleManagerContext);

  // List of Services
  const [services, setServices] = React.useState([]);
  const [chars, setChars] = React.useState({});

  React.useEffect(() => {
    async function getServices() {
      const devices = await bleManager.devices([route.params]);
      if (devices.length > 0) {
        let device = devices[0];
        device = await device.discoverAllServicesAndCharacteristics();
        const receivedServices = await device.services();

        const charObj = {};
        for (let i = 0; i < receivedServices.length; ++i) {
          const char = await receivedServices[i].characteristics();
          charObj[receivedServices[i].uuid] = char;
        }
        setChars(charObj);
        setServices(receivedServices);
      } else {
        console.log("No devices found!");
      }
    }
    getServices();
  }, []);

  return (
    <ScrollView>
      {services.map((service) => {
        console.log(`All chars = `, chars);
        console.log(`Particular = `, chars[service.uuid]);
        return (
          <ServiceComponent service={service} key={service.uuid}>
            {chars[service.uuid].map((char) => (
              <List.Item title={char.uuid} key={char.uuid} />
            ))}
          </ServiceComponent>
        );
      })}
    </ScrollView>
  );
};

export default ServicesListScreen;
