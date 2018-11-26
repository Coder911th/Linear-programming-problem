import markup from './markup.pug';
import funcHTML from './func.pug';
import './style.scss';

const SCALE = 50;

export default class FunctionGraph {

    constructor(destination, x = 0, y = 0, nameX = 'x', nameY = 'y') {
        // Сохраняем имена осей
        this.nameX = nameX;
        this.nameY = nameY;

        // Вставляем граф в разметку
        destination.insertAdjacentHTML('beforeend', markup());
        this.context = destination.lastElementChild.firstElementChild
            .getContext('2d');

        if (!this.context) {
            return console.log('Не удалось получить контекст графика функций!');
        }

        /* Модернизируем стандарные методы рисования для отображения графиков */
        this.context.moveTo = function(x, y) {
            this.__proto__.moveTo.call(this, y, x);
        };

        this.context.lineTo = function(x, y) {
            this.__proto__.lineTo.call(this, y, x);
        };

        // Устанавливаем начальную позицию
        this.context.canvas.parentNode.style.top = `${y}px`;
        this.context.canvas.parentNode.style.left = `${x}px`;

        // Добавляем возможность изменения области видимости в графике
        let drag = false,
            dragStartX, dragStartY;

        this.offsetX = 0;
        this.offsetY = 0;

        this.context.canvas.onmousedown = e => {
            dragStartX = e.offsetX - this.offsetX;
            dragStartY = e.offsetY - this.offsetY;
            drag = true;
        };

        this.context.canvas.onmouseup = e => drag = false;

        let lastWidth = 0;
        this.context.canvas.onmousemove = e => {
            if (drag) {
                this.offsetX = e.offsetX - dragStartX;
                this.offsetY = e.offsetY - dragStartY;
                this.redraw();
            }

            let c = this.context,
                w = this.context.canvas.width,
                h = this.context.canvas.height;

            /* Вывод координат мыши */
            let s = `${(
                (e.offsetX - this.offsetX - w / 2) / this.scale / SCALE
            ).toFixed(3)}; ${(
                -(e.offsetY - this.offsetY  - h / 2) / this.scale / SCALE
            ).toFixed(3)}`;

            // Очищаем область для вывода новых координат мыши
            c.fillStyle = 'white';
            c.fillRect(w, h, -lastWidth, -12);
            lastWidth = c.measureText(s).width;

            // Выводим координаты мыши на холсте
            c.fillStyle = 'black';
            c.textAlign = 'right';
            c.textBaseline = 'bottom';
            c.fillText(s, w, h);
        };

        // Добавляем возможность масштабирования графика
        this.scale = 1;
        this.context.canvas.addEventListener('wheel', e => {
            e.preventDefault();

            if (e.deltaY > 0) {
                if (this.scale > 0.2) {
                    this.scale /= 1.2;
                }
            } else {
                if (this.scale < 5) {
                    this.scale *= 1.2;
                }
            }

            this.redraw();
            this.context.canvas.onmousemove(e);
        }, true);

        /* Устанавливаем параметры шрифта */
        this.context.font = '10pt Segoe UI';

        /* Хранилище отрисовываемых линий */
        this.storage = [];

        this.redraw();
    }

    // Добавление функции в гарфик
    add(func) {
        this.storage.push(func);
        if (func.y == 0 && func.k == 0) return;

        this.context.canvas.parentElement.querySelector('.functions')
            .insertAdjacentHTML('beforeend', funcHTML({
                y: func.y,
                k: func.k,
                b: func.b,
                color: func.color,
                nameX: this.nameX,
                nameY: this.nameY
            }));
    }

    // Сброс настроект графа
    reset() {
        this.storage = [];
        this.offsetX = this.offsetY = 0;
        this.scaleX = this.scaleY = 1;
        this.redraw();
        this.context.canvas.parentElement.querySelector('.functions').innerHTML = '';
    }

    // Показать график
    show() {
        this.context.canvas.parentElement.classList.remove('hidden');
    }

    // Скрыть график
    hide() {
        this.context.canvas.parentElement.classList.add('hidden');
    }

    // Перерисовка графика
    redraw() {
        let c = this.context,
            w = this.context.canvas.width,
            h = this.context.canvas.height,
            offsetX = this.offsetX,
            offsetY = this.offsetY,
            scale = this.scale,
            nameY = this.nameY,
            nameX = this.nameX,
            max = (Math.max(Math.abs(this.offsetX), Math.abs(this.offsetY)) +
                Math.max(w, h)) / scale;

        /* Функция очищающая график */
        function clear() {
            c.fillStyle = 'white';
            c.fillRect(-max, -max, 2 * max, 2 * max);
        }

        /* Функция рисующая оси координат */
        function drawAxes() {
            c.strokeStyle = 'black';
            c.lineWidth = 2;
            c.beginPath();

            // Рисуем вертикальную ось
            c.moveTo(0, -h / 2 - max);
            c.lineTo(0, h / 2 + max);

            // Рисуем горизонтальную ось
            c.moveTo(-w / 2 - max, 0);
            c.lineTo(w / 2 + max, 0);

            // Отрисовываем
            c.stroke();
            c.lineWidth = 1;
        }

        /* Функция рисующая пометки на осях координат */
        function drawScaleLabels() {
            c.strokeStyle = 'black';
            c.fillStyle = 'black';
            c.lineWidth = 2;
            c.beginPath();

            /* Подсчитываем количество пометок, которое необходимо отрисовать
               в каждую сторону относительно начала координат */
            let n = Math.floor(max / SCALE);

            // Рисуем пометки
            for (let i = -n; i <= n; i++) {
                if (i === 0) continue;

                // на вертикальной оси
                c.moveTo(-4, i * SCALE);
                c.lineTo(4, i * SCALE);

                // на горизонтальной оси
                c.moveTo(i * SCALE, -4);
                c.lineTo(i * SCALE, 4);
            }

            c.rotate(Math.PI / 2);
            // Подписываем пометки на вертикальной оси
            c.textAlign = 'left';
            c.textBaseline = 'middle';
            for (let i = -n; i <= n; i++) {
                if (i === 0) continue;

                c.fillText(-i, 10, i * SCALE, 40);
            }

            // Подписываем пометки на горизонтальной оси
            c.textAlign = 'center';
            c.textBaseline = 'top';
            for (let i = -n; i <= n; i++) {
                if (i === 0) continue;

                c.fillText(i, i * SCALE, 12, 40);
            }
            // Рисуем ноль в начале координат
            c.fillText('0', 12, 5);

            c.rotate(-Math.PI / 2);

            // Отрисовываем
            c.stroke();
            c.lineWidth = 1;
        }

        /* Функция рисующая сетку */
        function drawGrid() {
            c.strokeStyle = 'rgb(210, 210, 210)';
            c.beginPath();

            /* Подсчитываем количество линий, которые необходимо отрисовать
               в каждую сторону относительно начала координат */
            let n = Math.floor(max / SCALE);

            // Рисуем пометки
            for (let i = -n; i <= n; i++) {
                if (i === 0) continue;

                // на вертикальной оси
                c.moveTo(-max, i * SCALE);
                c.lineTo(max, i * SCALE);

                // на горизонтальной оси
                c.moveTo(i * SCALE, -max);
                c.lineTo(i * SCALE, max);
            }

            c.stroke();
        }

        /* Функция прямой y = kx+b */
        function lineFunction(line, x) {
            return ((line.k / line.y) * x + line.b / line.y) * SCALE;
        }

        /* Сохраняем текущее состояние системы координат */
        c.save();

        /* Переносим начало координат холста в начало виртуальных координат */
        c.translate(this.offsetX + w / 2, this.offsetY + h / 2);

        /* Поворачиваем систему координат
           на 90 градусов против часовой стрелки */
        c.rotate(-Math.PI / 2);

        /* Масштабируем систему координат */
        c.scale(scale, scale);

        /* Очищаем фон */
        clear();

        /* Рисуем сетку */
        drawGrid();

        /* Рисуем оси координат */
        drawAxes();

        /* Делаем пометки масштаба на осях координат */
        drawScaleLabels();

        /* Отрисовка линий и полуплоскостей */
        for (let line of this.storage) {
            /* Задаём цвет линии и полуплоскости */
            c.strokeStyle = `rgba(${line.color}, 1)`;
            c.fillStyle = `rgba(${line.color}, 0.1)`;

            c.beginPath();

            if (line.type == 'line') {
                c.lineWidth = 3;
                c.moveTo(line.k * SCALE, -line.y * SCALE);
                c.lineTo(0, 0);
            } else {
                c.lineWidth = 1;
            }

            if (line.y !== 0) {
                /* Рисуем прямую */
                let Fmin = lineFunction(line, -max),
                    Fmax = lineFunction(line, max);

                c.moveTo(-max * SCALE, Fmin);
                c.lineTo(max * SCALE, Fmax);

                if (line.type === 'half-plane') {
                    /* Рисуем полуплоскость */
                    if (line.y > 0) {
                        if (line.k > 0) {
                            c.lineTo(-max, max);
                        } else {
                            if (line.k == 0) {
                                c.lineTo(max, max);
                                c.lineTo(-max, max);
                            } else {
                                c.lineTo(max, max);
                            }
                        }
                    } else {
                        if (line.k > 0) {
                            c.lineTo(-max, -max);
                        } else {
                            if (line.k == 0) {
                                c.lineTo(max, -max);
                                c.lineTo(-max, -max);
                            } else {
                                c.lineTo(max, -max);
                            }
                        }
                    }
                }
            } else {
                /* Рисуем x = const */
                c.moveTo((-line.b / line.k) * SCALE, max);
                c.lineTo((-line.b / line.k) * SCALE, -max);

                if (line.type === 'half-plane') {
                    /* Рисуем полуплоскость */
                    if (line.k > 0) {
                        c.lineTo(-max, -max);
                        c.lineTo(-max, max);
                    } else {
                        if (line.k == 0) {
                            continue;
                        }
                        c.lineTo(max, -max);
                        c.lineTo(max, max);
                    }
                }
            }

            c.closePath();
            c.fill(); /* Заливаем полуплоскость */
            c.stroke(); /* Отрисовываем линию */
        }

        /* Восстанавливаем изначальное состояние системы координат */
        c.restore();

        /* Подписываем оси */
        c.beginPath();
        c.strokeStyle = 'black';
        c.__proto__.moveTo.call(c, 60, h - 10);
        c.__proto__.lineTo.call(c, 10, h - 10);
        c.__proto__.lineTo.call(c, 10, h - 60);
        c.textAlign = 'right';
        c.textBaseline = 'bottom';
        c.fillText(nameX, 60, h - 10); // Горизонтальная
        c.textAlign = 'left';
        c.fillText(nameY, 15, h - 50); // Вертикальная
        c.stroke();
    }
}

/* Добавляем обработку перетаскивания графиков функций */
let draggable = null,
    offsetX, offsetY;

document.addEventListener('mousedown', function(e) {
    let target = e.target;
    if (target instanceof HTMLDivElement === false) return;
    if (!target.classList.contains('function-graph-wrap')) return;

    let position = target.getBoundingClientRect();
    offsetX = e.pageX - position.left;
    offsetY = e.pageY - position.top;
    draggable = target;
    draggable.classList.add('grabbing');
}, false);

document.addEventListener('mousemove', function(e) {
    if (draggable) {
        draggable.style.left = `${e.pageX - offsetX}px`;
        draggable.style.top = `${e.pageY - offsetY}px`;
    }
});

document.addEventListener('mouseup', e => {
    if (draggable) {
        draggable.classList.remove('grabbing');
        draggable = null;
    }
}, false);

/* Кнопка закрытия графа */
document.addEventListener('click', e => {
    if (e.target.id === 'cancel-graph') {
        e.target.parentElement.classList.add('hidden');
    }
}, false);
