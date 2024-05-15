import fs from 'fs'

async function read() {
    console.log("Time to roam ./input/...")
    return (await fs.promises.readdir('./input/'))
        .filter(filename => fs.lstatSync('./input/' + filename).isDirectory())
        .map(filename => {
            let files = fs.readdirSync('./input/' + filename + "/")
            if (!files.includes("index.777")) {
                return null
            }
            console.log("- discovered", filename)

            let obj = {
                index: fs.readFileSync('./input/' + filename + '/index.777', 'utf8'),
                folder: filename
            }
            if (files.includes("meta.111")) {
                obj.meta = parseMeta(fs.readFileSync('./input/' + filename + "/meta.111", 'utf8'))
            }
            obj.otherFiles = files
                .filter(name => !name.endsWith(".777"))
                .filter(name => !name.endsWith(".111"))
            return obj
        })
        .filter(thing => thing != null)
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