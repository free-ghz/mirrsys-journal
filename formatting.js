function copyWithOffset(formatting, offset) {
    let newFormatting = []
    formatting.forEach(format => {
        let newFormat = {
            start: format.start + offset,
            end: format.end + offset,
            type: format.type
        }
        newFormatting.push(newFormat)
    })
    return newFormatting
}

function initFormatting(text) {
    let formatting = []
    return {
        text,
        formatting
    }
}

function getRowsFormatted(text) {
    if (!text.text && text.length == 0) {
        // weird bug. i dont wanna deal right now.
        // why do we have "uninitialized" empty strings???
        console.log("weirdbug")
        return {
            text,
            formatting: []
        }
    }
    
    let index = 0
    let newlines = []
    while (index < text.text.length) {
        let where = text.text.indexOf("\n", index)
        if (where == -1) {
            break
        }
        newlines.push(where)
        index = where+1
    }
    return splitFormattedAtIndexes(text, newlines)
}

function splitFormattedAtIndexes(text, indexes) {
    if (indexes.length == 0) {
        return [getDeepCopy(text)]
    }

    indexes.push(text.text.length)
    let splits = []
    let a = 0
    for(let i = 0; i < indexes.length; i++) {
        let b = indexes[i]

        let splitText = text.text.substring(a, b)
        let splitFormatting = []

        text.formatting.forEach(format => {
            if (format.start >= a && format.end <= b) {
                // safely within row
                splitFormatting.push({
                    ...format,
                    start: format.start - a,
                    end: format.end - a,
                    type: format.type
                })
            } else if (format.start < a && format.end <= b && format.end >= a) {
                // only got tail
                splitFormatting.push({
                    ...format,
                    start: 0,
                    end: format.end - a,
                    type: format.type
                })
            } else if (format.start >= a && format.end >= b && format.start <= b) {
                // only got head
                splitFormatting.push({
                    ...format,
                    start: format.start - a,
                    end: b - a,
                    type: format.type
                })
            }
        })

        splits.push({
            text: splitText,
            formatting: splitFormatting
        })
        a = b+1
    }

    return splits
}

function getDeepCopy(source) {
    let text = (" " + source.text).substring(1)
    let formatting = []
    source.formatting.forEach(sourceFormat => {
        formatting.push({
            ...sourceFormat,
            start: sourceFormat.start,
            end: sourceFormat.end,
            type: sourceFormat.type
        })
    })
    return { text, formatting }
}

export { copyWithOffset, initFormatting, getRowsFormatted, getDeepCopy }