import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import Button from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalContext } from "../../Context/GlobalStates";
import axios from "axios";
import { apihost } from "../../API/url";

function MyProfile() {
  const navigation = useNavigation();
  const { username, currentUserId } = useContext(GlobalContext);
  const [post, setPost] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(0);
  const [isOpenBottomSheet2, setIsOpenBottomSheet2] = useState(0);
  const [followerCount,setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["%25", "50%"], []);
  const handlePresentModalPress = useCallback((postId) => {
    setSelectedItem(postId);
    setIsOpenBottomSheet(1);
  }, []);
  const handlePresentModalPress2 = useCallback(
    (postId) => {
      setSelectedItem(postId);
      console.log(postId);
      setIsOpenBottomSheet2(1);
      const fetchComments = async () => {
        try {
          const response = await axios.get(`${apihost}/getComments/${postId}`);
          setComments(response.data);
        } catch (error) {
          console.log("Error", error);
        }
      };
      fetchComments();
    },
    [setComments, setSelectedItem]
  );
  const handleSheetChanges = useCallback((index) => {
    setIsOpenBottomSheet(index);
  }, []);
  const handleSheetChanges2 = useCallback((index) => {
    setIsOpenBottomSheet2(index);
  }, []);
  const handleSendComment = async () => {
    console.log(selectedItem);
    console.log(currentUserId);
    console.log(commentText);
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
      console.log(response.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleCloseSheet = () => bottomSheetRef.current.close();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apihost}/getUserPosts/${username}`);
        setPost(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    const getFollowerCount = async()=>{
      try {
        const response = await axios.post(`${apihost}/getFollowerCount`,{
          userId:currentUserId
        })
        setFollowerCount(response.data.followerCount);
      } catch (error) {
        console.log("Error",error);
      }
    };
    const getFollowingCount = async()=>{
      try {
        const response = await axios.post(`${apihost}/getFollowingCount`,{
          userId:currentUserId
        })
        setFollowingCount(response.data.followingCount);
      } catch (error) {
        console.log("Error",error);
      }
    }
    fetchPosts();
    getFollowerCount();
    getFollowingCount();
   
  }, [username, post]);

  const deletePost = async () => {
    console.log("Siliyorum simdi");
    try {
      const response = await axios.delete(
        `${apihost}/deletePost/${selectedItem}`
      );
      console.log(response.data);

      bottomSheetRef.current.close();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const logOut = async () => {
    try {
      const response = await axios.get(`${apihost}/logout`);
      console.log(response.data);
      await navigation.navigate("Login");
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <GestureHandlerRootView style={{ color: "red", flex: 1 }}>
      <LinearGradient
        colors={["#3B21B5", "#8F62D7", "#C69BE7"]}
        style={{ flex: 1 }}
      >
        <View>
          <ImageBackground
            source={require("../../assets/profilebackground.png")}
            style={{
              padding: 100,
              overflow: "hidden",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <Image
            source={require("../../assets/profileimage.png")}
            style={{ position: "absolute", top: 170, left: 150 }}
          />
        </View>
        <View style={styles.userNameContainer}>
          <Text style={styles.username}>{username}</Text>
        </View>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={logOut}
            style={{
              backgroundColor: "#FFF",
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              borderRadius: 12,
              marginVertical: 5,
            }}
          >
            <Ionicons name="exit-outline" size={24} />
            <Text>Log Out</Text>
          </TouchableOpacity>
        </TouchableOpacity>
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
                  <TouchableOpacity
                    onPress={() => handlePresentModalPress(item._id)}
                  >
                    <Ionicons name="menu-outline" size={28} />
                  </TouchableOpacity>
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
        >
          <View
            style={{
              flexDirection: "column",
              gap: 20,
              alignItems: "center",
              marginTop: 15,
            }}
          >
            <TouchableOpacity onPress={deletePost}>
              <Text style={styles.username}>Delete Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseSheet}>
              <Text style={{ fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpenBottomSheet2}
          snapPoints={snapPoints}
          onChange={handleSheetChanges2}
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

export default MyProfile;
