'use strict';

// Note: Опущены проверки наличия аргументов и соответствия их типов
export default class Fraction {

    constructor(numerator, denominator) {
        if (denominator === 0) {
            let error = new Error('Знаменатель дроби не может быть равен нулю!');
            window.alert(error.message);
            throw error;
        }

        if (denominator < 0) {
            denominator *= -1;
            numerator *= -1;
        }

        this.numerator = numerator;
        this.denominator = denominator;
    }

    // Упростить дробь
    simplify() {
        let a = Math.abs(this.numerator),
            b = this.denominator;

        if (a === 0) {
            return this;
        }

        while (b !== 0) {
            [a, b] = [b, a % b];
        }

        this.numerator /= a;
        this.denominator /= a;
        return this;
    }

    // Сложение дробей
    add(term) {
        return new Fraction(this.numerator * term.denominator + this.denominator
            * term.numerator, this.denominator * term.denominator).simplify();
    }

    // Вычитание дробей
    sub(term) {
        return new Fraction(this.numerator * term.denominator - this.denominator
            * term.numerator, this.denominator * term.denominator).simplify();
    }

    // Перемножение дробей
    mul(term) {
        return new Fraction(this.numerator * term.numerator,
            this.denominator * term.denominator).simplify();
    }

    // Деление дробей
    div(term) {
        return new Fraction(this.numerator * term.denominator,
            this.denominator * term.numerator).simplify();
    }

    /* Сравнение дробей
    *   this > term, ret > 0
    *   this = term, ret = 0
    *   this < term, ret < 0
    */
    compare(term) {
        return this.sub(term).numerator;
    }

    toJSON() {
        return this.toString();
    }

    // Получение ответа в виде строки
    toString() {
        this.simplify();
        return this.denominator === 1 ||
            this.numerator === 0 ?
            this.numerator :
            this.numerator + '/' + this.denominator;
    }

    // Получение обычного числа
    toInt() {
        return +this.numerator / +this.denominator;
    }

    // Проверка равенства дроби нулю
    get isZero() {
        return this.numerator === 0;
    }

    // Положительна ли дробь?
    get isPositive() {
        return this.numerator > 0;
    }

    // Отрицательная дробь?
    get isNegative() {
        return this.numerator < 0;
    }

    // Возвращает модуль дроби
    get abs() {
        return this.isNegative ? this.mul(Fraction.minusOne) : this;
    }

    // Равна ли дробь единице?
    get isOne() {
        return this.abs.compare(Fraction.one) === 0;
    }

    // Возвращает дробь умноженную на минус единицу
    get reflect() {
        return this.mul(minusOne);
    }

    // Возвращает ноль (дробью)
    static get zero() {
        return zero;
    }

    // Возвращает единицу (дробью)
    static get one() {
        return one;
    }

    // Возвращает минус единицу (дробью)
    static get minusOne() {
        return minusOne;
    }
}

let zero = new Fraction(0, 1),
    one = new Fraction(1, 1),
    minusOne = new Fraction(-1, 1);
