import panel from './panel.js'
import { copyWithOffset } from '../formatting.js'

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
                return parent.borderStuff.getTop(width-2, parent.border)
            } else if (i == getHeight() - 1) {
                return parent.borderStuff.getBottom(width-2)
            } else {
                index = i-1
            }
        }

        let composite = {
            text: "",
            formatting: []
        }
        let offset = 0
        children.forEach(child => {
            if (child.getHeight() > index) {
                let childRow = child.getRow(index)
                composite.text += childRow.text
                composite.formatting = [...composite.formatting, ...copyWithOffset(childRow.formatting, offset)]
            } else {
                composite.text += " ".repeat(child.getWidth())
            }
            offset += child.getWidth()
        })

        if (!!parent.border) {
            composite = parent.borderStuff.addBorder(composite)
        }

        return composite
    }

    return { ...parent, getHeight, getWidth, getRow, addChild }
}

export default { create }