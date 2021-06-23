import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
import firebase from "firebase/app"

const EventsContext = React.createContext()

export function useEventsCRUD() {
  return useContext(EventsContext)
}

export function EventsCRUDProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function addEvent() {
    
  }

  function readEvent() {

  }

  function updateEvent() {

  }

  function deleteEvent() {

  }

  function signupWithEmail(email, password, name) {
    return auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      
      userCredential.user.updateProfile({
        displayName: name
      }).then(() => {
        db.collection("users").doc(email).set({
          displayName: name,
          uid: userCredential.user.uid,
          isGoogleSignIn: false,
          events: {
            confirmed: [],
            pending: []
          }
        }, { merge: true })
      })
    })
  }

  function loginWithEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function loginWithGoogle() {
    return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(userCredential => {
      
      const userDocRef = db.collection('users').doc(userCredential.user.email);
      userDocRef.get().then((doc) => {
        if (doc.data() === undefined) {
          db.collection("users").doc(userCredential.user.email).set({
            displayName: userCredential.user.displayName,
            uid: userCredential.user.uid,
            isGoogleSignIn: true,
            events: {
              confirmed: [],
              pending: []
            }
          }, { merge: true })
        } else {
          db.collection("users").doc(userCredential.user.email).set({
            displayName: userCredential.user.displayName,
            uid: userCredential.user.uid,
            isGoogleSignIn: true,
          }, { merge: true })
        }
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
    <EventsContext.Provider value={value}>
      {!loading && children}
    </EventsContext.Provider>
  )
}
 