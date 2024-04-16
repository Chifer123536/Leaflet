import { getRandom_attitude } from "./getRandom.js";

(function () {
  // Объявление переменных для сцены, камеры, рендерера, объекта, изображения горизонта и таймера аттитюда
  let scene, camera, renderer, sphere, horizonImage;
  let attitudeTimer;

  // Начальные углы крена, тангажа и рыскания
  let roll = 0;
  let pitch = 0;
  let yaw = 0;

  // Элемент горизонта
  let horizon;

  // Смещение текстуры по горизонтали
  let textureOffsetX = 0.5;
  // Функция для создания сферы
  function createSphere() {
    const radius = 1;
    const widthSegments = 50;
    const heightSegments = 50;

    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const indices = [];
    const uvs = [];

    // Создание сферической геометрии
    for (let y = 0; y <= heightSegments; y++) {
      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const v = y / heightSegments;
        const phi = u * Math.PI * 2;
        const theta = v * Math.PI;

        const vertex = new THREE.Vector3();
        vertex.x = -radius * Math.cos(phi) * Math.sin(theta);
        vertex.y = radius * Math.cos(theta);
        vertex.z = radius * Math.sin(phi) * Math.sin(theta);

        vertices.push(vertex.x, vertex.y, vertex.z);
        uvs.push(u, 1 - v); // Используем сферические координаты для текстуры
      }
    }

    // Создание индексов для рендеринга
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = x + (widthSegments + 1) * y;
        const b = x + (widthSegments + 1) * (y + 1);
        const c = x + 1 + (widthSegments + 1) * (y + 1);
        const d = x + 1 + (widthSegments + 1) * y;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("./images/texture.png", function (loadedTexture) {
      // Установка тайлинга для текстуры только по горизонтали
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.repeat.set(4, 1); // Устанавливаем тайлинг по горизонтали 4 раза

      // Установка фильтрации текстуры для сглаживания
      loadedTexture.magFilter = THREE.NearestMipmapLinearFilter; // Устанавливаем более качественный фильтр
      loadedTexture.minFilter = THREE.NearestMipmapLinearFilter;

      // Установка анизотропной фильтрации для сглаживания текстуры
      loadedTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const material = new THREE.MeshBasicMaterial({ map: loadedTexture });
      sphere = new THREE.Mesh(geometry, material);

      scene.add(sphere);

      // Запуск анимации после загрузки текстуры
      animate();
    });
  }

  // Функция для создания изображения горизонта
  function createHorizonImage() {
    const horizonContainer = document.querySelector(".horizon");
    horizonImage = document.createElement("img");
    horizonImage.src = "./images/line.png";
    horizonImage.id = "horizont-line";
    horizonImage.classList.add("horizon-image");
    horizonContainer.appendChild(horizonImage);
    horizon = document.getElementById("horizont-line");
  }

  // Функция для обновления углов аттитюда
  function update_attitude(newRoll, newPitch, newYaw) {
    roll = newRoll;
    pitch = newPitch;
    yaw = newYaw;

    console.log(`Roll: ${roll.toFixed(2)}, Pitch: ${pitch.toFixed(2)}, Yaw: ${yaw.toFixed(2)}`);
  }

  // Функция для запуска таймера аттитюда
  function startAttitudeTimer() {
    attitudeTimer = setInterval(function () {
      const randomData = getRandom_attitude();
      const { roll: targetRoll, pitch: targetPitch, yaw: targetYaw } = randomData;

      update_attitude(targetRoll, targetPitch, targetYaw);
      updateHorizon(targetRoll, targetPitch);
    }, 2000);
  }

  // Функция для инициализации сцены
  function init() {
    scene = new THREE.Scene();
    const horizonContainer = document.querySelector(".horizon");
    const width = horizonContainer.clientWidth;
    const height = horizonContainer.clientHeight;
    const aspectRatio = width / height;
    const fov = 48;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.z = 2.5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);

    horizonContainer.innerHTML = "";
    horizonContainer.appendChild(renderer.domElement);

    createSphere();
    createHorizonImage();
  }

  // Функция для обновления смещения текстуры по горизонтали
  function updateTextureOffsetX() {
    sphere.material.map.offset.set(textureOffsetX, 0);
  }

  // Функция для обновления изображения горизонта
  function updateHorizon(roll, pitch) {
    const rollAngle = THREE.MathUtils.degToRad(roll);
    const pitchAngle = THREE.MathUtils.degToRad(pitch);

    let horizonTop = (Math.tan(pitchAngle) * horizon.clientHeight) / 2;
    horizonTop = Math.max(Math.min(horizonTop, horizon.clientHeight / 2), -horizon.clientHeight / 2);
    horizon.style.transition = "top 0.5s";
    horizon.style.top = `calc(50% - ${horizonTop}px)`;

    horizon.style.transform = `translate(-50%, -50%) rotate(${-rollAngle}rad)`;
  }

  // Функция для анимации
  function animate() {
    requestAnimationFrame(animate);
    renderer.clear();

    const targetRoll = THREE.MathUtils.degToRad(roll);
    const targetPitch = THREE.MathUtils.degToRad(pitch);
    const targetYaw = THREE.MathUtils.degToRad(yaw);

    const deltaRoll = (targetRoll - sphere.rotation.z) * 0.05; // Уменьшаем шаг изменения угла
    const deltaPitch = (targetPitch - sphere.rotation.x) * 0.05; // Уменьшаем шаг изменения угла
    const deltaYaw = (targetYaw - sphere.rotation.y) * 0.05; // Уменьшаем шаг изменения угла

    sphere.rotation.x += deltaPitch;
    sphere.rotation.y += deltaYaw;
    sphere.rotation.z += deltaRoll;

    updateTextureOffsetX();
    renderer.render(scene, camera);
  }

  // Инициализация сцены и запуск таймера аттитюда
  init();
  startAttitudeTimer();
})();
