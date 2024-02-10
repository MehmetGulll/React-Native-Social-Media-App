import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Input from "../../components/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalContext } from "../../Context/GlobalStates";
import axios from "axios";
import { apihost } from "../../API/url";

function TextMessage({ route }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { userId, firstname, lastname } = route.params;
  const { currentUserId } = useContext(GlobalContext);
  const navigation = useNavigation();
  useEffect(() => {
    console.log(userId);
    const fetchMessages = async () => {
      const response = await axios.get(`${apihost}/getMessages`, {
        params: { userId },
      });
      setMessages(response.data);
      console.log(response.data);
    };
    fetchMessages();
  }, []);
  const sendMessage = async () => {
    console.log("Yollamaya çalışıyorum");
    const response = await axios.post(`${apihost}/sendMessage`, {
      sender: currentUserId,
      receiver: userId,
      content: message,
    });
    setMessage("");
    setMessages([...messages, response.data]); 
  };

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
        <View style={{ flex: 1 }}>
          <FlatList
            data={messages}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => <Text>{item.content}</Text>}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 15,
            backgroundColor: "#4D426C",
            padding: 15,
          }}
        >
          <View style={{ flexDirection: "row", marginHorizontal: 15, gap: 15 }}>
            <Input
              placeholder={"Text Message"}
              borderWidth={1}
              borderRadius={25}
              padding={12}
              borderColor={"#635A8F"}
              placeholderTextColor={"#FFF"}
              color={"#FFF"}
              flex={1}
              onChangeText={(text) => setMessage(text)}
              value={message}
            />
            <View
              style={{
                borderWidth: 1,
                borderColor: "#635A8F",
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="send"
                size={24}
                color={"#FFF"}
                onPress={sendMessage}
              />
            </View>
          </View>
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
    backgroundColor: "#4D426C",
    padding: 15,
  },
});
export default TextMessage;
