import React from 'react'
import './board.css'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { placeLetter, removeLetter, selectAll, updateWord } from '../store/reducer'
import Cell from './Cell'

const Board = () => {
    const allState = useAppSelector(selectAll)
    const dispatch = useAppDispatch()

    const onPlaceLetter = (event: React.ChangeEvent<HTMLInputElement>) => dispatch(placeLetter({
        letter: event.target.value,
        cell: event.target.id
    }))

    const onResetLetter = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        const target = event.target as HTMLDivElement
        dispatch(removeLetter({ cell: target.id }))
    }

    return <div className="container dark:bg-gray-400">
        <div className="grid" style={{
            gridTemplateColumns: `repeat(${allState.fieldSize}, 80px)`,
            gridTemplateRows: `repeat(${allState.fieldSize}, 80px)`
        }}>
            {
                allState.field
                    .flatMap((row, i) => row.map((l, j) =>
                        <Cell key={`${i}_${j}`}
                              id={`${i}_${j}`}
                              path={allState.wordPath}
                              letter={l}
                              value={l}
                              onSelectWord={(letter: string) => dispatch(updateWord({ letter, cell: `${i}_${j}` }))}
                              onResetLetter={onResetLetter}
                              onChange={onPlaceLetter}/>))
            }
        </div>
    </div>
}

export default Board