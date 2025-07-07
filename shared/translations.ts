/**
 * MULTILINGUAL TRANSLATIONS
 * 
 * Translation strings for all supported languages
 * Supports: English, Spanish, Italian, German, Dutch, Portuguese
 */

import type { SupportedLanguage } from '../client/src/lib/i18n';

export interface TranslationStrings {
  // Navigation
  home: string;
  browse: string;
  about: string;
  contact: string;
  favorites: string;
  howItWorks: string;
  submitProfile: string;
  login: string;
  logout: string;
  
  // Common UI
  search: string;
  filter: string;
  sort: string;
  viewProfile: string;
  addToCart: string;
  removeFromCart: string;
  cart: string;
  checkout: string;
  age: string;
  location: string;
  name: string;
  photos: string;
  videos: string;
  
  // Profile fields
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  height: string;
  bodyType: string;
  education: string;
  occupation: string;
  aboutMe: string;
  interests: string;
  lookingFor: string;
  
  // Countries and locations (Dominican Republic focused)
  dominicanRepublic: string;
  santiago: string;
  santodomingo: string;
  puertoPlata: string;
  laRomana: string;
  sanPedro: string;
  
  // Prepositions for profile URLs
  from: string; // "from" in English, "de" in Spanish, etc.
  
  // Page titles and descriptions
  pageTitle: {
    home: string;
    browse: string;
    about: string;
    contact: string;
    profile: string;
  };
  
  // SEO meta descriptions
  metaDescription: {
    home: string;
    browse: string;
    about: string;
    contact: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationStrings> = {
  en: {
    // Navigation
    home: 'Home',
    browse: 'Browse Profiles',
    about: 'About',
    contact: 'Contact',
    favorites: 'Favorites',
    howItWorks: 'How It Works',
    submitProfile: 'Submit Profile',
    login: 'Login',
    logout: 'Logout',
    
    // Common UI
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    viewProfile: 'View Profile',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove from Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    age: 'Age',
    location: 'Location',
    name: 'Name',
    photos: 'Photos',
    videos: 'Videos',
    
    // Profile fields
    firstName: 'First Name',
    lastName: 'Last Name',
    city: 'City',
    country: 'Country',
    height: 'Height',
    bodyType: 'Body Type',
    education: 'Education',
    occupation: 'Occupation',
    aboutMe: 'About Me',
    interests: 'Interests',
    lookingFor: 'Looking For',
    
    // Countries and locations
    dominicanRepublic: 'Dominican Republic',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'from',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Meet Beautiful Dominican Women',
      browse: 'Browse Dominican Profiles - HolaCupid',
      about: 'About HolaCupid - Dominican Dating Platform',
      contact: 'Contact HolaCupid - Dominican Dating Support',
      profile: 'Profile - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Meet verified Dominican women on HolaCupid. Premium dating platform connecting international men with authentic Dominican singles. Start your journey today.',
      browse: 'Browse verified profiles of beautiful Dominican women. Find your perfect match with advanced search and filtering options on HolaCupid.',
      about: 'Learn about HolaCupid, the leading Dominican dating platform. Discover our mission, safety features, and success stories.',
      contact: 'Contact HolaCupid support team. Get help with your account, technical issues, or general inquiries about our Dominican dating platform.'
    }
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    browse: 'Explorar Perfiles',
    about: 'Acerca de',
    contact: 'Contacto',
    favorites: 'Favoritos',
    howItWorks: 'Cómo Funciona',
    submitProfile: 'Enviar Perfil',
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    
    // Common UI
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    viewProfile: 'Ver Perfil',
    addToCart: 'Añadir al Carrito',
    removeFromCart: 'Quitar del Carrito',
    cart: 'Carrito',
    checkout: 'Finalizar Compra',
    age: 'Edad',
    location: 'Ubicación',
    name: 'Nombre',
    photos: 'Fotos',
    videos: 'Videos',
    
    // Profile fields
    firstName: 'Nombre',
    lastName: 'Apellido',
    city: 'Ciudad',
    country: 'País',
    height: 'Altura',
    bodyType: 'Tipo de Cuerpo',
    education: 'Educación',
    occupation: 'Ocupación',
    aboutMe: 'Acerca de Mí',
    interests: 'Intereses',
    lookingFor: 'Buscando',
    
    // Countries and locations
    dominicanRepublic: 'República Dominicana',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'de',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Conoce Hermosas Mujeres Dominicanas',
      browse: 'Explorar Perfiles Dominicanos - HolaCupid',
      about: 'Acerca de HolaCupid - Plataforma de Citas Dominicana',
      contact: 'Contactar HolaCupid - Soporte de Citas Dominicanas',
      profile: 'Perfil - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Conoce mujeres dominicanas verificadas en HolaCupid. Plataforma premium que conecta hombres internacionales con solteras dominicanas auténticas.',
      browse: 'Explora perfiles verificados de hermosas mujeres dominicanas. Encuentra tu pareja perfecta con opciones avanzadas de búsqueda en HolaCupid.',
      about: 'Conoce HolaCupid, la plataforma líder de citas dominicanas. Descubre nuestra misión, características de seguridad e historias de éxito.',
      contact: 'Contacta al equipo de soporte de HolaCupid. Obtén ayuda con tu cuenta, problemas técnicos o consultas generales sobre nuestra plataforma.'
    }
  },
  
  it: {
    // Navigation
    home: 'Home',
    browse: 'Esplora Profili',
    about: 'Chi Siamo',
    contact: 'Contatti',
    favorites: 'Preferiti',
    howItWorks: 'Come Funziona',
    submitProfile: 'Invia Profilo',
    login: 'Accedi',
    logout: 'Esci',
    
    // Common UI
    search: 'Cerca',
    filter: 'Filtra',
    sort: 'Ordina',
    viewProfile: 'Vedi Profilo',
    addToCart: 'Aggiungi al Carrello',
    removeFromCart: 'Rimuovi dal Carrello',
    cart: 'Carrello',
    checkout: 'Checkout',
    age: 'Età',
    location: 'Posizione',
    name: 'Nome',
    photos: 'Foto',
    videos: 'Video',
    
    // Profile fields
    firstName: 'Nome',
    lastName: 'Cognome',
    city: 'Città',
    country: 'Paese',
    height: 'Altezza',
    bodyType: 'Tipo di Corpo',
    education: 'Istruzione',
    occupation: 'Occupazione',
    aboutMe: 'Chi Sono',
    interests: 'Interessi',
    lookingFor: 'Cerco',
    
    // Countries and locations
    dominicanRepublic: 'Repubblica Dominicana',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'da',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Incontra Belle Donne Dominicane',
      browse: 'Esplora Profili Dominicani - HolaCupid',
      about: 'Chi Siamo - Piattaforma di Incontri Dominicana',
      contact: 'Contatta HolaCupid - Supporto Incontri Dominicani',
      profile: 'Profilo - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Incontra donne dominicane verificate su HolaCupid. Piattaforma premium che connette uomini internazionali con single dominicane autentiche.',
      browse: 'Esplora profili verificati di belle donne dominicane. Trova la tua anima gemella con opzioni avanzate di ricerca su HolaCupid.',
      about: 'Scopri HolaCupid, la piattaforma leader per incontri dominicani. Conosci la nostra missione, caratteristiche di sicurezza e storie di successo.',
      contact: 'Contatta il team di supporto HolaCupid. Ricevi aiuto per il tuo account, problemi tecnici o domande generali sulla nostra piattaforma.'
    }
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    browse: 'Profile Durchsuchen',
    about: 'Über Uns',
    contact: 'Kontakt',
    favorites: 'Favoriten',
    howItWorks: 'Wie Es Funktioniert',
    submitProfile: 'Profil Einreichen',
    login: 'Anmelden',
    logout: 'Abmelden',
    
    // Common UI
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    viewProfile: 'Profil Ansehen',
    addToCart: 'In Warenkorb',
    removeFromCart: 'Aus Warenkorb Entfernen',
    cart: 'Warenkorb',
    checkout: 'Zur Kasse',
    age: 'Alter',
    location: 'Standort',
    name: 'Name',
    photos: 'Fotos',
    videos: 'Videos',
    
    // Profile fields
    firstName: 'Vorname',
    lastName: 'Nachname',
    city: 'Stadt',
    country: 'Land',
    height: 'Größe',
    bodyType: 'Körpertyp',
    education: 'Bildung',
    occupation: 'Beruf',
    aboutMe: 'Über Mich',
    interests: 'Interessen',
    lookingFor: 'Suche Nach',
    
    // Countries and locations
    dominicanRepublic: 'Dominikanische Republik',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'aus',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Treffe Schöne Dominikanische Frauen',
      browse: 'Dominikanische Profile Durchsuchen - HolaCupid',
      about: 'Über HolaCupid - Dominikanische Dating-Plattform',
      contact: 'HolaCupid Kontaktieren - Dominikanischer Dating-Support',
      profile: 'Profil - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Treffe verifizierte dominikanische Frauen auf HolaCupid. Premium-Dating-Plattform verbindet internationale Männer mit authentischen dominikanischen Singles.',
      browse: 'Durchsuche verifizierte Profile schöner dominikanischer Frauen. Finde deinen perfekten Partner mit erweiterten Suchoptionen auf HolaCupid.',
      about: 'Erfahre mehr über HolaCupid, die führende dominikanische Dating-Plattform. Entdecke unsere Mission, Sicherheitsfeatures und Erfolgsgeschichten.',
      contact: 'Kontaktiere das HolaCupid Support-Team. Erhalte Hilfe bei deinem Konto, technischen Problemen oder allgemeinen Anfragen zu unserer Plattform.'
    }
  },
  
  nl: {
    // Navigation
    home: 'Home',
    browse: 'Profielen Bekijken',
    about: 'Over Ons',
    contact: 'Contact',
    favorites: 'Favorieten',
    howItWorks: 'Hoe Het Werkt',
    submitProfile: 'Profiel Indienen',
    login: 'Inloggen',
    logout: 'Uitloggen',
    
    // Common UI
    search: 'Zoeken',
    filter: 'Filteren',
    sort: 'Sorteren',
    viewProfile: 'Profiel Bekijken',
    addToCart: 'Toevoegen aan Winkelwagen',
    removeFromCart: 'Verwijderen uit Winkelwagen',
    cart: 'Winkelwagen',
    checkout: 'Afrekenen',
    age: 'Leeftijd',
    location: 'Locatie',
    name: 'Naam',
    photos: 'Foto\'s',
    videos: 'Video\'s',
    
    // Profile fields
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    city: 'Stad',
    country: 'Land',
    height: 'Lengte',
    bodyType: 'Lichaamstype',
    education: 'Opleiding',
    occupation: 'Beroep',
    aboutMe: 'Over Mij',
    interests: 'Interesses',
    lookingFor: 'Op Zoek Naar',
    
    // Countries and locations
    dominicanRepublic: 'Dominicaanse Republiek',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'uit',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Ontmoet Mooie Dominicaanse Vrouwen',
      browse: 'Dominicaanse Profielen Bekijken - HolaCupid',
      about: 'Over HolaCupid - Dominicaans Dating Platform',
      contact: 'Contact HolaCupid - Dominicaanse Dating Ondersteuning',
      profile: 'Profiel - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Ontmoet geverifieerde Dominicaanse vrouwen op HolaCupid. Premium dating platform verbindt internationale mannen met authentieke Dominicaanse singles.',
      browse: 'Bekijk geverifieerde profielen van mooie Dominicaanse vrouwen. Vind je perfecte match met geavanceerde zoekopties op HolaCupid.',
      about: 'Leer over HolaCupid, het leidende Dominicaanse dating platform. Ontdek onze missie, veiligheidsfeatures en succesverhalen.',
      contact: 'Neem contact op met het HolaCupid support team. Krijg hulp bij je account, technische problemen of algemene vragen over ons platform.'
    }
  },
  
  pt: {
    // Navigation
    home: 'Início',
    browse: 'Explorar Perfis',
    about: 'Sobre Nós',
    contact: 'Contato',
    favorites: 'Favoritos',
    howItWorks: 'Como Funciona',
    submitProfile: 'Enviar Perfil',
    login: 'Entrar',
    logout: 'Sair',
    
    // Common UI
    search: 'Pesquisar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    viewProfile: 'Ver Perfil',
    addToCart: 'Adicionar ao Carrinho',
    removeFromCart: 'Remover do Carrinho',
    cart: 'Carrinho',
    checkout: 'Finalizar Compra',
    age: 'Idade',
    location: 'Localização',
    name: 'Nome',
    photos: 'Fotos',
    videos: 'Vídeos',
    
    // Profile fields
    firstName: 'Nome',
    lastName: 'Sobrenome',
    city: 'Cidade',
    country: 'País',
    height: 'Altura',
    bodyType: 'Tipo de Corpo',
    education: 'Educação',
    occupation: 'Ocupação',
    aboutMe: 'Sobre Mim',
    interests: 'Interesses',
    lookingFor: 'Procurando Por',
    
    // Countries and locations
    dominicanRepublic: 'República Dominicana',
    santiago: 'Santiago',
    santodomingo: 'Santo Domingo',
    puertoPlata: 'Puerto Plata',
    laRomana: 'La Romana',
    sanPedro: 'San Pedro de Macorís',
    
    // Prepositions
    from: 'de',
    
    // Page titles
    pageTitle: {
      home: 'HolaCupid - Conheça Lindas Mulheres Dominicanas',
      browse: 'Explorar Perfis Dominicanos - HolaCupid',
      about: 'Sobre HolaCupid - Plataforma de Encontros Dominicana',
      contact: 'Contatar HolaCupid - Suporte de Encontros Dominicanos',
      profile: 'Perfil - HolaCupid'
    },
    
    // SEO meta descriptions
    metaDescription: {
      home: 'Conheça mulheres dominicanas verificadas no HolaCupid. Plataforma premium conecta homens internacionais com solteiras dominicanas autênticas.',
      browse: 'Explore perfis verificados de lindas mulheres dominicanas. Encontre sua parceira perfeita com opções avançadas de busca no HolaCupid.',
      about: 'Saiba sobre HolaCupid, a plataforma líder de encontros dominicanos. Descubra nossa missão, recursos de segurança e histórias de sucesso.',
      contact: 'Entre em contato com a equipe de suporte HolaCupid. Obtenha ajuda com sua conta, problemas técnicos ou dúvidas gerais sobre nossa plataforma.'
    }
  }
};