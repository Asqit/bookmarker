'use strict';

/**
 * @description This little function resizes both sections
 * @param {boolean} big
 */
function resizeApp(big) {
	const HERO = document.querySelector('.hero');
	const CARDS = document.querySelector('.array');

	if (big == true) {
		HERO.classList.remove('active');
		CARDS.style.display = 'none';
	} else {
		HERO.classList.add('active');
		CARDS.style.display = 'block';
	}
}

/**
 * @param {number | string} id
 * @returns {void}
 */
function handleDelete(id) {
	const FIELD = document.querySelector('.array__cards');
	const CARD = document.getElementById(id);

	if (!CARD) {
		return console.log('No card found!');
	}

	// Remove card from DOM
	FIELD.removeChild(CARD);

	// Remove card from localStorage
	let payload = JSON.parse(localStorage.getItem('bookmarkers'));

	payload = payload.filter((record) => record.id !== id);

	if (payload.length == 0) {
		resizeApp(true);
	}

	localStorage.setItem('bookmarkers', JSON.stringify(payload));
}

/**
 * @param {Event} e
 * @returns {void}
 */
function handleSubmit(e) {
	e.preventDefault();

	const URL_INPUT = document.getElementById('url')?.value;
	const TITLE_INPUT = document.getElementById('title')?.value;

	if (!URL_INPUT || !TITLE_INPUT) {
		return toggleError(
			'Both input fields are required for saving your bookmark'
		);
	}

	handleCardSave({
		title: TITLE_INPUT,
		url: URL_INPUT,
		date: Date.now(),
	});

	TITLE_INPUT.value = '';
	URL_INPUT.value = '';
}

/**
 * @param {{title: string, url: string, date: number}} bookmark
 */
function handleCardSave(bookmark) {
	if (!localStorage.getItem('bookmarkers')) {
		localStorage.setItem(
			'bookmarkers',
			JSON.stringify([{ ...bookmark, id: 0 }])
		);
	} else {
		const PAYLOAD = JSON.parse(localStorage.getItem('bookmarkers'));

		PAYLOAD.push({ ...bookmark, id: PAYLOAD.length });

		localStorage.setItem('bookmarkers', JSON.stringify(PAYLOAD));
	}

	appendCards();
}

function appendCards() {
	if (!localStorage.getItem('bookmarkers')?.length === 0) {
		return console.log('No bookmarks to render');
	}

	resizeApp(false);

	const DESTINATION = document.querySelector('.array__cards');
	const PAYLOAD = JSON.parse(localStorage.getItem('bookmarkers'));

	DESTINATION.innerHTML = PAYLOAD.map(
		(record) => `
	<div class="array__cards__card" id="${record.id}">
        <div class="array__cards__card--head">
            <h3>${record.title}</h3>
        </div>
        <div class="array__cards__card--body">
            <a target="blank" href="${record.url}">visit here</a>
            <button onClick="handleDelete(${String(record.id)})">delete</button>
        </div>
    </div>`
	);
}

function toggleError(msg) {
	const ERROR = document.getElementById('error');
	const ERROR_MSG = document.getElementById('error__output');

	ERROR.addEventListener('click', (e) => {
		ERROR.classList.remove('visible');
	});

	ERROR.classList.add('visible');
	ERROR_MSG.innerHTML = msg;
}

function main(e) {
	const SUBMIT = document.getElementById('submiter');
	SUBMIT.addEventListener('click', handleSubmit);

	if (JSON.parse(localStorage.getItem('bookmarkers'))?.length > 0) {
		appendCards();
	}
}

window.addEventListener('load', main, false);
