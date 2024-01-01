import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import Input from "../../components/Input";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { GlobalContext } from "../../Context/GlobalStates";
import { useNavigation } from "@react-navigation/native";
import { apihost } from "../../API/url";

function Home() {
  const [searchUsers, setSearchUsers] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const navigation = useNavigation();
  const { currentUserId } = useContext(GlobalContext);

  const Wait = (duration = 1000) => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    Wait(2000).then(() => setRefresh(false));
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.post(`${apihost}/getFollowedUsersPosts`, {
          userId: currentUserId,
        });
        setPosts(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getPosts();
  }, []);

  const searchUser = async (text) => {
    setSearchUsers(text);
    if (text.length >= 3) {
      try {
        const response = await axios.get(`${apihost}/searchUser/${text}`);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      setUsers([]);
    }
  };
  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts[postId];
      const response = isLiked
        ? await axios.post(`${apihost}/posts/${postId}/unlike`, { userId: currentUserId })
        : await axios.post(`${apihost}/posts/${postId}/like`, { userId: currentUserId });

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setLikedPosts((prevState) => ({ ...prevState, [postId]: !isLiked }));
    } catch (error) {
      console.error("Error while liking/unliking post", error);
    }
  };

  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 34,
            alignItems: "center",
          }}
        >
          <Input
            placeholder={"Explore"}
            borderWidth={1}
            borderRadius={25}
            padding={12}
            borderColor={"#635A8F"}
            placeholderTextColor={"#FFF"}
            onChangeText={searchUser}
            color={"#FFF"}
            flex={1}
          />

          <Image
            source={require("../../assets/Vector.png")}
            width={33}
            height={33}
            style={{ marginLeft: 19 }}
          />
        </View>
        {users.length > 0 && (
          <View style={styles.resultContainer}>
            {users.map((user) => (
              <TouchableOpacity
                key={user._id}
                onPress={() =>
                  navigation.navigate("ProfileNavigator", {
                    screen: "UserProfile",
                    params: {
                      username: user.firstname + " " + user.lastname,
                      userId: user._id,
                    },
                  })
                }
              >
                <Text>
                  {user.firstname} {user.lastname}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <FlatList
          contentContainerStyle={{ marginBottom: 150 }}
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const date = new Date(item.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return (
              <View
                style={{
                  backgroundColor: "#6D4ACD",
                  marginHorizontal: 34,
                  borderRadius: 20,
                  marginTop: 23,
                }}
              >
                <View style={{ marginTop: 14, marginHorizontal: 10 }}>
                  <View>
                    <Text
                      style={{ fontSize: 15, fontWeight: "500", color: "#FFF" }}
                    >
                      {item.username}
                    </Text>
                    <Text
                      style={{ fontSize: 12, fontWeight: "500", color: "#FFF" }}
                    >
                      {diffDays > 1
                        ? `${diffDays} gün önce gönderildi`
                        : "Bugün gönderildi"}
                    </Text>
                  </View>

                  <View style={{ justifyContent: "center", marginTop: 6 }}>
                    <Image
                      source={{
                        uri: `data:image/jpeg;base64,${item.content}`,
                      }}
                      width={307}
                      height={210}
                      borderRadius={20}
                      style={{ marginTop: 10 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 11,
                      marginBottom: 14,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity onPress={() => handleLike(item._id)}>
                        <Image
                          source={require("../../assets/heart.png")}
                          width={24}
                          height={24}
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          color: "#E5D7F7",
                          fontSize: 13,
                          fontWeight: "500",
                          marginLeft: 2,
                        }}
                      >
                        {item.likes.length}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 12,
                      }}
                    >
                      <Image
                        source={require("../../assets/icons.png")}
                        width={24}
                        height={24}
                      />
                      <Text
                        style={{
                          color: "#E5D7F7",
                          fontSize: 13,
                          fontWeight: "500",
                          marginLeft: 2,
                        }}
                      >
                        320
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  storysContainer: {
    marginTop: 31,
    marginLeft: 36,
    flexDirection: "row",
  },
  storyContainer: {
    alignItems: "center",
    flexDirection: "column",
    gap: 4,
  },
  storyImage: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 59,
  },
  postName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#FFF",
  },
  postTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFF",
  },
  postImage: {
    borderRadius: 59,
  },
  resultContainer: {
    backgroundColor: "white",
    padding: 15,
    zIndex: 1,
  },
});

export default Home;
