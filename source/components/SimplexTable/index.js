// Внутренние зависимости
import './SimplexTable.scss';
import view from './SimplexTable.pug';

// Внешние зависимости
import {SimplexTable as DOMFor} from '../../logic/DOMFor.js';
import Fraction from '../../logic/fraction.js';

export default class SimplexTable {

    constructor(
        lookBasis,
        step,
        data,
        top,
        left,
        size,
        referenceElements,
        message
    ) {
        let wrap = document.createElement('div');
        wrap.innerHTML = view({
            step,
            data,
            top,
            left,
            size,
            referenceElements,
            message
        });

        this.lookBasis = lookBasis;
        this.step = step;
        this.n = top.length;
        this.data = data;
        this.top = top;
        this.left = left;
        this.size = size;
        this.view = wrap.firstElementChild;
    }

    into(destination) {
        destination.appendChild(this.view);
        return this;
    }

    // Изменение размеров ячеек
    resize(size) {
        // TODO: delete: DOMFor(this.view.firstElementChild, (elem) => elem.size = size);
        this.size = size;
    }

    // Поиск возможных опорных элементов
    static getReferenceElements(m, n, data, left, lookBasis, maxN) {
        let pCol = [],
            pRow = [],
            code = 0; // CODE: OK


        // Поиск столбцов с p[i] < 0, занесение индексов таких столбцов в pCol
        for (let i = 0; i < n - 1; i++) {
            if (data[m - 1][i].isNegative) {
                pCol.push(i);
            }
        }

        if (pCol.length === 0 ) {
            // В нижней строке не найдено отрицательных значений
            // (исключая самый последний столбец)
            if (data[m - 1][n - 1].isZero) {
                // CODE: Вычисления закончены. Элемент в правом нижнем углу
                // равен нулю
                code = 2;

                // Проверка необходимости выполнения холостого шага
                for (let i = 0; i < left.length; i++) {
                    if (lookBasis && left[i] > maxN) {
                        // Необходим холостой шаг в строке left[i]
                        pCol.push(left[i]);
                        pRow = [];

                        // Проверка возможности выполнения холостого шага
                        for (let j = 0; j < top.length; j++) {
                            if (!data[left[i]][j].isZero) {
                                // Необходимо выполнить холостой шаг для опорного элемента data[left[i]][j]
                                pRow.push(j);
                            }
                        }

                        if (pRow.length === 0) {
                            // Холостой шаг выполнить невозможно => Задача неразрешима
                            code = 4;
                        }
                    }
                }
            } else {
                // CODE: Вычисления закончены. Число в правом нижнем углу
                // не равно нулю
                code = 3;
            }
        } else {

            // pCol[i] - номер столбца, где внизу p < 0
            // pRow[i] - номер строки, в которой минимальное отношение в этом
            // столбце, или undefined, если оно в недопустимой строке
            for (let i = 0, iLen = pCol.length; i < iLen; i++) {
                let min = null,
                    positive = false;

                // Поиск минимума отношения bi/ai в столбце pCol[i]
                for (let j = 0; j < m - 1; j++) {
                    if (data[j][pCol[i]].isPositive) {
                        positive = true;

                        let ratio = data[j][n - 1].div(data[j][pCol[i]]);
                        if (!min) {
                            min = ratio;
                        } else {
                            if (ratio.compare(min) < 0) {
                                min = ratio;
                            }
                        }
                    }
                }

                if (!positive) {
                    // CODE: Найден столбец из отрицательных элементов
                    code = 1;
                }

                // Массив индексов строк, которые в данном столбце
                // могут быть опорными элементами
                pRow[i] = [];

                // Поиск всех минимумов в столбце
                for (let j = 0; j < m - 1; j++) {
                    if (lookBasis && left[j] < n) {
                        // Этот элемент уже перенесён из первой строки в первый
                        // столбик
                        continue;
                    }

                    if (data[j][pCol[i]].isPositive) {
                        let ratio = data[j][n - 1].div(data[j][pCol[i]]);
                        if (ratio.compare(min) == 0) {
                            pRow[i].push(j);
                        }
                    }
                }
            }
        }

        // data[pRow[i][k]][pCol[i]] - опорные элементы,
        // если !pRow[i].empty(),
        // i = (0, pCol.length - 1)
        return {
            code,
            rows: pRow,
            cols: pCol,
            length: pRow.length
        };
    }

    // Делаем шаг относительно представления view
    // с опорным элементом (row, col)
    static step(view, row, col) {
        // Работаем с новой конфигурацией представления
        let data = [],
            top = Array.from(view.top),
            left = Array.from(view.left);

        // Выполняем глубокое копирование data
        for (let row of view.data) {
            data.push(Array.from(row));
        }

        // Пересчитываем строку опорного элемента, кроме самого опороного
        for (let k = 0; k <= top.length; k++) {
            if (k != col) {
                data[row][k] = data[row][k].div(data[row][col]);
            }
        }

        for (let i = 0; i <= left.length; i++) {
            for (let j = 0; j <= top.length; j++) {
                if (j == col || i == row) {
                    // Если элемент в том же столбце или строке, что и опорный,
                    // то пока не его пересчитываем
                    continue;
                } else {
                    data[i][j] = data[i][j]
                        .sub(
                            data[i][col]
                                .mul(data[row][j])
                        );
                }
            }
        }

        // Меняем местами индексы иксов сверху и слева относительно
        // опорного элемента
        [top[col], left[row]] = [left[row], top[col]];

        if (view.lookBasis) {
            // Если метод искусственного базиса, то удаляем столбец col
            top.splice(col, 1);
            for (let row of data) {
                row.splice(col, 1);
            }
        } else {
            // Пересчитывам столбец col
            for (let k = 0; k <= left.length; k++) {
                if (k == row) {
                    // Пока не трогаем опорный элемент
                    continue;
                } else {
                    data[k][col] = data[k][col]
                        .div(
                            data[row][col]
                                .mul(Fraction.minusOne)
                        );
                }
            }

            // Пересчитываем опорных элемент
            data[row][col] = Fraction.one.div(data[row][col]);
        }

        return {data, top, left};
    }
}
