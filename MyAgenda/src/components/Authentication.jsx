import React, { useState, createContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase, ref, set, push } from 'firebase/database';

export const AuthenticationContext = createContext();
const db = getDatabase();

const loginRequest = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);


export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  function writeUserData(email) {
    const reference = ref(db, 'Users/');
    const newReference = push(reference) // generate new id under Users/
    set(newReference, {
      email: email,
    });
  }

  function createBaseAgendas(email) {
    const reference = ref(db, 'Agendas/');
    let newReference = push(reference); //generate new id under Agendas/
    set(newReference, {
      name: "Mon agenda familial",
      owner: email,
      members: {},
      events: {},
    });
    newReference = push(reference); //generate new id under Agendas/
    set(newReference, {
      name: "Mon agenda personnel",
      owner: email,
      members: {},
      events: {},
    });
  }



  firebase.auth().onAuthStateChanged(usr => {
    if (usr) {
      setUser(usr);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  });

  const onLogin = (email, password) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then(u => {
        setUser(u);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onRegister = (email, password, repeatedPassword) => {
    setIsLoading(true);
    if (password !== repeatedPassword) {
      setError('Error: Passwords do not match');
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(u => {
        writeUserData(email);
        createBaseAgendas(email)
        setUser(u);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setError(null);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onLogin,
        onRegister,
        onLogout,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
