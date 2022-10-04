import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import {
  DEV_FIREBASE_API_KEY,
  DEV_FIREBASE_DATABASE_URL,
  DEV_FIREBASE_AUTH_DOMAIN,
  DEV_FIREBASE_PROJECT_ID,
  DEV_FIREBASE_STORAGE_BUCKET,
  DEV_FIREBASE_MESSAGING_SENDER_ID,
  DEV_FIREBASE_APP_ID,
  DEV_FIREBASE_MEASUREMENT_ID,
  TEST_FIREBASE_API_KEY,
  TEST_FIREBASE_DATABASE_URL,
  TEST_FIREBASE_AUTH_DOMAIN,
  TEST_FIREBASE_PROJECT_ID,
  TEST_FIREBASE_STORAGE_BUCKET,
  TEST_FIREBASE_MESSAGING_SENDER_ID,
  TEST_FIREBASE_APP_ID,
  TEST_FIREBASE_MEASUREMENT_ID
} from "@env";


// Dev Firebase configuration
export const firebaseDevConfig = {
  apiKey: DEV_FIREBASE_API_KEY,
  databaseURL: DEV_FIREBASE_DATABASE_URL,
  authDomain: DEV_FIREBASE_AUTH_DOMAIN,
  projectId: DEV_FIREBASE_PROJECT_ID,
  storageBucket: DEV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: DEV_FIREBASE_MESSAGING_SENDER_ID,
  appId: DEV_FIREBASE_APP_ID,
  measurementId: DEV_FIREBASE_MEASUREMENT_ID
};

// Test Firebase configuration
export const firebaseTestConfig = {
  apiKey: TEST_FIREBASE_API_KEY,
  databaseURL: TEST_FIREBASE_DATABASE_URL,
  authDomain: TEST_FIREBASE_AUTH_DOMAIN,
  projectId: TEST_FIREBASE_PROJECT_ID,
  storageBucket: TEST_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: TEST_FIREBASE_MESSAGING_SENDER_ID,
  appId: TEST_FIREBASE_APP_ID,
  measurementId: TEST_FIREBASE_MEASUREMENT_ID
};

// Creates and initializes a @firebase/app#FirebaseApp instance.
const app = initializeApp(firebaseDevConfig);

// Returns the instance of the Realtime Database SDK that is associated with the provided firebase app.
const database = getDatabase(app);
