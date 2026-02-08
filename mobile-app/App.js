/**
 * Field Sales Pro - Mobile Application
 * @format
 */

import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {LeadsProvider} from './src/context/LeadsContext';
import {colors} from './src/styles/theme';

const App = () => {
  return (
    <AuthProvider>
      <LeadsProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <AppNavigator />
      </LeadsProvider>
    </AuthProvider>
  );
};

export default App;
