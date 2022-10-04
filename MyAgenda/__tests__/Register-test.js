import { RegisterScreen } from '../src/components/Register';
import {AuthenticationContextProvider} from '../src/components/Authentication';
import { ThemeProvider } from 'styled-components';  
import {theme} from '../src/utility/Global';
import { expect } from '@jest/globals';
import React from 'react'
import {create,act,render} from 'react-test-renderer';

//import {firebase} from '../mockFirebase';
// Note: test renderer must be required after react-native.

jest.useFakeTimers()

jest.mock("firebase/database", () => {
    const data = { name: "unnamed" };
    
    const snapshot = { val: () => data };
    return {
      getDatabase: jest.fn(),
      onRegister: jest.fn(),
      initializeApp: jest.fn().mockReturnValue({
        database: jest.fn().mockReturnValue({
          ref: jest.fn().mockReturnThis(),
          once: jest.fn(() => Promise.resolve(snapshot))
        })
      })
    };
  });

  jest.mock("firebase/compat/app",()=>{
    return {
      initializeApp: jest.fn(),
      auth: jest.fn().mockReturnValue({
        onAuthStateChanged: jest.fn(),
        currentUser: true,
        signOut: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        createUserWithEmailAndPassword: jest.fn()
      })
    };
  })
test('test register', () => {
    const context = React.useContext = jest.fn();
    /*jest.spyOn(firebase, 'database').mockImplementation(() => ({
        ref: jest.fn().mockReturnThis(),
        on:  jest.fn((event, callback) => callback(snapshot))
    }));
    */

      const element = create(
        <ThemeProvider theme={theme}>
        <AuthenticationContextProvider>
          
            <RegisterScreen />
          
        </AuthenticationContextProvider>
        </ThemeProvider>
      
      );

      expect(element.toJSON()).toMatchSnapshot();

  });