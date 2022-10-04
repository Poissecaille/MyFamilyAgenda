import {NotificationModal} from '../src/components/NotificationModal';    
import {AuthenticationContext} from '../src/components/Authentication';
import { expect } from '@jest/globals';
import React from 'react';
import {create,act} from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react-native';
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




test('test NotificationModal component', () => {
    const element = render(
        <NotificationModal notifications={{"id1":{message:"test"},"id2":{message:"test2"}}} />
      );
    expect(element.toJSON()).toMatchSnapshot();

  });