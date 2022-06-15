import "../styles/globals.css";
import { AuthProvider } from "../Contexts/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Component {...pageProps} />
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default MyApp;
