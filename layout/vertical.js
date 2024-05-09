import panel from './panel.js'

function create(options) {
    let parent = { ...panel.create(), ...options }
    let children = []

    let width = 0
    let height = 0
    let getWidth = () => {
        return width
    }
    let getHeight = () => {
        return height
    }

    let recalcDimensions = () => {
        width = 0
        height = 0

        children.forEach(child => {
            if (child.getWidth() > width) {
                width = child.getWidth()
            }
            height += child.getHeight()
        })

        if (!!parent.border) {
            width += 2
            height += 2
        }
    }

    let addChild = (child) => {
        children.push(child)
        recalcDimensions()
    }

    let getRow = (i) => {
        let index = i
        if (!!parent.border) {
            if (i == 0) {
                return parent.borderStuff.getTop(width-2, parent.border)
            } else if (i == getHeight() - 1) {
                return parent.borderStuff.getBottom(width-2)
            } else {
                index = i-1
            }
        }

        let text
        let offset = 0
        for (let child of children) {
            if (index - offset < child.getHeight()) {
                text = child.getRow(index - offset)
                break;
            } else {
                offset += child.getHeight()
            }
        }
        let lengthDifference = width - text.text.length
        if (!!parent.border) {
            lengthDifference -= 2
        }
        text.text = text.text + " " .repeat(lengthDifference)

        if (!!parent.border) {
            text = parent.borderStuff.addBorder(text)
        }

        return text
    }

    return { ...parent, getHeight, getWidth, getRow, addChild }
}

export default { create }