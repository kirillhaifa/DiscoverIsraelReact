import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../public/translations';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PiUserSquareThin } from "react-icons/pi";
import { useAuthState } from 'react-firebase-hooks/auth';
let classes = require('./profileButton.module.scss');
import { auth } from '../../../firebaseConfig';


const ProfileButton = () => {
  const { language } = useSelector((state: RootState) => state.language);
  const { userData } = useSelector((state: RootState) => state.user);

  return (
    <Link to="/profile" className={classes.profileButtonContainer}>
      <PiUserSquareThin className={classes.profileIcon} />
      <span className={classes.profileName}>
        {userData?.name ? userData.name : translations.profile[language]}
      </span>
    </Link>
  );
};

export default ProfileButton;
