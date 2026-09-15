/* ==========================================
   SRI SRI UNIVERSITY - DATA STORE ENGINE
   Centralized LocalStorage Store for Dynamic Updates
   ========================================== */

const SSU_STORAGE_KEYS = {
  GALLERY: 'ssu_sports_gallery_data_v2', // Updated key for fresh dataset sync
  NEWS: 'ssu_sports_news_data',
  COACHES: 'ssu_sports_coaches_data_v7',
  SCHEDULES: 'ssu_sports_schedules_data_v2',
  AUTH: 'ssu_sports_admin_auth'
};

// Default Datasets: ALL 15 Veerodaya Highlights & Trophy Photos (Category: events / winners)
const DEFAULT_GALLERY = [
  // SSU Champions & Winners Trophies
  { id: 'gal-v1', title: 'Sri Sri University Cricket Team - Veerodaya 2026 Gold Champions', category: 'events', url: 'Veerodaya 2026/Champion (Crieck team SSU) .jpeg' },
  { id: 'gal-v2', title: 'Sri Sri University Volleyball Team - Veerodaya 2026 Silver Medal', category: 'events', url: 'Veerodaya 2026/Volleyball Runners Up (SSU ) .jpeg' },
  { id: 'gal-v3', title: 'Sri Sri University Football Team - Veerodaya 2026 Silver Medal', category: 'events', url: 'Veerodaya 2026/Runners of Football Team (SSU) .jpeg' },
  { id: 'gal-v4', title: 'Sri Sri University Girls Kabaddi Squad - Award Ceremony', category: 'events', url: 'Veerodaya 2026/Champion (Kabaddi-Grils) SSU Team.jpeg' },
  { id: 'gal-v5', title: 'Sarala Birla University Ranchi - Football Champions', category: 'events', url: 'Veerodaya 2026/Champion (Football Team) Sarala Birla University, Ranchi.jpeg' },
  { id: 'gal-v6', title: 'Sarala Birla University Football Squad Podium Honor', category: 'events', url: 'Veerodaya 2026/Champion (Football Team) Sarala Birla University, Ranchi (1).jpeg' },
  { id: 'gal-v7', title: 'C. V. Raman Global University - Volleyball Men Champions', category: 'events', url: 'Veerodaya 2026/Volleyball Champion(CGU) .jpeg' },
  
  // Veerodaya Ceremonies & Fest Highlights
  { id: 'gal-v8', title: 'Veerodaya 2026 23 Universities Participating Squads Group Photo', category: 'events', url: 'Veerodaya 2026/Group Photos of the Inter University Sports Fest 2026.jpeg' },
  { id: 'gal-v9', title: 'Chief Guest Mohd. Sahid Jaffar & Dignitaries on Dais', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.12 PM.jpeg' },
  { id: 'gal-v10', title: 'Veerodaya 2026 Closing Ceremony Trophy Distribution', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.16 PM.jpeg' },
  { id: 'gal-v11', title: 'Stadium Match Action & Arena Atmosphere', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.33 PM.jpeg' },
  { id: 'gal-v12', title: 'Inter-University Athlete Podium Honor Moment', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.42 PM.jpeg' },
  { id: 'gal-v13', title: 'Veerodaya 2026 Merit Certificates Distribution', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.46 PM.jpeg' },
  { id: 'gal-v14', title: 'Dignitaries Addressing Athletes at Closing Ceremony', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.48 PM.jpeg' },
  { id: 'gal-v15', title: 'Sports Management Committee & Student Volunteers Team', category: 'events', url: 'Veerodaya 2026/WhatsApp Image 2026-02-23 at 3.01.49 PM.jpeg' }
];

const DEFAULT_NEWS = [
  {
    id: 'news-veerodaya-2026',
    title: 'Veerodaya 2026 Concludes: SSU Wins Cricket Gold! 23 Universities & 1 Lakh+ Live Viewers',
    category: 'Veerodaya 2026 Highlights',
    summary: 'Sri Sri University Cricket squad emerged Champions! Over 23 universities & 100+ athletes competed, with historic live streaming hitting 1 Lakh+ views.',
    date: '22 February 2026',
    type: 'achievement',
    imageUrl: 'Veerodaya 2026/Champion (Crieck team SSU) .jpeg'
  },
  {
    id: 'news-media-coverage',
    title: 'Veerodaya 2026 Widespread Media & Press Coverage Across 18 National & Regional Dailies',
    category: 'Media Spotlight',
    summary: 'Featured prominently in Sambad, Dharitri, Pragativadi, Samaja, Prameya, Anupam Bharat, Samaya, Odisha Express, Santal Express, Lokjeet Savera, Ujjwal Duniya, and leading newspapers.',
    date: '23 February 2026',
    type: 'news',
    imageUrl: 'Veerodaya 2026/Sambad.png'
  },
  {
    id: 'news-1',
    title: 'Purna Chandra Panda Co-ordinates Collympics 2026',
    category: 'Collympics 2026',
    summary: 'Record participation of over 1,500 athletes across 14 sports categories.',
    date: 'August 2026',
    type: 'event',
    imageUrl: 'Veerodaya 2026/Group Photos of the Inter University Sports Fest 2026.jpeg'
  },
  {
    id: 'news-2',
    title: 'Dr. Rajat Kumar Baliarsingh Wins State Carrom Honor',
    category: 'Carrom Championship',
    summary: 'Joint Secretary Sports showcases state-level precision in indoor games.',
    date: 'July 2026',
    type: 'achievement',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
  }
];

const DEFAULT_COACHES = [
  {
    id: 'coach-panda',
    name: 'Purna Chandra Panda',
    univRole: 'Co-ordinator DSW Office',
    role: 'Sports Co-ordinator',
    email: 'purnachandra.p@srisri.edu.in',
    phone: '94395 41920',
    photo: 'profile photos/Purnachandra Panda.jpg'
  },
  {
    id: 'coach-1',
    name: 'Prabhata Kumar Nayak',
    univRole: 'Head Coach',
    role: 'Cricket & Basket Ball',
    email: 'pravat.n@srisriuniversity.edu.in',
    phone: '',
    photo: 'profile photos/Prabhat Kumar Nayak.jpg'
  },
  {
    id: 'coach-2',
    name: 'Udaya Bhanu Sundaray',
    univRole: 'Volleyball Coach',
    role: 'Volleyball, Kabaddi, Kho Kho',
    email: 'Udaya.s@srisriuniversity.edu.in',
    phone: '',
    photo: 'profile photos/Uday Sundray.jpg'
  },
  {
    id: 'coach-3',
    name: 'Satyabrata Nayak',
    univRole: 'Football Coach',
    role: 'Football & Athletics',
    email: 'satyabrata.n@srisriuniversity.edu.in',
    phone: '',
    photo: 'profile photos/Satyabrata Nayak.jpg'
  },
  {
    id: 'coach-4',
    name: 'Asshis Kumar Parida',
    univRole: 'Badminton Coach',
    role: 'Badminton Coach',
    email: 'ashis.parida@srisriuniversity.edu.in',
    phone: '',
    photo: 'profile photos/Asshis Kumar Parida.jpg'
  }
];

const DEFAULT_SCHEDULES = [
  {
    id: 'sch-1',
    type: 'intra',
    date: 'To Be Announced (TBA)',
    sport: 'Volleyball Mens Opening Fixture',
    matchup: 'FOAG Spikers vs FCIS Strikers',
    venue: 'SSU Synthetic Court 1',
    status: 'SCHEDULE ANNOUNCEMENT SOON'
  },
  {
    id: 'sch-2',
    type: 'intra',
    date: 'To Be Announced (TBA)',
    sport: 'Cricket T20 Match',
    matchup: 'FMS Royals vs FOHS Champions',
    venue: 'SSU Main Cricket Oval',
    status: 'SCHEDULE ANNOUNCEMENT SOON'
  },
  {
    id: 'sch-3',
    type: 'intra',
    date: 'To Be Announced (TBA)',
    sport: 'Football Futsal Match',
    matchup: 'FOAG Warriors vs FMA Tigers',
    venue: 'SSU Turf Ground',
    status: 'SCHEDULE ANNOUNCEMENT SOON'
  },
  {
    id: 'sch-4',
    type: 'inter',
    date: '18-22 Feb 2026',
    sport: 'Veerodaya 2026 Mega Sports Fest',
    matchup: '23 Universities (Host: Sri Sri University)',
    venue: 'SSU Sports Grounds',
    status: 'COMPLETED & WINNERS ANNOUNCED'
  },
  {
    id: 'sch-5',
    type: 'inter',
    date: '05 Sep 2026 - 9:00 AM',
    sport: 'Inter-University Volleyball Zonal',
    matchup: 'Sri Sri University vs KIIT University',
    venue: 'Cuttack Indoor Stadium',
    status: 'CONFIRMED'
  }
];

// Data Store Accessors
class SSUDataStore {
  // Gallery CRUD
  static getGallery() {
    const data = localStorage.getItem(SSU_STORAGE_KEYS.GALLERY);
    if (!data) {
      localStorage.setItem(SSU_STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length < 5) {
        localStorage.setItem(SSU_STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
        return DEFAULT_GALLERY;
      }
      return parsed;
    } catch (e) {
      localStorage.setItem(SSU_STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
  }

  static saveGallery(items) {
    localStorage.setItem(SSU_STORAGE_KEYS.GALLERY, JSON.stringify(items));
  }

  static addGalleryItem(item) {
    const items = this.getGallery();
    item.id = 'gal-' + Date.now();
    items.unshift(item);
    this.saveGallery(items);
    return item;
  }

  static deleteGalleryItem(id) {
    let items = this.getGallery();
    items = items.filter(i => i.id !== id);
    this.saveGallery(items);
  }

  // News & Events CRUD (with Featured Image URL)
  static getNews() {
    const data = localStorage.getItem(SSU_STORAGE_KEYS.NEWS);
    if (!data) {
      localStorage.setItem(SSU_STORAGE_KEYS.NEWS, JSON.stringify(DEFAULT_NEWS));
      return DEFAULT_NEWS;
    }
    return JSON.parse(data);
  }

  static saveNews(items) {
    localStorage.setItem(SSU_STORAGE_KEYS.NEWS, JSON.stringify(items));
  }

  static addNewsItem(item) {
    const items = this.getNews();
    item.id = 'news-' + Date.now();
    items.unshift(item);
    this.saveNews(items);
    return item;
  }

  static updateNewsItem(updatedItem) {
    const items = this.getNews();
    const index = items.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveNews(items);
    }
  }

  static deleteNewsItem(id) {
    let items = this.getNews();
    items = items.filter(i => i.id !== id);
    this.saveNews(items);
  }

  // Coaches / Faculty CRUD
  static getCoaches() {
    const data = localStorage.getItem(SSU_STORAGE_KEYS.COACHES);
    if (!data) {
      localStorage.setItem(SSU_STORAGE_KEYS.COACHES, JSON.stringify(DEFAULT_COACHES));
      return DEFAULT_COACHES;
    }
    try {
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length < 5 || !parsed.some(c => c.id === 'coach-4' || (c.name && c.name.includes('Parida')))) {
        localStorage.setItem(SSU_STORAGE_KEYS.COACHES, JSON.stringify(DEFAULT_COACHES));
        return DEFAULT_COACHES;
      }
      return parsed;
    } catch (e) {
      localStorage.setItem(SSU_STORAGE_KEYS.COACHES, JSON.stringify(DEFAULT_COACHES));
      return DEFAULT_COACHES;
    }
  }

  static saveCoaches(items) {
    localStorage.setItem(SSU_STORAGE_KEYS.COACHES, JSON.stringify(items));
  }

  static addCoachItem(item) {
    const items = this.getCoaches();
    item.id = 'coach-' + Date.now();
    items.push(item);
    this.saveCoaches(items);
    return item;
  }

  static updateCoachItem(updatedItem) {
    const items = this.getCoaches();
    const index = items.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveCoaches(items);
    }
  }

  static deleteCoachItem(id) {
    let items = this.getCoaches();
    items = items.filter(i => i.id !== id);
    this.saveCoaches(items);
  }

  // Match Schedules CRUD (Intra & Inter)
  static getSchedules() {
    const data = localStorage.getItem(SSU_STORAGE_KEYS.SCHEDULES);
    if (!data) {
      localStorage.setItem(SSU_STORAGE_KEYS.SCHEDULES, JSON.stringify(DEFAULT_SCHEDULES));
      return DEFAULT_SCHEDULES;
    }
    return JSON.parse(data);
  }

  static saveSchedules(items) {
    localStorage.setItem(SSU_STORAGE_KEYS.SCHEDULES, JSON.stringify(items));
  }

  static addSchedule(item) {
    const items = this.getSchedules();
    item.id = 'sch-' + Date.now();
    items.unshift(item);
    this.saveSchedules(items);
    return item;
  }

  static updateSchedule(updatedItem) {
    const items = this.getSchedules();
    const index = items.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      this.saveSchedules(items);
    }
  }

  static deleteSchedule(id) {
    let items = this.getSchedules();
    items = items.filter(i => i.id !== id);
    this.saveSchedules(items);
  }

  // Auth Session
  static login(username, password) {
    if (username === 'admin' && password === 'ssu@sports2026') {
      localStorage.setItem(SSU_STORAGE_KEYS.AUTH, JSON.stringify({ loggedIn: true, user: 'Admin' }));
      return true;
    }
    return false;
  }

  static isLoggedIn() {
    const auth = localStorage.getItem(SSU_STORAGE_KEYS.AUTH);
    if (!auth) return false;
    try {
      return JSON.parse(auth).loggedIn === true;
    } catch (e) {
      return false;
    }
  }

  static logout() {
    localStorage.removeItem(SSU_STORAGE_KEYS.AUTH);
  }
}
