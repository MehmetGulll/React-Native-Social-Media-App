import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Platform, SafeAreaView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";  
import "react-native-gesture-handler";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import BottomTabNavigator from "./components/BottomTab";
import { GlobalProvider } from "./Context/GlobalStates";
import TextMessage from "./pages/TextMessage/TextMessage";
import RequestMessage from "./pages/RequestMessages/RequestMessages";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
const Stack = createNativeStackNavigator();

function Router() {
  return (
    <GlobalProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#3B21B5",
          paddingTop: Platform.OS === "android" ? 63 : 0,
        }}
      >
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="TextMessage" component={TextMessage} />
            <Stack.Screen name="RequestMessages" component={RequestMessage} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GlobalProvider>
  );
}

export default Router;
