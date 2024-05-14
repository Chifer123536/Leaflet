// Экспорт функции update_system_status
function update_system_status(data) {
	const batteryChargeElement = document.getElementById('batteryCharge')
	const batteryVoltageElement = document.getElementById('batteryVoltage')
	const batteryCurrentElement = document.getElementById('batteryCurrent')
	const flightModeElement = document.getElementById('flightMode')

	// Обновление DOM элементов с использованием переданных данных
	batteryChargeElement.textContent = data.batteryCharge
	batteryVoltageElement.textContent = data.batteryVoltage
	batteryCurrentElement.textContent = data.batteryCurrent
	flightModeElement.textContent = data.flightMode

	console.log(
		`batteryCharge: ${data.batteryCharge}, batteryVoltage: ${data.batteryVoltage}, batteryCurrent: ${data.batteryCurrent}, flightMode: ${data.flightMode}`
	)
}

export default update_system_status
