import { read } from "./discovery.js"
import { generateBlogPage, generateIndexPage } from "./composer.js"
import { placeInFile, generateIndex } from "./generate.js"

async function main() {
    let files = await read()
    files.forEach(page => {
        console.log("Generating", page.folder)
        let html = generateBlogPage(page)
        placeInFile(html, page)
    })

    let indexHtml = generateIndexPage(files)
    generateIndex(indexHtml)
}

main()