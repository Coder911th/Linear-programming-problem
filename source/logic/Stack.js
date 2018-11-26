export default class Stack extends Array {

    constructor(...args) {
        super();
        let array = Array.from(args);
        array.__proto__ = Stack.prototype;
        
        return array;
    }

    // Возвращает вершину стека
    get top() {
        return this[this.length - 1];
    }

    // Очищает стек
    clear() {
        while (this.pop());
    }

    // Очищает стек и заменяет его содежимое на args
    replace(...args) {
        this.clear();
        for (let item of args) {
            this.push(item);
        }
    }

}
