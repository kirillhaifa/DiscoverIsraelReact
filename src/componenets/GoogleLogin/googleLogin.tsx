// src/components/GoogleLogin.tsx
import React from 'react';
import { handleGoogleSignIn } from '../../firebase/authService';
import { FcGoogle } from "react-icons/fc";let classes = require('./googleLogin.module.scss');

const GoogleLogin = () => {
  return (
    <div
      className={`${classes.buttonContainer}`}
      onClick={handleGoogleSignIn}
    >
      <FcGoogle className={classes.icon}/>
      <button className={classes.button}> Sign in with Google</button>
    </div>
  );
};

export default GoogleLogin;
