import AppNavigation from "navigation/app-navigation";
import { AuthProvider, LanguageProvider, ThemeProvider } from "contexts";
import GlobalStyle from "GlobalStyles";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <GlobalStyle />
          <AppNavigation />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
