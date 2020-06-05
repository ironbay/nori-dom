var Nori = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    var OP_CODE;
    (function (OP_CODE) {
        OP_CODE[OP_CODE["ELEMENT_CREATE"] = 0] = "ELEMENT_CREATE";
        OP_CODE[OP_CODE["ELEMENT_DELETE"] = 1] = "ELEMENT_DELETE";
        OP_CODE[OP_CODE["PROP_CREATE"] = 3] = "PROP_CREATE";
        OP_CODE[OP_CODE["PROP_DELETE"] = 4] = "PROP_DELETE";
        OP_CODE[OP_CODE["PROP_CHANGE"] = 5] = "PROP_CHANGE";
        OP_CODE[OP_CODE["TEXT_CREATE"] = 6] = "TEXT_CREATE";
        OP_CODE[OP_CODE["TEXT_DELETE"] = 7] = "TEXT_DELETE";
        OP_CODE[OP_CODE["TEXT_CHANGE"] = 8] = "TEXT_CHANGE";
    })(OP_CODE || (OP_CODE = {}));
    function render(connection, element) {
        return __awaiter(this, void 0, void 0, function* () {
            connection.on_cast.add((msg) => {
                if (msg.action === "nori.patch")
                    patch(msg.body, element);
            });
            yield connection.call("nori.render", {});
        });
    }
    function patch(ops, element) {
        for (let op of ops) {
            const [code, path_raw, data] = op;
            const path = path_raw.split(".");
            switch (code) {
                case OP_CODE.ELEMENT_CREATE:
                    const div = document.createElement("div");
                    div.innerHTML = data;
                    path.shift();
                    console.log(path);
                    target(element, path).appendChild(div.firstChild);
                    break;
                case OP_CODE.ELEMENT_DELETE:
                    target(element, path).remove();
                    break;
                case OP_CODE.TEXT_CHANGE:
                case OP_CODE.TEXT_CREATE:
                    path.shift();
                    target(element, path).innerHTML = data;
                    break;
                case OP_CODE.PROP_CHANGE:
                case OP_CODE.PROP_CREATE:
                    const [key, value] = data;
                    target(element, path).setAttribute(key, value);
                    break;
                case OP_CODE.PROP_DELETE:
                    target(element, path).removeAttribute(data);
                    break;
            }
        }
    }
    function target(root, path) {
        if (path.length === 0)
            return root;
        return root.querySelector(`[nori="${path.join(".")}"]`);
    }

    exports.render = render;

    return exports;

}({}));
