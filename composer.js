import { readFileToObject } from "./discovery.js"
import { parse } from "./markupParser.js"
import { generateHtmlFromPanel } from "./generate.js"
import vertical from "./layout/vertical.js"

function getBuiltin(name) {
    let path = "./theme/" + name + ".777"
    return readFileToObject(path)
}

function generateBlogPage(page) {
    let header = getBuiltin("header")
    let headerPanel = parse(header.index)
    let blogPanel = parse(page.index)

    let wrapper = vertical.create()
    wrapper.addChild(headerPanel)
    wrapper.addChild(blogPanel)

    let html = generateHtmlFromPanel(wrapper)
    return html
}

export { generateBlogPage }