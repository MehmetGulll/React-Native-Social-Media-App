import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import { apihost } from "../../API/url";
import axios from 'axios'

function RequestMessage() {
  const [requestMessages, setRequestMessages] = useState([]);
  const { currentUserId } = useContext(GlobalContext);
  useEffect(() => {
    const loadRequestMessages = async () => {
      try {
        const response = await axios.get(
          `${apihost}/getRequestMessages?userId=${currentUserId}`
        );
        console.log(response.data);
        setRequestMessages(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    loadRequestMessages();
  }, []);
  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <View>
        <FlatList
          data={requestMessages}
          renderItem={({ item }) => (
            <View>
              <Text>Sender: {item.sender}</Text>
              <Text>Message: {item.content}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </LinearGradient>
  );
}

export default RequestMessage;
