let scene, camera, renderer, sphere, horizonImage
let roll = 0
let pitch = 0
let yaw = 0
let horizon
let textureOffsetX = 0.5

function createSphere() {
	const radius = 2.01
	const widthSegments = 50
	const heightSegments = 50

	const geometry = new THREE.BufferGeometry()

	const vertices = []
	const indices = []
	const uvs = []

	for (let y = 0; y <= heightSegments; y++) {
		for (let x = 0; x <= widthSegments; x++) {
			const u = x / widthSegments
			const v = y / heightSegments
			const phi = u * Math.PI * 2
			const theta = v * Math.PI

			const vertex = new THREE.Vector3()
			vertex.x = -radius * Math.cos(phi) * Math.sin(theta)
			vertex.y = radius * Math.cos(theta)
			vertex.z = radius * Math.sin(phi) * Math.sin(theta)

			vertices.push(vertex.x, vertex.y, vertex.z)
			uvs.push(u, 1 - v)
		}
	}

	for (let y = 0; y < heightSegments; y++) {
		for (let x = 0; x < widthSegments; x++) {
			const a = x + (widthSegments + 1) * y
			const b = x + (widthSegments + 1) * (y + 1)
			const c = x + 1 + (widthSegments + 1) * (y + 1)
			const d = x + 1 + (widthSegments + 1) * y

			indices.push(a, b, d)
			indices.push(b, c, d)
		}
	}

	geometry.setIndex(indices)
	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute(vertices, 3)
	)
	geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

	const textureLoader = new THREE.TextureLoader()
	textureLoader.load('./images/texture.png', function (loadedTexture) {
		loadedTexture.wrapS = THREE.RepeatWrapping
		loadedTexture.repeat.set(4, 1)
		loadedTexture.magFilter = THREE.NearestMipmapLinearFilter
		loadedTexture.minFilter = THREE.NearestMipmapLinearFilter
		loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()

		const material = new THREE.MeshBasicMaterial({ map: loadedTexture })
		sphere = new THREE.Mesh(geometry, material)

		scene.add(sphere)

		animate()
	})
}

function createHorizonImage() {
	const horizonContainer = document.querySelector('.horizon')
	horizonImage = document.createElement('img')
	horizonImage.src = './images/line.png'
	horizonImage.id = 'horizont-line'
	horizonImage.classList.add('horizon-image')
	horizonImage.width = horizonContainer.clientWidth
	horizonImage.height = horizonContainer.clientHeight
	horizonContainer.appendChild(horizonImage)
	horizon = document.getElementById('horizont-line')
}

function updateAttitude(data) {
	const { roll: newRoll, pitch: newPitch, yaw: newYaw } = data

	roll = newRoll
	pitch = newPitch
	yaw = newYaw

	console.log(
		`Roll: ${roll.toFixed(2)}, Pitch: ${pitch.toFixed(2)}, Yaw: ${yaw.toFixed(
			2
		)}`
	)

	updateHorizon(newRoll)
}

function init() {
	scene = new THREE.Scene()
	const horizonContainer = document.querySelector('.horizon')
	const width = horizonContainer.clientWidth
	const height = horizonContainer.clientHeight
	const aspectRatio = width / height
	const fov = 48
	const near = 0.1
	const far = 1000

	camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
	camera.position.z = 5

	renderer = new THREE.WebGLRenderer({ alpha: true })
	renderer.setSize(width, height)

	horizonContainer.innerHTML = ''
	horizonContainer.appendChild(renderer.domElement)

	createSphere()
	createHorizonImage()
}

function updateTextureOffsetX() {
	sphere.material.map.offset.set(textureOffsetX, 0)
}

function updateHorizon(roll) {
	const rollAngle = THREE.MathUtils.degToRad(roll)
	horizon.style.transform = `translate(-50%, -50%) rotate(${-rollAngle}rad)`
}

function animate() {
	requestAnimationFrame(animate)
	renderer.clear()

	const targetRoll = THREE.MathUtils.degToRad(roll)
	const targetPitch = THREE.MathUtils.degToRad(pitch)
	const targetYaw = THREE.MathUtils.degToRad(yaw)

	const deltaRoll = (targetRoll - sphere.rotation.z) * 0.05
	const deltaPitch = (targetPitch - sphere.rotation.x) * 0.05
	const deltaYaw = (targetYaw - sphere.rotation.y) * 0.05

	sphere.rotation.x += deltaPitch
	sphere.rotation.y += deltaYaw
	sphere.rotation.z += deltaRoll

	updateTextureOffsetX()
	renderer.render(scene, camera)
}

init()

export default updateAttitude
