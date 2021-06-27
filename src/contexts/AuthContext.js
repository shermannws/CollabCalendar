import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
import firebase from "firebase/app"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  // Not populating the events field as there might already be pre-existing pending and/or
  // confirmed events before they even sign up
  function signupWithEmail(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password).then(async(userCredential) => {
      
      await userCredential.user.updateProfile({
        displayName: name
      }).then(async () => {
        await db.collection("users").doc(email).set({
          displayName: name,
          uid: userCredential.user.uid,
          isGoogleSignIn: false,
        }, { merge: true })
      })
    })
  }

  function loginWithEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  // Not populating the events field as there might already be pre-existing pending and/or
  // confirmed events before they even sign up
  function loginWithGoogle() {
    return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async(userCredential) => {
      
      const userDocRef = db.collection('users').doc(userCredential.user.email);
      await userDocRef.get().then((doc) => {
        db.collection("users").doc(userCredential.user.email).set({
          displayName: userCredential.user.displayName,
          uid: userCredential.user.uid,
          isGoogleSignIn: true,
        }, { merge: true })
      })
    })
  }
  

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function updateDisplayName(name) {
    return currentUser.updateProfile({
      displayName: name
    }).then(() => {
      db.collection("users").doc(currentUser.email).set({
        displayName: name,
      }, { merge: true })
    })
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    loginWithEmail,
    signupWithEmail,
    logout,
    resetPassword,
    updatePassword,
    loginWithGoogle,
    updateDisplayName
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
