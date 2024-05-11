import panel from './layout/panel.js'
import horizontal from './layout/horizontal.js'
import vertical from './layout/vertical.js'

function readBlockStructure(text) {
    let head = 0
    let blocks = []

    function readBlockHeader() {
        let blockHeaderEndIndex = text.indexOf("\n", head)
        let blockHeader = text.substring(head, blockHeaderEndIndex)
        head = blockHeaderEndIndex + 1
        return blockHeader
    }
    function readBlock() {
        let internalBlocks = []
        let stack = ""
        let header = parseHeader(readBlockHeader())
        while (head < text.length) {

            let ch = text[head]

            if (ch == "[") {
                if (head < text.length-1 && text[head+1] == ":") {
                    // nested block start!
                    if (stack.length > 0) {
                        internalBlocks.push({
                            text: stack,
                            header: { options: { decoration: header.options.decoration }}
                        })
                        stack = ""
                    }
                    let block = readBlock()
                    internalBlocks.push(block)
                    continue
                }
            }
            if (ch == "\n") {
                if (head < text.length-2 && text[head+1] == ":" && text[head+2] == "]") {
                    // block end
                    head += 3
                    break
                }
            }
            stack += ch
            head++
        }

        if (stack.length > 0) {
            internalBlocks.push({
                text: stack,
                header: { options: { decoration: header.options.decoration }}
            })
        }
        if (internalBlocks.length == 1 && !!internalBlocks[0].text) {
            return {
                ...internalBlocks[0],
                header
            }
        }
        return {
            children: internalBlocks,
            header
        }
    }
    head = text.indexOf("[:", head)
    while(head < text.length) {
        let block = readBlock()
        blocks.push(block)
        head += 1
    }

    function recurse (block, callback) {
        callback(null, block)
        if (block.children) {
            block.children.forEach(child => {
                callback(block, child)
                recurse(child, callback)
            })
        }
    }
    blocks.forEach(block => {
        recurse(block, (parent, block) => {
            if (!!block.text && block.text.endsWith("\n")) {
                block.text = block.text.substring(0, block.text.length-1)
            }
        })
    })

    return blocks
}

function convertToPanels(block) {
    let { type, options } = block.header ? block.header : { type: null, options: {} }
    if (!!block.text) {
        // i dont care about desired type. text is text
        return panel.createText(block.text, options)
    }
    let container = getPanelOfType(type, options)
    block.children
        .map(child => convertToPanels(child))
        .forEach(child => container.addChild(child))
    return container
}
function getPanelOfType(type, options) {
    if (type == "horizontal") {
        return horizontal.create(options)
    }
    // default
    return vertical.create(options)
}
function parseHeader(header) {
    let options = {}
    if (header == undefined) return { options }
    let type
    let workHeader = header.substring(2)
    if (workHeader.length == 0) {
        return { options }
    }
    workHeader.split(":").forEach(instruction => {
        let separator = instruction.indexOf("-")
        if (separator > 0) {
            let saliva = instruction.split("-")
            let key = saliva[0]
            let value = saliva[1]
            if (value == "true") value = true
            if (value == "false") value = false
            options[key] = value
        } else {
            type = instruction
        }
    })
    return { type, options }
}

function parse(text) {
    let blocks = readBlockStructure(text)
    if (blocks.length > 1) {
        let container = {
            children: blocks
        }
        blocks = [container]
    }

    return convertToPanels(blocks[0])
}

export { parse }