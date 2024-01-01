
export const NUMOFROW = 9;
export const NUMOFCOL = 7;

export const TRAPS ={
    0 : [[8,2],[8,4],[7,3]],
    1 : [[0,2],[0,4],[1,3]]
}

export const DENS = {
    0 : [[8,3]],
    1 : [[0,3]]
}

export const RIVER = [
    [3,1], [3,2], [4,1], [4,2], [5,1], [5,2], [3,4], [3,5], [4,4], [4,5], [5,4], [5,5]
]

export const BOARD = [
    ['lion1', null, null, null, null, null, 'tiger1'],
    [null, 'dog1', null, null, null, 'cat1', null],
    ['rat1', null, 'panther1', null, 'wolf1', null, 'elephant1'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['elephant0', null, 'wolf0', null, 'panther0', null, 'rat0'],
    [null, 'cat0', null, null, null, 'dog0', null],
    ['tiger0', null, null, null, null, null, 'lion0']
]

export const TERRAIN = [
    [null, null, 'trap1', 'den1', 'trap1', null, null],
    [null, null, null, 'trap1', null, null, null],
    [null, null, null, null, null, null, null],
    [null, 'river', 'river', null, 'river', 'river', null],
    [null, 'river', 'river', null, 'river', 'river', null],
    [null, 'river', 'river', null, 'river', 'river', null],
    [null, null, null, null, null, null, null],
    [null, null, null, 'trap0', null, null, null],
    [null, null, 'trap0', 'den0', 'trap0', null, null]
]

// export const BOARD = [
//     ['lion1', null, null, null, null, null, 'tiger1'],
//     [null, 'dog1', null, null, null, 'cat1', null],
//     ['rat1', null, 'panther1', null, 'wolf1', null, 'elephant1'],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, null, null, null, null],
//     ['elephant0', null, 'wolf0', null, 'panther0', null, 'rat0'],
//     [null, 'cat0', null, null, null, 'dog0', null],
//     ['tiger0', null, null, null, null, null, 'lion0']
// ]