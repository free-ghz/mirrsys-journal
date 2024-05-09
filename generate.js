import panel from './layout/panel.js'
import horizontal from './layout/horizontal.js'
import fs from 'fs'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .map(filename => fs.readFileSync('./input/' + filename, 'utf8'))
}

async function convert() {
    let files = await read()
    let h = horizontal.create({ border: true })
    files
        .map(file => panel.createText(file, { border: true }))
        .forEach(text => {
            h.addChild(text)
        })

    
    let rows = h.getHeight()
    for (let i = 0; i < rows; i++) {
        let row = h.getRow(i)
        console.log(row)
    }
}

convert()