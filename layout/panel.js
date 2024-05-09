import { copyWithOffset } from '../formatting.js'

function create() {
    let panel = {
        border: false,
        getHeight: () => 0,
        getWidth: () => 0,
        getRow: () => "",
        decoration: false,
        borderStuff: {
            getTop: (length, title) => {
                if (!!title && title !== true) {
                    let text = "┌┤" + title + "├" + "─".repeat(length - title.length - 2)  + "┐"
                    let formatting = [
                        { start: 0, end: 2, type: "decoration" },
                        { start: 2 + title.length, end: text.length, type: "decoration" },
                    ]
                    return { text, formatting }
                } else {
                    let text = "┌" + "─".repeat(length) + "┐"
                    return {
                        text,
                        formatting: [{ start: 0, end: text.length, type: "decoration" }]
                    }
                }
            },
            getBottom: (length) => {
                let text = "└" + "─".repeat(length) + "┘"
                return {
                    text,
                    formatting: [{ start: 0, end: text.length, type: "decoration" }]
                }
            },
            addBorder: (row) => {
                let newText = "│" + row.text + "│"
                let newFormatting = copyWithOffset(row.formatting, 1)
                newFormatting.push(
                    { start: 0, end: 1, type: "decoration" }
                )
                newFormatting.push(
                    { start: newText.length-1, end: newText.length, type: "decoration" }
                )
                return { text: newText, formatting: newFormatting }
            }
        }
    }
    return panel
}

function createText(text, options) {
    let panel = create()
    panel = {...panel, ...options}

    let rows = text.split("\n")
    let longestTextRow = 0
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].length > longestTextRow) {
            longestTextRow = rows[i].length
        }
    }
    let getWidth = () => {
        let textWidth = longestTextRow;
        let borderWidth = !!panel.border ? 2 : 0
        return textWidth + borderWidth;
    }
    let getHeight = () => {
        let textHeight = rows.length;
        let borderHeight = !!panel.border ? 2 : 0
        return textHeight + borderHeight;
    }
    let getRow = (i) => {
        let index = i
        if (!!panel.border) {
            if (i == 0) {
                return panel.borderStuff.getTop(longestTextRow, panel.border)
            } else if (i == getHeight() - 1) {
                return panel.borderStuff.getBottom(longestTextRow)
            } else {
                index = i-1
            }
        }
        let text = rows[index]
        let lengthDifference = longestTextRow - text.length
        let paddedText = text + " ".repeat(lengthDifference)

        text = {
            text: paddedText,
            formatting: []
        }
        if (panel.decoration) {
            text.formatting.push({
                start: 0, end: paddedText.length, type: "decoration"
            })
        }
        if (!!panel.border) {
            text = panel.borderStuff.addBorder(text)
        }
        return text
    }

    return { ...panel, getRow, getHeight, getWidth }
}

export default { createText, create }