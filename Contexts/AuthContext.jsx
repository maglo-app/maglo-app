import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
// import { auth } from "../firebase-config"; // created in 'firebase-config.jsx
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { db } from "../firebase-config";
import { setDoc, doc } from "firebase/firestore";

// Create an AuthContext
// before: React.createContext()
const AuthContext = React.createContext();

// function to use the context. This gives you access to AuthContext through the hook
export function useAuth() {
  return useContext(AuthContext);
}

// Take in children and then render them in the return statement
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  //   const usersCollectionRef = collection(db, "users");

  // we need to set the current user to the current user
  // we don't actually setCurrentUser. Firebase has a own way to notify when the user gets set -> auth.on. This will call setCurrentUser
  function signup(email, password) {
    // use auth module to signup a user
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function addUserToFireStore() {
    // Problem solved: For some reason, I can't use just currentUser. It seems to be undefined at this point in the code. I need to use auth.currentuser
    // problem solved: For the database reference, I used "usersCollectionRef" which did not work. Instead -> users
    // useSet to set an id. If document does not exist, it will be created. Otherwise, it will be updated
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      email: auth.currentUser.email,
      userID: auth.currentUser.uid,
      role: "admin",
      // expenses: [], // using set method, this will be created later anyways.
    });
  }

  // login
  // if you don't want to use firebase, you could just change this return line
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // logout
  function logout() {
    return signOut(auth);
  }

  // forgotpassword
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // update password
  function newPassword(password) {
    // current user and auth.curentUser are the same
    return updatePassword(currentUser, password);
  }

  // update email
  function newEmail(email) {
    // current user and auth.curentUser are the same
    return updateEmail(currentUser, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // const userEmail = user.email;
      // console.log("currentUser");
      // console.log(userEmail);
    });

    // unsubscribe when we unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    newEmail,
    newPassword,
    addUserToFireStore,
  };

  // Use the context inside the provider.
  // it contains all the information that we want to provide using our Authentication
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
