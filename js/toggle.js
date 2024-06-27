function toggleList(id) {
    var list = document.getElementById(id);
    if (list.classList.contains('hidden')) {
        list.classList.remove('hidden');
        list.style.maxHeight = list.scrollHeight + "px";
    } else {
        list.classList.add('hidden');
        list.style.maxHeight = 0;
    }
}
