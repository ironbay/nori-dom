import { Connection } from "@ironbay/riptide";

enum OP_CODE {
  ELEMENT_CREATE = 0,
  ELEMENT_DELETE = 1,
  PROP_CREATE = 3,
  PROP_DELETE = 4,
  PROP_CHANGE = 5,
  TEXT_CREATE = 6,
  TEXT_DELETE = 7,
  TEXT_CHANGE = 8,
}

type Operation = [OP_CODE, string, any];

export async function render<T, F>(
  connection: Connection.Client<T, F>,
  element: Element
) {
  connection.on_cast.add((msg) => {
    if (msg.action === "nori.patch") patch(msg.body, element);
  });
  await connection.call("nori.render", {});
}

function patch(ops: Operation[], element: Element) {
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

function target(root: Element, path: string[]) {
  if (path.length === 0) return root;
  return root.querySelector(`[nori="${path.join(".")}"]`);
}
