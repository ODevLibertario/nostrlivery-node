export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export function hasTag(tags: string[][], name: string, value: string) {
    return tags.filter(tag => tag[0] === name && tag[1] == value)[0][1] != undefined
}

export function removePrefix(key: string) {
    return key.replace('npub', '')
}