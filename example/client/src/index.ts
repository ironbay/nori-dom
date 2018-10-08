import * as Riptide from '@ironbay/riptide'
import Nori from '../../../js/src/index'

const root = document.getElementById('root')
const nori = new Nori(root)

async function run() {
    const riptide = new Riptide.Client(Riptide.Transports.WS, Riptide.Formats.Json)
    riptide.transport.connect('ws://localhost:12000/socket')
    riptide.transport.on_status.add(async status => {
        if (status !== 'ready') return
        const patch = await riptide.call('nori.init', true) as any
        root.innerHTML = ''
        nori.patch(patch)
    })

    nori.onevent = async e => {
        const patch = await riptide.call('nori.event', e) as any
        nori.patch(patch)
    }
}

run()