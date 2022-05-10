import React, { useState } from 'react';
import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './pages/HomeScreen';
import MessageScreen from './pages/MessageScreen';
import SearchScreen from './pages/SearchScreen';
import ExerciseScreen from './pages/ExerciseScreen';
import ProfileScreen from './pages/ProfileScreen';

function MessageRoute() {
  function MessageRouteInner() {
    return <MessageScreen userData={userData}/>;
  }
  return MessageRouteInner;
}

function ExerciseRoute(userData) {
  function ExerciseRouteInner() {
    return <ExerciseScreen userData={userData} />;
  }
  return ExerciseRouteInner;
}

function HomeRoute(userData) {
  function HomeRouteInner() {
    return <HomeScreen userData={userData} />;
  }
  return HomeRouteInner;
}

function SearchRoute(userData) {
  function SearchRouteInner() {
    return <SearchScreen userData={userData} />;
  }
  return SearchRouteInner;
}

function ProfileRoute(userData) {
  function ProfileRouteInner() {
    return <ProfileScreen userData={userData} profile={userData.username} />;
  }
  return ProfileRouteInner;
}

function Adapt({ route }) {
  const { userData } = route.params;
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'message', title: 'Messages', icon: 'forum' },
    { key: 'exercise', title: 'Exercise', icon: 'dumbbell' },
    { key: 'search', title: 'Search', icon: 'account-search' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute(userData),
    message: MessageRoute (userData),
    search: SearchRoute(userData),
    profile: ProfileRoute(userData),
    exercise: ExerciseRoute(userData),
  });

  return (
    <PaperProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
}
export default Adapt;
