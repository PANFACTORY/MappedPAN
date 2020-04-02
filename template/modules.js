function draggable(target) {
    target.onmousedown = function() {
        document.onmousemove = mouseMove;
    };
    document.onmouseup = function() {
        document.onmousemove = null;
    };
    function mouseMove(e) {
        var event = e ? e : window.event;
        target.style.top = event.clientY + 'px';
        target.style.left = event.clientX + 'px';
    }
}