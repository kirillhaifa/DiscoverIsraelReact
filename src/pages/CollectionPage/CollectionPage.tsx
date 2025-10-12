import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCollectionsThunk } from '../../store/Collections/collectionsThunks';
import { translations } from '../../../public/translations';
import RecommendationCard from '../../componenets/RecommendationCard/PlaceInCollectionCard';
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Paper
} from '@mui/material';
import { IoArrowBack, IoLocationOutline } from 'react-icons/io5';
import { TbPhoto } from 'react-icons/tb';


const CollectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Функция для парсинга ссылок в тексте
  const parseTextWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Добавляем текст до ссылки
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Добавляем ссылку
      const linkText = match[1];
      const linkPath = match[2];
      
      parts.push(
        <span
          key={match.index}
          onClick={() => navigate(linkPath)}
          style={{ 
            color: 'var(--accent-color)', 
            cursor: 'pointer',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => (e.target as HTMLSpanElement).style.opacity = '0.8'}
          onMouseLeave={(e) => (e.target as HTMLSpanElement).style.opacity = '1'}
        >
          {linkText}
        </span>
      );
      
      lastIndex = linkRegex.lastIndex;
    }
    
    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 1 ? parts : text;
  };
  
  const language = useSelector((state: RootState) => state.language.language);
  const languageShort = { ru: 'ru', en: 'en', he: 'he' }[language] || 'en';
  const { collections, loading } = useSelector((state: RootState) => state.collections);
  const places = useSelector((state: RootState) => state.places.places);
  
  const [imgError, setImgError] = useState(false);
  
  // Загружаем коллекции, если они еще не загружены
  useEffect(() => {
    if (collections.length === 0) {
      dispatch(fetchCollectionsThunk());
    }
  }, [dispatch, collections.length]);
  
  // Найдем коллекцию по ID
  const collection = collections.find(c => c.id === id);
  
  // Найдем места для этой коллекции
  const collectionPlaces = places.filter(p => 
    collection ? collection.placeIds.includes(p.id) : false
  );
  
  const handleBack = () => {
    navigate('/recommendations');
  };
  
  // Показываем загрузку
  if (loading || !collection) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: 'var(--text-color)' }}>
            {translations.loading[languageShort]}
          </Typography>
        </Box>
      </Container>
    );
  }
  
  // Если коллекция не найдена
  if (!collection) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" gutterBottom sx={{ color: 'var(--text-color)' }}>
            {languageShort === 'ru' ? 'Коллекция не найдена' : 
             languageShort === 'en' ? 'Collection not found' : 
             'האוסף לא נמצא'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'var(--text-color)', opacity: 0.7 }}>
            {languageShort === 'ru' ? 'Возможно, коллекция была удалена или перемещена' : 
             languageShort === 'en' ? 'The collection may have been deleted or moved' : 
             'ייתכן שהאוסף נמחק או הועבר'}
          </Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Хлебные крошки и кнопка назад */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton 
            onClick={handleBack} 
            sx={{ color: 'var(--text-color)', '&:hover': { backgroundColor: 'var(--card-background)' } }}
          >
            <IoArrowBack />
          </IconButton>
          <Breadcrumbs sx={{ color: 'var(--text-color)' }}>
            <Link 
              href="#/recommendations"
              underline="hover"
              sx={{ 
                color: 'var(--text-color)', 
                '&:hover': { color: 'var(--accent-color)', opacity: 0.8 } 
              }}
            >
              {translations.thematicCollectionsTitle[language]}
            </Link>
            <Typography sx={{ color: 'var(--text-color)' }}>
              {collection.title[language] || collection.title.en}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
      
      {/* Главное фото коллекции */}
      {(!imgError && collection.coverPhoto) ? (
        <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
          <CardMedia
            component="img"
            sx={{ 
              height: { xs: 300, md: 400 },
              objectFit: 'contain',
              width: '100%'
            }}
            image={collection.coverPhoto}
            alt={collection.title[language] || collection.title.en}
            onError={() => setImgError(true)}
          />
        </Box>
      ) : (
        <Box
          sx={{
            height: { xs: 300, md: 400 },
            mb: 4,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'var(--card-background)',
            color: 'var(--text-color)',
            boxShadow: 3
          }}
        >
          <TbPhoto size={80} />
          <Typography variant="body2" sx={{ mt: 1, color: 'var(--text-color)' }}>
            {translations.noPhotoYet[languageShort]}
          </Typography>
        </Box>
      )}

      {/* Основная информация коллекции */}
      <Paper elevation={3} sx={{ mb: 4, p: 4, backgroundColor: 'var(--background-color)' }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, color: 'var(--text-color)' }}>
          {collection.title[language] || collection.title.en}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3, color: 'var(--text-color)' }}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <IoLocationOutline />
            <Typography variant="body1" sx={{ color: 'var(--text-color)' }}>
              {collection.placeIds.length} {
                languageShort === 'ru' 
                  ? (collection.placeIds.length === 1 ? 'место' : 
                     collection.placeIds.length <= 4 ? 'места' : 'мест')
                  : languageShort === 'en' 
                  ? (collection.placeIds.length === 1 ? 'place' : 'places')
                  : (collection.placeIds.length === 1 ? 'מקום' : 'מקומות')
              }
            </Typography>
          </Box>
        </Box>
        
        {/* Краткое описание */}
        <Typography variant="h6" paragraph sx={{ color: 'var(--text-color)', opacity: 0.8 }}>
          {collection.shortDescription[language] || collection.shortDescription.en}
        </Typography>
        
        {/* Подробное описание */}
        {collection.longDescription && (collection.longDescription[language] || collection.longDescription.en) && (
          <Typography variant="body1" paragraph sx={{ color: 'var(--text-color)' }}>
            {parseTextWithLinks(collection.longDescription[language] || collection.longDescription.en)}
          </Typography>
        )}
      </Paper>
      
      {/* Дополнительные фото */}
      {collection.collectionPhotos && collection.collectionPhotos.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: 'var(--background-color)' }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-color)' }}>
            {translations.collectionPhotos[language]}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            {collection.collectionPhotos.map((photo, index) => (
              <Box key={index}>
                <Card elevation={1}>
                  <CardMedia
                    component="img"
                    sx={{ height: 120, objectFit: 'cover' }}
                    image={photo}
                    alt={`Photo ${index + 1}`}
                  />
                </Card>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Места в коллекции */}
      <Paper elevation={2} sx={{ p: 3, backgroundColor: 'var(--background-color)' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-color)' }}>
          {translations.placesInCollection[language]}
        </Typography>
        
        {collectionPlaces.length === 0 ? (
          <Typography variant="body1" sx={{ py: 4, textAlign: 'center', color: 'var(--text-color)', opacity: 0.7 }}>
            {translations.placesNotFound[language]}
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mt: 2 }}>
            {collectionPlaces.map(place => (
              <Box key={place.id}>
                <RecommendationCard place={place} />
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CollectionPage;
