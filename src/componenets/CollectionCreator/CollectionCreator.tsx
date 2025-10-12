import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createCollection } from '../../firebase/firebaseService';
import { translations } from '../../../public/translations';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebaseConfig';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
let classes = require('./CollectionCreator.module.scss');

interface CollectionCreatorProps {
  onSuccess?: (collectionId: string) => void;
}



const CollectionCreator: React.FC<CollectionCreatorProps> = ({ onSuccess }) => {
  const [user] = useAuthState(auth);

  const [collectionData, setCollectionData] = useState(''); // Строка для ввода JSON
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCollectionData(e.target.value);
    // Очищаем сообщения при изменении
    if (errors.length > 0) {
      setErrors([]);
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Проверка на валидность JSON
  const validateJSON = (jsonString: string) => {
    try {
      const parsedData = JSON.parse(jsonString);
      return { valid: true, parsedData };
    } catch (error) {
      return { valid: false, error };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!user) {
      setErrors(['Вы должны быть авторизованы для создания коллекции']);
      return;
    }

    const { valid, parsedData, error } = validateJSON(collectionData);

    if (!valid) {
      setErrors([`Неверный JSON: ${error.message}`]);
      return;
    }

    setLoading(true);

    try {
      const collectionId = await createCollection(parsedData, user.uid);
      setSuccessMessage('Коллекция успешно создана!');
      setCollectionData(''); // Очищаем поле ввода

      if (onSuccess) {
        onSuccess(collectionId);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      setErrors(['Ошибка при создании коллекции']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }} className={classes.container}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Создание коллекции
      </Typography>

      {/* Отображение ошибок */}
      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Ошибки валидации:</AlertTitle>
          {errors.map((error, index) => (
            <Typography key={index} variant="body2">
              • {error}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Отображение успешного сообщения */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Успешно!</AlertTitle>
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Добавить коллекцию (JSON)
        </Typography>
        
        <TextField
          multiline
          rows={15}
          variant="outlined"
          fullWidth
          value={collectionData}
          onChange={handleInputChange}
          placeholder='Вставьте JSON коллекции, например:
{
  "title": { "ru": "Название", "en": "Title", "he": "כותרת" },
  "shortDescription": { "ru": "Краткое описание", "en": "Short description", "he": "תיאור קצר" },
  "longDescription": { "ru": "Подробное описание", "en": "Long description", "he": "תיאור מפורט" },
  "coverPhoto": "https://example.com/photo.jpg",
  "collectionPhotos": ["https://example.com/photo1.jpg"],
  "placeIds": ["place-id-1", "place-id-2"],
  "isPublic": true
}'
          label="JSON данные коллекции"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Загрузка...' : 'Создать коллекцию'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CollectionCreator;
