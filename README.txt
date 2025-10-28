Grow a Garden — Cordova-ready demo
=================================

Что внутри:
- index.html — основной HTML/Phaser3 прототип.
- main.js — игровой код (посадка семян, рост).
- manifest.json — PWA манифест.
- config.xml — шаблон Cordova.
- pluck.ogg / pluck.mp3 — placeholder аудио.
- build_instructions.txt — пошаговая инструкция, как собрать APK.

Важно: я не могу собрать APK прямо здесь (нет Android SDK / cordova build environment). Вместо этого — готовый проект, который можно собрать на твоём компьютере.

Сборка с помощью Cordova (рекомендуется):
1) Установи Node.js и npm.
2) Установи Cordova: `npm install -g cordova`
3) Перейди в папку проекта и создай cordova-проект:
   - `cordova create growapp com.yourname.growagarden "Grow a Garden"`
   - Замени содержимое папки `growapp/www` на файлы из этого архива (index.html, main.js, manifest.json, pluck.*).
   - Скопируй config.xml в `growapp/config.xml`.
4) Добавь платформу Android:
   - `cd growapp`
   - `cordova platform add android`
5) Собери APK:
   - `cordova build android --release`
   - Затем подпиши APK с помощью jarsigner / apksigner (Android SDK).
6) Установи APK на устройство или используй `adb install`.

Альтернативы:
- Открыть `index.html` в браузере на ПК или телефоне (локально) — игра работает как прототип.
- Импортировать файлы в Unity/Godot и доработать (требует ручной работы).

Если хочешь, я могу:
- Добавить больше механик (полив, удобрения, разведение редких растений).
- Сделать GUI-элементы и иконки.
- Подготовить инструкции по подписи APK и публикации в Google Play.

Удачи!