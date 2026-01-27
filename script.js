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
      flag.src = lang === 'uk' ? 'Images/uk.png' : 'Images/ua.png';
      if (langText) {
         langText.innerText = lang === 'uk' ? 'English version' : 'Українська версія';
      }
   }

   updateLanguage(currentLang);

   if (langToggle) {
      langToggle.addEventListener('click', function () {
         currentLang = currentLang === 'uk' ? 'en' : 'uk';
         updateLanguage(currentLang);
         localStorage.setItem('preferredLanguage', currentLang);
      });
   }

   // --- 2. MOBILE MENU & SIDEBAR LOGIC ---
   const toggleButton = document.getElementById('menu-toggle');
   const sidebar = document.getElementById('sidebar');
   const pageLinks = document.getElementById('page-links');
   const topBar = document.querySelector('.top-bar');

   if (toggleButton) {
      toggleButton.addEventListener('click', (e) => {
         e.stopPropagation(); // Prevent immediate closing

         // Toggle Sidebar
         sidebar.classList.toggle('active');

         // Toggle Mobile Navigation Links (if we want them in a dropdown)
         // Or usually on mobile, the button toggles the sidebar. 
         // Let's make the button toggle the Sidebar AND Navigation for mobile.
         document.body.classList.toggle('mobile-nav-active');

         // Change icon
         const menuText = toggleButton.querySelector('#menu-text');
         if (sidebar.classList.contains('active')) {
            toggleButton.innerHTML = '✕';
         } else {
            toggleButton.innerHTML = `☰ <span id="menu-text" ...></span>`;
            // Restore text logic if needed, simpler to just use icon
            toggleButton.innerText = '☰';
         }
      });
   }

   // Close sidebar when clicking outside
   document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('active') &&
         !sidebar.contains(e.target) &&
         e.target !== toggleButton) {
         sidebar.classList.remove('active');
         document.body.classList.remove('mobile-nav-active');
         toggleButton.innerText = '☰';
      }
   });

   // --- 3. SMART HEADER (HIDE ON SCROLL DOWN) ---
   let lastScrollTop = 0;
   window.addEventListener('scroll', function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop && scrollTop > 100) {
         // Scroll Down > 100px -> Hide
         topBar.classList.add('hidden-nav');
      } else {
         // Scroll Up -> Show
         topBar.classList.remove('hidden-nav');
      }
      lastScrollTop = scrollTop;
   });

   // --- 4. SCROLL ANIMATIONS (INTERSECTION OBSERVER) ---
   // Select elements to animate. Note: You need to add the class 'animate-on-scroll' to HTML elements.
   const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
   };

   const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
         if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Animate only once
         }
      });
   }, observerOptions);

   const animatedElements = document.querySelectorAll('.animate-on-scroll');
   animatedElements.forEach(el => observer.observe(el));
});

// --- 5. MODAL LOGIC (Global Scope) ---
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