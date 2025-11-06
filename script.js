document.addEventListener('DOMContentLoaded', function () {
	const langToggle = document.getElementById('language-toggle');
	const flag = document.getElementById('flag');
	const langText = document.getElementById('lang-text');

	// Перевіряємо, чи є збережена мова
	let currentLang = localStorage.getItem('preferredLanguage') || 'uk'; // Українська за замовчуванням

	function updateLanguage(lang) {
		document.documentElement.lang = lang;

		// Міняємо текст на сторінці
		document.querySelectorAll('[data-lang-ua], [data-lang-en]').forEach(el => {
			el.innerText = lang === 'uk' ? el.getAttribute('data-lang-ua') : el.getAttribute('data-lang-en');
		});

		// Міняємо прапорець і текст на кнопці
		flag.src = lang === 'uk' ? 'Images/uk.png' : 'Images/ua.png';
		langText.innerText = lang === 'uk' ? 'English version of the portfolio' : 'Українська версія портфоліо';
	}

	// Ініціалізація при завантаженні
	updateLanguage(currentLang);

	// Обробник кліка по кнопці зміни мови
	langToggle.addEventListener('click', function () {
		currentLang = currentLang === 'uk' ? 'en' : 'uk';
		updateLanguage(currentLang);
		localStorage.setItem('preferredLanguage', currentLang); // Зберігаємо вибрану мову в localStorage
	});
});

document.addEventListener('DOMContentLoaded', () => {
	const toggleButton = document.getElementById('menu-toggle');
	const sidebar = document.getElementById('sidebar');

	toggleButton.addEventListener('click', () => {
		sidebar.classList.toggle('hidden');
	});
});

function openUniversalModal(fileUrl) {
	const modal = document.getElementById("universalModal");
	const modalBody = document.getElementById("modalBody");
	const closeBtn = document.querySelector(".close");

	// Очистити попередній вміст
	modalBody.innerHTML = "";

	// Перевірка розширення файлу
	const fileExtension = fileUrl.split('.').pop().toLowerCase();

	if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)) {
		const img = document.createElement("img");
		img.src = fileUrl;
		modalBody.appendChild(img);
	} else if (fileExtension === "pdf") {
		const iframe = document.createElement("iframe");
		iframe.src = fileUrl;
		iframe.width = "100%";
		iframe.height = "600px";
		iframe.style.border = "none";
		modalBody.appendChild(iframe);
	} else {
		modalBody.innerHTML = "<p style='color:white;'>Невідомий формат файлу.</p>";
	}

	modal.style.display = "block";

	closeBtn.onclick = () => modal.style.display = "none";

	window.onclick = (e) => {
		if (e.target === modal) {
			modal.style.display = "none";
		}
	};
}
