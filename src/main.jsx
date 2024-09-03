import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LanguageProvider } from './translations/LanguageContext.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import pl from 'date-fns/locale/pl';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='8218279479-970tm6tra2pje83ob0mlqn2a8hepme94.apps.googleusercontent.com'>
    <React.StrictMode>
      <LanguageProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>

      <App />
      </LocalizationProvider>,

      </LanguageProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>

)
