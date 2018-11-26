import view from './MatrixView.pug';
import './MatrixView.scss';

export default class MatrixView {

    constructor(matrix, isFirst = false) {
        let wrap = document.createElement('div');
        wrap.innerHTML = view({
            matrix, isFirst
        });
        this.view = wrap.firstElementChild;
    }

    resize() { return; }

    into(destination) {
        destination.appendChild(this.view);
        return this;
    }
}
