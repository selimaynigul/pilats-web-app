import AppNavigation from "navigation/app-navigation";
import { LanguageProvider, ThemeProvider } from "contexts";
import GlobalStyle from "GlobalStyles";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <GlobalStyle />
        <AppNavigation />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
