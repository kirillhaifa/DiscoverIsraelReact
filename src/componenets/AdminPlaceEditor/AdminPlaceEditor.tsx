import React, { useState } from 'react';
import apiClient from '../../utils/apiClient';

// Редактор фотографий — список записей с полями photoName и photoWay
const PhotoEditor = ({ photos, onChange }: { photos: { photoName: string; photoWay: string }[]; onChange: (updated: { photoName: string; photoWay: string }[]) => void }) => {
  const handlePhotoFieldChange = (index: number, field: 'photoName' | 'photoWay', value: string) => {
    const updated = photos.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  const addPhoto = () => {
    onChange([...photos, { photoName: '', photoWay: '' }]);
  };

  const removePhoto = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginLeft: '20px', marginTop: '4px' }}>
      {photos.map((photo, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ minWidth: '24px', color: '#888' }}>#{i + 1}</span>
          <input
            type="text"
            placeholder="photoName"
            value={photo.photoName ?? ''}
            onChange={(e) => handlePhotoFieldChange(i, 'photoName', e.target.value)}
            style={{ width: '180px' }}
          />
          <input
            type="text"
            placeholder="photoWay (URL)"
            value={photo.photoWay ?? ''}
            onChange={(e) => handlePhotoFieldChange(i, 'photoWay', e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button type="button" onClick={() => removePhoto(i)} style={{ color: 'red', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={addPhoto} style={{ marginTop: '4px' }}>+ Добавить фото</button>
    </div>
  );
};

// Функция для отображения вложенного объекта или массива
const renderNestedField = (fieldData, handleInputChange, handleDirectChange, parentKey) => {
  if (Array.isArray(fieldData)) {
    if (parentKey === 'photos') {
      return (
        <PhotoEditor
          photos={fieldData}
          onChange={(updated) => handleDirectChange(parentKey, updated)}
        />
      );
    }
    // Другие массивы (religions, tags и т.д.) — JSON textarea
    return (
      <textarea
        value={JSON.stringify(fieldData, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            handleDirectChange(parentKey, parsed);
          } catch {
            // ignore parse errors while typing
          }
        }}
        rows={4}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
    );
  }

  if (typeof fieldData === 'object' && fieldData !== null) {
    return Object.keys(fieldData).map((key) => (
      <div key={key} style={{ marginLeft: '20px' }}>
        <label>
          {`${parentKey}.${key}`}:
          {typeof fieldData[key] === 'object' && fieldData[key] !== null ? (
            renderNestedField(fieldData[key], handleInputChange, handleDirectChange, `${parentKey}.${key}`)
          ) : (
            isTextAreaField(`${parentKey}.${key}`) ? (
              <textarea
                value={fieldData[key] ?? ''}
                onChange={(e) => handleInputChange(e, `${parentKey}.${key}`)}
                rows={4}
                style={{ width: '100%' }}
              />
            ) : (
              <input
                type="text"
                value={fieldData[key] ?? ''}
                onChange={(e) => handleInputChange(e, `${parentKey}.${key}`)}
              />
            )
          )}
        </label>
      </div>
    ));
  }

  // null / undefined / primitive — показываем как обычное поле
  return (
    isTextAreaField(parentKey) ? (
      <textarea
        value={fieldData ?? ''}
        onChange={(e) => handleInputChange(e, parentKey)}
        rows={4}
        style={{ width: '100%' }}
      />
    ) : (
      <input
        type="text"
        value={fieldData ?? ''}
        onChange={(e) => handleInputChange(e, parentKey)}
      />
    )
  );
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
      const response = await apiClient.get(`/api/places/${placeId}`);
      const data = response.data.data;
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
      // Если промежуточный объект null/undefined — создаём пустой
      if (current[keys[i]] === null || current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = e.target.value;
    setPlaceData(updatedData);
  };

  // Обработчик для прямой установки значения (без event), используется для массивов
  const handleDirectChange = (key: string, value: unknown) => {
    const keys = key.split('.');
    const updatedData = { ...placeData };
    let current = updatedData as any;

    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === null || current[keys[i]] === undefined) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setPlaceData(updatedData);
  };

  // Функция для обновления данных на сервере
  const updatePlaceData = async () => {
    setIsSaving(true);
    try {
      // Обновляем поля места через API
      await apiClient.patch(`/api/places/${placeId}`, placeData);
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
                {Array.isArray(placeData[key]) ? (
                  renderNestedField(placeData[key], handleInputChange, handleDirectChange, key)
                ) : typeof placeData[key] === 'object' && placeData[key] !== null ? (
                  renderNestedField(placeData[key], handleInputChange, handleDirectChange, key)
                ) : (
                  isTextAreaField(key) ? (
                    <textarea
                      value={placeData[key] ?? ''}
                      onChange={(e) => handleInputChange(e, key)}
                      rows={4}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={placeData[key] ?? ''}
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
