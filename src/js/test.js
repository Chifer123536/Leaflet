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
	if (dataBuffer.gps) {
		update_gps_global_int(dataBuffer.gps)
	}
	if (dataBuffer.time) {
		update_time(dataBuffer.time)
	}
	if (dataBuffer.systemStatus) {
		update_system_status(dataBuffer.systemStatus)
	}
	if (dataBuffer.servoOutput) {
		update_servo_output_raw(dataBuffer.servoOutput)
	}
	if (dataBuffer.attitude) {
		update_attitude(dataBuffer.attitude)
	}
}

// Добавляем функцию обновления в панель
panel.addUpdateFunction(updateData)

// Инициализация переменных
let currentIndex = 0

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

// Функция обработки полученных сообщений
function handleMessage(message) {
	switch (message.type) {
		case 'gps':
			dataBuffer.gps = message.data
			break
		case 'time':
			dataBuffer.time = message.data
			break
		case 'systemStatus':
			dataBuffer.systemStatus = message.data
			break
		case 'servoOutput':
			dataBuffer.servoOutput = message.data
			break
		case 'attitude':
			dataBuffer.attitude = message.data
			break
		default:
			console.error('Unknown message type:', message.type)
	}
	checkGpsData()
	panel.update()
}

// Функции для создания сообщений с данными
function createGpsMessage() {
	if (routeCoordinates.length === 0) {
		return { type: 'gps', data: null }
	}
	const currentCoordinates = routeCoordinates[currentIndex]
	const nextCoordinates =
		routeCoordinates[(currentIndex + 1) % routeCoordinates.length]
	const azimuth = Random.getAzimuth(
		currentCoordinates[0],
		currentCoordinates[1],
		nextCoordinates[0],
		nextCoordinates[1]
	)

	const gpsData = {
		lat: currentCoordinates[0],
		lon: currentCoordinates[1],
		alt: Random.getRandom_gps_global_int().alt,
		vel: Random.getRandom_gps_global_int().vel,
		satellites_visible: Random.getRandom_gps_global_int().satellites_visible,
		cog: azimuth,
	}

	currentIndex = (currentIndex + 1) % routeCoordinates.length
	return { type: 'gps', data: gpsData }
}

function createTimeMessage() {
	return { type: 'time', data: Random.getRandom_update_time() }
}

function createSystemStatusMessage() {
	return { type: 'systemStatus', data: Random.generateRandomSystemStatus() }
}

function createServoOutputMessage() {
	return { type: 'servoOutput', data: Random.getRandom_servo_output_raw() }
}

function createAttitudeMessage() {
	return { type: 'attitude', data: Random.getRandom_attitude() }
}

// Функция для симуляции получения сообщений
function simulateIncomingMessage() {
	const messageTypes = [
		createGpsMessage,
		createTimeMessage,
		createSystemStatusMessage,
		createServoOutputMessage,
		createAttitudeMessage,
	]
	const randomIndex = Math.floor(Math.random() * messageTypes.length)
	const message = messageTypes[randomIndex]()
	handleMessage(message)
}

// Симуляция получения сообщений с различными интервалами
setInterval(simulateIncomingMessage, 500) // каждые 0.5 секунды

// Начальная проверка данных GPS
checkGpsData()

try {
	// Начальная симуляция данных и обновление панели
	panel.update()
} catch (error) {
	console.error('An error occurred:', error)
}
