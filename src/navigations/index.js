import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// * screen
import {Splashscreen, Login, Register, Home, Profile, OnBoard} from '../screen';

// Splash
const SplashStack = createStackNavigator();
const Splash = () => (
  <SplashStack.Navigator headerMode="none">
    <SplashStack.Screen name="splash" component={Splashscreen} />
  </SplashStack.Navigator>
);

// Root
const RootStack = createStackNavigator();
const Root = () => (
  <RootStack.Navigator initialRouteName="app">
    <RootStack.Screen
      name="onBoard"
      component={OnBoard}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="auth"
      component={Auth}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="app"
      component={App}
      options={{headerShown: false}}
    />
  </RootStack.Navigator>
);

// Auth
const AuthStack = createStackNavigator();
const Auth = () => (
  <AuthStack.Navigator initialRouteName="login" headerMode="none">
    <AuthStack.Screen name="login" component={Login} />
    <AuthStack.Screen name="register" component={Register} />
  </AuthStack.Navigator>
);

// App
const AppStack = createStackNavigator();
const App = () => (
  <AppStack.Navigator headerMode="none">
    <AppStack.Screen name="home" component={Home} />
    <AppStack.Screen name="profile" component={Profile} />
  </AppStack.Navigator>
);

export default function index() {
  const [splash, setSplash] = React.useState(false);

  React.useEffect(() => {
    // setTimeout(() => {
    //     setSplash(false);
    // },1000)
  }, []);

  return (
    <NavigationContainer>{splash ? <Splash /> : <Root />}</NavigationContainer>
  );
}
