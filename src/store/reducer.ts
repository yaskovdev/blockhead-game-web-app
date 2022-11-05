// @ts-nocheck
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { makeMove, createNewField } from '../api/service'
import { RootState } from './store'

const initialState = {
    field: [[]],
    lastSetLetter: { id: '', value: '' },
    word: [],
    wordsUsed: [],
    wordsByUser: [],
    wordsByComputer: []
}

export const fetchComputerMove = createAsyncThunk(
    'fetchComputerMove',
    async ({ field, wordsUsed }) => makeMove({ field, wordsUsed })
)

export const fetchCreateNewField = createAsyncThunk('fetchCreateNewField', createNewField)

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateWord(state, action) {
            const { letter } = action.payload
            state.word.push(letter)
        },
        resetWord(state, action) {
            state.word = []
        },
        userMove(state, action) {
            const { word } = action.payload

            state.word = []
            state.lastSetLetter = { id: '', value: '' }
            state.wordsUsed.push(word)
            state.wordsByUser.push(word)
        },
        placeLetter(state, action) {
            const { letter, cell } = action.payload

            const [x, y] = cell
            state.field[x][y] = letter.toUpperCase()

            if (state.lastSetLetter.id !== '') {
                const [xi, yi] = state.lastSetLetter.id
                state.field[xi][yi] = '.'
            }

            state.lastSetLetter = { id: cell, value: letter.toUpperCase() }
        },
        computerMove(state, action) {
            const { word, letter, cell } = action.payload

            const [x, y] = cell
            state.field[x][y] = letter.toUpperCase()

            state.wordsUsed.push(word)
            state.wordsByComputer.push(word)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchComputerMove.fulfilled, (state, action) => {
                const { word, letter, cell } = action.payload

                const [x, y] = cell
                state.field[x][y] = letter.toUpperCase()

                state.wordsUsed.push(word)
                state.wordsByComputer.push(word)
            })
            .addCase(fetchCreateNewField.fulfilled, (state, action) => {
                const field = action.payload
                const word = field[2].join('')

                state.field = field
                state.wordsUsed.push(word)
            })
    },
})

export const { userMove, updateWord, placeLetter, resetWord } = gameSlice.actions

export default gameSlice.reducer

export const selectAll = (state: RootState) => state