import React, { useState, useEffect, useContext,useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import { useNavigation,useFocusEffect } from "@react-navigation/native";
import Input from "../../components/Input";
import { apihost } from "../../API/url";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Messages() {
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [messageSendUsers, setMessageSendUsers] = useState([]);
  const { currentUserId } = useContext(GlobalContext);
  const navigation = useNavigation();

  // useEffect(() => {
  //   const getFollowing = async () => {
  //     if (!hasMore) {
  //       return;
  //     }
  //     setLoading(true);
  //     try {
  //       const response = await axios.post(`${apihost}/getFollowing`, {
  //         userId: currentUserId,
  //         page: page,
  //       });
  //       setFollowing((oldFollowing) => [
  //         ...oldFollowing,
  //         ...response.data.following,
  //       ]);
  //       setHasMore(response.data.hasMore);
  //       setPage(page + 1);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log("Error", error);
  //     }
  //   };
  //   const loadMessageSendUsers = async () => {
  //     const storedUsers = await AsyncStorage.getItem("messageSendUsers");
  //     if (storedUsers) {
  //       setMessageSendUsers(JSON.parse(storedUsers));
  //     }
  //     setLoadingUsers(false);
  //   };
  //   loadMessageSendUsers();
  //   getFollowing();
  // }, []);
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
          // following durumunu sıfırla
          setFollowing([]);
          setFollowing((oldFollowing) => [
            ...oldFollowing,
            ...response.data.following,
          ]);
          setHasMore(response.data.hasMore);
          setPage(page + 1);
          setLoading(false);
        } catch (error) {
          console.log("Error", error);
        }
      };
      const loadMessageSendUsers = async () => {
        const storedUsers = await AsyncStorage.getItem("messageSendUsers");
        if (storedUsers) {
          setMessageSendUsers(JSON.parse(storedUsers));
        }
        setLoadingUsers(false);
      };
      loadMessageSendUsers();
      getFollowing();
    }, [])
  );
  

  if (loadingUsers) {
    return <ActivityIndicator />;
  }

  const handleSendMessage = (userId, firstname, lastname) => {
    navigation.navigate("TextMessage", {
      userId: userId,
      firstname: firstname,
      lastname: lastname,
    });
  
    const newUser = { userId, firstname, lastname };
    setMessageSendUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      AsyncStorage.setItem("messageSendUsers", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };
  

  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <View>
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
            keyExtractor={(item,index) => index.toString()}
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
                  source={require("../../assets/profileimage.png")}
                  width={50}
                  height={50}
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
            marginRight:10
          }}
          onPress={()=>navigation.navigate("RequestMessages")}
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
                  userId: user.userId,
                  firstname: user.firstname,
                  lastname: user.lastname,
                })
              }
            >
              <View>
                <Text style={styles.lastMessageUser}>
                  {user.firstname} {user.lastname}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    backgroundColor: "#635A8F",
    marginTop: 15,
  },
  lastMessageUser: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "500",
    padding: 30,
  },
});
export default Messages;
