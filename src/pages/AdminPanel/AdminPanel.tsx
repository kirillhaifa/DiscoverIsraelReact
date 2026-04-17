import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { uploadPlaceToFirestore } from '../../firebase/firebaseService';
import { translations } from '../../../public/translations';
import MainLayout from '../../componenets/Layout/MainLayout';
import AdminPlaceEditor from '../../componenets/AdminPlaceEditor/AdminPlaceEditor';
import CollectionCreator from '../../componenets/CollectionCreator/CollectionCreator';
import { Button, Box, Typography, Paper, CircularProgress } from '@mui/material';
import apiClient from '../../utils/apiClient';

const AdminPanel = () => {
  const dispatch: AppDispatch = useDispatch();
  const [placeData, setPlaceData] = useState('');
  const [showCollectionCreator, setShowCollectionCreator] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  const { language } = useSelector((state: RootState) => state.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  const handleInvalidateCache = async () => {
    setCacheStatus('loading');
    try {
      await apiClient.delete('/api/places/cache');
      setCacheStatus('ok');
      setTimeout(() => setCacheStatus('idle'), 3000);
    } catch (e) {
      setCacheStatus('error');
      setTimeout(() => setCacheStatus('idle'), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlaceData(e.target.value);
  };

  const validateJSON = (jsonString: string) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return { valid: true, parsedData };
    } catch (error) {
      return { valid: false, error };
    }
  };

  const handleAddPlace = async () => {
    const { valid, parsedData, error } = validateJSON(placeData);

    if (!valid) {
      alert(`${translations.invalidJson[languageShort]}: ${error.message}`);
      return;
    }

    try {
      await uploadPlaceToFirestore(parsedData);
      alert(translations.placeAddedSuccess[languageShort]);
      setPlaceData(''); // Очищаем поле ввода после успешного добавления
    } catch (error) {
      console.error(translations.addPlaceError[languageShort], error);
      alert(translations.addPlaceFail[languageShort]);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {translations.adminPanel[languageShort]}
      </Typography>
      
      {/* Инвалидация кэша Redis */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Redis Cache
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleInvalidateCache}
            disabled={cacheStatus === 'loading'}
            startIcon={cacheStatus === 'loading' ? <CircularProgress size={16} /> : null}
          >
            Инвалидировать кэш мест
          </Button>
          {cacheStatus === 'ok' && <Typography color="success.main">✅ Кэш очищен</Typography>}
          {cacheStatus === 'error' && <Typography color="error">❌ Ошибка — проверь токен</Typography>}
        </Box>
      </Paper>

      {/* Секция добавления мест */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {translations.addPlace[languageShort]}
        </Typography>
        <textarea
          value={placeData}
          onChange={handleInputChange}
          rows={10}
          cols={50}
          placeholder={translations.pastePlaceJson[languageShort]}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <br />
        <Button variant="contained" onClick={handleAddPlace}>
          {translations.addPlaceButton[languageShort]}
        </Button>
      </Paper>

      {/* Секция создания коллекций */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {translations.createCollection?.[languageShort] || 'Коллекции'}
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => setShowCollectionCreator(!showCollectionCreator)}
          >
            {showCollectionCreator 
              ? 'Скрыть создание коллекции'
              : 'Создать коллекцию'
            }
          </Button>
        </Box>
        {showCollectionCreator && (
          <CollectionCreator 
            onSuccess={(collectionId) => {
              setShowCollectionCreator(false);
              // Здесь можно добавить дополнительные действия после создания коллекции
            }}
          />
        )}
      </Paper>

      {/* Редактор мест */}
      <Paper sx={{ padding: 3 }}>
        <AdminPlaceEditor />
      </Paper>
    </Box>
  );
};

export default AdminPanel;
