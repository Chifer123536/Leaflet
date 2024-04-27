import { generateRandomSystemStatus } from './getRandom.js'

function update_view_system_status(simulatedData) {
	const batteryChargeElement = document.getElementById('batteryCharge')
	const batteryVoltageElement = document.getElementById('batteryVoltage')
	const batteryCurrentElement = document.getElementById('batteryCurrent')
	const flightModeElement = document.getElementById('flightMode')

	batteryChargeElement.textContent = simulatedData.batteryCharge
	batteryVoltageElement.textContent = simulatedData.batteryVoltage
	batteryCurrentElement.textContent = simulatedData.batteryCurrent
	flightModeElement.textContent = simulatedData.flightMode
}

function update_system_status() {
	const simulatedData = generateRandomSystemStatus()
	update_view_system_status(simulatedData)
	console.log(
		`batteryCharge: ${simulatedData.batteryCharge}, batteryVoltage: ${simulatedData.batteryVoltage}, batteryCurrent: ${simulatedData.batteryCurrent}, flightMode: ${simulatedData.flightMode}`
	)
}

update_system_status()
setInterval(update_system_status, 2000)
