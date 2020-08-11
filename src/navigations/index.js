import 'react-native-gesture-handler';
import React from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';

import {SetUser} from '../redux/actions/UserAction';

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
  <AuthStack.Navigator initialRouteName="onBoard" headerMode="none">
    <AuthStack.Screen name="onBoard" component={OnBoard} />
    <AuthStack.Screen name="login" component={Login} />
    <AuthStack.Screen name="register" component={Register} />
  </AuthStack.Navigator>
);

// Home
const RootStack = createStackNavigator();
const Root = () => (
  <RootStack.Navigator initialRouteName="TabBar">
    <RootStack.Screen
      name="TabBar"
      component={TabBar}
      options={{headerShown: false}}
    />
    <RootStack.Screen name="Chat" component={Chat} />
    <RootStack.Screen
      name="ChatList"
      component={ChatList}
      options={{title: 'Chat History'}}
    />
  </RootStack.Navigator>
);

// App
const TabBarStack = createBottomTabNavigator();
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

const TabBar = () => (
  <TabBarStack.Navigator
    headerMode="none"
    initialRouteName="home"
    screenOptions={TabView}
    tabBarOptions={{
      activeTintColor: color.merahJambu,
      inactiveTintColor: 'gray',
    }}>
    {/* Main */}
    <TabBarStack.Screen name="home" component={Home} />
    <TabBarStack.Screen
      name="add"
      component={Add}
      options={{tabBarVisible: false}}
    />
    <TabBarStack.Screen name="profile" component={Profile} />
  </TabBarStack.Navigator>
);

const Navigation = ({SetUser, isAuth}) => {
  const [splash, setSplash] = React.useState(true);

  React.useEffect(() => {
    auth().onAuthStateChanged(async (user) => {
      if (user !== null) {
        try {
          await SetUser(user.uid);
          setSplash(false);
        } catch (error) {
          setSplash(false);
          console.log('check -> ', error);
        }
      } else {
        setSplash(false);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      {splash ? <Splash /> : isAuth ? <Root /> : <Auth />}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => ({
  isAuth: state.User.id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    SetUser: (data) => dispatch(SetUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
