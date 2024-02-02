import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import Button from "../../components/Button";
import axios from "axios";
import { GestureHandlerRootView} from "react-native-gesture-handler";
import { apihost } from "../../API/url";
import { TouchableOpacity } from "react-native-gesture-handler";

function UserProfile({ route }) {
  const { username, userId } = route.params;
  const { currentUserId } = useContext(GlobalContext);
  const [post, setPost] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedItem,setSelectedItem] = useState(null);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["%25", "50%"], []);
  const handlePresentModalPress = useCallback((postId) => {
    setSelectedItem(postId);
    setIsOpenBottomSheet(1);
    const fetchComments = async () => {
      try {
        console.log("Çalıştı");
        const response = await axios.get(`${apihost}/getComments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchComments();
  }, []);
  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await axios.post(`${apihost}/isFollowing`, {
          follower: currentUserId,
          followee: userId,
        });
        setIsFollowing(response.data.isFollowing);
        console.log(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    checkFollow();
  }, [currentUserId, userId]);

  const handleFollow = async () => {
    console.log("follow");
    try {
      await axios.post(`${apihost}/follow`, {
        follower: currentUserId,
        followee: userId,
      });
      setIsFollowing(true);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleUnFollow = async () => {
    console.log("unfloow");
    try {
      axios.delete(`${apihost}/unfollow`, {
        data: {
          follower: currentUserId,
          followee: userId,
        },
      });
      setIsFollowing(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apihost}/getUserPosts/${username}`);
        setPost(response.data);
      } catch (error) { 
        console.log("Error", error);
      }
    };
    fetchPosts();
  }, [username, post]);

  return (
    <LinearGradient
      colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View>
          <ImageBackground
            source={require("../../assets/profilebackground.png")}
            style={{
              padding: 150,
              overflow: "hidden",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <Image
            source={require("../../assets/profileimage.png")}
            style={{ position: "absolute", top: 250, left: 150 }}
          />
        </View>
        <View style={styles.userNameContainer}>
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.postFollowContainer}>
          <View style={styles.postFollow}>
            <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "600" }}>
              {post.length}
            </Text>
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "400" }}>
              Post
            </Text>
          </View>
          <View style={styles.postFollow}>
            <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "600" }}>
              12K
            </Text>
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "400" }}>
              Followers
            </Text>
          </View>
          <View style={styles.postFollow}>
            <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "600" }}>
              200
            </Text>
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "400" }}>
              Following
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ flex: 1 }}>
            {isFollowing ? (
              <Button
                text={"Unfollow"}
                backgroundColor={"#635A8F"}
                color={"#FFF"}
                padding={12}
                onPress={handleUnFollow}
              />
            ) : (
              <Button
                text={"Follow"}
                backgroundColor={"#635A8F"}
                color={"#FFF"}
                padding={12}
                onPress={handleFollow}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Button
              text={"Message"}
              backgroundColor={"#FFF"}
              color={"#635A8F"}
              padding={12}
            />
          </View>
        </View>
        <FlatList
          contentContainerStyle={{ marginBottom: 150 }}
          data={post}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#6D4ACD",
                marginHorizontal: 34,
                borderRadius: 20,
                marginTop: 23,
              }}
            >
              <View style={{ marginTop: 14, marginHorizontal: 10 }}>
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/heart.png")}
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
                    <TouchableOpacity
                      onPress={() => handlePresentModalPress(item._id)}
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
                        Show comments
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  userNameContainer: {
    marginTop: 42,
    alignItems: "center",
  },
  username: {
    color: "#3B21B2",
    fontSize: 21,
    fontWeight: "600",
  },
  postFollowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 13,
  },
  postFollow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#DDDCDC",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginHorizontal: 55,
    marginTop: 14,
  },
});

export default UserProfile;
