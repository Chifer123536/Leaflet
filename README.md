# Приборная панель на основе Leaflet

Данный проект представляет собой приборную панель, разработанную на основе библиотеки Leaflet, для отображения местоположения в режиме реального времени на карте.

## Установка и настройка

1. Склонируйте репозиторий на ваш компьютер:

git clone [https://github.com/Chifer123536/Leaflet](https://github.com/Chifer123536/Leaflet.git)

2. Установите зависимости, выполнив следующую команду в корне проекта:

npm install


## Использование

Для запуска приборной панели выполните следующие шаги:

1. Введите следующую команду в корне проекта:

npm start


2. Приложение начнет отображать текущее местоположение на карте с помощью GPS-координат, полученных из файла `gps.txt`.

3. Если GPS-координаты успешно распознаны из файла, на карте будет размещен маркер, указывающий текущее местоположение. В противном случае будет отображено сообщение "нет GPS".

4. Карта автоматически обновляется и показывает последние GPS-координаты каждые 2 секунды

## Структура файлов

- `index.html`: HTML-файл, содержащий карту и теги скриптов.
- `style.css`: CSS-файл для стилизации HTML-элементов.
- `js`: Папка со всеми js файлами.
- `images`: Папка со всеми изображениями

## Используемые библиотеки

- [jQuery](https://jquery.com/): Библиотека JavaScript для облегчения работы с HTML-документами.
- [Leaflet](https://leafletjs.com/): JavaScript-библиотека для интерактивных карт.

## Дополнительная информация

- GPS-координаты считываются из файла `gps.txt`.
- Карта использует тайлы от OpenStreetMap.
- Уровень масштабирования карты зафиксирован на значении 17.
- Иконка маркера настраивается с использованием файла `marker.png` из папки `icons/`.

