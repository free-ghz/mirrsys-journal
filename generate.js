import panel from './layout/panel.js'
import horizontal from './layout/horizontal.js'
import vertical from './layout/vertical.js'
import fs from 'fs'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .map(filename => fs.readFileSync('./input/' + filename, 'utf8'))
}

async function convert() {
    let files = await read()
    let main = horizontal.create({ border: false })
    
    let stats = vertical.create({ border: "Vertical being" })
    stats.addChild(
        panel.createText("Schmmm∞!")
    )
    stats.addChild(
        panel.createText("Panel: another")
    )
    stats.addChild(
        panel.createText("Panel: a third")
    )
    stats.addChild(
        panel.createText("Panel: weeyyyy four")
    )
    main.addChild(stats)

    let catsay = horizontal.create({ border:true })
    catsay.addChild(
        panel.createText(files[1])
    )
    catsay.addChild(
        panel.createText("Moew moew")
    )
    main.addChild(catsay)
    

    
    let rows = main.getHeight()
    for (let i = 0; i < rows; i++) {
        let row = main.getRow(i)
        console.log(row)
    }
}

convert()