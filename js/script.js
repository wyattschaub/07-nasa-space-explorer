// Find the date inputs, button, and gallery on the page.
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalDescription = document.getElementById('modalDescription');
const modalInfo = document.getElementById('modalInfo');
const closeModalButton = document.getElementById('closeModal');
const spaceFactText = document.getElementById('spaceFactText');
const apiKey = 'DEMO_KEY';

const spaceFacts = [
	'Earth is the only planet known to host life.',
	'Earth\'s atmosphere shields us from deadly radiation.',
	'The Moon is slowly drifting away from Earth each year.',
	'A day on Earth is not exactly 24 hours long.',
	'Most of Earth\'s gold came from supernova explosions.',
	'The Sun is 109 times wider than Earth.',
	'The Sun loses about 4 million tons of mass every second.',
	'The Sun will eventually swallow Earth when it becomes a red giant.',
	'Sunlight takes about 8 minutes to reach Earth.',
	'The Sun makes up 99.8% of the solar system\'s mass.',
	'The Moon was likely formed after a giant collision with Earth.',
	'The Moon has moonquakes.',
	'The far side of the Moon gets sunlight too.',
	'Astronauts\' footprints can last millions of years on the Moon.',
	'The Moon helps stabilize Earth\'s tilt.',
	'A year on Mercury lasts only 88 Earth days.',
	'Mercury\'s temperature swings are extreme between day and night.',
	'Venus is hotter than Mercury even though it is farther from the Sun.',
	'A day on Venus is longer than its year.',
	'Mars has the largest volcano in the solar system, Olympus Mons.',
	'Mars once had liquid water flowing on its surface.',
	'Jupiter\'s Great Red Spot has raged for centuries.',
	'Jupiter has many known moons orbiting it.',
	'Saturn could float in water because it is less dense than water.',
	'Saturn\'s rings are slowly disappearing.',
	'Uranus rotates on its side with a huge tilt.',
	'Uranus has extremely fast winds.',
	'Neptune has the fastest winds in the solar system.',
	'Neptune radiates more heat than it receives from the Sun.',
	'A year on Pluto lasts 248 Earth years.',
	'Pluto has a heart-shaped glacier made of nitrogen ice.',
	'There are more stars in the universe than grains of sand on Earth.',
	'Our galaxy may host billions of Earth-like planets.',
	'The closest star system to us is Alpha Centauri.',
	'Proxima Centauri b is a potentially habitable exoplanet.',
	'Rogue planets wander without stars.',
	'The largest star discovered is UY Scuti.',
	'Stars do not twinkle in space.',
	'Most stars are part of binary or multiple systems.',
	'The Milky Way is on a collision course with Andromeda.',
	'The Milky Way is about 100,000 light-years across.',
	'Our galaxy has been compared to the smell of raspberries and rum.',
	'Black holes warp time and space.',
	'The closest known black hole is about 1,500 light-years away.',
	'Supermassive black holes sit at the center of most galaxies.',
	'Nothing escapes a black hole, not even light.',
	'Black holes can merge and create gravitational waves.',
	'Yuri Gagarin was the first human in space.',
	'Valentina Tereshkova was the first woman in space.',
	'Humans have walked only on the Moon, not Mars.',
	'The International Space Station travels at about 28,000 km/h.',
	'Voyager 1 is the farthest human-made object from Earth.',
	'Space smells like burnt steak to astronauts.',
	'55 Cancri e may have a diamond-rich core.',
	'A teaspoon of neutron star material would weigh billions of tons.',
	'Space is not completely silent.',
	'Galaxies can cannibalize smaller galaxies.',
	'Dark matter makes up about 27% of the universe.',
	'Dark energy drives the expansion of the universe.',
	'Only about 5% of the universe is normal matter.',
	'The Hubble Space Telescope has taken over 1.5 million images.',
	'The James Webb Space Telescope can see very early galaxies.',
	'The first exoplanet was discovered in 1992.',
	'Thousands of satellites orbit Earth today.',
	'Space junk is a growing problem.',
	'The asteroid belt lies between Mars and Jupiter.',
	'The largest asteroid, Ceres, is also a dwarf planet.',
	'Comets are often called dirty snowballs.',
	'The Perseid meteor shower happens every August.',
	'A massive asteroid helped wipe out the dinosaurs.',
	'The universe is about 13.8 billion years old.',
	'The Big Bang was an expansion, not an explosion.',
	'The universe is still expanding faster and faster.',
	'Cosmic microwave background radiation is the afterglow of the Big Bang.',
	'The observable universe is 93 billion light-years across.',
	'Scientists have discovered amino acids in meteorites.',
	'Extremophiles on Earth can survive space-like conditions.',
	'Mars may host microbial life underground.',
	'The Drake Equation estimates many possible civilizations.',
	'No alien civilization has been confirmed yet.',
	'Space tourism is already a reality.',
	'NASA plans crewed Mars missions in the 2030s.',
	'Nuclear propulsion could shorten deep-space travel time.',
	'Colonies on the Moon may be possible within decades.',
	'Terraforming Mars is a long-term challenge.',
	'Saturn\'s moon Titan has lakes of liquid methane.',
	'Enceladus has geysers that spray water into space.',
	'Europa may have more water than Earth.',
	'Venus rains sulfuric acid.',
	'Neptune\'s moon Triton orbits backward.',
	'The hottest planet is Venus, not Mercury.',
	'The coldest place known is the Boomerang Nebula.',
	'The fastest spacecraft is Parker Solar Probe.',
	'The biggest canyon is Valles Marineris on Mars.',
	'Time passes slower in strong gravity.',
	'Falling into a black hole would cause spaghettification.',
	'Neutrinos pass through your body by the trillions every second.',
	'The universe may have no edge.',
	'Most of the universe is invisible to us.'
];

// Set up the date pickers from dateRange.js.
// This gives us a valid default range right away.
setupDateInputs(startInput, endInput);

// Show a friendly message in the gallery area.
function showMessage(message) {
	gallery.innerHTML = `
		<div class="placeholder">
			<div class="placeholder-icon">🔭</div>
			<p>${message}</p>
		</div>
	`;
}

// Show one random fact every time the images are fetched.
function showRandomFact() {
	if (!spaceFactText) {
		return;
	}

	const randomIndex = Math.floor(Math.random() * spaceFacts.length);
	spaceFactText.textContent = spaceFacts[randomIndex];
}

// Create one row of metadata for the image details panel.
function createInfoRow(label, value) {
	const term = document.createElement('dt');
	term.textContent = label;

	const description = document.createElement('dd');
	description.textContent = value || 'Not available';

	return [term, description];
}

// Build a thumbnail for APOD videos when NASA provides a video URL.
function getVideoThumbnailUrl(imageData) {
	if (imageData.thumbnail_url) {
		return imageData.thumbnail_url;
	}

	if (imageData.url.includes('youtube.com') || imageData.url.includes('youtu.be')) {
		const videoIdMatch = imageData.url.match(/(?:v=|\/)([A-Za-z0-9_-]{11})(?:\?|&|$)/);
		if (videoIdMatch) {
			return `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`;
		}
	}

	return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23e1f3f8"/%3E%3Ccircle cx="400" cy="225" r="76" fill="%230b3d91"/%3E%3Cpolygon points="378,185 378,265 448,225" fill="%23ffffff"/%3E%3Ctext x="400" y="345" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="%23212121"%3EVideo preview unavailable%3C/text%3E%3C/svg%3E';
}

// Build the best link target for APOD videos.
function getVideoSourceUrl(imageData) {
	return imageData.url;
}

// Open the larger image detail view.
function openImageModal(imageData) {
	modalImage.src = imageData.media_type === 'video' ? getVideoThumbnailUrl(imageData) : imageData.hdurl || imageData.url;
	modalImage.alt = imageData.title;
	modalTitle.textContent = imageData.title;
	modalDate.textContent = imageData.date;
	modalDescription.textContent = imageData.explanation;
	modalInfo.innerHTML = '';

	const infoRows = [
		['Media type', imageData.media_type],
		['Service version', imageData.service_version],
		['Copyright', imageData.copyright],
		[imageData.media_type === 'video' ? 'Video URL' : 'Image URL', imageData.media_type === 'video' ? getVideoSourceUrl(imageData) : imageData.url],
		['HD image URL', imageData.hdurl],
	];

	infoRows.forEach(([label, value]) => {
		const [term, description] = createInfoRow(label, value);
		modalInfo.appendChild(term);
		modalInfo.appendChild(description);
	});

	modal.classList.add('is-open');
	modal.setAttribute('aria-hidden', 'false');
	closeModalButton.focus();
}

// Close the larger image detail view.
function closeImageModal() {
	modal.classList.remove('is-open');
	modal.setAttribute('aria-hidden', 'true');
}

// Turn one APOD item into a gallery card.
function createGalleryItem(imageData) {
	const article = document.createElement('article');
	article.className = 'gallery-item';
	article.classList.add(imageData.media_type === 'video' ? 'gallery-item--video' : 'gallery-item--image');
	article.setAttribute('role', 'button');
	article.setAttribute('tabindex', '0');
	article.setAttribute('aria-label', `Open details for ${imageData.title}`);

	const mediaPreviewUrl = imageData.media_type === 'video' ? getVideoThumbnailUrl(imageData) : imageData.url;
	const sourceUrl = imageData.media_type === 'video' ? getVideoSourceUrl(imageData) : imageData.url;
	const mediaLabel = imageData.media_type === 'video' ? 'Watch video' : 'View image';

	article.innerHTML = `
		<div class="gallery-item-media">
			<img src="${mediaPreviewUrl}" alt="${imageData.title}" />
			${imageData.media_type === 'video' ? `<span class="gallery-item-badge">Video</span>` : ''}
		</div>
		<p><strong>${imageData.title}</strong></p>
		<p>${imageData.date}</p>
		<p><a class="gallery-item-link" href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${mediaLabel}</a></p>
	`;

	const galleryLink = article.querySelector('.gallery-item-link');
	if (galleryLink) {
		galleryLink.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}

	article.addEventListener('click', () => openImageModal(imageData));
	article.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openImageModal(imageData);
		}
	});

	return article;
}

// Fetch APOD images for the selected date range.
async function getSpaceImages() {
	const startDate = startInput.value;
	const endDate = endInput.value;

	showRandomFact();

	if (!apiKey) {
		showMessage('Missing NASA API key. Create js/secrets.js and set window.apiKey.');
		return;
	}

	if (!startDate || !endDate) {
		showMessage('Please choose both a start date and an end date.');
		return;
	}

	showMessage('Loading images from NASA...');

	const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}&thumbs=true`;

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error?.message || 'Something went wrong while loading the images.');
		}

		const images = Array.isArray(data) ? data : [data];

		if (images.length === 0) {
			showMessage('No results were found for that date range. Try a different range.');
			return;
		}

		gallery.innerHTML = '';

		images.forEach((imageData) => {
			gallery.appendChild(createGalleryItem(imageData));
		});
	} catch (error) {
		showMessage(error.message);
	}
}

// Load images when the button is clicked.
getImagesButton.addEventListener('click', getSpaceImages);

// Close the modal with the close button or by clicking outside the dialog.
closeModalButton.addEventListener('click', closeImageModal);
modal.addEventListener('click', (event) => {
	if (event.target === modal) {
		closeImageModal();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && modal.classList.contains('is-open')) {
		closeImageModal();
	}
});

// Load the default date range as soon as the page opens.
getSpaceImages();
