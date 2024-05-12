import update_gps_global_int from './update_gps_global_int.js'
import { routeCoordinates } from './route.js'
import * as Random from './getRandom.js' // Подключаем все экспортированные функции из файла getRandom.js

// Инициализация переменных
let currentIndex = 0

// Генерация и отправка данных в функцию update_gps_global_int
function simulateGPSData() {
	const currentCoordinates = routeCoordinates[currentIndex]
	currentIndex = (currentIndex + 1) % routeCoordinates.length

	const nextCoordinates = routeCoordinates[currentIndex]
	const randomData = Random.getRandom_gps_global_int() // Используем функцию getRandom_gps_global_int из файла getRandom.js

	// Передаем сгенерированные случайные данные в функцию update_gps_global_int
	update_gps_global_int(randomData)
}

// Запуск симуляции
simulateGPSData()
setInterval(simulateGPSData, 2000)
