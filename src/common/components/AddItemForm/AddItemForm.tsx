import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { AddBox } from '@mui/icons-material';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(function (props: AddItemFormPropsType) {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
                   disabled={props.disabled}
        />
        <IconButton color="primary" onClick={addItem} disabled={props.disabled}>
            <AddBox/>
        </IconButton>
    </div>
})




// import React, {ChangeEvent, useState, KeyboardEvent} from 'react';
//
// export type AddItemFormPropsType = {
//     callback: (value: string) => void
// }
//
//
// export const AddItemForm = (props: AddItemFormPropsType) => {
//     const {callback} = props
//     let [newTitle, setNewTitle] = useState("")
//     let [error, setError] = useState<null | string>(null)
//
//     const addTask = () => {
//         if(newTitle.trim() !== ""){
//             setNewTitle(newTitle.trim())
//             callback(newTitle)
//             setNewTitle("")
//         }
//     }
//
//     const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//         setNewTitle(e.currentTarget.value)
//         setError(null)
//     }
//     const onKeyHandler = (e: KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter") {
//             addTask()
//         }
//     }
//     const onClickHandler = () => {
//         addTask()
//     }
//     return (
//         <div>
//             {/*<input*/}
//             {/*    value={newTitle}*/}
//             {/*    onChange={onChangeHandler}*/}
//             {/*    onKeyDown={onKeyHandler}*/}
//             {/*/>*/}
//             {/*<button onClick={onClickHandler}>Add</button>*/}
//             <TextField variant="outlined"
//                        error={!!error}
//                        value={title}
//                        onChange={onChangeHandler}
//                        onKeyPress={onKeyPressHandler}
//                        label="Title"
//                        helperText={error}
//             />
//             <IconButton color="primary" onClick={addItem}>
//                 <AddBox/>
//             </IconButton>
//             {error && <h3>{error}</h3>}
//         </div>
//     );
// };
//
