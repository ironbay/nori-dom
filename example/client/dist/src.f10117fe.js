// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/@ironbay/riptide/lib/formats.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Json = /** @class */ (function () {
    function Json() {
    }
    Json.prototype.encode = function (input) {
        return JSON.stringify(input);
    };
    Json.prototype.decode = function (input) {
        return JSON.parse(input);
    };
    return Json;
}());
exports.Json = Json;

},{}],"node_modules/universal-websocket-client/browser.js":[function(require,module,exports) {
'use strict';

module.exports = WebSocket;

},{}],"node_modules/@ironbay/riptide/lib/sleep.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(time) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(time); }, time);
    });
}
exports.default = default_1;

},{}],"node_modules/@ironbay/riptide/lib/dispatcher.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
        this.callbacks = new Array();
        this.timeout = null;
    }
    Dispatcher.prototype.add = function (cb) {
        this.callbacks.push(cb);
    };
    Dispatcher.prototype.trigger = function (msg, delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        if (delay === 0) {
            this.callbacks.forEach(function (cb) { return cb(msg); });
            return;
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            _this.callbacks.forEach(function (cb) { return cb(msg); });
        }, delay);
    };
    return Dispatcher;
}());
exports.default = Dispatcher;

},{}],"node_modules/@ironbay/riptide/lib/transports.js":[function(require,module,exports) {
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("universal-websocket-client");
var sleep_1 = require("./sleep");
var dispatcher_1 = require("./dispatcher");
var TransportBase = /** @class */ (function () {
    function TransportBase() {
        this.on_data = new dispatcher_1.default();
    }
    TransportBase.prototype.subscribe = function (cb) {
        this.on_data.add(cb);
    };
    return TransportBase;
}());
exports.TransportBase = TransportBase;
var WS = /** @class */ (function (_super) {
    __extends(WS, _super);
    function WS() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.attempts = -1;
        _this.on_status = new dispatcher_1.default();
        return _this;
    }
    WS.prototype.write = function (data) {
        if (!this.socket || this.socket.readyState !== 1)
            throw 'Socket unready';
        this.socket.send(data);
    };
    WS.prototype.connect = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.attempts++;
                        return [4 /*yield*/, sleep_1.default(Math.min(this.attempts * 1000, 5 * 1000))];
                    case 1:
                        _a.sent();
                        this.socket = new WebSocket(url);
                        this.socket.onopen = function () {
                            _this.attempts = 0;
                            _this.on_status.trigger('ready');
                        };
                        this.socket.onclose = function () {
                            _this.cleanup();
                            _this.connect(url);
                        };
                        this.socket.onerror = function (err) {
                            // this._cleanup()
                            // this._connect()
                        };
                        this.socket.onmessage = function (event) {
                            _this.on_data.trigger(event.data);
                        };
                        return [2 /*return*/];
                }
            });
        });
    };
    WS.prototype.disconnect = function () {
        if (!this.socket)
            return;
        this.socket.onclose = function () { };
        this.socket.close();
        this.cleanup();
    };
    WS.prototype.cleanup = function () {
        this.on_status.trigger('disconnected');
        this.socket = undefined;
    };
    return WS;
}(TransportBase));
exports.WS = WS;

},{"universal-websocket-client":"node_modules/universal-websocket-client/browser.js","./sleep":"node_modules/@ironbay/riptide/lib/sleep.js","./dispatcher":"node_modules/@ironbay/riptide/lib/dispatcher.js"}],"node_modules/@ironbay/riptide/lib/client.js":[function(require,module,exports) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sleep_1 = require("./sleep");
var dispatcher_1 = require("./dispatcher");
var Client = /** @class */ (function () {
    function Client(transport, format) {
        if (transport === void 0) { transport = null; }
        if (format === void 0) { format = null; }
        var _this = this;
        this.counter = 0;
        this.on_cast = new dispatcher_1.default();
        this.private = new Map();
        this.transport = new transport();
        this.transport.subscribe(function (data) { return _this.handle_data(data); });
        this.format = new format();
    }
    Client.prototype.call = function (action, body) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.counter++;
                        promise = new Promise(function (resolve, reject) {
                            _this.private.set(_this.counter, { resolve: resolve, reject: reject });
                        });
                        return [4 /*yield*/, this.write({
                                key: this.counter,
                                action: action,
                                body: body,
                                type: 'call'
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, promise];
                }
            });
        });
    };
    Client.prototype.cast = function (action, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.write({
                            action: action,
                            body: body,
                            type: 'cast'
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.write = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var encoded, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msg.version = 1;
                        encoded = this.format.encode(msg);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 2, , 5]);
                        this.transport.write(encoded);
                        return [3 /*break*/, 5];
                    case 2:
                        ex_1 = _a.sent();
                        return [4 /*yield*/, sleep_1.default(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.write(msg)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.handle_data = function (data) {
        var msg = this.format.decode(data);
        var match = this.private.get(msg.key);
        switch (msg.action) {
            case 'reply':
                match.resolve(msg.body);
                this.private.delete(msg.key);
            case 'error':
                match.reject(msg.body);
                this.private.delete(msg.key);
            default:
                this.on_cast.trigger(msg);
        }
    };
    return Client;
}());
exports.default = Client;

},{"./sleep":"node_modules/@ironbay/riptide/lib/sleep.js","./dispatcher":"node_modules/@ironbay/riptide/lib/dispatcher.js"}],"node_modules/@ironbay/riptide/lib/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Formats = require("./formats");
exports.Formats = Formats;
var Transports = require("./transports");
exports.Transports = Transports;
var client_1 = require("./client");
exports.Client = client_1.default;

},{"./formats":"node_modules/@ironbay/riptide/lib/formats.js","./transports":"node_modules/@ironbay/riptide/lib/transports.js","./client":"node_modules/@ironbay/riptide/lib/client.js"}],"../../js/src/events.ts":[function(require,module,exports) {

"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

function define(name, transform) {
  return {
    name: name,
    transform: transform
  };
}

function mouse_event(e) {
  return __assign({}, base_event(e), {
    altKey: e.altKey,
    button: e.button,
    buttons: e.buttons,
    clientX: e.clientX,
    clientY: e.clientY,
    ctrlKey: e.ctrlKey,
    layerX: e.layerX,
    layerY: e.layerY,
    metaKey: e.metaKey,
    movementX: e.movementX,
    movementY: e.movementY,
    offsetX: e.offsetX,
    offsetY: e.offsetY,
    pageX: e.pageX,
    pageY: e.pageY,
    screenX: e.screenX,
    screenY: e.screenY,
    shiftKey: e.shiftKey,
    x: e.x,
    y: e.y
  });
}

function keyboard_event(e) {
  return __assign({}, base_event(e), {
    altKey: e.altKey,
    code: e.code,
    ctrlKey: e.ctrlKey,
    key: e.key,
    location: e.location,
    metaKey: e.metaKey,
    repeat: e.repeat,
    shiftKey: e.shiftKey,
    which: e.which
  });
}

function base_event(e) {
  return {
    value: e.target.value
  };
}

exports.default = {
  'on_click': define('click', mouse_event),
  "on_abort": define('abort', base_event),
  "on_afterprint": define('afterprint', base_event),
  "on_beforeprint": define('beforeprint', base_event),
  "on_beforeunload": define('beforeunload', base_event),
  "on_blur": define('blur', base_event),
  "on_canplay": define("canplay", base_event),
  "on_canplaythrough": define("canplaythrough", base_event),
  "on_change": define("change", base_event),
  "on_compassneedscalibration": define("compassneedscalibration", base_event),
  "on_contextmenu": define("contextmenu", base_event),
  "on_dblclick": define("dblclick", base_event),
  "on_devicelight": define("devicelight", base_event),
  "on_devicemotion": define("devicemotion", base_event),
  "on_deviceorientation": define("deviceorientation", base_event),
  "on_drag": define("drag", base_event),
  "on_dragend": define("dragend", base_event),
  "on_dragenter": define("dragenter", base_event),
  "on_dragleave": define("dragleave", base_event),
  "on_dragover": define("dragover", base_event),
  "on_dragstart": define("dragstart", base_event),
  "on_drop": define("drop", base_event),
  "on_durationchange": define("durationchange", base_event),
  "on_emptied": define("emptied", base_event),
  "on_ended": define("ended", base_event),
  "on_error": define("error", base_event),
  "on_focus": define("focus", base_event),
  "on_hashchange": define("hashchange", base_event),
  "on_input": define("input", base_event),
  "on_invalid": define("invalid", base_event),
  "on_keydown": define("keydown", keyboard_event),
  "on_keypress": define("keypress", keyboard_event),
  "on_keyup": define("keyup", keyboard_event),
  "on_load": define("load", base_event),
  "on_loadeddata": define("loadeddata", base_event),
  "on_loadedmetadata": define("loadedmetadata", base_event),
  "on_loadstart": define("loadstart", base_event),
  "on_message": define("message", base_event),
  "on_mousedown": define("mousedown", mouse_event),
  "on_mouseenter": define("mouseenter", mouse_event),
  "on_mouseleave": define("mouseleave", mouse_event),
  "on_mousemove": define("mousemove", mouse_event),
  "on_mouseout": define("mouseout", mouse_event),
  "on_mouseover": define("mouseover", mouse_event),
  "on_mouseup": define("mouseup", mouse_event),
  "on_mousewheel": define("mousewheel", mouse_event),
  "on_MSGestureChange": define("MSGestureChange", base_event),
  "on_MSGestureDoubleTap": define("MSGestureDoubleTap", base_event),
  "on_MSGestureEnd": define("MSGestureEnd", base_event),
  "on_MSGestureHold": define("MSGestureHold", base_event),
  "on_MSGestureStart": define("MSGestureStart", base_event),
  "on_MSGestureTap": define("MSGestureTap", base_event),
  "on_MSInertiaStart": define("MSInertiaStart", base_event),
  "on_MSPointerCancel": define("MSPointerCancel", base_event),
  "on_MSPointerDown": define("MSPointerDown", base_event),
  "on_MSPointerEnter": define("MSPointerEnter", base_event),
  "on_MSPointerLeave": define("MSPointerLeave", base_event),
  "on_MSPointerMove": define("MSPointerMove", base_event),
  "on_MSPointerOut": define("MSPointerOut", base_event),
  "on_MSPointerOver": define("MSPointerOver", base_event),
  "on_MSPointerUp": define("MSPointerUp", base_event),
  "on_offline": define("offline", base_event),
  "on_online": define("online", base_event),
  "on_orientationchange": define("orientationchange", base_event),
  "on_pagehide": define("pagehide", base_event),
  "on_pageshow": define("pageshow", base_event),
  "on_pause": define("pause", base_event),
  "on_play": define("play", base_event),
  "on_playing": define("playing", base_event),
  "on_popstate": define("popstate", base_event),
  "on_progress": define("progress", base_event),
  "on_ratechange": define("ratechange", base_event),
  "on_readystatechange": define("readystatechange", base_event),
  "on_reset": define("reset", base_event),
  "on_resize": define("resize", base_event),
  "on_scroll": define("scroll", base_event),
  "on_seeked": define("seeked", base_event),
  "on_seeking": define("seeking", base_event),
  "on_select": define("select", base_event),
  "on_stalled": define("stalled", base_event),
  "on_storage": define("storage", base_event),
  "on_submit": define("submit", base_event),
  "on_suspend": define("suspend", base_event),
  "on_timeupdate": define("timeupdate", base_event),
  "on_unload": define("unload", base_event),
  "on_volumechange": define("volumechange", base_event),
  "on_vrdisplayactivate": define("vrdisplayactivate", base_event),
  "on_vrdisplayblur": define("vrdisplayblur", base_event),
  "on_vrdisplayconnect": define("vrdisplayconnect", base_event),
  "on_vrdisplaydeactivate": define("vrdisplaydeactivate", base_event),
  "on_vrdisplaydisconnect": define("vrdisplaydisconnect", base_event),
  "on_vrdisplayfocus": define("vrdisplayfocus", base_event),
  "on_vrdisplaypointerrestricted": define("vrdisplaypointerrestricted", base_event),
  "on_vrdisplaypointerunrestricted": define("vrdisplaypointerunrestricted", base_event),
  "on_vrdisplaypresentchange": define("vrdisplaypresentchange", base_event),
  "on_waiting": define("waiting", base_event)
};
},{}],"../../js/src/index.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var events_1 = __importDefault(require("./events"));

var OP_CODE;

(function (OP_CODE) {
  OP_CODE[OP_CODE["ELEMENT_CREATE"] = 0] = "ELEMENT_CREATE";
  OP_CODE[OP_CODE["ELEMENT_DELETE"] = 1] = "ELEMENT_DELETE";
  OP_CODE[OP_CODE["ATTRIBUTE_SET"] = 2] = "ATTRIBUTE_SET";
  OP_CODE[OP_CODE["ATTRIBUTE_DELETE"] = 3] = "ATTRIBUTE_DELETE";
  OP_CODE[OP_CODE["TEXT_SET"] = 4] = "TEXT_SET";
  OP_CODE[OP_CODE["TEXT_DELETE"] = 5] = "TEXT_DELETE";
})(OP_CODE || (OP_CODE = {}));

var Nori =
/** @class */
function () {
  function Nori(root) {
    this.onevent = function (e) {};

    this._root = root;
  }

  Nori.prototype.patch = function (ops) {
    for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
      var op = ops_1[_i];
      var code = op[0],
          path = op[1],
          data = op[2];

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
          var key = data[0],
              value = data[1];
          {
            var t = target(this._root, path);
            var event = Event[key];
            if (event) this.event_bind(t, event, value);

            if (key === 'value') {
              t.value = value;
              break;
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
    if (shallow === void 0) {
      shallow = false;
    }

    for (var i = 0; i < t.attributes.length; i++) {
      var attr = t.attributes[i];
      var event = events_1.default[attr.name];
      if (!event) continue;
      this.event_bind(t, event, attr.value);
    }

    if (shallow) return;

    for (var i = 0; i < t.children.length; i++) {
      this.event_scan(t.children[i]);
    }
  };

  Nori.prototype.event_bind = function (t, type, handler) {
    var _this = this;

    t.addEventListener(type.name, function (evt) {
      _this.onevent({
        handler: handler,
        event: type.transform(evt)
      });
    }, false);
  };

  return Nori;
}();

exports.default = Nori;

function target(root, path) {
  if (path.length === 0) return root;
  var selector = path.map(function (item) {
    return "[nori=\"" + item + "\"]";
  }).join(' > ');
  return root.querySelector(selector);
}
},{"./events":"../../js/src/events.ts"}],"src/index.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Riptide = __importStar(require("@ironbay/riptide"));

var index_1 = __importDefault(require("../../../js/src/index"));

var root = document.getElementById('root');
var nori = new index_1.default(root);

function run() {
  return __awaiter(this, void 0, void 0, function () {
    var riptide;

    var _this = this;

    return __generator(this, function (_a) {
      riptide = new Riptide.Client(Riptide.Transports.WS, Riptide.Formats.Json);
      riptide.transport.connect('ws://localhost:12000/socket');
      riptide.transport.on_status.add(function (status) {
        return __awaiter(_this, void 0, void 0, function () {
          var patch;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (status !== 'ready') return [2
                /*return*/
                ];
                return [4
                /*yield*/
                , riptide.call('nori.init', true)];

              case 1:
                patch = _a.sent();
                root.innerHTML = '';
                nori.patch(patch);
                return [2
                /*return*/
                ];
            }
          });
        });
      });

      nori.onevent = function (e) {
        return __awaiter(_this, void 0, void 0, function () {
          var patch;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4
                /*yield*/
                , riptide.call('nori.event', e)];

              case 1:
                patch = _a.sent();
                nori.patch(patch);
                return [2
                /*return*/
                ];
            }
          });
        });
      };

      return [2
      /*return*/
      ];
    });
  });
}

run();
},{"@ironbay/riptide":"node_modules/@ironbay/riptide/lib/index.js","../../../js/src/index":"../../js/src/index.ts"}]},{},["src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.map