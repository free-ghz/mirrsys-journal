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
            if (child.getHeight() > height) {
                height = child.getHeight()
            }
            width += child.getWidth()
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
                return parent.borderStuff.getTop(width-2)
            } else if (i == getHeight() - 1) {
                return parent.borderStuff.getBottom(width-2)
            } else {
                index = i-1
            }
        }

        let text = ""
        children.forEach(child => {
            if (child.getHeight() > index) {
                text += child.getRow(index)
            } else {
                text += " ".repeat(child.getWidth())
            }
        })

        if (!!parent.border) {
            text = parent.borderStuff.addBorder(text)
        }

        return text
    }

    return { ...parent, getHeight, getWidth, getRow, addChild }
}

export default { create }