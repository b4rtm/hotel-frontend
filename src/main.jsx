import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LanguageProvider } from './translations/LanguageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='8218279479-970tm6tra2pje83ob0mlqn2a8hepme94.apps.googleusercontent.com'>
    <React.StrictMode>
      <LanguageProvider>
      <App />
      </LanguageProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>

)
