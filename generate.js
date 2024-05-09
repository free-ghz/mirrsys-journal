import panel from './layout/panel.js'
import horizontal from './layout/horizontal.js'
import vertical from './layout/vertical.js'
import fs from 'fs'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .map(filename => fs.readFileSync('./input/' + filename, 'utf8'))
}

async function main() {
    let files = await read()
    let main = vertical.create({ border: false })

    let dashboard = horizontal.create({ border: false })
    
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
    dashboard.addChild(stats)

    let catsay = horizontal.create({ border:true })
    catsay.addChild(
        panel.createText(files[1])
    )
    catsay.addChild(
        panel.createText("Moew moew")
    )
    dashboard.addChild(catsay)

    let pattern = panel.createText(files[3], { decoration: true })
    main.addChild(pattern)
    main.addChild(dashboard)

    let html = generateHtmlFromPanel(main)
    console.log(html)
}

function generateHtmlFromPanel(panel) {
    let rows = panel.getHeight()
    let outputRows = [];
    for (let i = 0; i < rows; i++) {
        let output = ""
        let row = panel.getRow(i)
        let events = convertToEvents(row.formatting)
        let head = 0
        events.forEach((event, index) => {
            if (event.index != head) {
                output += row.text.substring(head, event.index)
            }
            if (event.event == "start") {
                if (event.type == "decoration") {
                    output += "<span class=\"decoration\" aria-hidden=\"true\">"
                } else {
                    console.log("Unknown event type", event.type)
                }
            }
            if (event.event == "end") {
                if (event.type == "decoration") {
                    output += "</span>"
                } else {
                    console.log("Unknown event type", event.type)
                }
            }
            head = event.index
        })
        outputRows.push(output)
    }
    return outputRows.join("\n")
}

function convertToEvents(formatting) {
    let events = []
    formatting.forEach(format => {
        let start = {
            event: "start",
            index: format.start,
            type: format.type
        }
        let end = {
            event: "end",
            index: format.end,
            type: format.type
        }
        events.push(start, end)
    })

    events.sort((a, b) => {
        if (a.index == b.index) {
            if (a.type == b.type) {
                return 0
            }
            if (a.type == "start") return 1;
            return -1
        } else {
            return a.index - b.index
        }
    })

    return events
}

main()