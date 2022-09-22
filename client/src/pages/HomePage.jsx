
import React, {useEffect, useState} from "react";
import Main from '../components/Main';
import MainEng from '../components/MainEng';
import Select from '../components/Select';


import i18next, { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
  detection:{
    // order and from where user language should be detected
    order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
  
    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
  
    // optional expire and domain for set cookie
    cookieMinutes: 10,
    cookieDomain: 'myDomain',
  
    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement,
  
    // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    cookieOptions: { path: '/', sameSite: 'strict' }
  },
});

const HomePage = () => {
  const [language, setLanguage] = useState();

  useEffect(()=>{
    setLanguage(i18next.language)
  },[i18next.language]);

  console.log('home page language', language )
  return(
    (language === 'en-US' || language === 'en') ?
      (<MainEng />)
      :
      (<Main />)
  )
};

export default HomePage;