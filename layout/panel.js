function create() {
    let panel = {
        border: false,
        getHeight: () => 0,
        getWidth: () => 0,
        getRow: () => "",
        borderStuff: {
            getTop: (length) => {
                return "┌" + "─".repeat(length) + "┐"
            },
            getBottom: (length) => {
                return "└" + "─".repeat(length) + "┘"
            },
            addBorder: (text) => {
                return "│" + text + "│"
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
                return panel.borderStuff.getTop(longestTextRow)
            } else if (i == getHeight() - 1) {
                return panel.borderStuff.getBottom(longestTextRow)
            } else {
                index = i-1
            }
        }
        let text = rows[index]
        let lengthDifference = longestTextRow - text.length
        let paddedText = text + " ".repeat(lengthDifference)
        if (!!panel.border) {
            paddedText = panel.borderStuff.addBorder(paddedText)
        }
        return paddedText
    }

    return { ...panel, getRow, getHeight, getWidth }
}

export default { createText, create }