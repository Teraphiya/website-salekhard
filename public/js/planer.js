document.addEventListener('DOMContentLoaded', function () {
	let attractions = {
		'Стелла 66 параллель': 'images/1shd.png',
		'Мост Ямал': 'images/2shd.jpg',
		'Северное сияние': 'images/3shd.jpg',
		'Вид на город с высоты птичьего полета': 'images/4shd.jpg',
		'Памятник мамонту': 'images/5shd.jpg',
		'Собор преображения господня': 'images/6shd.jpg',
		'Концертный зал': 'images/7shd.jpg',
		'Правительство ЯНАО': 'images/7shd.jpeg',
		'Памятник Поезду': 'images/9shd.jpg',
		'Обдорский острог': 'images/10shd.jpg',
		'Памятник северному оленю': 'images/12shd.jpg',
	}
	// Получаем элементы DOM...м
	let scheduleContainer = document.getElementById('schedule-container')
	let modal = document.getElementById('attraction-modal')
	let span = document.getElementsByClassName('close')[0]
	let searchInput = document.getElementById('search-attraction')
	let saveButton = document.getElementById('save-schedule')
	let deleteButton = document.getElementById('delete-schedule')
	// Обработчик события  реагирует на событие отправки формы - submit. Происходит бработка отправки формы расписания. Потом вызывает функцию для генерации расписания, скрывает форму и отображает кнопку сохранения расписания.
	document
		.getElementById('schedule-form')
		.addEventListener('submit', function (event) { //*TODO: по лабораторной работе. когда форма пытается отправить данные
			event.preventDefault() // предотвращение f5
			generateSchedule()
			this.style.display = 'none'
			saveButton.style.display = 'inline-block'
		})
	// Обработчик события нажатия на кнопку - Сохр расписание
	saveButton.addEventListener('click', function () {
		saveScheduleToLocalStorage() //*TODO: по лабораторной   
		deleteButton.style.display = 'inline-block' //+ кн del
	})
	// Обработчик события (нажатия на кнопку - Удалить расписание
	deleteButton.addEventListener('click', function () {
		localStorage.removeItem('scheduleData')
		scheduleContainer.innerHTML = ''
		this.style.display = 'none'
	})
	// Для генерации расписания
	function generateSchedule() {
		let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
		let scheduleHTML = '<table>'
		scheduleHTML +=
			'<tr><th>Время/День</th>' +
			days
				.map(function (day) {
					return '<th>' + day + '</th>'
				})
				.join('') +
			'</tr>'

		for (let hour = 0; hour < 24; hour++) {
			let hourFormatted = hour < 10 ? '0' + hour + ':00' : hour + ':00'
			scheduleHTML += '<tr><td>' + hourFormatted + '</td>'

			for (let i = 0; i < days.length; i++) {
				scheduleHTML +=
					'<td id="slot-' +
					hour +
					'-' +
					i +
					'" class="time-slot"></td>'
			}
			scheduleHTML += '</tr>'
		}

		scheduleHTML += '</table>'
		scheduleContainer.innerHTML = scheduleHTML
		addEventListenersToSlots() // Обработчик событий для временных ячеек
		loadScheduleFromLocalStorage() // загружаю данные которые были сохранены локално если они сущ.
	}
	// Для обавления обработчиков событий к слотам
	function addEventListenersToSlots() {
		let slots = document.getElementsByClassName('time-slot')
		/*В массив*/
		Array.from(slots).forEach(function (slot) {
			slot.addEventListener('click', function () {
				if (!slot.hasChildNodes()) {
					openAttractionSelector(slot.id)
				} /*Чтобы не было дабл клика проверка на хран*/
			})
		})
	}
	// Нужна для открытия мод окна выбора достопримечательности
	function openAttractionSelector(slotId) {
		currentSlot = slotId
		updateAttractionList(
			attractions,
			document.getElementById('attraction-list'),
			slotId
		)
		modal.style.display = 'block'
	}
	// Обновление списка достопримечательностей внутри самого мод окна
	function updateAttractionList(attractions, container, slotId) {
		container.innerHTML = ''
		for (let key in attractions) {
			let div = document.createElement('div')
			div.classList.add('attraction-item')
			div.innerHTML = `<img src="${attractions[key]}" alt="${key}"><span>${key}</span>`
			div.onclick = function () {
				addAttractionToSchedule(slotId, key)
			}
			container.appendChild(div)
		}
	}
	// Функция для добавления достопримечательности в расписание
	function addAttractionToSchedule(slotId, attraction) {
		let slot = document.getElementById(slotId)
		slot.innerHTML = `<input type="checkbox" id="check-${slotId}"><label for="check-${slotId}">${attraction}</label><span class="remove-attraction">×</span>`
		modal.style.display = 'none'

		document
			.getElementById(`check-${slotId}`)
			.addEventListener('change', function (event) {
				let label = event.target.nextElementSibling
				label.style.textDecoration = this.checked
					? 'line-through'
					: 'none'
			})

		slot.querySelector('.remove-attraction').addEventListener(
			'click',
			function () {
				slot.innerHTML = ''
			}
		)
	}
	// Сохранение расписания в лок хранилище
	function saveScheduleToLocalStorage() { // *TODO: по лабораторной
		let scheduleData = []
		document.querySelectorAll('.time-slot').forEach(slot => {
			let attraction = slot.querySelector('label')
				? slot.querySelector('label').textContent
				: ''
			let isChecked = slot.querySelector('input')
				? slot.querySelector('input').checked
				: false
			scheduleData.push({
				id: slot.id,
				attraction: attraction,
				isChecked: isChecked,
			})
		})
		localStorage.setItem('scheduleData', JSON.stringify(scheduleData))
		// Показать уведомление. 7 ЛАБОРАТОРНАЯ Toaster
		toastr.success('Расписание успешно сохранено!')
		// Показать уведомление об ошибке
		/*
        toastr.error('Произошла ошибка при добавлении события.');
        */
		// Конфигурация
		toastr.options = {
			positionClass: 'toast-top-right', // Позиция уведомления
			timeOut: '500', // Время отображения уведомления (в мс)
		}
	}
	// Для загрузки расписания из лок хранилища
	function loadScheduleFromLocalStorage() {
		let savedData = JSON.parse(localStorage.getItem('scheduleData'))
		if (savedData) {
			savedData.forEach(data => {
				let slot = document.getElementById(data.id)
				if (slot && data.attraction) {
					slot.innerHTML = `<input type="checkbox" id="check-${
						data.id
					}" ${data.isChecked ? 'checked' : ''}><label for="check-${
						data.id
					}">${
						data.attraction
					}</label><span class="remove-attraction">×</span>`
					addRemoveAttractionListener(slot)
				}
			})
		}
	}
	// Функция для добавления обработчика удаления дост из расписания КрЕстик
	function addRemoveAttractionListener(slot) {
		slot.querySelector('.remove-attraction').addEventListener(
			'click',
			function () {
				slot.innerHTML = ''
				saveScheduleToLocalStorage()
			}
		)

		let checkbox = slot.querySelector('input[type="checkbox"]')
		if (checkbox) {
			checkbox.addEventListener('change', function (event) {
				let label = event.target.nextElementSibling
				label.style.textDecoration = this.checked
					? 'line-through'
					: 'none'
				saveScheduleToLocalStorage()
			})
		}
	}
	// Обработчики событий для закрытия модального окна
	span.onclick = function () {
		modal.style.display = 'none'
	}

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = 'none'
		}
	}
	// Необходимо для обработки ввода в поле поиска достопримечательностей
	function handleSearchInput(slotId) {
		let searchTerm = searchInput.value.toLowerCase()
		let filteredAttractions = {}
		for (let key in attractions) {
			if (key.toLowerCase().includes(searchTerm)) {
				filteredAttractions[key] = attractions[key]
			}
		}
		updateAttractionList(
			filteredAttractions,
			document.getElementById('attraction-list'),
			slotId
		)
	}

	searchInput.addEventListener('input', function () {
		handleSearchInput(currentSlot)
	})

	searchInput.addEventListener('keypress', function (event) {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleSearchInput(currentSlot)
		}
	})
	// Инициализация начальной загрузки расписания из лок хранилища
	loadScheduleFromLocalStorage()
})
