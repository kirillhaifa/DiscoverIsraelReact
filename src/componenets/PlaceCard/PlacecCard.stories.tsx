import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PlaceCard from './PlaceCard';
import languageReducer from '../../store/Language/languageSlice';
import userReducer from '../../store/User/userSlice';
import '../../public/Styles/themes.module.scss';
import '../../public/Styles/normalizer.module.scss';

// Моковые данные для компонента
const mockPlace = {
  "number": 80,
  "placeName": {
    "en": "Mini Israel Park",
    "he": "פארק מיני ישראל",
    "ru": "Парк Маленький Израиль"
  },
  "coordinates": [31.8631, 34.9753],
  "ticketPrice": {
    "adult": 40,
    "child": 30
  },
  "contact": {
    "phone": "+972-8-9130010",
    "email": "info@minisrael.co.il",
    "website": "https://www.minisrael.co.il"
  },
  "region": "Central Israel",
  "minVisitTime": 120,
  "photos": [
    {
      "photoName": "Mini Israel Park",
      "photoWay": "https://icache.rutraveller.ru/icache/place/7/309/7309_603x354.jpg"
    }
  ],
  "extendedDescription": {
    "en": "Mini Israel Park is a unique attraction showcasing Israel's famous landmarks in miniature form. Visitors can explore detailed replicas of historical and cultural sites across Israel, all scaled down to a compact size. Perfect for families, the park offers a unique overview of Israel’s geography and architecture, allowing guests to experience the country's diversity in a single day.",
    "he": "פארק מיני ישראל הוא אטרקציה ייחודית המציגה דגמים מוקטנים של אתרים מפורסמים ברחבי ישראל. המבקרים יכולים לחקור רפליקות מפורטות של אתרים היסטוריים ותרבותיים מכל רחבי הארץ. זהו מקום מושלם למשפחות ומספק מבט מקיף על הגיאוגרפיה והאדריכלות של ישראל ביום אחד.",
    "ru": "Парк Маленький Израиль — уникальная достопримечательность, демонстрирующая миниатюрные копии известных израильских мест. Посетители могут увидеть детализированные реплики исторических и культурных достопримечательностей по всей стране. Парк идеально подходит для семей и позволяет получить общее представление о географии и архитектуре Израиля за один день."
  },
  "googleMapsLink": "https://maps.app.goo.gl/PwVCqjmQsjRpqagR8",
  "shortDescription": {
    "en": "Miniature park displaying Israel's famous landmarks in one location.",
    "he": "פארק מיני המציג את אתרי ישראל במקום אחד.",
    "ru": "Миниатюрный парк с известными достопримечательностями Израиля в одном месте."
  },
  "schedule": {
    "summer": {
      "weekdaysAndSaturday": {
        "open": "10:00",
        "close": "19:00"
      },
      "fridayAndHolidaysEve": {
        "open": "10:00",
        "close": "17:00"
      }
    },
    "winter": {
      "weekdaysAndSaturday": {
        "open": "10:00",
        "close": "17:00"
      },
      "fridayAndHolidaysEve": {
        "open": "10:00",
        "close": "16:00"
      }
    },
    "notes": {
      "en": "Opening hours may vary on holidays.",
      "he": "שעות הפתיחה עשויות להשתנות בחגים.",
      "ru": "Часы работы могут меняться в праздничные дни."
    }
  },
  "favoriteMonths": {
    "January": true,
    "February": true,
    "March": true,
    "April": true,
    "May": true,
    "June": true,
    "July": true,
    "August": true,
    "September": true,
    "October": true,
    "November": true,
    "December": true
  },
  "parameters": {
    "grill": false,
    "hiking": false,
    "view": true,
    "transport": true,
    "beach": false,
    "historical": false,
    "free": false,
    "pets": false,
    "parking": true,
    "toilets": true,
    "drinkingWater": true,
    "cafe": true,
    "wifi": false,
    "accessible": true,
    "unesco": false,
    "nationalPark": false,
    "kidsFriendly": true
  }
}


const createMockStore = (language: string, userRole: string) =>
  configureStore({
    reducer: {
      language: languageReducer,
      user: userReducer,
    },
    preloadedState: {
      language: { language },
      user: {
        userData: { name: 'Test User', email: 'test@example.com', role: userRole },
        loading: false,
        error: null,
      },
    },
  });

export default {
  title: 'Components/PlaceCard',
  component: PlaceCard,
  decorators: [
    (Story, context) => {
      const { language = 'en', userRole = 'user' } = context.args;
      const store = createMockStore(language, userRole);

      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
};

const Template = (args) => <PlaceCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  place: mockPlace,
  onClick: () => console.log('PlaceCard clicked'),
};

export const AdminView = Template.bind({});
AdminView.args = {
  place: mockPlace,
  onClick: () => console.log('PlaceCard clicked'),
  userRole: 'admin',
};

export const HebrewLanguage = Template.bind({});
HebrewLanguage.args = {
  place: mockPlace,
  onClick: () => console.log('PlaceCard clicked'),
  language: 'he',
};

export const RussianLanguage = Template.bind({});
RussianLanguage.args = {
  place: mockPlace,
  onClick: () => console.log('PlaceCard clicked'),
  language: 'ru',
};
