import { createStackNavigator } from "@react-navigation/stack";
import RandomScreen from "../Components/normal/RandomScreen";
import ProfileScreen from "../Components/normal/ProfileScreen";
// Import other screens as needed

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
