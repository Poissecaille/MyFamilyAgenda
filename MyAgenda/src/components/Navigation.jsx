import React, { useContext } from 'react';
import { AuthenticationContext } from './Authentication';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountScreen } from './Account';
import { LoginScreen } from './Login';
import { RegisterScreen } from './Register';
import { AgendaObject } from './Agenda';
import { Home } from './Home';


const Stack = createStackNavigator();


export const Navigation = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ?
            (
              <Stack.Group>
                <Stack.Screen name="Home" component={Home} options={{
                  headerShown: false
                }} />
                <Stack.Screen name="Agenda" component={AgendaObject} options={{
                  headerShown: false
                }} />
              </Stack.Group>
            ) :
            (
              <Stack.Group>
                <Stack.Screen name="Authentication Menu" component={AccountScreen} options={{
                  headerShown: false,

                }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{
                  headerShown: false
                }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{
                  headerShown: false
                }} />
              </Stack.Group>
            )
          }
        </Stack.Navigator>

      </NavigationContainer>

    </>

  );
};
