// src/components/ProfileEditForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { updateUserThunk } from '../../store/User/updateUserThunk';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { translations } from '../../public/translations';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ProfileEditForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userData, loading, error } = useSelector((state: RootState) => state.user);
  const language = useSelector((state: RootState) => state.language.language);
  const t = (key: keyof typeof translations) => translations[key][language] || translations[key].en;
  const theme = useTheme();

  const [formData, setFormData] = useState({
    userID: '',
    name: '',
    surname: '',
    premiumStatus: false,
    email: '',
    profilePicture: '',
    placesMarks: [] as any[],
    wishlist: [] as any[],
    language: '',
    colorTheme: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        userID: userData.userID,
        name: userData.name || '',
        surname: userData.surname || '',
        premiumStatus: !!userData.premiumStatus,
        email: userData.email || '',
        profilePicture: userData.profilePicture || '',
        language: userData.language || '',
        colorTheme: userData.colorTheme || '',
        placesMarks: userData.ratings || [],
        wishlist: userData.wishlist || [],
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserThunk(formData));
  };

  if (loading) return <Typography variant="body2">{t('loading')}...</Typography>;
  if (error) return <Typography color="error">{t('error')}: {error}</Typography>;
  if (!userData) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{t('profile')}</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>{t('firstName')}</Typography>
          <TextField variant="outlined" fullWidth margin="dense" name="name" placeholder={t('firstName')} value={formData.name} onChange={handleChange} size="small" />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>{t('lastName')}</Typography>
          <TextField variant="outlined" fullWidth margin="dense" name="surname" placeholder={t('lastName')} value={formData.surname} onChange={handleChange} size="small" />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>{t('email')}</Typography>
          <TextField variant="outlined" fullWidth margin="dense" name="email" placeholder={t('email')} value={formData.email} onChange={handleChange} size="small" />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>Avatar URL</Typography>
          <TextField variant="outlined" fullWidth margin="dense" name="profilePicture" placeholder="https://" value={formData.profilePicture} onChange={handleChange} size="small" />
        </Box>
        {/* <Divider sx={{ my: 1 }} />
        <FormControlLabel
          control={<Checkbox checked={formData.premiumStatus} onChange={(e) => setFormData(p => ({ ...p, premiumStatus: e.target.checked }))} />}
          label={t('premiumStatus')}
        />
        <FormControl fullWidth margin="dense" size="small" variant="outlined">
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>{t('language')}</Typography>
          <Select
            name="language"
            value={formData.language}
            onChange={(e: SelectChangeEvent) => setFormData(p => ({ ...p, language: e.target.value }))}
            displayEmpty
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="he">עברית</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense" size="small" variant="outlined">
          <Typography variant="caption" sx={{ fontWeight: 600, mb: .5 }}>{t('colorTheme')}</Typography>
          <Select
            name="colorTheme"
            value={formData.colorTheme}
            onChange={(e: SelectChangeEvent) => setFormData(p => ({ ...p, colorTheme: e.target.value }))}
            displayEmpty
          >
            <MenuItem value="light">{translations.light[language]}</MenuItem>
            <MenuItem value="dark">{translations.dark[language]}</MenuItem>
          </Select>
        </FormControl> */}
        <Box sx={{ display:'flex', gap:2, mt:1 }}>
          <Button variant="contained" type="submit">{t('saveChanges')}</Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileEditForm;
