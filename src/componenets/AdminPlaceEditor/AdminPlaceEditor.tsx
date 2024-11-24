import React, { useState } from 'react';
import { editPlaceField, fetchPlaceById } from '../../firebase/firebaseService';

// Функция для отображения вложенного объекта или массива
const renderNestedField = (fieldData, handleInputChange, parentKey) => {
  if (typeof fieldData === 'object' && fieldData !== null) {
    return Object.keys(fieldData).map((key) => (
      <div key={key} style={{ marginLeft: '20px' }}>
        <label>
          {`${parentKey}.${key}`}:
          {typeof fieldData[key] === 'object' && fieldData[key] !== null ? (
            // Рекурсивно отображаем вложенные поля
            renderNestedField(fieldData[key], handleInputChange, `${parentKey}.${key}`)
          ) : (
            isTextAreaField(`${parentKey}.${key}`) ? (
              <textarea
                value={fieldData[key] || ''}
                onChange={(e) => handleInputChange(e, `${parentKey}.${key}`)}
                rows={4}
                style={{ width: '100%' }}
              />
            ) : (
              <input
                type="text"
                value={fieldData[key] || ''}
                onChange={(e) => handleInputChange(e, `${parentKey}.${key}`)}
              />
            )
          )}
        </label>
      </div>
    ));
  } else {
    return (
      isTextAreaField(parentKey) ? (
        <textarea
          value={fieldData || ''}
          onChange={(e) => handleInputChange(e, parentKey)}
          rows={4}
          style={{ width: '100%' }}
        />
      ) : (
        <input
          type="text"
          value={fieldData || ''}
          onChange={(e) => handleInputChange(e, parentKey)}
        />
      )
    );
  }
};

// Функция для определения, должно ли поле быть textarea
const isTextAreaField = (key) => {
  // Здесь указываем конкретные поля, которые должны быть textarea
  const textAreaFields = [
    'shortDescription.en',
    'shortDescription.he',
    'shortDescription.ru',
    'extendedDescription.en',
    'extendedDescription.he',
    'extendedDescription.ru',
    'placeName.en',
    'placeName.he',
    'placeName.ru'
  ];
  return textAreaFields.includes(key);
};

// Компонент для редактирования данных о месте
const AdminPlaceEditor = () => {
  const [placeId, setPlaceId] = useState(''); // Состояние для Id места
  const [placeData, setPlaceData] = useState(null); // Состояние для данных места
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const [isSaving, setIsSaving] = useState(false); // Состояние сохранения

  // Функция для загрузки данных места по Id
  const fetchPlaceData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPlaceById(placeId); // Используем Firebase API для получения данных места
      if (data) {
        setPlaceData(data); // Устанавливаем данные места
      } else {
        alert('Place not found.');
      }
    } catch (error) {
      console.error('Error fetching place data:', error);
      alert('Failed to load place data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения значения Id
  const handleIdChange = (e) => {
    setPlaceId(e.target.value);
  };

  // Обработчик отправки формы для загрузки данных
  const handleFetchSubmit = (e) => {
    e.preventDefault();
    if (placeId) {
      fetchPlaceData();
    } else {
      alert('Please enter a valid Place Id.');
    }
  };

  // Обработчик изменения данных в форме
  const handleInputChange = (e, key) => {
    const keys = key.split('.');
    const updatedData = { ...placeData };
    let current = updatedData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = e.target.value;
    setPlaceData(updatedData);
  };

  // Функция для обновления данных на сервере
  const updatePlaceData = async () => {
    setIsSaving(true);
    try {
      // Обновляем каждое измененное поле в Firestore
      await editPlaceField(placeId, placeData); // Используем Firebase API для обновления данных
      alert('Place data successfully updated!');
    } catch (error) {
      console.error('Error updating place data:', error);
      alert('Failed to update place data.');
    } finally {
      setIsSaving(false);
    }
  };

  // Обработчик отправки формы для обновления данных
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (placeData) {
      updatePlaceData();
    }
  };

  return (
    <div>
      {/* Форма для ввода Id места */}
      <form onSubmit={handleFetchSubmit}>
        <label>
          Enter Place Id:
          <input
            type="text"
            value={placeId}
            onChange={handleIdChange}
            placeholder="Enter Place Id"
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load Place Data'}
        </button>
      </form>

      {/* Форма для редактирования данных места */}
      {placeData && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Edit Place Data</h2>
          {Object.keys(placeData).map((key) => (
            <div key={key}>
              <label>
                {key}:
                {typeof placeData[key] === 'object' ? (
                  // Если поле объект или массив, отображаем его рекурсивно
                  renderNestedField(placeData[key], handleInputChange, key)
                ) : (
                  // Проверяем, является ли поле описанием или названием
                  isTextAreaField(key) ? (
                    <textarea
                      value={placeData[key] || ''}
                      onChange={(e) => handleInputChange(e, key)}
                      rows={4}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={placeData[key] || ''}
                      onChange={(e) => handleInputChange(e, key)}
                    />
                  )
                )}
              </label>
            </div>
          ))}
          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Submit Changes'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPlaceEditor;
