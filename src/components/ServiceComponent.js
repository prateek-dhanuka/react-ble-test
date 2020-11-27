import { Divider, TouchableRipple, useTheme } from "react-native-paper";
import { StyleSheet, Text } from "react-native";

import React from "react";

const ServiceComponent = ({ service, children }) => {
  const [expanded, setExpanded] = React.useState(false);

  const { colors } = useTheme();

  return (
    <>
      <TouchableRipple
        style={[styles.container, { backgroundColor: colors.background }]}
        onPress={() => setExpanded(!expanded)}
      >
        <Text>{service.uuid}</Text>
      </TouchableRipple>
      <Divider style={{ backgroundColor: "black" }} />
      {expanded ? (
        <>
          {children}
          <Divider style={{ backgroundColor: "black" }} />
        </>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    minHeight: 60,
    alignSelf: "stretch",
    justifyContent: "center",
  },
});

export default ServiceComponent;
