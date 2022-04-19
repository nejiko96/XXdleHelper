const deleteChars = (str, chars) => {
  return str.replace(new RegExp(`[${chars}]`, 'g'), '')
}

const selectChars = (str, chars) => {
  return str.replace(new RegExp(`[^${chars}]`, 'g'), '')
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
  }
  const arr = obj
  if (arr.length === 1) {
    return arr
  }
  return arr.flatMap((_, i) => {
    const rest = [...arr]
    const elem = rest.splice(i, 1)
    return permutation(rest).map(perm => [elem, ...perm])
  })
}

const repeatedPermutation = (obj, len) => {
  if (typeof(obj) === 'string') {
    const str = obj
    return repeatedPermutation([...str], len).map(arr => arr.join(''))
  }
  const arr = obj
  if (len == 0) {
    return [[]]
  }
  return arr.flatMap(elem => repeatedPermutation(arr, len - 1).map(rp => [elem, ...rp]))
}

export {
  deleteChars,
  selectChars,
  uniq,
  permutation,
  repeatedPermutation
}
