import fs from 'fs'

function generateHtmlFromPanel(panel) {
    let rows = panel.getHeight()
    let outputRows = [];
    for (let i = 0; i < rows; i++) {
        let output = ""
        let row = panel.getRow(i)
        let events = convertToEvents(row.formatting)
        // not the best way but eh.
        events.push({
            event: "terminator",
            type: "terminator",
            index: row.length
        })
        let head = 0
        events.forEach((event, index) => {
            if (event.index != head) {
                output += row.text.substring(head, event.index)
            }
            if (event.event == "start") {
                if (event.type == "decoration") {
                    output += "<span class=\"decoration\" aria-hidden=\"true\">"
                } else if (event.type == "link") {
                    output += "<a href=\"" + event.original.linkTarget + "\">"
                } else {
                    console.log("Unknown event type", event.type)
                }
            }
            if (event.event == "end") {
                if (event.type == "decoration") {
                    output += "</span>"
                } else if (event.type == "link") {
                    output += "</a>"
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
            type: format.type,
            original: format
        }
        let end = {
            event: "end",
            index: format.end,
            type: format.type,
            original: format
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

function placeInFile(html, title) {
    let template = fs.readFileSync("./theme/template.html").toString()
    template = template.replace("(title)", title)
    template = template.replace("(here)", html)
    if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output")
    }
    fs.writeFileSync("./output/index.html", template)
}

export { generateHtmlFromPanel, placeInFile }