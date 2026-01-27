document.addEventListener('DOMContentLoaded', function () {

   // --- 1. LANGUAGE LOGIC ---
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

   updateLanguage(currentLang);

   if (langToggle) {
      langToggle.addEventListener('click', function () {
         currentLang = currentLang === 'uk' ? 'en' : 'uk';
         updateLanguage(currentLang);
         localStorage.setItem('preferredLanguage', currentLang);
      });
   }

   // --- 2. MOBILE MENU LOGIC (NEW) ---
   const toggleButton = document.getElementById('menu-toggle');
   const sidebar = document.getElementById('sidebar');

   // Функція для копіювання посилань в сайдбар для мобільного
   function initMobileMenu() {
      const sidebarContent = document.getElementById('sidebar-content');
      const pageLinks = document.getElementById('page-links');

      // Перевіряємо, чи вже створено (щоб не дублювати)
      if (!sidebarContent || !pageLinks || document.querySelector('.mobile-links-wrapper')) return;

      const mobileLinksWrapper = document.createElement('div');
      mobileLinksWrapper.className = 'mobile-links-wrapper';

      // Клонуємо посилання
      const links = Array.from(pageLinks.querySelectorAll('a'));
      links.forEach(link => {
         const clonedLink = link.cloneNode(true);
         // Закривати меню при кліку на посилання
         clonedLink.addEventListener('click', () => {
            sidebar.classList.remove('active');
            toggleButton.innerHTML = '☰';
         });
         mobileLinksWrapper.appendChild(clonedLink);
      });

      // Вставляємо на самий верх сайдбару
      sidebarContent.insertBefore(mobileLinksWrapper, sidebarContent.firstChild);
   }

   // Запускаємо ініціалізацію мобільного меню
   initMobileMenu();

   // Обробник кліку на гамбургер
   if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
         e.stopPropagation();
         sidebar.classList.toggle('active');

         // Зміна іконки
         if (sidebar.classList.contains('active')) {
            toggleButton.innerHTML = '✕';
            toggleButton.style.position = 'fixed'; // Щоб хрестик не втік при скролі сайдбару
         } else {
            toggleButton.innerHTML = '☰';
            toggleButton.style.position = 'absolute';
         }
      });
   }

   // Закриття при кліку поза меню
   document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('active') &&
         !sidebar.contains(e.target) &&
         e.target !== toggleButton) {
         sidebar.classList.remove('active');
         toggleButton.innerHTML = '☰';
         toggleButton.style.position = 'absolute';
      }
   });

   // --- 3. SMART HEADER ---
   let lastScrollTop = 0;
   const topBar = document.querySelector('.top-bar');
   window.addEventListener('scroll', function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
         topBar.classList.add('hidden-nav');
      } else {
         topBar.classList.remove('hidden-nav');
      }
      lastScrollTop = scrollTop;
   });

   // --- 4. SCROLL ANIMATIONS ---
   const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
   };

   const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
         }
      });
   }, observerOptions);

   const animatedElements = document.querySelectorAll('.animate-on-scroll');
   animatedElements.forEach(el => observer.observe(el));
});

// --- 5. MODAL LOGIC ---
function openUniversalModal(fileUrl) {
   const modal = document.getElementById("universalModal");
   const modalBody = document.getElementById("modalBody");
   const closeBtn = document.querySelector(".close");

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

   closeBtn.onclick = () => modal.style.display = "none";
   window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
   };
}