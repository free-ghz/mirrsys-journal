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
                } else if (event.type == "image") {
                    output += "<a class=\"image\" href=\"" + event.original.imageTarget + "\">"
                } else {
                    console.log("Unknown event type", event.type)
                }
            }
            if (event.event == "end") {
                if (event.type == "decoration") {
                    output += "</span>"
                } else if (event.type == "link") {
                    output += "</a>"
                } else if (event.type == "image") {
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

const masterTemplate = fs.readFileSync("./theme/template.html").toString()
const outputRoot = "./output"
function placeInFile(html, page) {
    let title = page.meta.title || "untitled"
    let template = masterTemplate.replace("(title)", title)
    template = template.replace("(here)", html)

    let wallpaperUrl = "../wallpaper.jpg"
    if (page.meta.wallpaper) {
        wallpaperUrl = page.meta.wallpaper
    }
    template = template.replace("(wallpaper)", wallpaperUrl)
    
    let outputFolder = outputRoot + "/" + page.folder
    prepareFolder(outputFolder)

    page.otherFiles.forEach(otherFile => {
        let from = "./input/" + page.folder + "/" + otherFile
        let to = outputFolder + "/" + otherFile
        fs.copyFile(from, to)
        console.log("- copied", otherFile)
    })
    fs.writeFileSync(outputFolder + "/index.html", template)
    console.log("- wrote", outputFolder + "/index.html")
}

function prepareFolder(outputFolder) {
    if (!fs.existsSync(outputRoot)) {
        fs.mkdirSync(outputRoot)
    }
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder)
    }
}

function generateIndex(indexHtml) {
    // first create a bogus "page"
    let page = {
        meta: {
            title: "blog....",
            wallpaper: "wallpaper.jpg" // same folder! default is up one
        },
        otherFiles: [],
        folder: "." // sketchyyyy lol
    }
    fs.copyFile("./theme/wallpaper.jpg", outputRoot + "/wallpaper.jpg")
    placeInFile(indexHtml, page)
}

export { generateHtmlFromPanel, placeInFile, generateIndex }