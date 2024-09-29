import AppNavigation from "navigation/app-navigation";
import { LanguageProvider, ThemeProvider } from "contexts";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
