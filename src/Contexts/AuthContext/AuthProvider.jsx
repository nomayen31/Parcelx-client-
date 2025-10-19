import React, { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile,  } from "firebase/auth";
import { auth } from "../../Firebase/firebase.init";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading , SetLoading] =useState(true)

  const signInWithGoogle = () => {
    SetLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = () => {
    SetLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const signInUser = (email , password)=>{
    SetLoading(true); 
    return signInWithEmailAndPassword(auth, email, password)
  }
  const createNewUser = (email, password)=>{
    SetLoading(true); 
    return createUserWithEmailAndPassword(auth,email, password)
  }
  const updateUser = (updatedData)=>{
    return updateProfile(auth.currentUser, updatedData)
  }
  const forgetPassword =(email)=>{
        SetLoading(true); 
    return sendPasswordResetEmail(auth, email)
  }
  const logout = () =>{
    return signOut(auth)
  }
  const userInfo = {
    user,
    setUser,
    createNewUser,
    logout,
    signInUser,
    loading,
    SetLoading,
    updateUser,
    signInWithGoogle,
    signInWithGithub,
    forgetPassword
  };
  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, currentUser=>{
      setUser(currentUser)
      SetLoading(false)
    })
    return() =>{
      unsubscribe();
    }
  },[])
  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;