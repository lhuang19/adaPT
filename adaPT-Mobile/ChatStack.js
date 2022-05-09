import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, Provider as PaperProvider } from 'react-native-paper';

import HomeScreen from './pages/HomeScreen';
import MessageScreen from './pages/MessageScreen';
import SearchScreen from './pages/SearchScreen';
import ExerciseScreen from './pages/ExerciseScreen';
import ProfileScreen from './pages/ProfileScreen';
import ChatScreen from './pages/ChatScreen';

function ChatStack({ userData }) {
//   const { userData } = route.params;
  
  const chatStack = createNativeStackNavigator();
  
    return (
        <chatStack.Navigator
        initialRouteName="Messages"
        // screenOptions={{ headerShown: false }}
        >
        <chatStack.Screen name="Messages" component={MessageScreen} initialParams={{ userData: userData }} />
        <chatStack.Screen name="Chat" component={ChatScreen} />
        </chatStack.Navigator>
    );

}
export default ChatStack;
