import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import Input from "../../components/Input";
import { LinearGradient } from "expo-linear-gradient";
import Checkbox from "expo-checkbox";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios'
import { apihost } from "../../API/url";
import { GlobalContext } from "../../Context/GlobalStates";

function Login() {
  const navigation = useNavigation();
  const {setUsername,setCurrentUserId} = useContext(GlobalContext);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [rememberChecked, setRememberChecked] = useState(false);
  const handleLogin = async()=>{
    try {
      const response = await axios.post(`${apihost}/login`,{
        email:email,
        password:password
      })
      console.log(response.data);
      console.log(response.data.username);
      console.log(response.data.currentId);
      setUsername(response.data.username);
      setCurrentUserId(response.data.currentId);

      if(response.data.message==="Giriş Başarılı"){
        navigation.navigate("Home");
      }else{
        Alert.alert("Hata",response.data.error)
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log("Error",error);
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
        style={{ flex: 1 }}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/Ciao.png")}
            width={560}
            height={12}
          />
        </View>
        <View style={styles.formContainer}>
          <View style={{ marginLeft: 32 }}>
            <Text style={{ color: "#FFF", fontSize: 30, fontWeight: "700" }}>
              Sign in
            </Text>
          </View>
          <View style={styles.inputsContainer}>
            <Input
              placeholder={"Email/Phone Number"}
              borderWidth={1}
              borderColor={"#FFF"}
              placeholderTextColor={"#FFF"}
              onChangeText={(text)=>setEmail(text)}
              padding={15}
              borderRadius={25}
              color={"#FFF"}
            />
            <Input
              placeholder={"Password"}
              borderWidth={1}
              borderColor={"#FFF"}
              placeholderTextColor={"#FFF"}
              onChangeText={(text)=>setPassword(text)}
              padding={15}
              borderRadius={25}
              color={"#fff"}
              secureTextEntry={true}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Checkbox
                  color={"#FFF"}
                  value={rememberChecked}
                  onValueChange={setRememberChecked}
                />
                <Text
                  style={{
                    marginLeft: 15,
                    fontWeight: "500",
                    fontSize: 17,
                    color: "#FFF",
                  }}
                >
                  Remember Me
                </Text>
              </View>
              <TouchableOpacity>
                <Text
                  style={{ fontSize: 17, color: "#3B21B2", fontWeight: "500" }}
                >
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <Button
                text={"Sign in"}
                backgroundColor={"#635A8F"}
                onPress={handleLogin}
                color={"#FFF"}
                padding={15}
              />
            </View>
            <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style = {{color:'#FFF',fontSize:17,fontWeight:'500'}}>Don't have an account?</Text>
                <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
                <Text style = {{fontSize:17, color:"#3B21B2",fontWeight:'500'}}> Sign Up</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    marginBottom:90
  },
  inputsContainer: {
    marginHorizontal: 32,
    marginTop: 36,
    flexDirection: "column",
    gap: 19,
  },
});

export default Login;
