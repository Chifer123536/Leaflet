import Panel from './Panel.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js'
import update_gps_global_int from './update_gps_global_int.js'
import update_system_status from './update_system_status.js'
import update_time from './update_time.js'
import update_servo_output_raw from './update_servo_output_raw.js'
import update_attitude from './update_attitude.js'

class DataPanel {
	constructor() {
		this.panel = new Panel()
		this.dataBuffer = {
			gps: null,
			time: null,
			systemStatus: null,
			servoOutput: null,
			attitude: null,
		}
		this.currentIndex = 0

		this.panel.addUpdateFunction(this.updateData.bind(this))
	}

	updateData() {
		if (this.dataBuffer.gps) {
			update_gps_global_int(this.dataBuffer.gps)
		}
		if (this.dataBuffer.time) {
			update_time(this.dataBuffer.time)
		}
		if (this.dataBuffer.systemStatus) {
			update_system_status(this.dataBuffer.systemStatus)
		}
		if (this.dataBuffer.servoOutput) {
			update_servo_output_raw(this.dataBuffer.servoOutput)
		}
		if (this.dataBuffer.attitude) {
			update_attitude(this.dataBuffer.attitude)
		}
		this.checkGpsData()
	}

	checkGpsData() {
		const messageElement = document.querySelector('.centered-message')
		if (
			!this.dataBuffer.gps ||
			this.dataBuffer.gps.lat == null ||
			this.dataBuffer.gps.lon == null
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

	handleMessage(message) {
		switch (message.type) {
			case 'gps':
				this.dataBuffer.gps = message.data
				break
			case 'time':
				this.dataBuffer.time = message.data
				break
			case 'systemStatus':
				this.dataBuffer.systemStatus = message.data
				break
			case 'servoOutput':
				this.dataBuffer.servoOutput = message.data
				break
			case 'attitude':
				this.dataBuffer.attitude = message.data
				break
			default:
				console.error('Unknown message type:', message.type)
		}
		this.panel.update()
	}

	createGpsMessage() {
		if (routeCoordinates.length === 0) {
			return { type: 'gps', data: null }
		}
		const currentCoordinates = routeCoordinates[this.currentIndex]
		const nextCoordinates =
			routeCoordinates[(this.currentIndex + 1) % routeCoordinates.length]
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

		this.currentIndex = (this.currentIndex + 1) % routeCoordinates.length
		return { type: 'gps', data: gpsData }
	}

	createTimeMessage() {
		return { type: 'time', data: Random.getRandom_update_time() }
	}

	createSystemStatusMessage() {
		return { type: 'systemStatus', data: Random.generateRandomSystemStatus() }
	}

	createServoOutputMessage() {
		return { type: 'servoOutput', data: Random.getRandom_servo_output_raw() }
	}

	createAttitudeMessage() {
		return { type: 'attitude', data: Random.getRandom_attitude() }
	}

	simulateIncomingMessage() {
		const messageTypes = [
			this.createGpsMessage.bind(this),
			this.createTimeMessage.bind(this),
			this.createSystemStatusMessage.bind(this),
			this.createServoOutputMessage.bind(this),
			this.createAttitudeMessage.bind(this),
		]
		const randomIndex = Math.floor(Math.random() * messageTypes.length)
		const message = messageTypes[randomIndex]()
		this.handleMessage(message)
	}
}

const dataPanel = new DataPanel()

// Симуляция получения сообщений с различными интервалами
setInterval(() => dataPanel.simulateIncomingMessage(), 500) // каждые 0.5 секунды

// Начальная проверка данных GPS
dataPanel.checkGpsData()

try {
	// Начальная симуляция данных и обновление панели
	dataPanel.panel.update()
} catch (error) {
	console.error('An error occurred:', error)
}
