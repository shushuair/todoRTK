import React, {ChangeEvent, useState} from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

type EditableSpanPropsType = {
    oldTitle: string
    updateCallbackTitle: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {
    const {oldTitle, updateCallbackTitle} = props
    let [title, setTitle] = useState<string>(oldTitle)
    let [editMode, setEditMode] = useState<boolean>(false)
    const buttonRef = React.createRef<HTMLButtonElement>()
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onClickUpdateTitle = () => {
        updateCallbackTitle(title)
        setEditMode(false)
    }
     const onKeyUpdateTitle = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickUpdateTitle();
        }
    };

    const onClickEditMode = () => {
        setEditMode(!editMode)
    }

    const onBlurMode = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget !== buttonRef.current) {
            setEditMode(false);
            setTitle(oldTitle);
        }
    }

    const onDoubleClickUpdateTitle = () => {
        onClickUpdateTitle()
    }

    return (
        <div>
            {editMode ? <>
                <TextField value={title} autoFocus={true} onKeyDown={onKeyUpdateTitle} onChange={onChangeTitle} onBlur={onBlurMode} onDoubleClick={onDoubleClickUpdateTitle} />
                <Button ref={buttonRef} onClick={onClickUpdateTitle} >
                    Update title
                </Button>
            </> : <span onDoubleClick={onClickEditMode}>{title}</span>}
        </div>
    );
};

