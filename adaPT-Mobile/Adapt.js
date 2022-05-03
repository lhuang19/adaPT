import * as React from 'react';

import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './pages/HomeScreen';
import MessageScreen from './pages/MessageScreen';
import ProfileScreen from './pages/ProfileScreen';
import ExerciseScreen from './pages/ExerciseScreen';

function HomeRoute(userData) {
  function HomeRouteInner() {
    return <HomeScreen userData={userData} />;
  }
  return HomeRouteInner;
}

function MessageRoute() {
  return <MessageScreen />;
}

function ExerciseRoute(userData) {
  function ExerciseRouteInner() {
    return <ExerciseScreen userData={userData} />;
  }
  return ExerciseRouteInner;
}

function ProfileRoute() {
  return <ProfileScreen />;
}

function Adapt({ route }) {
  const { userData } = route.params;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'message', title: 'Messages', icon: 'forum' },
    { key: 'exercise', title: 'Exercise', icon: 'dumbbell' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute(userData),
    message: MessageRoute,
    exercise: ExerciseRoute,
    profile: ProfileRoute,
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
