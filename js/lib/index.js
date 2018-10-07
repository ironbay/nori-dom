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
var EVENTS;
(function (EVENTS) {
    EVENTS["nori-click"] = "click";
    EVENTS["nori-change"] = "change";
    EVENTS["nori-press"] = "keypress";
    EVENTS["nori-keyup"] = "keyup";
})(EVENTS || (EVENTS = {}));
var Nori = /** @class */ (function () {
    function Nori(root) {
        this.onevent = function (e) { };
        this._root = root;
    }
    Nori.prototype.patch = function (ops) {
        for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
            var op = ops_1[_i];
            var code = op[0], path = op[1], data = op[2];
            switch (code) {
                case OP_CODE.ELEMENT_DELETE:
                    target(this._root, path).remove();
                    break;
                case OP_CODE.ELEMENT_CREATE:
                    var div = document.createElement('div');
                    div.innerHTML = data;
                    path.splice(-1, 1);
                    {
                        var t = target(this._root, path);
                        t.appendChild(div.firstChild);
                        this.event_scan(t);
                    }
                    break;
                case OP_CODE.ATTRIBUTE_SET:
                    var key = data[0], value = data[1];
                    {
                        var t = target(this._root, path);
                        var event_1 = EVENTS[key];
                        if (event_1)
                            this.event_bind(t, event_1, value);
                        if (key === 'value') {
                            t.value = value;
                            return;
                        }
                        t.setAttribute(key, value);
                    }
                    break;
                case OP_CODE.ATTRIBUTE_DELETE:
                    target(this._root, path).removeAttribute(data);
                    break;
                case OP_CODE.TEXT_SET:
                    target(this._root, path).innerHTML = data;
                    break;
                case OP_CODE.TEXT_DELETE:
                    target(this._root, path).innerHTML = '';
                    break;
                default:
                    break;
            }
        }
    };
    Nori.prototype.event_scan = function (t, shallow) {
        if (shallow === void 0) { shallow = false; }
        for (var i = 0; i < t.attributes.length; i++) {
            var attr = t.attributes[i];
            var event_2 = EVENTS[attr.name];
            if (!event_2)
                continue;
            this.event_bind(t, event_2, attr.value);
        }
        if (shallow)
            return;
        for (var i = 0; i < t.children.length; i++) {
            this.event_scan(t.children[i]);
        }
    };
    Nori.prototype.event_bind = function (t, type, handler) {
        var _this = this;
        t.addEventListener(type, function (evt) {
            console.dir(evt);
            _this.onevent({
                handler: handler,
                data: evt,
            });
        }, false);
    };
    return Nori;
}());
exports.default = Nori;
function target(root, path) {
    if (path.length === 0)
        return root;
    var selector = path.map(function (item) { return "[nori=\"" + item + "\"]"; }).join(' > ');
    return root.querySelector(selector);
}
//# sourceMappingURL=index.js.map