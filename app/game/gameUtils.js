export function createUserBox(userId, nome, pos) {
    if (document.getElementById(userId)) return;
    const box = document.createElement('div');
    box.classList.add('person');
    box.id = userId;
    box.textContent = nome || userId;
    document.getElementById('objects').appendChild(box);
}