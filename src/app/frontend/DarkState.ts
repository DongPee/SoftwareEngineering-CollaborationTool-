// themeState.ts
let darkMode = false;

export const getDarkMode = () => darkMode;
export const setDarkMode = (value: boolean) => {
  darkMode = value;
};