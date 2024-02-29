import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Input from "../../components/Input";
import { apihost } from "../../API/url";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Messages() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [messageSendUsers, setMessageSendUsers] = useState([]);
  const { currentUserId, blockedUsers, following, setFollowing } =
    useContext(GlobalContext);
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const getFollowing = async () => {
        if (!hasMore) {
          return;
        }
        setLoading(true);
        try {
          const response = await axios.post(`${apihost}/getFollowing`, {
            userId: currentUserId,
            page: page,
          });
          setFollowing([]);
          setFollowing((oldFollowing) => [
            ...oldFollowing,
            ...(response.data.following || []),
          ]);

          setHasMore(response.data.hasMore);
          setPage(page + 1);
          setLoading(false);
        } catch (error) {
          console.log("Error", error);
        }
      };
      const loadMessageSendUsers = async () => {
        setMessageSendUsers([]);
        try {
          const response = await axios.get(`${apihost}/getRecentChat`, {
            params: { userId: currentUserId },
          });
          const nonBlockedUsers = response.data.filter(
            (user) => !blockedUsers.includes(user._id)
          );
          console.log(nonBlockedUsers);
          setMessageSendUsers((oldUsers) => [...oldUsers, ...nonBlockedUsers]);
        } catch (error) {
          console.log("Bu error Error", error);
        }
      };
      loadMessageSendUsers();
      getFollowing();
    }, [blockedUsers])
  );

  const handleSendMessage = async (userId, firstname, lastname) => {
    navigation.navigate("TextMessage", {
      userId: userId,
      firstname: firstname,
      lastname: lastname,
    });

    const newUser = { userId, firstname, lastname };
    let updatedUsers = [...messageSendUsers];

    const userExists = updatedUsers.some((user) => user.userId === userId);

    if (!userExists) {
      updatedUsers.push(newUser);
      setMessageSendUsers(updatedUsers);
      AsyncStorage.setItem("messageSendUsers", JSON.stringify(updatedUsers));
    }

    try {
      const response = await axios.post(`${apihost}/storeRecentChat`, {
        userId: currentUserId,
        recentChats: updatedUsers,
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 34,
            alignItems: "center",
          }}
        >
          <Input
            placeholder={"Search"}
            borderWidth={1}
            borderRadius={25}
            padding={12}
            borderColor={"#635A8F"}
            placeholderTextColor={"#FFF"}
            color={"#FFF"}
            flex={1}
          />
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            marginHorizontal: 15,
            borderColor: "#FFF",
          }}
        >
          <FlatList
            horizontal
            data={following}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handleSendMessage(
                    item.followee._id,
                    item.followee.firstname,
                    item.followee.lastname
                  )
                }
                style={styles.followingUsers}
              >
                <Image
                  source={
                    item.followee.profileImage
                      ? {
                          uri: `data:image/gif;base64,${item.followee.profileImage}`,
                        }
                      : require("../../assets/profileimage.png")
                  }
                  width={75}
                  height={75}
                  borderRadius={75}
                />
                <Text style={styles.followingUserName}>
                  {item.followee.firstname}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginTop: 10,
            marginRight: 10,
            borderBottomWidth: 1,
            borderColor: "#FFF",
            padding: 5,
          }}
          onPress={() => navigation.navigate("RequestMessages")}
        >
          <Text>Request Message</Text>
        </TouchableOpacity>
        <View>
          {messageSendUsers.map((user, index) => (
            <TouchableOpacity
              style={styles.lastMessageContainer}
              key={index}
              onPress={() =>
                navigation.navigate("TextMessage", {
                  userId: user.userId._id,
                  firstname: user.firstname,
                  lastname: user.lastname,
                })
              }
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 15,
                  }}
                >
                  <Image
                    source={
                      user.userId.profileImage
                        ? {
                            uri: `data:image/gif;base64,${user.userId.profileImage}`,
                          }
                        : require("../../assets/profileimage.png")
                    }
                    width={50}
                    height={50}
                    borderRadius={50}
                  />

                  <Text style={styles.lastMessageUser}>
                    {user.firstname} {user.lastname}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  followingUsers: {
    flexDirection: "column",
    alignItems: "center",
    margin: 15,
  },
  followingUserName: {
    color: "#FFF",
    marginTop: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  lastMessageContainer: {
    borderBottomWidth: 1,
    marginTop: 15,
    borderColor: "#FFF",
  },
  lastMessageUser: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "500",
    padding: 30,
  },
});
export default Messages;
