import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Context
import {useAuth} from '../context/AuthContext';
import {colors} from '../styles/theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import LeadFeedScreen from '../screens/LeadFeedScreen';
import LeadIntelligenceScreen from '../screens/LeadIntelligenceScreen';
import DetailedLeadEntryScreen from '../screens/DetailedLeadEntryScreen';
import ActionHistoryScreen from '../screens/ActionHistoryScreen';
// import SyncDashboardScreen from '../screens/SyncDashboardScreen'; // Removed
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Components
import BottomTabBar from '../components/BottomTabBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Leads" component={LeadFeedScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      {/* History Tab Removed */}
      {/* <Tab.Screen name="Sync" component={SyncDashboardScreen} /> */ }
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const AppNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="LeadFeed" component={MainTabs} />
            <Stack.Screen name="LeadIntelligence" component={LeadIntelligenceScreen} />
            <Stack.Screen name="DetailedLeadEntry" component={DetailedLeadEntryScreen} />
            <Stack.Screen name="ActionHistory" component={ActionHistoryScreen} />
            {/* <Stack.Screen name="SyncDashboard" component={SyncDashboardScreen} /> */}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
