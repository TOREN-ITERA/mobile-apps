import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBr5A5kQ1Dak_VeVbEcJYeoCi_g8XUVmWU',
  authDomain: 'toren-itera.firebaseapp.com',
  projectId: 'toren-itera',
  storageBucket: 'toren-itera.appspot.com',
  messagingSenderId: '971511034983',
  appId: '1:971511034983:web:4f67c76d98b8baa9fb50c2'
}

const app = initializeApp(firebaseConfig)

export const DB = initializeFirestore(app, {
  experimentalForceLongPolling: true
})

export const auth = getAuth(app)
export const storage = getStorage(app)
