import fs from 'fs'
import { parse } from "./markupParser.js"
import { generateHtmlFromPanel } from "./generate.js"
import vertical from "./layout/vertical.js"

function getBuiltin(name) {
    let path = "./theme/" + name + ".777"
    return fs.readFileSync(path, 'utf8')
}

function generateBlogPage(page) {
    let header = getBuiltin("header")
    let headerPanel = parse(header)
    let blogPanel = parse(page.index)

    let wrapper = vertical.create()
    wrapper.addChild(headerPanel)
    wrapper.addChild(blogPanel)

    let html = generateHtmlFromPanel(wrapper)
    return html
}

export { generateBlogPage }