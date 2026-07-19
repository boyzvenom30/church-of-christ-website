/**
 * Church of Christ - Main JS Logic
 * Responsive menu, songbook search, login mockup, and form handling.
 */

// YouTube Channel Config. Enter your YouTube Channel ID to load your videos dynamically!
// If left empty or null, the site will show beautiful static placeholders.
const YOUTUBE_CHANNEL_ID = 'UCuowgDDs1eR72uqNS6FDWDA';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initTabs();
  initSongbook();
  initContactForm();
  initLoginPortal();
  initDashboard();
  initYouTubeFeeds();
  initGallery();
});

/* ==========================================
   THEME TOGGLE (LIGHT & DARK MODE)
   ========================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

/* ==========================================
   MOBILE NAVIGATION DRAWER
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ==========================================
   TAB COMPONENT FOR SUNDAY SCHOOL & ABOUT
   ========================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentContainer = btn.closest('.tabs-container');
      if (!parentContainer) return;

      // Deactivate all buttons in this container
      parentContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Deactivate all tab content blocks in this container
      parentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Activate selected button
      btn.classList.add('active');

      // Activate corresponding tab content
      const targetId = btn.getAttribute('data-tab');
      const targetContent = parentContainer.querySelector(`#${targetId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================
   DIGITAL SONGBOOK DATA & FILTERING
   ========================================== */
const SONGBOOK_DATA = {
  tamil: {
    script: [
      { 
        id: 1, 
        title: "1. தேவனைத் துதித்துப் பாடுங்கள்", 
        lyrics: "தேவனைத் துதித்துப் பாடுங்கள் - அவர்\nநல்லவர் கிருபை உள்ளவர்\nஅவரைப் போற்றிப் பாடுங்கள்...\n\nபல்லவி:\nதேவனைத் துதித்துப் பாடுங்கள்\nஅவர் நல்லவர் கிருபை உள்ளவர்\nஅவரைப் போற்றிப் பாடுங்கள்\n\n1. வானம் பூமி படைத்தவராம்\nவார்த்தையினால் நிலைநிறுத்தினாராம்\nஅவர் நாமத்தைப் போற்றுங்கள்\n\n2. சூரியன் சந்திர நட்சத்திரங்களை\nஒழுங்காய் வானில் வைத்தவராம்\nஅவர் அன்பை வாழ்த்திப் பாடுங்கள்\n\n3. நமக்காய் ஜீவன் தந்தவராம்\nவழிகாட்டும் தீபமாய் நின்றவராம்\nஅவர் கிருபை என்றுமுள்ளது" 
      },
      { 
        id: 2, 
        title: "2. எந்நாளும் துதிப்பேன் என் இயேசுவை", 
        lyrics: "எந்நாளும் துதிப்பேன் என் இயேசுவை நான்\nஆபத்து நாளில் அனுகூலமான\nஆத்தும நேசரைத் துதிப்பேன்...\n\nபல்லவி:\nஎந்நாளும் துதிப்பேன் என் இயேசுவை நான்\nஆபத்து நாளில் அனுகூலமான\nஆத்தும நேசரைத் துதிப்பேன்\n\n1. சிங்கக்குட்டிகள் பட்டினி கிடக்கும்\nஆண்டவரைத் தேடுவோர்க்கு\nகுறையொன்றும் இருக்காதே\n\n2. சோதனைகள் என்னைச் சூழ்ந்திடினும்\nசோர்ந்து போகாமல் காப்பவராம்\nஎன் நம்பிக்கையான இயேசுவை பாடுவேன்\n\n3. பயங்கள் யாவையும் போக்கினாரே\nபரலோக பாதையில் நடத்துகிறாரே\nஅவர் நாமம் வாழ்கவே" 
      },
      {
        id: 3,
        title: "3. ஆராதனை உமக்கே ஆராதனை",
        lyrics: "ஆராதனை உமக்கே ஆராதனை\nஎன் அன்பு இயேசுவே ஆராதனை...\n\nபல்லவி:\nஆராதனை உமக்கே ஆராதனை\nஎன் அன்பு இயேசுவே ஆராதனை\n\n1. கல்வாரி சிலுவையில் இரத்தம் சிந்தி\nஎன் பாவங்கள் யாவையும் கழுவினீரே\nஉமக்கு ஆராதனை\n\n2. இருள் சூழ்ந்த பாதையில் வெளிச்சமானீர்\nதனிமையின் வேளையில் துணையானீர்\nஉமக்கு ஆராதனை"
      },
      {
        id: 4,
        title: "4. மகிமை உமக்கே மகிமை",
        lyrics: "மகிமை உமக்கே மகிமை\nமாட்சிமை நிறைந்தவரே...\n\nபல்லவி:\nமகிமை உமக்கே மகிமை\nமாட்சிமை நிறைந்தவரே\n\n1. தூயவரே துதிக்கு பாத்திரரே\nதுதிகள் மத்தியில் வாசம் செய்பவரே\nஉமக்கே மகிமை\n\n2. நேற்றும் இன்றும் என்றும் மாறாதவரே\nவார்த்தையினால் எங்களை நடத்துபவரே\nஉமக்கே மகிமை"
      },
      {
        id: 5,
        title: "5. இயேசுவே என் ஜீவியத்தின்",
        lyrics: "இயேசுவே என் ஜீவியத்தின்\nநாளெல்லாம் நடத்தும் தெய்வமே...\n\nபல்லவி:\nஇயேசுவே என் ஜீவியத்தின்\nநாளெல்லாம் நடத்தும் தெய்வமே\n\n1. புல்லுள்ள இடங்களில் என்னை மேய்த்து\nஅமர்ந்த தண்ணீரண்டைக் கொண்டு செல்பவரே\nஉம்மைத் துதிப்பேன்\n\n2. மரண இருளின் பள்ளத்தாக்கிலும்\nதீமைக்கு அஞ்சாமல் காப்பவராம்\nஎன் நல்ல மேய்ப்பரே"
      },
      {
        id: 6,
        title: "6. நன்றி பலிபீடம் கட்டுகிறோம்",
        lyrics: "நன்றி பலிபீடம் கட்டுகிறோம்\nநல்லவரே நன்மை செய்தவரே...\n\nபல்லவி:\nநன்றி பலிபீடம் கட்டுகிறோம்\nநல்லவரே நன்மை செய்தவரே\n\n1. கடந்த நாட்கள் முழுவதும் காத்து\nபுதிய நாளுக்குள் எங்களை நடத்தினீரே\nகோடி நன்றி ஐயா\n\n2. ஆபத்து காலத்தில் கூப்பிட்டபோது\nபதில் தந்து எங்களை விடுவித்தீரே\nகோடி நன்றி ஐயா"
      }
    ],
    romanized: [
      { 
        id: 1, 
        title: "1. Devanai Thuthithu Paadungal", 
        lyrics: "Devanai thuthithu paadungal - avar\nNallavar kirubai ullavar\nAvarai potrip paadungal...\n\nChorus:\nDevanai thuthithu paadungal\nAvar nallavar kirubai ullavar\nAvarai potrip paadungal\n\n1. Vaanam boomi padaithavaraam\nVaarthaiyinaal nilainiruthinaaraam\nAvar naamathai potrunggal\n\n2. Sooriyan santhira natchathirangalai\nOlungaai vaanil vaithavaraam\nAvar anbai vaalthip paadungal\n\n3. Namakkaai jeevan thanthavaraam\nValikaattum deepamaai nintravaaraam\nAvar kirubai endrumullathu" 
      },
      { 
        id: 2, 
        title: "2. Ennaalum Thuthithen", 
        lyrics: "Ennaalum thuthithen en yesuvai naan\nAabathu naalil anugoolamaana\nAathuma nesarai thuthithen...\n\nChorus:\nEnnaalum thuthithen en yesuvai naan\nAabathu naalil anugoolamaana\nAathuma nesarai thuthithen\n\n1. Singgakuttigal pattini kidakkum\nAandavarai theduvorkku\nKuraiyondrum irukkaathe\n\n2. Sothanaigal ennai soolnthidinum\nSornthu pogaamal kaappavaraam\nEn nambikkaiyaana yesuvai paaduveen\n\n3. Bayanggal yaavaiyum pokkinaare\nParaloga paathaiyil nadathukiraare\nAvar naamam vaalgave" 
      },
      {
        id: 3,
        title: "3. Aaradhanai Umakke Aaradhanai",
        lyrics: "Aaradhanai Umakke Aaradhanai\nEn anbu Yesuve Aaradhanai...\n\nChorus:\nAaradhanai Umakke Aaradhanai\nEn anbu Yesuve Aaradhanai\n\n1. Kalvaari siluvaiyil iratham sinthi\nEn paavangal yaavaiyum kaluvineere\nUmakku Aaradhanai\n\n2. Irul soolntha paathaiyil velichamaaneer\nThanimaiyin velaiyil thunaiyaaneer\nUmakku Aaradhanai"
      },
      {
        id: 4,
        title: "4. Magimai Umakke Magimai",
        lyrics: "Magimai Umakke Magimai\nMaatchimai nirainthavare...\n\nChorus:\nMagimai Umakke Magimai\nMaatchimai nirainthavare\n\n1. Thooyavare thuthikku paathirare\nThuthigal mathiyil vaasam seybavare\nUmakke magimai\n\n2. Netrum indrum endrum maaraathavare\nVaarthaiyinaal engalai nadathubavare\nUmakke magimai"
      },
      {
        id: 5,
        title: "5. Yesuve En Jeeviyathin",
        lyrics: "Yesuve en jeeviyathin\nNaalellaam nadathum deivame...\n\nChorus:\nYesuve en jeeviyathin\nNaalellaam nadathum deivame\n\n1. Pullulla idangalil ennai meithu\nAmarntha thanneerandai kondu selbavare\nUmmai thuthippeen\n\n2. Marana irulin pallathaakkilum\nTheemaiku anjaamal kaappavaraam\nEn nalla meippare"
      },
      {
        id: 6,
        title: "6. Nandri Balibeedam Kattugirom",
        lyrics: "Nandri balibeedam kattugirom\nNallavare nanmai seithavare...\n\nChorus:\nNandri balibeedam kattugirom\nNallavare nanmai seithavare\n\n1. Kadantha naatkal muluvathum kaathu\nPuthiya naalukkul engalai nadathineere\nKodi nandri aiya\n\n2. Aabathu kaalathil kooppittapothu\nBathil thanthu engalai viduvitheere\nKodi nandri aiya"
      }
    ]
  },
  english: [
    { 
      id: 1, 
      title: "1. Amazing Grace", 
      lyrics: "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\n1. 'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.\n\n2. Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.\n\n3. When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we first begun." 
    },
    { 
      id: 2, 
      title: "2. How Great Thou Art", 
      lyrics: "O Lord my God, when I in awesome wonder\nConsider all the worlds Thy Hands have made;\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.\n\nChorus:\nThen sings my soul, my Savior God, to Thee,\nHow great Thou art! How great Thou art!\nThen sings my soul, my Savior God, to Thee,\nHow great Thou art! How great Thou art!\n\n1. When through the woods and forest glades I wander,\nAnd hear the birds sing sweetly in the trees;\nWhen I look down from lofty mountain grandeur\nAnd hear the brook and feel the gentle breeze." 
    },
    {
      id: 3,
      title: "3. It Is Well With My Soul",
      lyrics: "When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.\n\nChorus:\nIt is well with my soul,\nIt is well, it is well with my soul.\n\n1. Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ has regarded my helpless estate,\nAnd hath shed His own blood for my soul."
    }
  ]
};

let currentLanguage = ''; // Empty on load
let currentTamilSubpart = 'script'; // 'script' (Tamil font) or 'romanized' (English letters)

function initSongbook() {
  const songListElement = document.getElementById('song-list');
  const searchInput = document.getElementById('song-search');
  const headingElement = document.getElementById('songbook-heading');
  const langBtns = document.querySelectorAll('.lang-btn');
  const languageTabsWrapper = document.querySelector('.language-tabs');
  const subpartToggleWrapper = document.querySelector('.subpart-toggles');
  const subpartBtns = document.querySelectorAll('.subpart-btn');

  if (!songListElement) return; // Not on Media page

  // Initialize modal hooks
  createLyricsModal();

  // Function to render songs list based on current active choices and search keyword
  function renderSongs() {
    if (!currentLanguage) {
      songListElement.innerHTML = '';
      return;
    }

    const query = searchInput.value.toLowerCase().trim();
    songListElement.innerHTML = '';

    let songsArray = [];
    if (currentLanguage === 'english') {
      songsArray = SONGBOOK_DATA.english;
    } else {
      songsArray = SONGBOOK_DATA.tamil[currentTamilSubpart];
    }

    // Filter songs by number exactly, or by search keywords in name/lyrics
    const filteredSongs = songsArray.filter(song => {
      if (/^\d+$/.test(query)) {
        // If searching a number, match by id exactly
        return song.id.toString() === query;
      }
      // Otherwise, match title or lyrics
      return song.title.toLowerCase().includes(query) || 
             song.lyrics.toLowerCase().includes(query);
    });

    if (filteredSongs.length === 0) {
      songListElement.innerHTML = `<div class="no-songs-found">No songs found matching "${escapeHTML(searchInput.value)}"</div>`;
      return;
    }

    filteredSongs.forEach(song => {
      const card = document.createElement('div');
      card.className = 'song-card';
      card.innerHTML = `
        <div>
          <div class="song-number">Song #${song.id}</div>
          <h4 class="song-title">${song.title}</h4>
          <p class="song-lyrics-preview">${song.lyrics.split('\n').slice(0, 3).join('<br>')}</p>
        </div>
      `;
      card.addEventListener('click', () => openLyricsModal(song.title, song.lyrics));
      songListElement.appendChild(card);
    });
  }

  // Helper function to handle language selection and UI updates
  function selectLanguage(lang) {
    if (languageTabsWrapper) {
      languageTabsWrapper.style.display = 'none';
    }

    if (headingElement) {
      if (lang === 'tamil') {
        headingElement.textContent = 'Tamil Songs';
      } else if (lang === 'english') {
        headingElement.textContent = 'English Songs';
      }
    }

    langBtns.forEach(b => {
      if (b.getAttribute('data-lang') === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    currentLanguage = lang;
    const searchWrapper = searchInput.closest('.search-box-wrapper');

    if (currentLanguage === 'tamil') {
      subpartToggleWrapper.style.display = 'flex';
      if (searchWrapper) searchWrapper.style.display = 'block';
      songListElement.style.display = 'grid';
      
      // Reset subpart to default 'script' when clicking Tamil Songs
      currentTamilSubpart = 'script';
      subpartBtns.forEach(b => {
        if (b.getAttribute('data-subpart') === 'script') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    } else if (currentLanguage === 'english') {
      subpartToggleWrapper.style.display = 'none';
      if (searchWrapper) searchWrapper.style.display = 'block';
      songListElement.style.display = 'grid';
    }

    renderSongs();
  }

  // Handle Main Language Tab clicks
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      selectLanguage(lang);
    });
  });

  // Handle Tamil subpart (Script vs Romanized) clicks
  subpartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subpartBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTamilSubpart = btn.getAttribute('data-subpart');
      renderSongs();
    });
  });

  // Handle live search input
  searchInput.addEventListener('input', renderSongs);

  // Handle URL query parameter pre-selection on page load
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam === 'tamil' || langParam === 'english') {
    selectLanguage(langParam);
  } else {
    // Initial state on page load (if no param): hide subparts, search box, and list
    const searchWrapper = searchInput.closest('.search-box-wrapper');
    subpartToggleWrapper.style.display = 'none';
    if (searchWrapper) searchWrapper.style.display = 'none';
    songListElement.style.display = 'none';
    songListElement.innerHTML = '';
  }
}

function createLyricsModal() {
  if (document.getElementById('lyrics-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'lyrics-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <div>
          <h3 id="modal-song-title" class="modal-title">Song Title</h3>
          <span class="badge" style="margin-bottom:0; margin-top:4px;">Song Book</span>
        </div>
        <button id="modal-close-btn" class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div id="modal-song-lyrics" class="modal-lyrics-content"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close event listeners
  const closeBtn = modal.querySelector('#modal-close-btn');
  closeBtn.addEventListener('click', closeLyricsModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLyricsModal();
    }
  });

  // ESC key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLyricsModal();
    }
  });
}

function openLyricsModal(title, lyrics) {
  const modal = document.getElementById('lyrics-modal');
  const titleElem = document.getElementById('modal-song-title');
  const lyricsElem = document.getElementById('modal-song-lyrics');

  if (modal && titleElem && lyricsElem) {
    titleElem.textContent = title;
    lyricsElem.innerHTML = lyrics.replace(/\n/g, '<br>');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }
}

function closeLyricsModal() {
  const modal = document.getElementById('lyrics-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

/* ==========================================
   CONTACT FORM SUBMISSION MOCKUP
   ========================================== */
function initContactForm() {
  const contactForm = document.getElementById('church-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // Elegant alert dialog using vanilla components
    showToastNotification(`Thank you, ${name}! Your message has been received. We will contact you soon.`);
    contactForm.reset();
  });
}

/* ==========================================
   MEMBER PORTAL LOGIN MOCKUP
   ========================================== */
function initLoginPortal() {
  const loginForm = document.getElementById('member-login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Simple demo validation: allows 'member@coc.org' / 'password123'
    if (email === 'member@coc.org' && password === 'password123') {
      localStorage.setItem('coc_member_session', JSON.stringify({
        email: email,
        name: 'Bro. Dr. Peter Solomon',
        role: 'Congregation Believer',
        loginTime: Date.now()
      }));
      window.location.href = 'dashboard.html';
    } else {
      const errorMsg = document.getElementById('login-error-msg');
      if (errorMsg) {
        errorMsg.textContent = 'Invalid email or password. Hint: Use member@coc.org & password123';
        errorMsg.style.display = 'block';
      } else {
        alert('Invalid email or password. Hint: Use member@coc.org and password123');
      }
    }
  });
}

/* ==========================================
   MEMBER PORTAL DASHBOARD MOCKUP
   ========================================== */
function initDashboard() {
  const dashboardContainer = document.getElementById('member-dashboard-section');
  if (!dashboardContainer) return; // Not on dashboard page

  // Check login state
  const sessionData = localStorage.getItem('coc_member_session');
  if (!sessionData) {
    // Not logged in, redirect
    window.location.href = 'login.html';
    return;
  }

  const session = JSON.parse(sessionData);

  // Render user information dynamically
  const userNameElem = document.getElementById('dashboard-user-fullname');
  const userInitialsElem = document.getElementById('dashboard-user-initials');
  const userRoleElem = document.getElementById('dashboard-user-role');

  if (userNameElem) userNameElem.textContent = session.name;
  if (userRoleElem) userRoleElem.textContent = session.role;
  if (userInitialsElem) {
    const initials = session.name.split(' ').map(n => n[0]).join('');
    userInitialsElem.textContent = initials;
  }

  // Handle Logout buttons (desktop and mobile)
  const logoutBtns = document.querySelectorAll('#dashboard-logout-btn, #dashboard-logout-btn-mobile');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('coc_member_session');
      window.location.href = 'login.html';
    });
  });
}

/* ==========================================
   UTILITY HELPER FUNCTIONS
   ========================================== */
function showToastNotification(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = 'var(--text-primary)';
    toast.style.color = 'var(--bg-primary)';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = 'var(--border-radius-sm)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '2000';
    toast.style.fontSize = '0.95rem';
    toast.style.border = '1px solid var(--border-color)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity var(--transition-normal), transform var(--transition-normal)';
    toast.style.transform = 'translateY(20px)';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  // Trigger animations
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 50);

  // Remove alert
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4000);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================
   YOUTUBE FEEDS LOADER
   ========================================== */
function initYouTubeFeeds() {
  const cocGrid = document.getElementById('coc-video-grid');
  const bhGrid = document.getElementById('biblehour-video-grid');

  if (!cocGrid && !bhGrid) return; // Not on Media page

  // Fallback data (real recent videos from the channels)
  const fallbacks = {
    coc: [
      { title: "@christianityofchrist / Lesson - 123", id: "Y6gsWiT5PLE", pubDate: "2026-07-07" },
      { title: "SUNDAY SERMON / 05.07.2026", id: "wxZ2VrURy8c", pubDate: "2026-07-05" },
      { title: "@christianityofchrist / Lesson - 122", id: "SPyyEHUdHb0", pubDate: "2026-07-03" },
      { title: "@christianityofchrist / Lesson - 121", id: "3bnaa7IvQ34", pubDate: "2026-07-02" }
    ],
    bh: [
      { title: "Bible Hour TV - Sunday Worship - What I Have Give You", id: "O5rGlYQTF0w", pubDate: "2026-07-05" },
      { title: "Bible Hour TV NBC Hard talk - Earthquake", id: "jhqeu5v9Kw8", pubDate: "2026-07-03" },
      { title: "Sunday Tamil Worship - Speek , Yes or No", id: "vwaUOL1eKJ4", pubDate: "2026-07-01" },
      { title: "Bible Hour TV - NBC Red Card", id: "JpFY0HtNkdI", pubDate: "2026-06-27" }
    ]
  };

  createVideoModal();

  loadChannelFeed('UCuowgDDs1eR72uqNS6FDWDA', cocGrid, fallbacks.coc);
  loadChannelFeed('UCwLr8WW9YwGGSPrgzO7Kznw', bhGrid, fallbacks.bh);
}

function loadChannelFeed(channelId, gridElement, fallbackData) {
  if (!gridElement) return;

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data && data.status === 'ok' && data.items && data.items.length > 0) {
        // Extract top 4 videos
        const videos = data.items.slice(0, 4).map(item => {
          let videoId = '';
          const link = item.link || '';
          const reg = /[?&]v=([^&#]+)/;
          const match = link.match(reg);
          if (match && match[1]) {
            videoId = match[1];
          } else {
            videoId = link.split('/').pop();
          }
          return {
            title: item.title,
            id: videoId,
            pubDate: item.pubDate ? item.pubDate.split(' ')[0] : ''
          };
        });
        renderVideoCards(gridElement, videos);
      } else {
        renderVideoCards(gridElement, fallbackData);
      }
    })
    .catch(err => {
      console.warn("YouTube feed fetch failed, using fallback.", err);
      renderVideoCards(gridElement, fallbackData);
    });
}

function renderVideoCards(gridElement, videos) {
  gridElement.innerHTML = '';
  
  videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'video-feed-card';
    card.innerHTML = `
      <div class="video-thumbnail-wrapper">
        <img class="video-thumbnail" src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${escapeHTML(video.title)}">
        <div class="video-play-overlay">
          <svg style="width: 44px; height: 44px; fill: var(--color-accent); filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div class="video-feed-info">
        <h4 class="video-feed-title">${escapeHTML(video.title)}</h4>
        <span class="video-feed-date">${video.pubDate ? formatDate(video.pubDate) : ''}</span>
      </div>
    `;
    card.addEventListener('click', () => openVideoModal(video.id));
    gridElement.appendChild(card);
  });
}

function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function createVideoModal() {
  const existingModal = document.getElementById('video-modal');
  if (existingModal) {
    // If it's the old layout structure (doesn't have floating close button directly inside container)
    if (!existingModal.querySelector('.modal-container > #video-modal-close-btn')) {
      existingModal.remove(); // Clean up stale DOM element
    } else {
      return; // Already correct, skip creation
    }
  }

  const modal = document.createElement('div');
  modal.id = 'video-modal';
  modal.className = 'modal-overlay';
  
  // Apply fail-proof inline styles to ensure the overlay is centered and cinematic even if styles are cached
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(10, 8, 6, 0.9)';
  modal.style.backdropFilter = 'blur(10px)';
  modal.style.webkitBackdropFilter = 'blur(10px)';
  modal.style.zIndex = '3000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.opacity = '0';
  modal.style.pointerEvents = 'none';
  modal.style.transition = 'opacity 0.3s ease';

  modal.innerHTML = `
    <div class="modal-container">
      <!-- Floating round close button overlaying the top-right corner of the video -->
      <button id="video-modal-close-btn" style="position: absolute; top: 15px; right: 15px; z-index: 100; background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.25); color: #fff; font-size: 24px; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background-color 0.2s, transform 0.2s; line-height: 1; padding: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">&times;</button>
      
      <div class="modal-body" style="padding: 0; width: 100%; height: 100%; position: relative; background-color: #000;">
        <iframe id="video-modal-iframe" src="" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#video-modal-close-btn');
  closeBtn.addEventListener('click', closeVideoModal);

  // Close button hover animations handled in JS
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    closeBtn.style.transform = 'scale(1.08)';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    closeBtn.style.transform = 'scale(1)';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.opacity === '1') {
      closeVideoModal();
    }
  });
}

function openVideoModal(videoId) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-modal-iframe');
  if (modal && iframe) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('active');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';

    // Force-apply explicit sizing and absolute positioning styles inline to container to bypass any cached CSS stylesheets
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.style.position = 'absolute';
      container.style.top = '50%';
      container.style.left = '50%';
      container.style.transform = 'translate(-50%, -50%) scale(1)';
      container.style.width = '90%';
      container.style.maxWidth = '800px';
      container.style.maxHeight = '80vh';
      container.style.aspectRatio = '16/9';
      container.style.backgroundColor = '#000';
      container.style.borderRadius = '8px';
      container.style.overflow = 'hidden';
      container.style.boxShadow = '0 10px 40px rgba(0,0,0,0.6)';
      container.style.border = '1px solid rgba(255,255,255,0.15)';
      container.style.transition = 'transform 0.3s ease';
      container.style.zIndex = '3100';
    }
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-modal-iframe');
  if (modal && iframe) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    iframe.src = '';
    document.body.style.overflow = '';

    const container = modal.querySelector('.modal-container');
    if (container) {
      container.style.transform = 'translate(-50%, -50%) scale(0.95)';
    }
  }
}

/* ==========================================
   INTERACTIVE GALLERY & LIGHTBOX MODAL
   ========================================== */
function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'flex';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox Modal logic
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (lightboxModal && lightboxImg && closeBtn) {
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      const captionText = item.querySelector('.gallery-caption-title')?.textContent || '';
      
      if (img) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
          lightboxImg.src = img.getAttribute('src') || img.src;
          lightboxCaption.textContent = captionText;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock background scroll
        });
      }
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxImg.src = '';
      document.body.style.overflow = ''; // Unlock background scroll
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking outside container
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
}


