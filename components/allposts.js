import panel from '../layout/panel.js'
import vertical from '../layout/vertical.js'
import { initFormatting } from '../formatting.js'
import { addLinks } from '../markupParser.js'

const indicator = " -> "
function create(allPosts) {
    let container = vertical.create({})
    
    allPosts.forEach(post => {
        let line = post.meta.date
        line += indicator
        let title = post.meta.title || "untitled"
        let link = "[" + title + "](" + post.folder + "/)"
        line += link
        line = initFormatting(line)
        addLinks(line)
        container.addChild(panel.createText(line))
    })

    return container
}

export default { create }