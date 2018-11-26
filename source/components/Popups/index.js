import filesList from './files-list.pug';
import BasisView from '../BasisView';
import Stack from '../../logic/Stack.js';
import InputView from '../InputView';

let filesPopup = document.getElementById('files-popup'),
    filesPopupWrap = filesPopup.querySelector('.list'),
    popupWrap = document.getElementById('popup-wrap'),
    waitingPopup = document.getElementById('waiting-popup'),
    waitingPopupMessage = waitingPopup.querySelector('.message'),
    waitingPopupCancel = waitingPopup.querySelector('.cancel'),
    fileSavePopup = document.getElementById('file-save'),
    fileSavePopupSend = document.getElementById('send'),
    fileSaveName = document.getElementById('save-name'),
    bgBlock = document.getElementById('background-block'),
    solution = document.getElementById('solution-wrap');

// Установка обработчиков закрытия popup'ов
popupWrap.onclick = function(event) {
    if (!event.target.classList.contains('cancel')) {
        return;
    }

    bgBlock.classList.add('hidden');
    filesPopup.classList.add('hidden');
    waitingPopup.classList.add('hidden');
    waitingPopupCancel.classList.add('hidden');
    fileSavePopup.classList.add('hidden');
};

/* Загрузка файла из списка */
filesPopupWrap.onclick = function(event) {
    let target = event.target;
    if (!target.classList.contains('file')) {
        return;
    }

    filesPopup.classList.add('hidden'); // Скрываем список файлов
    Popups.waiting(); // Показываем окно ожидания

    fetch(`/files/${target.textContent}`)
        .then(res => {
            if (res.status != 200) {
                throw res;
            }

            return res.json();
        })
        .then(json => {

            let m = json.length,
                n = json[0].length;

            if (n < 3 || n > 17 || m < 3 || m > 17) {
                throw new Error();
            }

            solution.innerHTML = '';
            window.views = new Stack(
                new InputView(true, m, n, 2, json).into(solution)
            );
            new BasisView(n - 1);

            Popups.showMessage('Данные успешно загружены!');
        })
        .catch(err => {
            console.dir(err); // Подробное описание ошибки
            if (err.status) {
                Popups.showMessage(`${err.status}: ${err.statusText}`);
            } else {
                Popups.showMessage('Загружаемый файл имеет неправильный формат!');
            }
        });
};

/* Кнопка "Сохранить" */
fileSavePopupSend.onclick = function() {
    let name = fileSaveName.value.trim();

    // Скрываем окно сохранения
    fileSavePopup.classList.add('hidden');
    // Показываем окно ожидания
    Popups.waiting();

    if (name === '') {
        Popups.showMessage('Введено пустое имя файла!');
        return;
    }

    fetch('/save', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            name,
            file: window.views[0].getData()
        })
    })
        .then(res => {
            if (res.status == 200) {
                Popups.showMessage('Файл успешно сохранён!');
            } else {
                Popups.showMessage('Не удалось сохранить файл!');
            }
        })
        .catch(err => {
            Popups.showMessage(err.toString());
        });
};

export default class Popups {

    static waiting() {
        // Отображение представления ожидания загрузки
        bgBlock.classList.remove('hidden');
        waitingPopupMessage.textContent = 'Ожидание ответа от сервера...';
        waitingPopupCancel.classList.add('hidden');
        waitingPopup.classList.remove('hidden');
    }

    // Вывести сообщение с возможностью закрытия popup
    static showMessage(msg) {
        bgBlock.classList.remove('hidden');
        waitingPopup.classList.remove('hidden');

        waitingPopupMessage.textContent = msg;
        waitingPopupCancel.classList.remove('hidden');
    }

    static openFileLoadView(files) {
        // Скрытие представления ожидания загрузки
        waitingPopup.classList.add('hidden');
        // отображение представления каталога
        filesPopup.classList.remove('hidden');
        // Показать каталог
        filesPopupWrap.innerHTML = filesList({ files });
    }

    static openFileSaveView() {
        bgBlock.classList.remove('hidden');
        fileSavePopup.classList.remove('hidden');
    }
}
