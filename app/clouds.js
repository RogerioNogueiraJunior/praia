export function animateClouds() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        const randomHeight = Math.floor(Math.random() * (700 - 600 + 1)) + 100;
        box.style.transform = `translateY(${randomHeight}px)`;
    });
}