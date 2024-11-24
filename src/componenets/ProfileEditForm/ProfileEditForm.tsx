// src/components/ProfileEditForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { updateUserThunk } from '../../store/User/updateUserThunk';

const ProfileEditForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userData, loading, error } = useSelector((state: RootState) => state.user);
  
  const [formData, setFormData] = useState({
    userID: '',
    name: '',
    surname: '',
    premiumStatus: false,
    email: '',
    profilePicture: '',
    placesMarks: [],
    wishlist: [],
    language: '',
    colorTheme: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        userID: userData.userID,
        name: userData.name,
        surname: userData.surname,
        premiumStatus: userData.premiumStatus,
        email: userData.email,
        profilePicture: userData.profilePicture,
        language: userData.language || '',
        colorTheme: userData.colorTheme || '',
        placesMarks: userData.ratings || [], // добавлено
        wishlist: userData.wishlist || [],       // добавлено
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserThunk(formData)); // Передаем formData в updateUserThunk
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Surname:</label>
        <input name="surname" value={formData.surname} onChange={handleChange} />
      </div>
      <div>
        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label>Premium Status:</label>
        <input
          type="checkbox"
          name="premiumStatus"
          checked={formData.premiumStatus}
          onChange={(e) => setFormData((prev) => ({ ...prev, premiumStatus: e.target.checked }))}
        />
      </div>
      <div>
        <label>Language:</label>
        <input name="language" value={formData.language} onChange={handleChange} />
      </div>
      <div>
        <label>Color Theme:</label>
        <input name="colorTheme" value={formData.colorTheme} onChange={handleChange} />
      </div>
      <button type="submit">Save changes</button>
    </form>
    </>
  );
};

export default ProfileEditForm;
