import { SettingsScreen } from '../old/Settings';    
import {AuthenticationContext} from '../src/components/Authentication';
import { expect } from '@jest/globals';
import React from 'react';
import {create,act,render} from 'react-test-renderer';
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


const value = {onLogout : null, user : {email: 'test@gmail.com', name: 'test'}};

test('test SettingsScreen component', () => {
    const element = create(
        
        <AuthenticationContext.Provider value={value}>
            <SettingsScreen />
        </AuthenticationContext.Provider>
      );

    expect(element.toJSON()).toMatchSnapshot();

  });