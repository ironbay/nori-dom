enum OP_CODE {
    ELEMENT_CREATE = 0,
    ELEMENT_DELETE = 1,
    ATTRIBUTE_SET = 2,
    ATTRIBUTE_DELETE = 3,
    TEXT_SET = 4,
    TEXT_DELETE = 5,
}

type Operation = [OP_CODE, string[], any]

export function patch(root: HTMLElement, ops: Operation[]) {
    for (let op of ops) {
        const [code, path, data] = op
        switch (code) {
            case OP_CODE.ELEMENT_DELETE:
                target(root, path).remove()
                break

            case OP_CODE.ELEMENT_CREATE:
                const div = document.createElement('div')
                div.innerHTML = data
                path.splice(-1, 1)
                target(root, path).appendChild(div.firstChild)
                break

            case OP_CODE.ATTRIBUTE_SET:
                const [key, value] = data
                target(root, path).setAttribute(key, value)
                break

            case OP_CODE.ATTRIBUTE_DELETE:
                target(root, path).removeAttribute(data)

            case OP_CODE.TEXT_SET:
                target(root, path).innerHTML = data

            case OP_CODE.TEXT_DELETE:
                target(root, path).innerHTML = ''
        }
    }
}

function target(root: HTMLElement, path: string[]) {
    const selector = path.map(item => `[nori="${item}"]`).join(' > ')
    return root.querySelector(selector)
}