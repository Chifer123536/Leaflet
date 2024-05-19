import updateGpsGlobalInt from './update_gps_global_int.js'
import updateSystemStatus from './update_system_status.js'
import updateTime from './update_time.js'
import updateServoOutputRaw from './update_servo_output_raw.js'
import updateAttitude from './update_attitude.js'

class Panel {
	constructor() {
		this.dataBuffer = {
			gps: null,
			time: null,
			systemStatus: null,
			servoOutput: null,
			attitude: null,
		}
		this.currentIndex = 0
		this.updateFunctions = []
	}

	addUpdateFunction(updateFunction) {
		this.updateFunctions.push(updateFunction)
	}

	update() {
		this.updateFunctions.forEach(func => func())
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
		this.update()
	}

	updateData() {
		if (this.dataBuffer.gps) {
			updateGpsGlobalInt(this.dataBuffer.gps)
		}
		if (this.dataBuffer.time) {
			updateTime(this.dataBuffer.time)
		}
		if (this.dataBuffer.systemStatus) {
			updateSystemStatus(this.dataBuffer.systemStatus)
		}
		if (this.dataBuffer.servoOutput) {
			updateServoOutputRaw(this.dataBuffer.servoOutput)
		}
		if (this.dataBuffer.attitude) {
			updateAttitude(this.dataBuffer.attitude)
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
}

export default Panel
