import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import { apihost } from "../../API/url";
import axios from "axios";

function Messages() {
  const [following, setFollowing] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { currentUserId } = useContext(GlobalContext);
  const navigation = useNavigation();

  useEffect(() => {
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
        setFollowing((oldFollowing) => [
          ...oldFollowing,
          ...response.data.following,
        ]);
        setHasMore(response.data.hasMore);
        setPage(page + 1);
        setLoading(false);
        console.log(response.data.following);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getFollowing();
  }, []);

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
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TextMessage", {
                    userId: item.followee._id,
                    firstname: item.followee.firstname,
                    lastname: item.followee.lastname,
                  })
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
          />
        </View>
        <View></View>
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
});
export default Messages;
