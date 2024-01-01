import { useAppDispatch } from "common/hooks/useAppDispatch";
import { Domain, todolistsActions } from "ui";
import { DragEvent, ReactNode } from "react";

type DragAndDropProps = {
    classname?: string;
    children: ReactNode;
    todo: Domain;
    draggableTodo: null | Domain;
    setDraggableTodolist: (todo: Domain) => void;
};

export function DragAndDrop({ classname, todo, draggableTodo, setDraggableTodolist, children }: DragAndDropProps) {
    const dispatch = useAppDispatch();

    const dragStartHandler = (e: DragEvent<HTMLDivElement>) => {
        setDraggableTodolist(todo);
    };

    const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
    };

    const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.background = 'rgba(66,237,80,0.4)';
    };

    const dropHandler = (e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        if (draggableTodo) {
            dispatch(todolistsActions.changeTodoListOrder({ dragTodo: draggableTodo, dropTodo: todo }));
        }
    };

    return (
        <div
            className={classname}
            draggable={true}
            onDragStart={dragStartHandler}
            onDragEnd={dragEndHandler}
            onDragLeave={dragEndHandler}
            onDragOver={dragOverHandler}
            onDrop={dropHandler}
        >
            {children}
        </div>
    );
}