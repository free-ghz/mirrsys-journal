import fs from 'fs'

async function read() {
    let files = await fs.promises.readdir('./input/')
    return files
        .filter(filename => fs.lstatSync('./input/' + filename).isDirectory())
        .filter(filename => fs.readdirSync('./input/' + filename + "/").includes("index.777"))
        .map(filename => {
            let obj = {
                index: fs.readFileSync('./input/' + filename + '/index.777', 'utf8'),
                folder: filename
            }
            
            if (fs.readdirSync('./input/' + filename + "/").includes("meta")) {
                obj.meta = parseMeta(fs.readFileSync('./input/' + filename + "/meta", 'utf8'))
            }

            return obj
        })
}

function parseMeta(metaString) {
    let obj = {}
    let blocks = metaString.split("\n\n")
    blocks.forEach(block => {
        let lines = block.split("\n")
        if (lines.length < 2) {
            return
        }
        let key = lines[0]
        let values = lines.splice(1)
        obj[key] = values
    })
    return obj
}


export { read }