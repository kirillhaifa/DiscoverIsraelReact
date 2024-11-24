import { createSelector } from "reselect";
import { RootState } from "../../store";

// Базовый селектор для слайса языка
const selectLanguageSlice = (state: RootState) => state.language;

// Селектор для получения текущего языка
export const selectLanguage = createSelector(
  [selectLanguageSlice],
  (languageState) => languageState.language
);

// Селектор для проверки языка (динамический)
export const selectIsLanguage = (language: string) =>
  createSelector([selectLanguage], (currentLanguage) => currentLanguage === language);
