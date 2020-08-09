import 'react-native-gesture-handler';
import React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import {RootContext} from '../contexts';

// * screen
import {
  Splashscreen,
  Login,
  Register,
  Home,
  Profile,
  OnBoard,
  Add,
  Chat,
  ChatList,
} from '../screen';
import {color} from '../styles/color';

// Splash
const SplashStack = createStackNavigator();
const Splash = () => (
  <SplashStack.Navigator headerMode="none">
    <SplashStack.Screen name="splash" component={Splashscreen} />
  </SplashStack.Navigator>
);

// Auth
const AuthStack = createStackNavigator();
const Auth = () => (
  <AuthStack.Navigator initialRouteName="login" headerMode="none">
    <AuthStack.Screen name="login" component={Login} />
    <AuthStack.Screen name="register" component={Register} />
  </AuthStack.Navigator>
);

// Home
const HomeStack = createStackNavigator();
const HomeScreen = () => (
  <HomeStack.Navigator initialRouteName="App">
    <HomeStack.Screen
      name="App"
      component={App}
      options={{headerShown: false}}
    />
    <HomeStack.Screen name="Chat" component={Chat} />
    <HomeStack.Screen
      name="ChatList"
      component={ChatList}
      options={{title: 'Chat History'}}
    />
  </HomeStack.Navigator>
);

// App
const AppStack = createBottomTabNavigator();

const TabView = ({route}) => ({
  tabBarIcon: ({color, size}) => {
    let iconName;

    switch (route.name) {
      case 'home':
        iconName = 'home';
        break;
      case 'add':
        iconName = 'camera';
        break;
      case 'profile':
        iconName = 'user';
        break;
      default:
        iconName = 'slash';
        break;
    }
    // You can return any component that you like here!
    return (
      <Icon name={iconName} size={size} color={color} style={{marginTop: 10}} />
    );
  },
});

const App = () => (
  <AppStack.Navigator
    headerMode="none"
    initialRouteName="home"
    screenOptions={TabView}
    tabBarOptions={{
      activeTintColor: color.merahJambu,
      inactiveTintColor: 'gray',
    }}>
    {/* Main */}
    <AppStack.Screen
      name="home"
      component={Home}
      // options={{tabBarVisible: isChatScreen ? false : true}}
    />
    <AppStack.Screen
      name="add"
      component={Add}
      options={{tabBarVisible: false}}
    />
    <AppStack.Screen name="profile" component={Profile} />
  </AppStack.Navigator>
);

export default () => {
  const [splash, setSplash] = React.useState(true);
  const [isAuth, setIsAuth] = React.useState(false);
  const {setUser} = React.useContext(RootContext);

  // Root
  const RootStack = createStackNavigator();
  const Root = () => (
    <RootStack.Navigator initialRouteName={isAuth ? 'app' : 'onBoard'}>
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
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );

  React.useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (user !== null) {
        try {
          const userRef = firestore().collection('users');
          const document = await userRef.doc(user.uid).get();
          const data = document.data();
          setUser(data);
          setIsAuth(true);
          setSplash(false);
        } catch (error) {
          console.log('check -> ', error);
        }
      } else {
        setSplash(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>{splash ? <Splash /> : <Root />}</NavigationContainer>
  );
};
