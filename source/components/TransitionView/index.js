// Внутренние зависимости
import view from './TransitionView.pug';
import './TransitionView.scss';

// Внешние зависимости
import Fraction from '../../logic/fraction.js';

export default class TransitionView {

    constructor(data, top, left, linearForm) {

        // Сохраняем данные
        this.data = data;
        this.top = top;
        this.left = left;

        // Инициализируем нижнюю строку симплекс таблицы нулями
        let bottomRow = [];
        let topLen = top.length;
        for (let i = 0; i < topLen; i++) {
            bottomRow.push(linearForm[top[i] - 1]);
        }
        bottomRow.push(new Fraction(0, 1));

        for (let row = 0; row < left.length; row++) {
            for (let i = 0; i < topLen; i++) {
                bottomRow[i] = bottomRow[i]
                    .sub(
                        linearForm[left[row] - 1]
                            .mul(data[row][i])
                    );
            }

            bottomRow[topLen] = bottomRow[topLen]
                .add(
                    linearForm[left[row] - 1]
                        .mul(data[row][topLen])
                );
        }

        this.bottomRow = bottomRow;

        let wrap = document.createElement('div');
        wrap.innerHTML = view({
            data, top, left, linearForm, bottomRow
        });

        wrap.className = 'TransitionView';
        this.view = wrap;

        this.bottomRow[topLen] = this.bottomRow[topLen].mul(Fraction.minusOne);
    }

    into(destionation) {
        destionation.appendChild(this.view);
        return this;
    }

    resize() { return; }
}
