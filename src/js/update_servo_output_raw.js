import { getRandom_servo_output_raw } from './getRandom.js'
;(function () {
	try {
		const engineMarkers = {} // Объект для хранения маркеров двигателей

		// Функция для создания элемента полоски двигателя
		function createEngineStrip(id, width, height, top, engineNumber) {
			const engineStrip = document.createElement('li')
			engineStrip.classList.add('engine-strip')
			engineStrip.style.width = `${width}px`
			engineStrip.style.height = `${height}px`
			engineStrip.style.top = `${top}px`
			engineStrip.id = id

			const engineContainer = document.createElement('div')
			engineContainer.classList.add('engine-container')
			engineStrip.appendChild(engineContainer)

			const rearEngineImage = document.createElement('img')
			rearEngineImage.classList.add('rear-engine-strip-image')
			rearEngineImage.src = 'images/Rear Engine Strip.png'
			rearEngineImage.style.width = '8px'
			rearEngineImage.style.height = '70px'
			rearEngineImage.style.float = 'left'
			engineContainer.appendChild(rearEngineImage)

			const engineImage = document.createElement('img')
			engineImage.classList.add('engine-strip-image')
			engineImage.src = 'images/Engine Strip.png'
			engineImage.style.width = '20px'
			engineImage.style.height = '6px'
			engineImage.style.float = 'right'
			engineContainer.appendChild(engineImage)

			const engineNumberText = document.createElement('span')
			engineNumberText.classList.add('engine-number')
			engineNumberText.textContent = engineNumber
			engineContainer.appendChild(engineNumberText)

			const powerText = document.createElement('span')
			powerText.classList.add('power-text')
			powerText.textContent = '0%'
			engineContainer.appendChild(powerText)

			return engineStrip
		}

		// Функция для анимации перемещения маркера
		function animateMarker(marker, newBottom) {
			const duration = 500
			const start = marker.style.bottom ? parseFloat(marker.style.bottom) : 0
			const startTime = performance.now()
			const previousBottom =
				marker.previousBottom !== undefined ? marker.previousBottom : start

			function step(currentTime) {
				const elapsedTime = currentTime - startTime
				if (elapsedTime < duration) {
					const progress = elapsedTime / duration
					marker.style.bottom = `${
						previousBottom + (newBottom - previousBottom) * progress
					}%`
					requestAnimationFrame(step)
				} else {
					marker.style.bottom = `${newBottom}%`
					marker.previousBottom = newBottom
				}
			}

			requestAnimationFrame(step)
		}

		// Функция для обновления полоски двигателя
		function updateEngineStrip(engineStrip, enginePower) {
			const rearEngineImage = engineStrip.querySelector(
				'.rear-engine-strip-image'
			)
			const engineImage = engineStrip.querySelector('.engine-strip-image')
			const powerText = engineStrip.querySelector('.power-text')

			// Высота полоски
			const stripHeight = engineStrip.offsetHeight

			// Новое значение bottom для engineImage
			const newBottom =
				(enginePower / 100) * (stripHeight - engineImage.offsetHeight)

			animateMarker(rearEngineImage, newBottom)
			animateMarker(engineImage, newBottom)

			powerText.textContent = `${enginePower.toFixed(0)}%`
		}

		// Функция для обновления показаний двигателей
		function updateServoOutputRaw() {
			const enginePowerValues = getRandom_servo_output_raw()
			const servoOutputRawContainer =
				document.querySelector('.servo_output_raw')

			const engineData = []

			Object.entries(enginePowerValues).forEach(([engineId, power], index) => {
				const enginePower = Math.min(100, Math.max(0, power))
				const engineStripId = `engine-strip-${index + 1}`
				let engineStrip = engineMarkers[engineId]

				if (!engineStrip) {
					engineStrip = createEngineStrip(
						engineStripId,
						28,
						100,
						index * 100,
						index + 1
					)
					// Изменяем точку вставки на контейнер servo_output_raw
					servoOutputRawContainer.appendChild(engineStrip)
					engineMarkers[engineId] = engineStrip
				}

				updateEngineStrip(engineStrip, enginePower)
				engineData.push(`Engine ${index + 1}: ${enginePower.toFixed(0)}%`)
			})

			console.log(engineData.join(', '))
		}

		// Инициализация
		function init() {
			updateServoOutputRaw()
			setInterval(updateServoOutputRaw, 2000)
		}

		init()
	} catch (error) {
		console.error('An error occurred:', error)
	}
})()
