import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import React from 'react';
import 'react-native-gesture-handler';
import { Navigation } from './src/components/Navigation';
import { AuthenticationContextProvider } from './src/components/Authentication';
import firebase from 'firebase/compat/app';
import { firebaseDevConfig } from './firebaseConf';
import { colors } from './src/utility/Global';
import "./ignoreWarnings";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseDevConfig);
}

export default function App() {
  return (
    <>
      <AuthenticationContextProvider>
        <Navigation />
      </AuthenticationContextProvider>
      <ExpoStatusBar style="light" backgroundColor={colors.Black} />
    </>
  );
}

registerRootComponent(App);
