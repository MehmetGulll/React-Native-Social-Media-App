import { Image, TouchableOpacity, View, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Home from "../pages/Home/Home";
import Messages from "../pages/Messages/Messages";
import AddPost from "../pages/AddPost/AddPost";
import MyProfile from "../pages/MyProfile/MyProfile";
import Notifications from "../pages/Notifications/Notifications";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { GlobalContext, GlobalProvider } from "../Context/GlobalStates";
import React, { useContext } from "react";
import { apihost } from "../API/url";
import UserProfile from "../pages/UserProfile/UserProfile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function ProfileNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    );
  }

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{ top: -30, justifyContent: "center", alignItems: "center" }}
    onPress={onPress}
  >
    <View style={{ width: 70, height: 70, borderRadius: 35 }}>{children}</View>
  </TouchableOpacity>
);
function BottomTabNavigator() {
  const { username, currentUserId, notificationsModal, setNotificationsModal } =
    useContext(GlobalContext);
  const navigation = useNavigation();
  const selectPhotoTapped = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Hata", "Üzgünüm Galeriye Erişim İznim Bulunmuyor.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      let localUri = result.assets[0].uri;
      let fileName = localUri.split("/").pop();
      let match = /\.(\w+)$/.exec(fileName);
      let type = match ? `image/${match[1]}` : `image`;
      let formData = new FormData();
      formData.append("photo", { uri: localUri, name: fileName, type });
      formData.append("username", username);
      formData.append("userId", currentUserId);

      await axios
        .post(`${apihost}/addPost`, formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("upload succes", response);
          alert("Upload success!");
        })
        .catch((error) => {
          console.log("upload error", error);
          alert("Upload failed!");
        });
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 5,
          left: 10,
          right: 10,
          elevation: 0,
          backgroundColor: "#FFF",
          borderRadius: 15,
          height: 90,
        },
      }}
    >
      <Tab.Screen
        name="HomeTabs"
        component={Home}
        options={{
          tabBarIcon: () => <Image source={require("../assets/hometab.png")} />,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/messagetab.png")} />
          ),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity onPress={selectPhotoTapped}>
              <Image
                source={require("../assets/add.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 35,
                  backgroundColor: "#635A8F",
                  padding: 30,
                }}
              />
            </TouchableOpacity>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "ProfileNavigator",
                      params: { screen: "MyProfile" },
                    },
                  ],
                });
              }}
            >
              <Image source={require("../assets/profiletab.png")} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            setNotificationsModal(!notificationsModal);
          },
        }}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/notificationtab.png")} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;
