import update_gps_global_int from './update_gps_global_int.js'
import update_system_status from './update_system_status.js'
import update_time from './update_time.js' // Импорт функции update_time
import update_servo_output_raw from './update_servo_output_raw.js'
import update_attitude from './update_attitude.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js' // Подключаем все экспортированные функции из файла getRandom.js

class Panel {
	constructor() {
		this.updateFunctions = [] // Массив функций для обновления данных
	}

	// Добавление функции обновления данных
	addUpdateFunction(updateFunction) {
		this.updateFunctions.push(updateFunction)
	}

	// Обновление экрана
	update() {
		this.updateFunctions.forEach(func => func())
	}
}

// Создаем экземпляр панели
const panel = new Panel()

// Функция обновления данных для GPS
function updateGPS() {
	const currentCoordinates = routeCoordinates[currentIndex]
	currentIndex = (currentIndex + 1) % routeCoordinates.length
	const nextCoordinates = routeCoordinates[currentIndex]

	const azimuth = Random.getAzimuth(
		currentCoordinates[0],
		currentCoordinates[1],
		nextCoordinates[0],
		nextCoordinates[1]
	)

	const randomGpsData = Random.getRandom_gps_global_int()

	update_gps_global_int({
		lat: currentCoordinates[0],
		lon: currentCoordinates[1],
		alt: randomGpsData.alt,
		vel: randomGpsData.vel,
		satellites_visible: randomGpsData.satellites_visible,
		cog: azimuth,
	})
}

// Функция обновления данных для времени
function updateTime() {
	const randomTimeData = Random.getRandom_update_time()
	update_time(randomTimeData)
}

// Функция обновления данных для системного статуса
function updateSystemStatus() {
	const randomStatusData = Random.generateRandomSystemStatus()
	update_system_status(randomStatusData)
}

// Функция обновления данных для сервопривода
function updateServoOutputRaw() {
	const randomServoData = Random.getRandom_servo_output_raw()
	update_servo_output_raw(randomServoData)
}

// Функция обновления данных для аттитюда
function updateAttitude() {
	const randomAttitudeData = Random.getRandom_attitude()
	update_attitude(randomAttitudeData)
}

// Добавляем функции обновления в панель
panel.addUpdateFunction(updateGPS)
panel.addUpdateFunction(updateTime)
panel.addUpdateFunction(updateSystemStatus)
panel.addUpdateFunction(updateServoOutputRaw)
panel.addUpdateFunction(updateAttitude)

// Инициализация переменных
let currentIndex = 0

try {
	// Генерация и отправка данных в функцию update_gps_global_int
	function simulateGPSData() {
		panel.update()
	}

	// Запуск симуляции
	simulateGPSData()
	setInterval(simulateGPSData, 2000)
} catch (error) {
	if (error instanceof TypeError && error.message.includes('undefined')) {
		const message = document.createElement('div')
		message.innerHTML = 'no GPS'
		message.classList.add('centered-message')

		document.getElementById('map').appendChild(message)
	} else {
		console.error('An error occurred:', error)
	}
}
