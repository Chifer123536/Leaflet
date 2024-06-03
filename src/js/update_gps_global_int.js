let marker
let routePolyline = null
let previousPositions = []

const iconWidth = 50
const iconHeight = 50

const Icon = L.icon({
	iconUrl: './images/marker.png',
	iconSize: [iconWidth, iconHeight],
	iconAnchor: [iconWidth / 2, iconHeight / 2],
	popupAnchor: [iconWidth / 2, iconHeight / 2],
})

const initialMapCenter = [51.6839, 39.1678]

const mapOptions = {
	center: initialMapCenter,
	zoom: 15,
	zoomControl: false,
	tileWidth: 512,
	tileHeight: 512,
	minZoom: 17,
	maxZoom: 17,
}

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution:
		'&copy; <a href="www.openstreetmap.org">OpenStreetMap</a> contributors',
})

const mapElement = document.getElementById('map')
const map = L.map(mapElement, mapOptions)

function animateValue(element, end, duration = 500, unit = '') {
	const start = parseFloat(element.textContent) || 0
	const startTime = performance.now()

	const update = currentTime => {
		const elapsedTime = currentTime - startTime
		const progress = Math.min(elapsedTime / duration, 1)
		element.textContent =
			Math.round(start + progress * (end - start)).toString() + unit

		if (progress < 1) {
			requestAnimationFrame(update)
		}
	}

	requestAnimationFrame(update)
}

function update_gps_global_int(data) {
	const position = [data.lat, data.lon]

	// Update map
	map.setView(position, map.getZoom())

	if (!map.hasLayer(osm)) {
		osm.addTo(map)
	} else {
		osm.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	}

	if (marker) {
		map.removeLayer(marker)
	}

	marker = L.marker(position, {
		icon: Icon,
		rotationOrigin: 'center center',
		riseOnHover: true,
		rotationAngle: parseFloat(data.cog).toFixed(0),
	}).addTo(map)

	const arrowMarker = document.querySelector('.map-overlay-arrow')
	arrowMarker.style.transform = `translate(-50%, -50%) rotate(${parseFloat(
		data.cog
	).toFixed(0)}deg)`

	document.getElementById('latitude').textContent = `Latitude: ${parseFloat(
		data.lat
	).toFixed(5)}`
	document.getElementById('longitude').textContent = `Longitude: ${parseFloat(
		data.lon
	).toFixed(5)}`
	animateValue(
		document.getElementById('altitude'),
		Math.round(parseFloat(data.alt))
	)
	animateValue(
		document.getElementById('speed'),
		Math.round(parseFloat(data.vel))
	)
	document.getElementById(
		'satellites'
	).textContent = `Satellites: ${data.satellites_visible}`
	animateValue(
		document.getElementById('azimuth'),
		parseFloat(data.cog).toFixed(0)
	)

	previousPositions.push(L.latLng(position))

	if (!routePolyline) {
		routePolyline = L.polyline([], {
			color: 'purple',
			weight: 10,
		}).addTo(map)
	}

	routePolyline.setLatLngs(previousPositions)
}

export default update_gps_global_int
