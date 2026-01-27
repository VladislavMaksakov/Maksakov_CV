document.addEventListener('DOMContentLoaded', function () {

   // --- 1. MOBLIE MENU & CLOSE BUTTON FIX ---
   // Цей блок відповідає за виїзне меню на мобільних пристроях
   const toggleButton = document.getElementById('menu-toggle');
   const sidebar = document.getElementById('sidebar');
   const topBar = document.querySelector('.top-bar');

   // Ініціалізація вмісту мобільного меню
   function initMobileMenu() {
      const sidebarContent = document.getElementById('sidebar-content');
      const pageLinks = document.getElementById('page-links');
      const profilePhoto = document.getElementById('profile-photo');

      // Перевірка наявності елементів та запобігання дублюванню
      if (!sidebarContent || !pageLinks || document.querySelector('.mobile-links-wrapper')) return;

      const mobileLinksWrapper = document.createElement('div');
      mobileLinksWrapper.className = 'mobile-links-wrapper';

      // Клонуємо посилання з головної навігації для мобільної шторки
      const links = Array.from(pageLinks.querySelectorAll('a'));
      links.forEach(link => {
         const clonedLink = link.cloneNode(true);
         clonedLink.addEventListener('click', closeMenu);
         mobileLinksWrapper.appendChild(clonedLink);
      });

      // Вставляємо посилання ПІСЛЯ фотографії, щоб вона залишалася зверху в меню
      if (profilePhoto && profilePhoto.nextSibling) {
         sidebarContent.insertBefore(mobileLinksWrapper, profilePhoto.nextSibling);
      } else {
         sidebarContent.insertBefore(mobileLinksWrapper, sidebarContent.firstChild);
      }
   }

   function openMenu() {
      sidebar.classList.add('active');
      toggleButton.innerHTML = '✕';

      // Переміщуємо кнопку в body, щоб вона була поверх усього (z-index 3000 в CSS)
      document.body.appendChild(toggleButton);
   }

   function closeMenu() {
      sidebar.classList.remove('active');
      toggleButton.innerHTML = '☰';

      // Повертаємо кнопку назад в хедер
      if (topBar) {
         topBar.insertBefore(toggleButton, topBar.firstChild);
      }
   }

   // Створюємо мобільну навігацію при завантаженні
   initMobileMenu();

   if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
         e.stopPropagation();
         if (sidebar.classList.contains('active')) {
            closeMenu();
         } else {
            openMenu();
         }
      });
   }

   // Закриття меню при кліку поза його межами
   document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('active') &&
         !sidebar.contains(e.target) &&
         e.target !== toggleButton) {
         closeMenu();
      }
   });

   // --- 2. LANGUAGE LOGIC ---
   // Логіка перемикання мов та збереження вибору в локальне сховище
   const langToggle = document.getElementById('language-toggle');
   const flag = document.getElementById('flag');
   const langText = document.getElementById('lang-text');
   let currentLang = localStorage.getItem('preferredLanguage') || 'uk';

   function updateLanguage(lang) {
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-lang-ua], [data-lang-en]').forEach(el => {
         el.innerText = lang === 'uk' ? el.getAttribute('data-lang-ua') : el.getAttribute('data-lang-en');
      });
      if (flag) flag.src = lang === 'uk' ? 'Images/uk.png' : 'Images/ua.png';
      if (langText) langText.innerText = lang === 'uk' ? 'English version' : 'Українська версія';
   }

   // Встановлюємо мову при завантаженні
   updateLanguage(currentLang);

   if (langToggle) {
      langToggle.addEventListener('click', function () {
         currentLang = currentLang === 'uk' ? 'en' : 'uk';
         updateLanguage(currentLang);
         localStorage.setItem('preferredLanguage', currentLang);
      });
   }

   // --- 3. SMART HEADER ---
   // Хедер ховається при скролі вниз і з'являється при скролі вгору
   let lastScrollTop = 0;
   window.addEventListener('scroll', function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (topBar) {
         if (scrollTop > lastScrollTop && scrollTop > 100) {
            topBar.classList.add('hidden-nav');
         } else {
            topBar.classList.remove('hidden-nav');
         }
      }
      lastScrollTop = scrollTop;
   });

   // --- 4. SCROLL ANIMATIONS ---
   // Плавна поява блоків, коли вони потрапляють у поле зору
   const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
         }
      });
   }, { threshold: 0.1 });

   document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

// --- 5. MODAL LOGIC (Global) ---
// Функція для відкриття модального вікна з PDF або зображеннями
function openUniversalModal(fileUrl) {
   const modal = document.getElementById("universalModal");
   const modalBody = document.getElementById("modalBody");
   const closeBtn = document.querySelector(".close");

   if (!modal || !modalBody) return;

   modalBody.innerHTML = "";
   const fileExtension = fileUrl.split('.').pop().toLowerCase();

   if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)) {
      const img = document.createElement("img");
      img.src = fileUrl;
      modalBody.appendChild(img);
   } else if (fileExtension === "pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = fileUrl;
      iframe.width = "100%";
      iframe.height = "100%";
      modalBody.appendChild(iframe);
   } else {
      modalBody.innerHTML = "<p style='color:white;'>Невідомий формат файлу.</p>";
   }

   modal.style.display = "block";

   if (closeBtn) {
      closeBtn.onclick = () => modal.style.display = "none";
   }

   window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
   };
}