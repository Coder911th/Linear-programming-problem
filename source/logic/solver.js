import InputView from '../components/InputView';
import SimplexTable from '../components/SimplexTable';
import TransitionView from '../components/TransitionView';
import MatrixView from '../components/MatrixView';
import Fraction from './fraction.js';
import {SimplexTable as DOMFor} from './DOMFor';
import Stack from './Stack.js';
import Popups from '../components/Popups';

let colors = [
    '167, 525, 0', // Весенний бутон
    '255, 36, 0', // Алый
    '165, 38, 10', // Бисмарк-фуриозо
    '75, 0, 130', // Индиго
    '153, 102, 204', // Аметистовый
    '127, 255, 212', // Аквамариновый
    '250, 231, 181', // Бананомания
    '237, 60, 202', // Амарантовый маджента
    '255, 220, 51', // Блестящий зеленовато-желтый
    '181, 121, 0', // Глубокий желтый
    '66, 170, 255', // Голубой
    '0, 0, 0', // Черный
    '0, 255, 0', // Зеленый
    '33, 66, 30', // Миртовый
    '252, 15, 192', // Ярко-розовый
    '245, 64, 33' // Транспортный оранжевый
];

let views, // Актуальные представления
    graphic, // График функций
    linearForm, // Линейная форма
    maxTask = false, // Задача на максимум?
    solution = document.getElementById('solution-wrap'),
    toolbar = document.querySelector('.toolbar'),
    prev = document.getElementById('prev'),
    auto = document.getElementById('auto'),
    finalPane = document.getElementById('final-pane'),
    showGraph = document.getElementById('show-graph'),
    exit = document.getElementById('exit');

// Генерация сообщения с ответом на задачу
function getLastMessage(data, left, top) {
    let n = top.length,
        m = left.length,
        x = [];

    for (let i = 1; i <= n + m; i++) {
        let rowIndex = left.indexOf(i);
        if (rowIndex > -1) {
            x.push(data[rowIndex][n]);
        } else {
            x.push(0);
        }
    }

    return `Задача решена! f(${x.join(', ')}) = ${maxTask ? data[m][n] : data[m][n].reflect}`;
}

// Добавление нового представления симплекс-таблицы к решению
function addNewSimplexTableView(view, step, lookBasis) {
    // Поиск возможных опорных элементов в новой таблице
    let referenceElements = SimplexTable.getReferenceElements(
        view.left.length + 1,
        view.top.length + 1,
        view.data,
        view.left,
        lookBasis,
        views[0].n - 1
    );

    let message = null,
        refElems = referenceElements;
    switch (referenceElements.code) {
        case 1:
            if (maxTask) {
                message = 'Линейная форма неограничена сверху!';
            } else {
                message = 'Линейная форма неограничена снизу!';
            }
            refElems = null;
            break;
        case 2:
            if (!lookBasis) {
                message = getLastMessage(view.data, view.left, view.top);
            }
            break;
        case 3:
            if (lookBasis) {
                message = 'Система несовместна!';
                refElems = null;
            } else {
                message = getLastMessage(view.data, view.left, view.top);
            }
            break;
        case 4:
            if (lookBasis) {
                message = 'Задача неразрешима! Нет возможности выполнить холостой шаг.';
                refElems = null;
            }
            break;
    }

    // Создаём новое представление симплекс-таблицы
    views.push(
        new SimplexTable(
            lookBasis,
            step,
            view.data,
            view.top,
            view.left,
            views[0].size,
            refElems,
            message
        ).into(solution)
    );

    if (message) {
        // Показываем панельку с предложением выйти
        finalPane.classList.remove('hidden');
        auto.disabled = true;

        if (!lookBasis && views[0].n - views[0].m <= 2) {
            /* Решение задачи подошло к концу и мы можем вывести график */

            /* Очищаем график */
            graphic.reset();
            /* Добавляем функции в график */
            let tv = null;
            // Ищем в решении TransitionView
            for (let v of views) {
                if (v instanceof TransitionView) {
                    tv = v;
                    break;
                }
            }

            let data = tv.data,
                top = tv.top,
                left = tv.left,
                lf = tv.bottomRow;

            /*  Решаем двумерную графическую задачу линейного программирования
                для данных, записанных в TransitionView */
            for (let i = 0; i < data.length; i++) {
                graphic.add({
                    type: 'half-plane',
                    y: -data[i][0].toInt(),
                    k: data[i][1].toInt(),
                    b: -data[i][2].toInt(),
                    color: colors[i]
                });
            }

            graphic.add({
                type: 'line',
                y: lf[0].toInt(),
                k: -lf[1].toInt(),
                b: 0,
                color: '0, 0, 255'
            });

            graphic.nameY = `x${top[0]}`;
            graphic.nameX = `x${top[1]}`;

            /* Перерисовываем график */
            graphic.redraw();

            /* Активируем отображение график */
            showGraph.disabled = false;
        }
    }

    // Если нашли базис
    if (referenceElements.code == 2 && lookBasis) {
        let data = view.data.slice(0, view.data.length - 1);

        views.push(new TransitionView(
            data, view.top, view.left, linearForm
        ).into(solution));


        // Создаём симплекс таблицу для рассчётов
        addNewSimplexTableView({
            data: data.concat([views.top.bottomRow]),
            left: view.left,
            top: view.top
        }, 0, false);
    }
}

// Обработчик кнопки "Назад/Выйти"
prev.onclick = () => {
    // Скрываем график функций
    graphic.hide();

    if (views.length === 3 || views.length > 3 &&
        views[views.length - 3] instanceof MatrixView
    ) {
        // Нажимаем на кнопку выйти
        exit.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    } else {
        // Делаем шаг назад
        solution.removeChild(views.pop().view);
        let top = views.top;

        if (top instanceof TransitionView) {
            solution.removeChild(views.pop().view);
            solution.removeChild(views.pop().view);
            top = views.top;
        }

        if (!finalPane.classList.contains('hidden')) {
            finalPane.classList.add('hidden');
            showGraph.disabled = true;
            auto.disabled = false;
        }

        solution.removeChild(views.pop().view);
        addNewSimplexTableView(top, top.step, top.lookBasis);

        // Прокручиваем к последнему представлению страницы
        views.top.view.scrollIntoView(false);
    }
};

// Автовыбор опорного элемента
auto.onclick = function() {
    let variants = document.querySelectorAll('.reference-element');
    variants[Math.floor(variants.length * Math.random())].dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );
};

// Обработчик ручного выбора опорного элемента
solution.onclick = event => {
    if (!event.target.classList.contains('reference-element')) {
        return;
    }

    let target = event.target;
    let [row, col] = target.dataset.indexes.split(',');

    // Удаляем возможность выбора опорого элемента,
    // выделяем выбранный опорный элемент, его строку и столбец особым цветом
    DOMFor(views.top.view.firstElementChild, (elem, i, j) => {
        elem.classList.remove('reference-element');
        if (i == row) {
            elem.classList.add('selected-element');
        } else if (j == col) {
            elem.classList.add('selected-element');
        }
    });

    // Выделяем выбранный элемент
    target.classList.add('selected-element');

    let top = views.top;
    let nextTableData = SimplexTable.step(top, +row, +col);

    addNewSimplexTableView(nextTableData, top.step + 1, top.lookBasis);

    // Прокручиваем к последнему представлению страницы
    views.top.view.scrollIntoView(false);
};

export default function solve(input) {
    // Получаем актуальные представления
    views = window.views;

    // Получаем представление графика функций
    graphic = window.graphic;

    // Отключаем конфигурирование представления ввода данных
    input.view.disabled = true;
    // Удаляем обработчики со стрелок
    input.removeArrowsHandlers();

    // Изменяем тулбар
    toolbar.classList.add('hide');
    solution.classList.add('solving');
    auto.disabled = false;
    showGraph.disabled = true;

    // Получаем выходные данные и делаем их первичную обработку
    let data = input.getData(true),
        m = input.m,
        n = input.n;

    // Если задача на максимум, сводим её к задаче на минимум
    let taskTypeIndex = data[0].length - 1;
    if (data[0][taskTypeIndex] === 'max') {
        maxTask = true;
        for (let i = 0; i < data[0].length - 1; i++) {
            data[0][i] = data[0][i].mul(Fraction.minusOne);
        }

        data[0][taskTypeIndex] = data[0][taskTypeIndex] = 'min';
    } else {
        maxTask = false;
    }

    /* Делаем так, чтобы в столбце свободных членов находились
       неотрицательные значения */
    for (let i = 0; i < m; i++) {
        if (data[i][n - 1] < 0) {
            for (let j = 0; j < n; j++) {
                data[i][j] = data[i][j].mul(Fraction.minusOne);
            }
        }
    }

    /* Выводим откоректированное входное представление
       Все дроби упрощены, в столбце свободных членов неотрицательные
       значения */
    views.push(new InputView(false, m, n, input.size, data)
        .into(solution));

    /*  Удаляем из data линейную форму и сохраняем её в linearForm
        до окончания вычислений в симплекс-таблице */
    linearForm = data.splice(0, 1)[0];


    // Special for Microsoft (IE, Edge) (Как бы не переназывали IE, в душе он всегда IE)
    let basisSettings;
    if (document.forms.settings.basis[0].checked) {
        basisSettings = document.forms.settings.basis[0].value;
    } else {
        basisSettings = document.forms.settings.basis[1].value;
    }


    if (basisSettings === 'МИБ') {
        // Метод искусственного базиса
        let top = [],
            left = [],
            p = [];

        // Записываем в массив top индексы x, находящиеся сверху таблицы
        for (let i = 1; i < n; i++) {
            top.push(i);
        }

        // Записываем в массив left индексы x, находящиеся в левом столбце таблицы
        for (let i = n; i < n + m - 1; i++) {
            left.push(i);
        }



        // Подсчитываем нижнюю строку p как суммы соответствующих столбцов
        // умноженных на минус единицу
        for (let i = 0; i < n; i++) {
            let sum = Fraction.zero;
            for (let j = 0; j < m - 1; j++) {
                sum = sum.add(data[j][i]);
            }
            p.push(sum.mul(Fraction.minusOne));
        }

        data.push(p);

        // Создаём первичное представление симплекс-таблицы
        addNewSimplexTableView({
            data, left, top
        }, 0, true);
    } else {
        // Свои базисные переменные

        // Первичное отображение матрицы
        views.push(new MatrixView(data).into(solution));

        let left = [], // Базисные переменные
            top = [], // Небазисные переменные
            temp = [], /*  Временное хранилище для переменных, которые не
                           могут быть базисными */
            checkBoxes = document.forms.settings;

        // Распределяем переменные на базисные и нет
        for (let i = 0; i < n - 1; i++) {
            if (checkBoxes[`b${i + 1}`].checked) {
                left.push(i + 1);
            } else {
                top.push(i + 1);
            }
        }

        /*  В left указаны индексы иксов (от единицы),
            которые выбраны базисными
            В top аналогично для небазисных */

        let matrix = [], // Матрица
            /*  Коэффициент для зануления элемента в столбце или
                получение единицы при делении строки */
            coefficient,
            currentRow = 0,
            // Кол-во строк в матрице
            rows = data.length,
            // Кол-во столбцов в матрице с учётом столбца свободных членов
            cols = data[0].length,
            k, i, j;

        // Глубокое копирование матрицы data
        for (let row of data) {
            matrix.push(Array.from(row));
        }

        /*  Пройдёмся по всем столбцам, соответствующим базисным переменным
            из left */
        for (i = 0; i < left.length; i++) {

            // Индекс текущего столбца с базисной переменной
            let colIndex = left[i] - 1;

            /*  Поиск ненулевого элемента в i-м стобце ниже
                и в самой currentRow строке */
            for (k = currentRow; k < rows; k++) {
                if (!matrix[k][colIndex].isZero) {
                    break;
                }
            }

            /*  Если в данном базисном столбце остались только нули ниже и
                в строке currentRow, то left[i] - не может быть базисной переменной, поэтому ищем в top другой базиную переменную
                переменную */
            if (k === rows) {
                if (top.length == 0) {
                    // TODO: Если не осталось небазисных переменных на замену
                    Popups.showMessage('Система линейно зависима! Пожалуйста, введите линейно независимую систему!');
                    prev.value = 'ВЫЙТИ';
                    auto.disabled = true;
                    return;
                }

                /*  Перемещаем текущую базисную переменную во временный массив
                    небазисных переменных и сразу же вставляем в массив
                    базсных переменных произвольную небазисную.
                    С этой вставленной переменной начинаем следующую итерацию */
                temp.push(...left.splice(i, 1, top.shift()));
                i--;
                continue;
            }
            /*  Меняем строки местами так, чтобы в currentRow текущего
                столбцам был не ноль. В k-ой строке не ноль. */
            [matrix[currentRow], matrix[k]] = [matrix[k], matrix[currentRow]];

            /*  Поделим всю строку currentRow
                на элемент [currentRow][colIndex],
                чтобы получить единицу в этом элементе */
            coefficient = matrix[currentRow][colIndex];
            for (k = 0; k < cols; k++) {
                matrix[currentRow][k] = matrix[currentRow][k].div(coefficient);
            }

            /*  Зануляем все ячейки, находящиеся ниже или выше,
                чем matrix[currentRow][colIndex] */

            // Для всех строчек данного столбца colIndex
            for (k = 0; k < rows; k++) {
                if (k === currentRow) {
                    /*  Кроме строки currentRow,
                        в которой должна находиться единица */
                    continue;
                }

                // Вычисляем коэффициент для k-ой строки
                coefficient = matrix[k][colIndex];

                // Элементов k-ой строки
                for (j = 0; j < cols; j++) {
                    matrix[k][j] = matrix[k][j]
                        .sub(
                            coefficient.mul(
                                matrix[currentRow][j]
                            )
                        );
                }
            }

            // С текущей строчкой разобрались, переходим к следующей
            currentRow++;

            // Отображаем промежуточные результаты
            views.push(new MatrixView(matrix).into(solution));
        }

        // С методом Гаусса закончили
        top = top.concat(temp);

        // Формируем data для отправки в TansitionView
        data = [];
        for (let i = 0; i < left.length; i++) {
            // Формируем строки таблицы
            let row = [];
            for (let j = 0; j < top.length; j++) {
                // Формируем ячейки
                row.push(matrix[i][top[j] - 1]);
            }
            // Добавляем свободный член строки
            row.push(matrix[i][cols - 1]);

            data.push(row);
        }

        views.push(new TransitionView(
            data, top, left, linearForm
        ).into(solution));


        // Создаём симплекс таблицу для рассчётов
        addNewSimplexTableView({
            data: data.concat([views.top.bottomRow]),
            left: left,
            top: top
        }, 0, false);

        views.top.view.scrollIntoView(false);
    }

    // Если авторешение
    if (!document.forms.settings.step_to_step.checked) {
        let elem = document.querySelector('.reference-element'),
            click = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });

        while (elem) {
            elem.dispatchEvent(click);
            elem = document.querySelector('.reference-element');
        }
    }
}
