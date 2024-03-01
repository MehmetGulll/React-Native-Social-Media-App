import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import Entypo from "react-native-vector-icons/Entypo";
import BottomSheet from "@gorhom/bottom-sheet";
import Button from "../../components/Button";
import axios from "axios";
import { apihost } from "../../API/url";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";

function UserProfile({ route }) {
  const { username, userId } = route.params;
  const {
    currentUserId,
    messageSendUsers,
    setMessageSendUsers,
    blockedUsers,
    setBlockedUsers,
    following,
    setFollowing,
  } = useContext(GlobalContext);
  const [post, setPost] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isProfileImageLoaded, setIsProfileImageLoaded] = useState(false);
  const [isCoverImageLoaded, setIsCoverImageLoaded] = useState(false);
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
  const handleSheetChanges = useCallback((index) => {
    setIsOpenBottomSheet(index);
  }, []);

  useEffect(() => {
    const checkFollow = async () => {
      try {
        const response = await axios.post(`${apihost}/isFollowing`, {
          follower: currentUserId,
          followee: userId,
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.log("Error", error);
      }
    };
    const fetchUserImages = async () => {
      try {
        const response = await axios.get(`${apihost}/getUserImages/${userId}`);
        setProfileImage(response.data.profileImage);
        setCoverImage(response.data.coverImage);
        setIsProfileImageLoaded(true);
        setIsCoverImageLoaded(true);
      } catch (error) {
        console.log("Error", error);
      }
    };
    checkFollow();
    fetchUserImages();
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
  const userBlocked = async (userIdToBlock) => {
    try {
      const response = await axios.post(`${apihost}/blockedUser`, {
        userId: userIdToBlock,
        currentUserId: currentUserId,
      });
      console.log(response.data.success);
      if (response.data.success) {
        console.log("User blocked successfully");
        setBlockedUsers((oldBlockedUsers) => [
          ...oldBlockedUsers,
          userIdToBlock,
        ]);
        const userIndex = messageSendUsers.findIndex(
          (user) => user.userId === userIdToBlock
        );
        let updatedUsers = [...messageSendUsers];
        if (userIndex !== -1) {
          updatedUsers.splice(userIndex, 1);
          setMessageSendUsers(updatedUsers);
          AsyncStorage.setItem(
            "messageSendUsers",
            JSON.stringify(updatedUsers)
          );
        }
        try {
          const response = await axios.post(`${apihost}/storeRecentChat`, {
            userId: currentUserId,
            recentChats: updatedUsers,
          });
        } catch (error) {
          console.log("Error", error);
        }

        try {
          setMessageSendUsers([]);
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
      } else {
        console.log("Failed to block user");
      }
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
    const getFollowerCount = async () => {
      try {
        const response = await axios.post(`${apihost}/getFollowerCount`, {
          userId: userId,
        });
        setFollowerCount(response.data.followerCount);
      } catch (error) {
        console.log("Error", error);
      }
    };

    const getFollowingCount = async () => {
      try {
        const response = await axios.post(`${apihost}/getFollowingCount`, {
          userId: userId,
        });
        setFollowingCount(response.data.followingCount);
      } catch (error) {
        console.log("Error", error);
      }
    };
    getFollowerCount();
    getFollowingCount();
    fetchPosts();
  }, [username, post]);

  return (
    <MenuProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient
          colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
          style={{ flex: 1 }}
        >
          <View>
            <View>
              <ImageBackground
                source={
                  coverImage
                    ? { uri: `data:image/gif;base64,${coverImage}` }
                    : require("../../assets/profilebackground.png")
                }
                style={{
                  padding: 100,
                  overflow: "hidden",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              />
            </View>
            <View style={{ position: "absolute", top: 170, left: 150 }}>
              <Image
                source={
                  profileImage
                    ? { uri: `data:image/gif;base64,${profileImage}` }
                    : require("../../assets/profileimage.png")
                }
                style={{ width: 75, height: 75, borderRadius: 75 }}
              />
            </View>
          </View>
          <View style={styles.userNameContainer}>
            <Text style={styles.username}>{username}</Text>
          </View>

          <View style={{ alignItems: "flex-end", marginRight: 15 }}>
            <Menu>
              <MenuTrigger>
                <Entypo name="dots-three-horizontal" size={24} />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => userBlocked(userId)}>
                  <Text>Block</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
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
                {followerCount}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "400" }}>
                Followers
              </Text>
            </View>
            <View style={styles.postFollow}>
              <Text style={{ color: "#FFF", fontSize: 28, fontWeight: "600" }}>
                {followingCount}
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
                  borderRadius={25}
                  fontSize={22}
                  onPress={handleUnFollow}
                />
              ) : (
                <Button
                  text={"Follow"}
                  backgroundColor={"#635A8F"}
                  color={"#FFF"}
                  padding={12}
                  borderRadius={25}
                  fontSize={22}
                  onPress={handleFollow}
                />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Button
                text={"Message"}
                borderRadius={25}
                fontSize={22}
                backgroundColor={"#FFF"}
                color={"#635A8F"}
                padding={12}
              />
            </View>
          </View>
          <FlatList
            contentContainerStyle={{ paddingBottom: 109 }}
            data={post}
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
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "500",
                        color: "#FFF",
                      }}
                    >
                      {diffDays > 1
                        ? `${diffDays} gün önce gönderildi`
                        : "Bugün gönderildi"}
                    </Text>

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
                      <TouchableOpacity
                        onPress={() => handlePresentModalPress2(item._id)}
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
                          Show comments
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />

          <BottomSheet
            ref={bottomSheetRef}
            index={isOpenBottomSheet}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundComponent={({ style }) => (
              <View
                style={[
                  style,
                  { backgroundColor: "#C69BE7", borderRadius: 15 },
                ]}
              />
            )}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 15,
                gap: 20,
              }}
            >
              <TextInput
                placeholder="Yorumunu Yaz..."
                style={{ borderBottomWidth: 1, flex: 1 }}
                onChangeText={(text) => setCommentText(text)}
              />
              <Button text="Send" onPress={() => handleSendComment()} />
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.postCommentsContainer}>
                  <View style={styles.postCommentContainer}>
                    <View>
                      <Text style={{ fontWeight: "500", fontSize: 15 }}>
                        {item.userId.firstname} {item.userId.lastname}
                      </Text>
                    </View>

                    <Text>{item.content}</Text>
                  </View>
                </View>
              )}
            />
          </BottomSheet>
        </LinearGradient>
      </GestureHandlerRootView>
    </MenuProvider>
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
  postCommentsContainer: {
    marginHorizontal: 30,
  },
  postCommentContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: "#DDDDDD",
  },
});

export default UserProfile;
