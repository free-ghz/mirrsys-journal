import panel from './layout/panel.js'
import fs from 'fs'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .map(filename => fs.readFileSync('./input/' + filename, 'utf8'))
}

async function convert() {
    let files = await read()
    files
        .map(file => panel.createText(file, { border: true }))
        .forEach(text => {
            console.log("\n\n* text:")
            let rows = text.getHeight()
            for (let i = 0; i < rows; i++) {
                let row = text.getRow(i)
                console.log(row)
            }
        })
}

convert()