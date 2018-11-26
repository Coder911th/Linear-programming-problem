// Процедура рисования стрелки
function drawArrow(item) {
    item.beginPath();
    item.moveTo(0, 5);
    item.lineTo(30, 5);
    item.lineTo(30, 0);
    item.lineTo(50, 10);
    item.lineTo(30, 20);
    item.lineTo(30, 15);
    item.lineTo(0, 15);
    item.closePath();
    item.fill();
}

let arrows = [],  // 2D контексты холстов
    pressed = [], // Соотвествующие контекстам состояния нажатия кнопок
    pressedColor = '#AB3030',
    notPressedColor = '#753838';

document.addEventListener('mouseup', () => {
    pressed.forEach((item, index) => {
        if (!item) {
            return;
        }

        arrows[index].fillStyle = pressedColor;
        drawArrow(arrows[index]);
        pressed[index] = false;
    });
}, false);

// Зарегистрировать стрелку. Теперь она будет отрисовываться в canvas
export function addArrow(canvas) {
    let context = canvas.getContext('2d'),
        index = arrows.length;

    arrows.push(context);
    pressed.push(false);

    context.fillStyle = pressedColor;
    drawArrow(context);

    canvas.addEventListener('mousedown', () => {
        context.fillStyle = notPressedColor;
        drawArrow(context);
        pressed[index] = true;
    }, false);
}

// Удаление зарегистрированного обработчика стрелки по его canvas
export function removeArrow(canvas) {
    let context = canvas.getContext('2d');
    arrows.forEach((arrow, index) => {
        if (arrow === context) {
            arrows.splice(index, 1);
            pressed.splice(index, 1);
            canvas.parentElement.removeChild(canvas);
        }
    });
}
