"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OP_CODE;
(function (OP_CODE) {
    OP_CODE[OP_CODE["ELEMENT_CREATE"] = 0] = "ELEMENT_CREATE";
    OP_CODE[OP_CODE["ELEMENT_DELETE"] = 1] = "ELEMENT_DELETE";
    OP_CODE[OP_CODE["ATTRIBUTE_SET"] = 2] = "ATTRIBUTE_SET";
    OP_CODE[OP_CODE["ATTRIBUTE_DELETE"] = 3] = "ATTRIBUTE_DELETE";
    OP_CODE[OP_CODE["TEXT_SET"] = 4] = "TEXT_SET";
    OP_CODE[OP_CODE["TEXT_DELETE"] = 5] = "TEXT_DELETE";
})(OP_CODE || (OP_CODE = {}));
function patch(root, ops) {
    for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
        var op = ops_1[_i];
        var code = op[0], path = op[1], data = op[2];
        switch (code) {
            case OP_CODE.ELEMENT_DELETE:
                target(root, path).remove();
                break;
            case OP_CODE.ELEMENT_CREATE:
                var div = document.createElement('div');
                div.innerHTML = data;
                path.splice(-1, 1);
                target(root, path).appendChild(div.firstChild);
                break;
            case OP_CODE.ATTRIBUTE_SET:
                var key = data[0], value = data[1];
                target(root, path).setAttribute(key, value);
                break;
            case OP_CODE.ATTRIBUTE_DELETE:
                target(root, path).removeAttribute(data);
            case OP_CODE.TEXT_SET:
                target(root, path).innerHTML = data;
            case OP_CODE.TEXT_DELETE:
                target(root, path).innerHTML = '';
        }
    }
}
exports.patch = patch;
function target(root, path) {
    var selector = path.map(function (item) { return "[nori=\"" + item + "\"]"; }).join(' > ');
    return root.querySelector(selector);
}
//# sourceMappingURL=index.js.map