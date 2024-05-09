import fs from 'fs'
import { parse } from './markupParser.js'
import { generateHtmlFromPanel } from './generate.js'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .filter(filename => fs.lstatSync('./input/' + filename).isDirectory())
        .filter(filename => fs.readdirSync('./input/' + filename + "/").includes("index.777"))
        .map(filename => { return {
            filename,
            index: fs.readFileSync('./input/' + filename + "/index.777", 'utf8')
        }})
}

async function main() {
    let files = await read()
    files.forEach(file => {
        let panels = parse(file.index)
        let html = generateHtmlFromPanel(panels)
        console.log(html)
    })

}

main()