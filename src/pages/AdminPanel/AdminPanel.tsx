import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { uploadPlaceToFirestore } from '../../firebase/firebaseService';
import { translations } from '../../public/translations';
import MainLayout from '../../componenets/Layout/MainLayout';
import AdminPlaceEditor from '../../componenets/AdminPlaceEditor/AdminPlaceEditor';

const AdminPanel = () => {
  const dispatch: AppDispatch = useDispatch();
  const [placeData, setPlaceData] = useState(''); // Строка для ввода JSON

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlaceData(e.target.value);
  };

  // Получаем язык интерфейса и сокращение для переводов
  const { language } = useSelector((state: RootState) => state.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';

  // Проверка на валидность JSON
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
    <>
      <h1>{translations.adminPanel[languageShort]}</h1>
      <h2>{translations.addPlace[languageShort]}</h2>
      <textarea
        value={placeData}
        onChange={handleInputChange}
        rows={10}
        cols={50}
        placeholder={translations.pastePlaceJson[languageShort]}
      />
      <br />
      <button onClick={handleAddPlace}>{translations.addPlaceButton[languageShort]}</button>
      <AdminPlaceEditor />
    </>
  );
};

export default AdminPanel;
