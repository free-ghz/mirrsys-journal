function create() {
    let panel = {
        border: false,
        getHeight: () => 0,
        getRow: () => ""
    }
    return panel
}

function createText(text) {
    let panel = create()

    let rows = text.split("\n")
    let getHeight = () => {
        return rows.length;
    }
    let getRow = (i) => {
        return rows[i]
    }

    return {...panel, getRow, getHeight}
}

export default { createText }