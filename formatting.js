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

export { copyWithOffset }