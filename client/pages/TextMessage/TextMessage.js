import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import Input from "../../components/Input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalContext } from "../../Context/GlobalStates";
import axios from "axios";
import { apihost } from "../../API/url";

function TextMessage({ route }) {
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userId, firstname, lastname } = route.params;
  const { currentUserId } = useContext(GlobalContext);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(userId);
        console.log(currentUserId);
        const response = await axios.get(`${apihost}/getMessages`, {
          params: { userId: currentUserId, otherUserId: userId },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.log(" Bu Error", error);
      }
    };
    fetchMessages();
    loadMoreMessages();
  }, []);
  const sendMessage = async () => {
    console.log("Yollamaya çalışıyorum");
    const response = await axios.post(`${apihost}/sendMessage`, {
      sender: currentUserId,
      receiver: userId,
      text: message,
    });
    setMessage("");
    setMessages((prevMessages) => [...prevMessages, response.data]);
  };

  const loadMoreMessages = async () => {
    try {
      const response = await axios.get(`${apihost}/getMessages`, {
        userId: currentUserId,
        otherUserId: userId,
        page: page,
        limit: 20,
      });
      if (response.data.messages.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          ...response.data.messages,
        ]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const reservedMessages = [...messages].reverse();

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
          <ImageBackground
            source={require("../../assets/messageContainerBackground.png")}
            style={{ width: "100%", height: "100%" }}
          >
          <FlatList
            data={reservedMessages}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={({ item }) => (
              <View
                style={{
                  alignSelf:
                    item.sender === currentUserId ? "flex-end" : "flex-start",
                  backgroundColor:
                    item.sender === currentUserId ? "#635A8F" : "#635A8F",
                  padding: 20,
                  marginVertical: 15,
                  borderRadius: 25,
                }}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            inverted
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5}
          />
          </ImageBackground>
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
              value={Array.isArray(message) ? message.join("") : message}
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
  messageText: {
    color: "#FFF",
    fontSize: 18,
    maxWidth: "80%",
    flexWrap: "wrap",
  },
});
export default TextMessage;
