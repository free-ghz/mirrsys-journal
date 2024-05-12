import fs from 'fs'

function readFileToObject(path) {
    return {
        filename: path,
        index: fs.readFileSync(path, 'utf8')
    }
}

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .filter(filename => fs.lstatSync('./input/' + filename).isDirectory())
        .filter(filename => fs.readdirSync('./input/' + filename + "/").includes("index.777"))
        .map(filename => readFileToObject('./input/' + filename + '/index.777'))
}


export { readFileToObject, read }