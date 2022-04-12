const deleteChars = (str, chars) => {
  return str.replace(new RegExp(`[${chars}}]`, 'g'), '')
}

const uniq = (obj) => {
  if (typeof(obj) === 'string') {
    return [...new Set([...obj])].join('')
  } else {
    return [...new Set(obj)]
  }
}

const permutation = (obj) => {
  if (typeof(obj) === 'string') {
    const str = obj
    return permutation([...str]).map(arr => arr.join(''))
  } else {
    const arr = obj
    if (arr.length === 1) {
      return arr
    }
    const ret = []
    arr.forEach((_, i) => {
      const rest = [...arr]
      const elem = rest.splice(i, 1)
      permutation(rest).forEach((perm) => {
        ret.push([elem, ...perm])
      })
    })
    return ret
  }
}

export {
  deleteChars,
  uniq,
  permutation
}
