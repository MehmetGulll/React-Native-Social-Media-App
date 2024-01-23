import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Checkbox from "expo-checkbox";
import axios from "axios";
import { apihost } from "../../API/url";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [agreeChecked, setAgreeChecked] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (firstName.length < 3 || lastName.length < 3) {
      Alert.alert("Uyarı", "İsim ve Soyisminiz 3 harften fazla olmalı", [
        { text: "Tamam", style: "cancel" },
      ]);
    } else {
      try {
        const checkResponse = await axios.get(`${apihost}/checkEmail`, {
          params: {
            email: email,
          },
        });
        if (checkResponse.data.exists) {
          Alert.alert(
            "Uyarı",
            "Bu e-postaya kayıtlı bir hesap zaten bulunmakta",
            [{ text: "Tamam", style: "cancel" }]
          );
        } else {
          const response = await axios.post(`${apihost}/signup`, {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
            gender: selectedGender,
          });
          console.log(response.data);
         
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
        style={{ flex: 1 }}
      >
        <View style={{ marginTop: 65, marginLeft: 32 }}>
          <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 30 }}>
            Sign Up
          </Text>
        </View>
        <View style={styles.inputsContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 36,
            }}
          >
            <Input
              placeholder={"First Name"}
              borderWidth={1}
              placeholderTextColor={"#FFF"}
              onChangeText={(text) => setFirstName(text)}
              padding={15}
              borderRadius={25}
              borderColor={"#FFF"}
              paddingHorizontal={40}
              color={"#FFF"}
            />
            <Input
              placeholder={"Last Name"}
              borderWidth={1}
              placeholderTextColor={"#FFF"}
              onChangeText={(text) => setLastName(text)}
              padding={15}
              borderRadius={25}
              borderColor={"#FFF"}
              paddingHorizontal={40}
              color={"#FFF"}
            />
          </View>
          <Input
            placeholder={"Email/Phone Number"}
            borderWidth={1}
            placeholderTextColor={"#FFF"}
            onChangeText={(text) => setEmail(text)}
            padding={15}
            borderRadius={25}
            borderColor={"#FFF"}
            color={"#FFF"}
          />
          <Input
            placeholder={"Password"}
            secureTextEntry={true}
            borderWidth={1}
            placeholderTextColor={"#FFF"}
            onChangeText={(text) => setPassword(text)}
            padding={15}
            borderRadius={25}
            borderColor={"#FFF"}
            color={"#FFF"}
          />
          <Input
            placeholder={"Confirm Password"}
            secureTextEntry={true}
            borderWidth={1}
            placeholderTextColor={"#FFF"}
            padding={15}
            borderRadius={25}
            borderColor={"#FFF"}
            color={"#FFF"}
          />
          <Text style={{ color: "#FFF", fontSize: 17, fontWeight: "500" }}>
            Gender
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 31,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedGender("male")}
              style={[
                styles.genderItem,
                selectedGender === "male" && { borderWidth: 0 },
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  selectedGender === "male" && { color: "#000" },
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedGender("female")}
              style={[
                styles.genderItem,
                selectedGender === "female" && { borderWidth: 0 },
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  selectedGender === "female" && { color: "#000" },
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Checkbox
              color={"#FFF"}
              value={agreeChecked}
              onValueChange={setAgreeChecked}
            />
            <Text
              style={{
                fontSize: 17,
                color: "#FFF",
                fontWeight: "500",
                marginLeft: 11,
              }}
            >
              I Agree with privacy and policy
            </Text>
          </View>
          <View>
            <Button
              text={"Sign up"}
              backgroundColor={"#635A8F"}
              color={"#FFF"}
              padding={15}
              onPress={handleSignUp}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#FFF", fontSize: 17, fontWeight: "500" }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={{ fontSize: 17, color: "#3B21B2", fontWeight: "500" }}
              >
                {" "}
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    flexDirection: "column",
    marginHorizontal: 32,
    gap: 20,
  },
  genderItem: {
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#FFF",
    padding: 15,
    borderRadius: 25,
    flex: 1,
  },
  genderText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#FFF",
  },
});
export default SignUp;
