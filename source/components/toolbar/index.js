'use strict';

import './toolbar.scss';

// Подгружаем popup'ы
import Popups from '../Popups';

// Подгружаем представление с вводом задачи линейного программирования
import InputView from '../InputView';

// Подгружаем представление графика функций
import FunctionGraph from '../FunctionGraph';

let creeper = document.getElementById('creeper'),
    myBasisView = document.getElementById('my-basis'),
    dragStart = null,
    offset;

/*
*   Заставляем ползунок двигаться
*/
creeper.onmousedown = (event) => {
    offset = document.getElementById('rangebar').getBoundingClientRect().left;
    dragStart = event.pageX - creeper.getBoundingClientRect().left;
};

document.addEventListener('mousemove', event => {
    if (dragStart === null) {
        return;
    }

    let dif = event.pageX - offset - dragStart;

    if (dif >= 0 && dif <= 190) {
        creeper.style.left = `${dif}px`;
        window.views.forEach(view => {
            if (typeof view !== 'string') {
                view.resize(Math.floor(dif / 5 + 1));
            }
        });
    }
}, false);

document.addEventListener('mouseup', () => dragStart = null, false);

/*
*   Появление и исчезновение полей ввода собвственного базиса
*/
document.getElementById('personal-basis').onclick = () => myBasisView.classList.remove('hidden');

document.getElementById('artificial-base-method').onclick = () => myBasisView.classList.add('hidden');

// Получаем необходимые для взаимодействия элементы
let load = document.getElementById('load'),
    save = document.getElementById('save');

/* Кнопка "ЗАГРУЗИТЬ" */
load.onclick = () => {
    Popups.waiting();

    // Отправка запроса на сервер
    fetch('/files-list')
        .then(res => {
            if (res.status != 200) {
                throw res;
            }

            return res.json();
        })
        .then(json => {
            if (json.message) {
                // Вывод сообщения об ошибке на стороне сервера
                Popups.showMessage(json.message);
            } else {
                // Скрытие представления ожидания загрузки
                // отображение представления каталога
                // Показать каталог
                Popups.openFileLoadView(json.files);
            }
        })
        .catch(err => {
            if (err.status) {
                Popups.showMessage(`${err.status}: ${err.statusText}`);
            } else {
                Popups.showMessage(err.toString());
            }
        });
};

/* Кнопка "СОХРАНИТЬ" */
save.onclick = Popups.openFileSaveView;

/* Кнопка "ВЫЙТИ"*/
let solution = document.getElementById('solution-wrap');
document.getElementById('exit').onclick = e => {
    // Возвращаемся к начальному экрану с сохранением введенной матрицы
    let newInputView = new InputView(window.views[0]); // special for IE
    solution.innerHTML = '';
    window.views.replace(newInputView.into(solution));
    document.querySelector('.toolbar').classList.remove('hide');
    solution.classList.remove('solving');
    // Скрываем панельку с предложением выхода
    document.getElementById('final-pane').classList.add('hidden');
};

// Создаём представление графика функций
window.graphic = new FunctionGraph(document.body, 340, 100);

/* Кнопка "ПОКАЗАТЬ ГРАФИК" */
document.getElementById('show-graph').onclick = e => {
    window.graphic.show();
};
