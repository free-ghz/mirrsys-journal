function create() {
    let panel = {
        border: false,
        getHeight: () => 0,
        getRow: () => ""
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
    let getHeight = () => {
        let textHeight = rows.length;
        let borderHeight = !!panel.border ? 2 : 0
        return textHeight + borderHeight;
    }
    let getRow = (i) => {
        let index = i
        if (!!panel.border) {
            if (i == 0) {
                return "┌" + "─".repeat(longestTextRow) + "┐"
            } else if (i == getHeight() - 1) {
                return "└" + "─".repeat(longestTextRow) + "┘"
            } else {
                index = i-1
            }
        }
        let text = rows[index]
        let lengthDifference = longestTextRow - text.length
        let paddedText = text + " ".repeat(lengthDifference)
        if (!!panel.border) {
            paddedText = "│" + paddedText + "│"
        }
        return paddedText
    }

    return {...panel, getRow, getHeight}
}

export default { createText }