// Внутренние зависимости
import view from './BasisView.pug';
import './BasisView.scss';

// Внешние зависимости
import Popups from '../Popups';

export default class BasisView {

    constructor(n) {
        this.n = n;
        document.getElementById('my-basis').innerHTML = view({ n });
    }

    static isValidForm(m) {
        let checkBoxes = document.forms.settings,
            amountChecked = 0,
            n = window.views[0].n - 1;

        for (let i = 0; i < n; i++) {
            if (checkBoxes[`b${i + 1}`].checked) {
                amountChecked++;
            }
        }

        if (amountChecked !== m) {
            Popups.showMessage(`Базис должен содержать ровно ${m} переменныe(ых), а вы выбрали ${amountChecked}!`);
            return false;
        }

        return true;
    }
}
