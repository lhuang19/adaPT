import React, { useState } from 'react';

import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './pages/HomeScreen';
import MessageScreen from './pages/MessageScreen';
import SearchScreen from './pages/SearchScreen';
import ExerciseScreen from './pages/ExerciseScreen';
import ProfileScreen from './pages/ProfileScreen';

const MessageRoute = () => <MessageScreen />;

function ExerciseRoute(userData) {
  function ExerciseRouteInner() {
    return <ExerciseScreen />;
  }
  return ExerciseRouteInner;
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
    home: () => <HomeScreen userData={userData} />,
    message: MessageRoute,
    search: () => <SearchScreen userData={userData} />,
    profile: () => <ProfileScreen userData={userData} profile={userData.username} height="77%" />,
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
