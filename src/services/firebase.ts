import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: 'AIzaSyCblZ0jC0juH4Pe3Yk08TPodouvEu4aWAo',
  authDomain: 'mrs-habits.firebaseapp.com',
  projectId: 'mrs-habits',
  storageBucket: 'mrs-habits.appspot.com',
  messagingSenderId: '844655613341',
  appId: '1:844655613341:web:ffd5fbf38c4895af264b74',
  measurementId: 'G-F3WSW87484',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
