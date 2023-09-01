import React, { ChangeEvent, useState } from 'react';
import TextField from '@mui/material/TextField';

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    style?: any
    disabled?: boolean
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {

    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField value={title} onChange={updateTitle} autoFocus disabled={props.disabled} onBlur={activateViewMode}/>
        : <span style={props.style} onDoubleClick={activateEditMode} >{props.value}</span>
});