import fs from 'fs'
import { parse } from "./markupParser.js"
import { generateHtmlFromPanel } from "./generate.js"
import vertical from "./layout/vertical.js"
import metaview from './components/metaview.js'
import allposts from './components/allposts.js'

function getBuiltin(name) {
    let path = "./theme/" + name + ".777"
    return fs.readFileSync(path, 'utf8')
}

const headerPanel = parse(getBuiltin("header"))
const tailerPanel = parse(getBuiltin("tailer"))
const welcomePanel = parse(getBuiltin("welcome"))

function generateIndexPage(files) {
    let filesCopy = [...files]
    filesCopy.sort((a, b) => b.meta.date[0].localeCompare(a.meta.date[0]))
    let allPostsPanel = allposts.create(filesCopy)

    let wrapper = vertical.create()
    wrapper.addChild(headerPanel)
    wrapper.addChild(welcomePanel)
    wrapper.addChild(allPostsPanel)
    wrapper.addChild(tailerPanel)

    let html = generateHtmlFromPanel(wrapper)
    return html
}

function generateBlogPage(page) {
    let metadataPanel = metaview.create(page)
    let blogPanel = parse(page.index)

    let wrapper = vertical.create()
    wrapper.addChild(headerPanel)
    wrapper.addChild(blogPanel)
    wrapper.addChild(tailerPanel)
    wrapper.addChild(metadataPanel)

    let html = generateHtmlFromPanel(wrapper)
    return html
}

export { generateBlogPage, generateIndexPage }