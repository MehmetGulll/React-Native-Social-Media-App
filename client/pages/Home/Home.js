import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import axios from "axios";
import { GlobalContext } from "../../Context/GlobalStates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { apihost } from "../../API/url";

function Home() {
  const [searchUsers, setSearchUsers] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();
  const { currentUserId, setNotificationsModal, notificationsModal } =
    useContext(GlobalContext);
  const onRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  };
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["%25", "75%"], []);
  const handlePresentModalPress = useCallback((postId) => {
    setSelectedItem(postId);
    setIsOpenBottomSheet(1);
    const fetchComments = async () => {
      try {
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

  const getPosts = async () => {
    if (!hasMore) return;
    setPageLoading(true);
    try {
      const response = await axios.post(`${apihost}/getFollowedUsersPosts`, {
        userId: currentUserId,
        page: page,
      });
      setPosts((oldPosts) => [...oldPosts, ...response.data.posts]);
      setHasMore(response.data.hasMore);
      setPage(page + 1);
      setPageLoading(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    const fetchLikedPosts = async () => {
      const storeLikedPosts = await getLikedPosts();
      setLikedPosts(storeLikedPosts);
    };
    getPosts();
    fetchLikedPosts();
  }, [refresh]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const response = await axios.get(`${apihost}/getNotifications`, {
        params: {
          userId: currentUserId,
          page: page,
        },
      });
      setNotifications((oldNotifications) => [
        ...oldNotifications,
        ...response.data.notifications,
      ]);
      setHasMore(response.data.hasMore);
      setLoading(false);
    };
    fetchNotifications();
  }, [notificationsModal]);

  const searchUser = async (text) => {
    setSearchUsers(text);
    if (text.length >= 3) {
      try {
        const response = await axios.get(`${apihost}/searchUser/${text}`, {
          params: {
            currentUserId: currentUserId,
          },
        });

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
      const isLiked = likedPosts[postId] || false;
      const response = isLiked
        ? await axios.post(`${apihost}/posts/${postId}/unlike`, {
            userId: currentUserId,
          })
        : await axios.post(`${apihost}/posts/${postId}/like`, {
            userId: currentUserId,
          });

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      const newLikedPosts = { ...likedPosts, [postId]: !isLiked };
      setLikedPosts(newLikedPosts);

      storeLikedPosts(newLikedPosts);
    } catch (error) {
      console.error("Error while liking/unliking post", error);
    }
  };

  const storeLikedPosts = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@liked_posts", jsonValue);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getLikedPosts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@liked_posts");
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSendComment = async () => {
    try {
      const response = await axios.post(`${apihost}/addComment`, {
        postId: selectedItem,
        userId: currentUserId,
        content: commentText,
      });
      const commentsResponse = await axios.get(
        `${apihost}/getComments/${selectedItem}`
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
        style={{ flex: 1 }}
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
          <TouchableOpacity
            onPress={() => setNotificationsModal(!notificationsModal)}
          >
            <View style={{ marginLeft: 19 }}>
              <Image
                source={require("../../assets/Vector.png")}
                width={33}
                height={33}
              />
              {notifications.length > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white" }}>{notifications.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={notificationsModal}
          >
            <LinearGradient
              colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
              style={{ flex: 1 }}
            >
              <Ionicons
                name="arrow-back"
                size={35}
                style={{ padding: 15, color: "#FFF" }}
                onPress={() => setNotificationsModal(!notificationsModal)}
              />
              <View style={styles.notificationsContainer}>
                <View>
                  <Text
                    style={{ color: "#FFF", fontSize: 24, fontWeight: "700" }}
                  >
                    Notifications
                  </Text>
                </View>
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item._id}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item }) => (
                    <View style={styles.notificationContainer}>
                      <View style={{ flexDirection: "column", gap: 3 }}>
                        <Text
                          style={{
                            color: "#FFF",
                            fontWeight: "700",
                            fontSize: 16,
                          }}
                        >
                          {item.follower.firstname} {item.follower.lastname}{" "}
                          followed you.
                        </Text>
                        <Text style={{ color: "#a9a9a9", marginBottom: 5 }}>
                          Az önce
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </LinearGradient>
          </Modal>
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
                style={{
                  borderBottomWidth: 1,
                  padding: 10,
                  borderColor: "#D3D3D3",
                }}
              >
                <View style = {{flexDirection:'row',alignItems:'center'}}>
                  <Image
                    source={
                      user.profileImage
                        ? { uri: `data:image/gif;base64,${user.profileImage}` }
                        : require("../../assets/profileimage.png")
                    }
                    style={{ width: 35, height: 35, borderRadius: 35 }}
                  />
                  <Text style = {{marginLeft:10}}>
                    {user.firstname} {user.lastname}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {pageLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 150 }}
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={getPosts}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => onRefresh()}
              />
            }
            ListEmptyComponent={
              <View
                style={{
                  alignItems: "center",
                  marginTop: 80,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{
                    uri: "https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png",
                  }}
                  width={250}
                  height={250}
                />
                <Text
                  style={{
                    marginTop: 25,
                    fontSize: 24,
                    color: "#FFF",
                    fontWeight: "700",
                  }}
                >
                  Start following someone now!
                </Text>
              </View>
            }
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
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          color: "#FFF",
                        }}
                      >
                        {item.username}
                      </Text>
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
                          {likedPosts[item._id] ? (
                            <Image source={require("../../assets/heart.png")} />
                          ) : (
                            <Ionicons
                              name="heart-outline"
                              size={24}
                              color={"#FFF"}
                            />
                          )}
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

                      <TouchableOpacity
                        onPress={() => handlePresentModalPress(item._id)}
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
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpenBottomSheet}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundComponent={({ style }) => (
            <View style={[style, { backgroundColor: '#C69BE7', borderRadius:15 }]} /> 
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
              placeholder="Write Comment..."
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
    position: "absolute",
    top: 55,
    width: "90%",
    marginHorizontal: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  postCommentsContainer: {
    marginHorizontal: 30,
  },
  postCommentContainer: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: "#DDDDDD",
  },
  notificationsContainer: {
    padding: 39,
  },
  notificationContainer: {
    marginTop: 35,
    borderBottomWidth: 1,
    borderColor: "#FFF",
  },
});

export default Home;
