// Внутренние зависимости
import './InputView.scss';
import view from './InputView.pug';
import add from './add.pug';
import lastCondition from './lastCondition.pug';

// Внешние зависимости
import {InputView as DOMFor} from '../../logic/DOMFor.js';
import {addArrow, removeArrow} from '../../logic/arrow.js';
import solve from '../../logic/solver.js';
import Fraction from '../../logic/fraction.js';
import BasisView from '../BasisView';

export default class InputView {
    constructor(configurable, m, n, size, data = null) {

        if (configurable instanceof InputView) {
            m = configurable.m;
            n = configurable.n;
            size = configurable.size,
            data = configurable.getData();
        }

        let temp = document.createElement('div');
        temp.innerHTML = view({
            object: 'table',
            configurable,
            m,
            n,
            data,
            size
        });

        this.configurable = configurable;
        this.size = size;
        this.m = m;
        this.n = n;
        this.view = temp.firstElementChild;

        if (configurable) {
            // Стрелки
            let arrowsBlock = this.view.lastElementChild.previousSibling;
            for (let canvas of arrowsBlock.children) {
                addArrow(canvas);
                switch (true) {
                    case canvas.classList.contains('left'):
                        canvas.onclick = () => {
                            if (this.n > 3) {
                                this.removeCol();
                                new BasisView(this.n - 1, this.m - 1);
                            }
                        };
                        break;
                    case canvas.classList.contains('right'):
                        canvas.onclick = () => {
                            if (this.n < 17) {
                                this.addCol();
                                new BasisView(this.n - 1, this.m - 1);
                            }
                        };
                        break;
                    case canvas.classList.contains('up'):
                        canvas.onclick = () => {
                            if (this.m > 3) {
                                this.removeRow();
                                new BasisView(this.n - 1, this.m - 1);
                            }
                        };
                        break;
                    case canvas.classList.contains('down'):
                        canvas.onclick = () => {
                            if (this.m < 17) {
                                this.addRow();
                                new BasisView(this.n - 1, this.m - 1);
                            }
                        };
                        break;
                }
            }

            // Снятие флага плохого ввода с поля при попытке что-то туда ввести
            this.view.addEventListener('input', event =>
                event.target.classList.remove('bad-input'), false);

            // Блокировка ввода пробелов
            this.view.addEventListener('keydown', event =>
                event.code === 'Space' ? event.preventDefault() : undefined);

            // Блокировка вставки пробелов из буфера обмена
            this.view.addEventListener('paste', event => {
                let text,
                    target = event.target;

                event.preventDefault();
                if (target instanceof HTMLInputElement === false) {
                    return;
                }

                text = event.clipboardData.getData('text').replace(/ /g, '');
                target.value = target.value.slice(0, target.selectionStart) +
                    text + target.value.slice(target.selectionEnd);
            });

            // Обработчик кнопки посчитать
            document.getElementById('count').onclick = () => {
                if (document.forms.settings.basis.value == 'СБП' && !BasisView.isValidForm(this.m - 1)) {
                    return;
                }

                let badInput = false;
                DOMFor(this.view.firstElementChild, (elem, i, j) => {
                    if (elem.value.length === 0 ||
                        i === 0 &&
                        j === this.n - 1
                    ) {
                        return;
                    }

                    if (!/(^(-)??\d+?([.,]\d+?)??$)|(^(-)??\d+?\/\d+?$)/.test(elem.value)) {
                        elem.classList.add('bad-input');
                        badInput = true;
                    }
                });

                if (!badInput) {
                    solve(this);
                }
            };

            // Обработчик кнопки сброс
            document.getElementById('reset').onclick = () => {
                DOMFor(document.getElementById('solution-wrap')
                    .firstElementChild.firstElementChild, (elem, i, j) => {
                    if (i == 0 && j == this.n - 1) {
                        elem.value = 'min';
                    } else {
                        elem.value = '';
                        elem.classList.remove('bad-input');
                    }
                });
            };
        }
    }

    // Помещает представление в конец destination
    into(destination) {
        destination.appendChild(this.view);
        return this;
    }

    // Изменить размер полей ввода представления на size
    resize(size) {
        DOMFor(this.view.firstElementChild, (elem, i, j) => {
            if (i !== 0 || j !== this.n - 1) {
                elem.size = size;
            }
        });
        this.size = size;
    }

    // Получить данные из представления в виде массива
    // Если dataToNextStep = true, то создаёт дроби (Fraction),
    // иначе возвращает строковые значения
    getData(dataToNextStep = false) {
        let data = [];
        let lastI = -1;
        DOMFor(this.view.firstElementChild, (elem, i, j) => {
            if (lastI < i) {
                data.push([]);
                lastI = i;
            }

            if (!dataToNextStep || i === 0 && j === this.n - 1) {
                return data[i].push(elem.value);
            }

            let inputValue = elem.value,
                index = inputValue.indexOf('/');

            if (index > -1) {
                // Обычная дробь
                data[i].push(new Fraction(+inputValue.slice(0, index),
                    +inputValue.slice(index + 1)));
            } else {
                index = inputValue.indexOf('.');
                if (index == -1) {
                    index = inputValue.indexOf(',');
                }

                if (index > -1) {
                    // Десятичная дробь
                    let before = +inputValue.slice(0, index),
                        after = +inputValue.slice(index + 1);

                    let denominator = Math.pow(10, after.toString().length);

                    if (before[0] === '-') {
                        data[i].push(new Fraction(-(-before * denominator + after),
                            denominator));
                    } else {
                        data[i].push(new Fraction(before * denominator + after,
                            denominator));
                    }
                } else {
                    // Целое число
                    data[i].push(new Fraction(+inputValue, 1));
                }
            }
        });

        return data;
    }

    addRow() {
        let row = document.createElement('div');
        row.innerHTML = add({
            object: 'row',
            n: this.n,
            size: this.size
        });
        this.m++;
        this.view.firstElementChild.appendChild(row);
    }

    removeRow() {
        this.view.firstElementChild.removeChild(
            this.view.firstElementChild.lastElementChild
        );
        this.m--;
    }

    addCol() {
        let data = this.getData();
        data.forEach(array => array.splice(this.n - 1, 0, ''));

        this.view.firstElementChild.innerHTML = add({
            object: 'table',
            configurable: this.configurable,
            n: ++this.n,
            m: this.m,
            size: this.size,
            data
        });

        this.view.lastElementChild.innerHTML = lastCondition({
            n: this.n
        });
    }

    removeCol() {
        let data = this.getData();
        data.forEach(array => array.splice(this.n - 2, 1));

        this.view.firstElementChild.innerHTML = add({
            object: 'table',
            configurable: this.configurable,
            n: --this.n,
            m: this.m,
            size: this.size,
            data
        });

        this.view.lastElementChild.innerHTML = lastCondition({
            n: this.n
        });
    }

    removeArrowsHandlers() {
        for (let arrow of Array.from(
            this.view.lastElementChild.previousSibling.children
        )) {
            removeArrow(arrow);
        }
    }
}
