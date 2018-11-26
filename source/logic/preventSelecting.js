// Блокировка выделения текста вне полей ввода
document.addEventListener('mousedown', function(event) {
    var target = event.target;
    if (target instanceof HTMLInputElement === false &&
        target instanceof HTMLSelectElement === false) {
        event.preventDefault();
    }
}, false);
