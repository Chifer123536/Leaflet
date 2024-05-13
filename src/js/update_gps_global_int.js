import { routeCoordinates } from './route.js'

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

class GPSDataSubject {
	constructor() {
		this.observers = []
	}

	addObserver(observer) {
		this.observers.push(observer)
	}

	notify(data) {
		this.observers.forEach(observer => {
			observer.update(data)
		})
	}
}

class GPSDataObserver {
	constructor(elementId) {
		this.element = document.getElementById(elementId)
	}

	update(data) {
		switch (this.element.id) {
			case 'latitude':
				this.element.textContent = `Latitude: ${parseFloat(data.lat).toFixed(
					5
				)}`
				break
			case 'longitude':
				this.element.textContent = `Longitude: ${parseFloat(data.lon).toFixed(
					5
				)}`
				break
			case 'altitude':
				this.animateValue(this.element, Math.round(parseFloat(data.alt)), 500)
				break
			case 'speed':
				this.animateValue(this.element, Math.round(parseFloat(data.vel)), 500)
				break
			case 'satellites':
				this.element.textContent = `Satellites: ${data.satellites_visible}`
				break
			case 'azimuth':
				this.element.textContent = `${parseFloat(data.cog).toFixed(0)}°`
				break
			default:
				break
		}
	}

	animateValue(element, end, duration, unit = '') {
		let start = parseFloat(element.textContent) || 0
		let startTimestamp = null
		const step = timestamp => {
			if (!startTimestamp) startTimestamp = timestamp
			const progress = Math.min((timestamp - startTimestamp) / duration, 1)
			element.textContent =
				Math.round(start + progress * (end - start) || 0).toString() + unit
			if (progress < 1) {
				window.requestAnimationFrame(step)
			}
		}
		window.requestAnimationFrame(step)
	}
}

function update_gps_global_int(data) {
	const gpsDataSubject = new GPSDataSubject()

	const latitudeObserver = new GPSDataObserver('latitude')
	const longitudeObserver = new GPSDataObserver('longitude')
	const altitudeObserver = new GPSDataObserver('altitude')
	const speedObserver = new GPSDataObserver('speed')
	const satellitesObserver = new GPSDataObserver('satellites')
	const azimuthObserver = new GPSDataObserver('azimuth')

	const observers = [
		latitudeObserver,
		longitudeObserver,
		altitudeObserver,
		speedObserver,
		satellitesObserver,
		azimuthObserver,
	]

	const position = [data.lat, data.lon]

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

	document.querySelector('.leaflet-control-attribution').style.display = 'none'

	// Обновление данных и уведомление наблюдателей
	gpsDataSubject.notify(data)

	// Обновление полилинии
	const markerPosition = L.latLng(position)
	previousPositions.push(markerPosition)

	if (!routePolyline) {
		routePolyline = L.polyline([], {
			color: 'purple',
			weight: 10,
		}).addTo(map)
	}

	routePolyline.setLatLngs(previousPositions)

	observers.forEach(observer => {
		observer.update(data)
	})
}

export default update_gps_global_int
