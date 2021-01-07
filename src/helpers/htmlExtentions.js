const lineHeight = 17;

export function lastRow(elem) {
    return getSelectionHeight(elem) === elem.offsetHeight;
}

export function firstRow(elem) {
    return getSelectionHeight(elem) === lineHeight;
}

function getSelectionHeight(textarea) {
    var new_node = document.createElement("div");
    textarea.parentNode.insertBefore(new_node, textarea.nextSibling);
    new_node.style = `opacity:0;position:fixed;top:0;right;width:${textarea.offsetWidth}px;min-height:${lineHeight}px;`;
    new_node.innerHTML = String(textarea.value.substring(0, textarea.selectionStart));
    const offsetHeight = new_node.offsetHeight;
    new_node.remove();
    return offsetHeight;
}
