import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AccountScreen } from '../src/components/Account';
import { LoginScreen } from '../src/components/Login';
import { RegisterScreen } from '../src/components/Register';


const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Main" component={AccountScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);
