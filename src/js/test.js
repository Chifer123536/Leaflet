import update_gps_global_int from './update_gps_global_int.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js' // Подключаем все экспортированные функции из файла getRandom.js

// Инициализация переменных
let currentIndex = 0

try {
	// Генерация и отправка данных в функцию update_gps_global_int
	function simulateGPSData() {
		const currentCoordinates = routeCoordinates[currentIndex]
		currentIndex = (currentIndex + 1) % routeCoordinates.length

		const nextCoordinates = routeCoordinates[currentIndex]

		// Используем функцию getAzimuth из модуля Random для вычисления азимута
		const azimuth = Random.getAzimuth(
			currentCoordinates[0],
			currentCoordinates[1],
			nextCoordinates[0],
			nextCoordinates[1]
		)

		const randomData = Random.getRandom_gps_global_int() // Генерация случайных данных

		// Передаем сгенерированные случайные данные и текущие координаты в функцию update_gps_global_int
		update_gps_global_int({
			lat: currentCoordinates[0],
			lon: currentCoordinates[1],
			alt: randomData.alt,
			vel: randomData.vel,
			satellites_visible: randomData.satellites_visible,
			cog: azimuth, // Используем вычисленный азимут
		})
	}

	// Запуск симуляции
	simulateGPSData()
	setInterval(simulateGPSData, 2000)
} catch (error) {
	if (error instanceof TypeError && error.message.includes('undefined')) {
		document.querySelector('.leaflet-control-attribution').style.display =
			'none'
		const message = document.createElement('div')
		message.innerHTML = 'no GPS'
		message.classList.add('centered-message')

		document.getElementById('map').appendChild(message)
	} else {
		console.error('An error occurred:', error)
	}
}

export default update_gps_global_int
