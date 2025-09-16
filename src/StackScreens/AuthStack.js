import { createStackNavigator } from "@react-navigation/stack";
import RandomLogIn from "../Components/normal/RandomLogIn";
import LogInPage from "../Navigation/Bottom/Components-bottom/LogInPage";
// Import other authentication screens as needed

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LogInPage"
        component={LogInPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
