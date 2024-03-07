import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import Button from "../../components/Button";

function ForgotPassword() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
        style={{ flex: 1 }}
      >
        <View style={styles.notificationsContainer}>
          <View>
            <Ionicons
              name="arrow-back"
              size={35}
              style={{ color: "#FFF" }}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                color: "#FFF",
                fontSize: 30,
                fontWeight: "700",
                marginTop: 10,
              }}
            >
              Forgot Password?
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 32 }}>
          <Input
            placeholder={"Enter your email address"}
            borderWidth={1}
            borderColor={"#FFF"}
            placeholderTextColor={"#FFF"}
            padding={15}
            borderRadius={25}
            color={"#fff"}
          />
        </View>
        <View style = {{marginHorizontal:32, marginTop:30}}>
          <Button
            text={"Recover Password"}
            backgroundColor={"#635A8F"}
            color={"#FFF"}
            borderRadius={25}
            fontSize={22}
            padding={15}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationsContainer: {
    padding: 15,
  },
});
export default ForgotPassword;
