import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
import firebase from "firebase/app"

// creating a Auth Context for the React App to gain access so some of these shared methods and states
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  // State initialisation
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  /*
  Method to sign a user up
  Params:
  - email: a string representing the email tagged to the account
  - password: a string representing the password for the account
  - name: a string representing the preferred name of the user
  */
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

  /*
  Method to log a user in
  Params:
  - email: a string representing the log in email credentials
  - password: a string representing the log in password credentials
  */
  function loginWithEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  /*
  Method to log a user in via Google
  */
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
  
  /*
  Method to log thje current user out
  */
  function logout() {
    return auth.signOut()
  }

  /*
  Method to reset password given the email with a reset password email sent to the user's inbox
  Params:
  - email: a string representing the email corresponding to the user who wants to reset the password
  */
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  /*
  Method to update password of the current user
  Params:
  - password: a string representing the new password for the current user
  */
  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  /*
  Method to update the Display Name
  Params:
  - name: a string representing the new display name to be changed into
  */
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

  // returns the Context Provider in order for components that import the auth context to see the "values"
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
