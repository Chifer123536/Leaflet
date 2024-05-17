import Panel from './Panel.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js'
import update_gps_global_int from './update_gps_global_int.js'
import update_system_status from './update_system_status.js'
import update_time from './update_time.js'
import update_servo_output_raw from './update_servo_output_raw.js'
import update_attitude from './update_attitude.js'

const panel = new Panel()

// Общий буфер для хранения всех данных
let dataBuffer = {
	gps: null,
	time: null,
	systemStatus: null,
	servoOutput: null,
	attitude: null,
}

// Функция обновления данных на панели
function updateData() {
	update_gps_global_int(dataBuffer.gps)
	update_time(dataBuffer.time)
	update_system_status(dataBuffer.systemStatus)
	update_servo_output_raw(dataBuffer.servoOutput)
	update_attitude(dataBuffer.attitude)
}

// Добавляем функцию обновления в панель
panel.addUpdateFunction(updateData)

// Инициализация переменных
let currentIndex = 0

// Функции для обновления различных данных с разными интервалами
function updateGpsData() {
	const currentCoordinates = routeCoordinates[currentIndex]
	const nextCoordinates =
		routeCoordinates[(currentIndex + 1) % routeCoordinates.length]
	const azimuth = Random.getAzimuth(
		currentCoordinates[0],
		currentCoordinates[1],
		nextCoordinates[0],
		nextCoordinates[1]
	)

	dataBuffer.gps = {
		lat: currentCoordinates[0],
		lon: currentCoordinates[1],
		alt: Random.getRandom_gps_global_int().alt,
		vel: Random.getRandom_gps_global_int().vel,
		satellites_visible: Random.getRandom_gps_global_int().satellites_visible,
		cog: azimuth,
	}

	currentIndex = (currentIndex + 1) % routeCoordinates.length
	checkGpsData() // Проверка сразу после обновления данных
}

function updateTimeData() {
	dataBuffer.time = Random.getRandom_update_time()
}

function updateSystemStatusData() {
	dataBuffer.systemStatus = Random.generateRandomSystemStatus()
}

function updateServoOutputData() {
	dataBuffer.servoOutput = Random.getRandom_servo_output_raw()
}

function updateAttitudeData() {
	dataBuffer.attitude = Random.getRandom_attitude()
}

// Устанавливаем интервалы для обновления данных
setInterval(updateGpsData, 2000) // раз в 2 секунды
setInterval(updateTimeData, 500) // 2 раза в секунду
setInterval(updateSystemStatusData, 1000) // 1 раз в секунду
setInterval(updateServoOutputData, 1000) // 1 раз в секунду
setInterval(updateAttitudeData, 3000) // 10 раз в секунду

// Функция для проверки наличия GPS данных
function checkGpsData() {
	const messageElement = document.querySelector('.centered-message')
	if (
		!dataBuffer.gps ||
		dataBuffer.gps.lat == null ||
		dataBuffer.gps.lon == null
	) {
		if (!messageElement) {
			const message = document.createElement('div')
			message.innerHTML = 'no GPS'
			message.classList.add('centered-message')
			document.getElementById('map').appendChild(message)
		}
	} else {
		if (messageElement) {
			messageElement.remove()
		}
	}
}

// Обновление панели интерфейса через короткие интервалы
setInterval(() => {
	panel.update()
	checkGpsData()
}, 100) // каждые 0.1 секунды

try {
	// Начальная симуляция данных и обновление панели
	panel.update()
	checkGpsData()
} catch (error) {
	console.error('An error occurred:', error)
}

// Первоначальная проверка, чтобы сообщение сразу отображалось
checkGpsData()
