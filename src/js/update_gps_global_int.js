import { getRandom_gps_global_int } from './getRandom.js'
import { routeCoordinates } from './route.js'

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

class Subject {
	constructor() {
		this.observers = []
	}

	addObserver(observer) {
		this.observers.push(observer)
	}

	removeObserver(observer) {
		this.observers = this.observers.filter(obs => obs !== observer)
	}

	notify(data) {
		this.observers.forEach(observer => {
			observer.update(data)
		})
	}
}

class Observer {
	update(data) {
		// Реализация метода обновления в подклассах
	}
}

class GPSData extends Subject {
	constructor() {
		super()
		this.data = {}
	}

	setData(data) {
		this.data = data
		this.notify(data)
	}
}

class MapView extends Observer {
	constructor(map) {
		super()
		this.map = map
		this.routePolyline = null // переменная для хранения полилинии
	}

	update(data) {
		// Обновление карты с новыми данными GPS
		const position = [data.lat, data.lon]
		this.map.setView(position, this.map.getZoom())

		// Обновление положения полилинии
		if (this.routePolyline) {
			this.routePolyline.addLatLng(position)
		} else {
			this.routePolyline = L.polyline([], {
				color: 'purple',
				weight: 10,
			}).addTo(this.map)
			this.routePolyline.addLatLng(position)
		}
	}
}

try {
	let marker
	let currentIndex = 0
	let lastAltitude = 0 // Переменная для хранения последнего значения высоты
	let lastSpeed = 0 // Переменная для хранения последнего значения скорости

	function createMarker(position, rotation) {
		const marker = L.marker(position, {
			icon: Icon,
			rotationOrigin: 'center center',
			riseOnHover: true,
			rotationAngle: rotation,
		}).addTo(map)
		return marker
	}

	function getAzimuth(currentLat, currentLon, nextLat, nextLon) {
		const dLat = nextLat - currentLat
		const dLon = nextLon - currentLon

		const radianAngle = Math.atan2(dLon, dLat)
		const degreeAngle = (radianAngle * 180) / Math.PI

		return degreeAngle >= 0 ? degreeAngle : 360 + degreeAngle
	}

	function updateView(data, maxAltitude, maxSpeed) {
		const latitudeElement = document.getElementById('latitude')
		const longitudeElement = document.getElementById('longitude')
		const altitudeElement = document.getElementById('altitude')
		const speedElement = document.getElementById('speed')
		const satellitesElement = document.getElementById('satellites')
		const azimuthElement = document.getElementById('azimuth')

		latitudeElement.textContent = `Latitude: ${parseFloat(data.lat).toFixed(5)}`
		longitudeElement.textContent = `Longitude: ${parseFloat(data.lon).toFixed(
			5
		)}`

		animateValue(
			altitudeElement,
			lastAltitude, // Используем последнее значение высоты как начальное
			parseFloat(data.alt),
			500
		)
		animateValue(
			speedElement,
			lastSpeed, // Используем последнее значение скорости как начальное
			parseFloat(data.vel),
			500
		)

		satellitesElement.textContent = `Satellites: ${data.satellites_visible}`
		azimuthElement.textContent = `${parseFloat(data.cog).toFixed(0)}°`

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

		// Добавляем вызов функции createMarker
		marker = createMarker(position, parseFloat(data.cog).toFixed(0))

		// После добавления маркера на карту убедитесь, что вы его отображаете
		marker.addTo(map)

		const arrowMarker = document.querySelector('.map-overlay-arrow')
		arrowMarker.style.transform = `translate(-50%, -50%) rotate(${parseFloat(
			data.cog
		).toFixed(0)}deg)`

		document.querySelector('.leaflet-control-attribution').style.display =
			'none'

		// Обновляем последние значения высоты и скорости
		lastAltitude = parseFloat(data.alt)
		lastSpeed = parseFloat(data.vel)
	}

	// Создаем экземпляры субъекта и наблюдателя
	const gpsData = new GPSData()
	const mapView = new MapView(map)

	// Добавляем наблюдателя в список подписчиков субъекта
	gpsData.addObserver(mapView)

	function update_gps_global_int() {
		const currentCoordinates = routeCoordinates[currentIndex]
		currentIndex = (currentIndex + 1) % routeCoordinates.length

		const nextCoordinates = routeCoordinates[currentIndex]

		const randomData = getRandom_gps_global_int()

		randomData.lat = currentCoordinates[0]
		randomData.lon = currentCoordinates[1]

		randomData.cog = getAzimuth(
			currentCoordinates[0],
			currentCoordinates[1],
			nextCoordinates[0],
			nextCoordinates[1]
		)

		console.log(
			`Latitude: ${randomData.lat.toFixed(
				5
			)}, Longitude: ${randomData.lon.toFixed(
				5
			)}, Altitude: ${randomData.alt.toFixed(
				5
			)}, Speed: ${randomData.vel.toFixed(1)} m/s, Satellites: ${
				randomData.satellites_visible
			}, Azimuth: ${randomData.cog.toFixed(0)}`
		)

		updateView(randomData)

		//  setData() для уведомления наблюдателей о новых данных
		gpsData.setData(randomData)
	}

	update_gps_global_int()
	setInterval(update_gps_global_int, 2000)
} catch {
	document.querySelector('.leaflet-control-attribution').style.display = 'none'
	const message = document.createElement('div')
	message.innerHTML = 'нет GPS'
	message.classList.add('centered-message')

	// Добавляем сообщение в документ
	document.body.appendChild(message)
}

// Функция для анимации обновления значений
function animateValue(element, start, end, duration, unit = '') {
	let startTimestamp = null
	const step = timestamp => {
		if (!startTimestamp) startTimestamp = timestamp
		const progress = Math.min((timestamp - startTimestamp) / duration, 1)
		element.textContent =
			(start + progress * (end - start) || 0).toFixed(1) + unit // Проверяем на NaN и присваиваем 0
		if (progress < 1) {
			window.requestAnimationFrame(step)
		}
	}
	window.requestAnimationFrame(step)
}
