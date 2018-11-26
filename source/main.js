// Подключаем базовые стили страницы
import './index.scss';

// Блокируем выделение текста вне полей ввода
import './logic/preventSelecting.js';

// Подгружаем тулбар
import './components/toolbar';

// Погружаем генератор чекбоксов в тулбар
import BasisView from './components/BasisView';

// Подгружаем стек
import Stack from './logic/Stack.js';

// Подгружаем представление ввода данных
import InputView from './components/InputView';

let solution = document.getElementById('solution-wrap');

window.views = new Stack(
    new InputView(true, 3, 3, 2, null).into(solution)
);
new BasisView(window.views[0].n - 1);
