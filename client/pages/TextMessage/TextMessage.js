import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Input from "../../components/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

function TextMessage({ route }) {
  const [message, setMessage] = useState("");
  const { userId, firstname, lastname } = route.params;
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <View style={styles.messageUserTitle}>
          <Ionicons
            name="arrow-back"
            size={35}
            color={"#FFF"}
            onPress={() => navigation.goBack()}
          />
          <Text style={{ color: "#FFF", fontSize: 20, fontWeight: "700" }}>
            {firstname} {lastname}
          </Text>
        </View>
        <View style={{ flex: 1 }}>{/* Mesajların görüntüleneceği yer */}</View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 34,
            alignItems: "center",
            marginBottom: 10, 
          }}
        >
          <Input
            placeholder={"Text Message"}
            borderWidth={1}
            borderRadius={25}
            padding={12}
            borderColor={"#635A8F"}
            placeholderTextColor={"#FFF"}
            color={"#FFF"}
            flex={1}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  messageUserTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#635A8F",
    padding: 15,
  },
});
export default TextMessage;
