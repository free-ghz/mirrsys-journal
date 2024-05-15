import panel from './layout/panel.js'
import horizontal from './layout/horizontal.js'
import vertical from './layout/vertical.js'
import { initFormatting } from './formatting.js'

function readBlockStructure(text) {
    let lines = text.split("\n")
    let stack = []
    let completeBlocks = []
    let currentBlock = null
    lines.forEach(line => {
        if (line.startsWith("[:")) {
            if (stack.length > 0) {
                let textBlock = {
                    parent: currentBlock,
                    text: initFormatting(stack.join("\n"))
                }
                if (currentBlock) {
                    textBlock.header = { options: { decoration: currentBlock.header.options.decoration }}
                    if (currentBlock.children) {
                        currentBlock.children.push(textBlock)
                    } else {
                        currentBlock.children = [textBlock]
                    }
                }
                stack = []
            }

            let header = parseHeader(line.substring(2))
            let newBlock = {
                parent: currentBlock,
                header
            }
            if (currentBlock) {
                if (currentBlock.children) {
                    currentBlock.children.push(newBlock)
                } else {
                    currentBlock.children = [newBlock]
                }
            }
            currentBlock = newBlock

        } else if (line.startsWith(":]")) {
            if (stack.length > 0) {
                let textBlock = {
                    parent: currentBlock,
                    text: initFormatting(stack.join("\n"))
                }
                if (currentBlock) {
                    textBlock.header = { options: { decoration: currentBlock.header.options.decoration }}
                    if (currentBlock.children) {
                        currentBlock.children.push(textBlock)
                    } else {
                        currentBlock.children = [textBlock]
                    }
                }
                stack = []
            }
            if (currentBlock.parent == null) {
                completeBlocks.push(currentBlock)
            }
            currentBlock = currentBlock.parent
        } else {
            if (currentBlock != null) {
                stack.push(line)
            }
        }
    })

    addFormatting(completeBlocks)
    return completeBlocks
}

function addFormatting(blocks) {
    function recurse (block, callback) {
        callback(null, block)
        recurse2(block, callback)
    }
    function recurse2 (block, callback) {
        if (block.children) {
            block.children.forEach(child => {
                callback(block, child)
                recurse2(child, callback)
            })
        }
    }

    blocks.forEach(block => {
        recurse(block, (parent, block) => {
            if (!!block.text) {
                addLinks(block.text)
                addImages(block.text)
            }
        })
    })
}

let linkRegex = /\[(.*?)\]\((.*?)\)/g
function addLinks(text) {
    let rawMatches = text.text.match(linkRegex)
    if (!rawMatches) {
        return
    }
    rawMatches.forEach(rawLinkText => {
        let borderIndex = rawLinkText.indexOf("](") // probably not so good if there's a weird url some day.
        let linkText = rawLinkText.substring(1, borderIndex)
        let linkTarget = rawLinkText.substring(borderIndex+2, rawLinkText.length-1)

        let where = text.text.indexOf(rawLinkText)
        text.text = text.text.substring(0, where) + linkText + text.text.substring(where + rawLinkText.length)
        text.formatting.push({
            start: where,
            end: where + linkText.length,
            type: "link",
            linkTarget
        })
    })
}


let imageRegex = /@image\((.*?)\)/g
function addImages(text) {
    let rawMatches = text.text.match(imageRegex)
    if (!rawMatches) {
        return
    }
    rawMatches.forEach(rawImageText => {
        let hrefIndex = 7
        let target = rawImageText.substring(hrefIndex, rawImageText.length-1)

        let linkText = "(image)"
        let where = text.text.indexOf(rawImageText)
        text.text = text.text.substring(0, where) + linkText + text.text.substring(where + rawImageText.length)
        text.formatting.push({
            start: where,
            end: where + linkText.length,
            type: "image",
            imageTarget: target
        })
    })
}

function convertToPanels(block) {
    let { type, options } = block.header ? block.header : { type: null, options: {} }
    if (block.text != null) {
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
    if (header.length == 0) {
        return { options }
    }
    header.split(":").forEach(instruction => {
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

export { parse, addLinks }