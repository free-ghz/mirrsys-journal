import panel from '../layout/panel.js'
import horizontal from '../layout/horizontal.js'
import { initFormatting } from '../formatting.js'

const visibleLabels = ["title", "date", "author", "topic", "location", "animal", "regret", "smell", "drug", "temperature", "penis type"]
const indicator = " -> "
function create(blogpost) {
    let container = horizontal.create({
        border: "meta"
    })
    if (!blogpost.meta) {
        container.addChild(panel.createText(initFormatting("Mystery blogpost.")))
        return container
    }

    let widestkey = 0
    visibleLabels.forEach(possibleKey => {
        if (blogpost.meta[possibleKey] && possibleKey.length > widestkey) {
            widestkey = possibleKey.length
        }
    })
    let text = []
    visibleLabels.forEach(possibleKey => {
        if (blogpost.meta[possibleKey]) {
            let sizeDifference = widestkey - possibleKey.length
            let key = possibleKey + " ".repeat(sizeDifference)
            let value = blogpost.meta[possibleKey][0]
            text.push(key + indicator + value)
        }
    })
    container.addChild(panel.createText(initFormatting(text.join("\n"))))
    return container
}

export default { create }