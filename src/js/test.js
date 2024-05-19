import Panel from './Panel.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js'

const panel = new Panel()

panel.addUpdateFunction(panel.updateData.bind(panel))

function createGpsMessage() {
	if (routeCoordinates.length === 0) {
		return { type: 'gps', data: null }
	}
	const currentCoordinates = routeCoordinates[panel.currentIndex]
	const nextCoordinates =
		routeCoordinates[(panel.currentIndex + 1) % routeCoordinates.length]
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

	panel.currentIndex = (panel.currentIndex + 1) % routeCoordinates.length
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
	panel.handleMessage(message)
}

setInterval(() => simulateIncomingMessage(), 500)

panel.checkGpsData()

try {
	panel.update()
} catch (error) {
	console.error('An error occurred:', error)
}
