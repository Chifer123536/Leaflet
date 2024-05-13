export function getRandom_gps_global_int() {
	return {
		time_usec: getRandomTimeUsec(),
		fix_type: getRandomFixType(),
		alt: getRandomAltitude(),
		eph: getRandomEph(),
		epv: getRandomEpv(),
		vel: getRandomVel(),
		cog: getRandomCog(),
		satellites_visible: getRandomSatellitesVisible(),
	}
}

export function generateRandomSystemStatus() {
	const batteryCharge = Math.floor(Math.random() * 101) + '%'
	const batteryVoltage = (Math.random() * 25).toFixed(1) + 'V'
	const batteryCurrent = (Math.random() * 10).toFixed(1) + 'A'
	const flightMode = getRandomFlightMode()

	return {
		batteryCharge,
		batteryVoltage,
		batteryCurrent,
		flightMode,
	}
}

export function getRandom_update_time() {
	const currentTime = new Date()
	const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
	const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')

	const time = `${hours}:${minutes}`

	return {
		time_usec: time,
		boot_ms: getRandomBootMs(),
		time_since_start_ms: getRandomTimeSinceStartMs(),
	}
}

export function getRandom_attitude() {
	return {
		time_boot_ms: getRandomTimeBootMs(),
		roll: getRandomAngle(),
		pitch: getRandomAngle(),
		yaw: getRandomAngle(),
		rollspeed: getRandomSpeed(),
		pitchspeed: getRandomSpeed(),
		yawspeed: getRandomSpeed(),
	}
}

export function getRandom_servo_output_raw() {
	return {
		servo1_raw: getRandomServoRawPercentage(),
		servo2_raw: getRandomServoRawPercentage(),
		servo3_raw: getRandomServoRawPercentage(),
		servo4_raw: getRandomServoRawPercentage(),
		servo5_raw: getRandomServoRawPercentage(),
		servo6_raw: getRandomServoRawPercentage(),
		servo7_raw: getRandomServoRawPercentage(),
		servo8_raw: getRandomServoRawPercentage(),
	}
}

function getRandomServoRawPercentage() {
	return Math.floor(Math.random() * 101)
}

function getRandomBootMs() {
	return Math.floor(Math.random() * 10000)
}

export function getRandomTimeSinceStartMs() {
	return Math.floor(Math.random() * 100000)
}

function getRandomAngle() {
	return Math.random() * 360
}

function getRandomSpeed() {
	return Math.random() * 100
}

function getRandomTimeUsec() {
	return Math.floor(Math.random() * 1000000)
}

function getRandomFixType() {
	return Math.floor(Math.random() * 7)
}

function getRandomCoordinate() {
	return Math.random() * 180 - 90
}

function getRandomAltitude() {
	return Math.floor(Math.random() * 1000)
}

function getRandomEph() {
	return Math.random() * 10
}

function getRandomEpv() {
	return Math.random() * 10
}

function getRandomVel() {
	return Math.floor(Math.random() * 100)
}

export function getRandomCog() {
	return Math.random() * 360
}

function getRandomSatellitesVisible() {
	return Math.floor(Math.random() * 20)
}

function getRandomTimeBootMs() {
	return Math.floor(Math.random() * 10000)
}

export function getRandomRoll() {
	return Math.floor(Math.random() * 360)
}

export function getRandomPitch() {
	return Math.floor(Math.random() * 360)
}

export function getRandomYaw() {
	return Math.floor(Math.random() * 360)
}

export function getRandomServoRaw() {
	return Math.floor(Math.random() * 180)
}

function getRandomFlightMode() {
	const flightModes = [
		'Manual',
		'Stabilize',
		'Alt Hold',
		'Auto',
		'Guided',
		'Loiter',
		'RTL',
	]
	const randomIndex = Math.floor(Math.random() * flightModes.length)
	return flightModes[randomIndex]
}

export function getAzimuth(currentLat, currentLon, nextLat, nextLon) {
	const dLat = nextLat - currentLat
	const dLon = nextLon - currentLon

	const radianAngle = Math.atan2(dLon, dLat)
	const degreeAngle = (radianAngle * 180) / Math.PI

	return degreeAngle >= 0 ? degreeAngle : 360 + degreeAngle
}
