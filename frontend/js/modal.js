function openModal(content) {
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}
