
const exclude = (obj, keys) => {
    if (obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([key]) => !keys.includes(key))
        )   
    } else {
        return {};
    }
}

export default exclude;