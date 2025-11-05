import { AppProvider } from "./context/appContext";
import { Routing } from "./navigations/Routing";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <AppProvider>
      <Routing />
      <Toaster />
    </AppProvider>
  );
}

export default App;
