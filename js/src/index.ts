import Events from './events'
enum OP_CODE {
    ELEMENT_CREATE = 0,
    ELEMENT_DELETE = 1,
    ATTRIBUTE_SET = 2,
    ATTRIBUTE_DELETE = 3,
    TEXT_SET = 4,
    TEXT_DELETE = 5,
}

type Operation = [OP_CODE, string[], any]

export default class Nori {
    private _root: HTMLElement
    public onevent = (e: NoriEvent) => { }
    constructor(root: HTMLElement) {
        this._root = root
    }

    patch(ops: Operation[]) {
        for (let op of ops) {
            const [code, path, data] = op
            switch (code) {
                case OP_CODE.ELEMENT_DELETE:
                    target(this._root, path).remove()
                    break

                case OP_CODE.ELEMENT_CREATE:
                    const div = document.createElement('div')
                    div.innerHTML = data
                    path.splice(-1, 1)
                    {
                        const t = target(this._root, path)
                        t.appendChild(div.firstChild)
                        this.event_scan(t)
                    }
                    break

                case OP_CODE.ATTRIBUTE_SET:
                    const [key, value] = data
                    {
                        const t = target(this._root, path)
                        const event = Event[key]
                        if (event) this.event_bind(t, event, value)
                        if (key === 'value') {
                            (t as HTMLInputElement).value = value
                            break
                        }
                        t.setAttribute(key, value)
                    }
                    break

                case OP_CODE.ATTRIBUTE_DELETE:
                    target(this._root, path).removeAttribute(data)
                    break

                case OP_CODE.TEXT_SET:
                    target(this._root, path).innerHTML = data
                    break

                case OP_CODE.TEXT_DELETE:
                    target(this._root, path).innerHTML = ''
                    break

                default:
                    break
            }
        }
    }

    event_scan(t: Element, shallow = false) {
        for (let i = 0; i < t.attributes.length; i++) {
            const attr = t.attributes[i]
            const event = Events[attr.name]
            if (!event) continue
            this.event_bind(t, event, attr.value)
        }
        if (shallow) return
        for (let i = 0; i < t.children.length; i++) {
            this.event_scan(t.children[i])
        }
    }

    event_bind(
        t: Element,
        type: {
            name: string,
            transform: (e: Event) => any
        },
        handler: string
    ) {
        t.addEventListener(type.name, (evt) => {
            this.onevent({
                handler,
                event: type.transform(evt)
            })
        }, false)
    }
}

interface NoriEvent {
    handler: string
    event: any
}



function target(root: HTMLElement, path: string[]) {
    if (path.length === 0)
        return root
    const selector = path.map(item => `[nori="${item}"]`).join(' > ')
    return root.querySelector(selector)
}