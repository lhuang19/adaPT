import 'react-native-gesture-handler';
 
import * as React from 'react';

import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './pages/HomeScreen';
import MessageScreen from './pages/MessageScreen';
import ProfileScreen from './pages/ProfileScreen';
import ExerciseScreen from './pages/ExerciseScreen';
const MessageRoute = () => <MessageScreen />;
const ExerciseRoute = () => <ExerciseScreen />;
const ProfileRoute = () => <ProfileScreen />;

function Adapt({ route, navigation }) {
  const { userData } = route.params;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'message', title: 'Messages', icon: 'forum' },
    { key: 'exercise', title: 'Exercise', icon: 'dumbbell' },
    { key: 'profile', title: 'Profile', icon: 'account' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeScreen userData={userData} />,
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