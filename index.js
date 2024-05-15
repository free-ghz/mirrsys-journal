import { read } from "./discovery.js"
import { generateBlogPage } from "./composer.js"
import { placeInFile } from "./generate.js"

async function main() {
    let files = await read()
    files.forEach(page => {
        console.log("Generating", page.folder)
        let html = generateBlogPage(page)
        placeInFile(html, page)
    })
}

main()