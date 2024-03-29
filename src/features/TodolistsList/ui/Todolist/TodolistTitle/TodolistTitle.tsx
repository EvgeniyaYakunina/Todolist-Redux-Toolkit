import { EditableSpan } from "common/components"
import { IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import React, { useCallback } from "react"
import { useActions } from "common/hooks"
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer"

type PropsType = {
  todolist: TodolistDomainType
}

export const TodolistTitle = ({ todolist }: PropsType) => {
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)
  const { entityStatus, id, title } = todolist

  const removeTodolistHandler = () => {
    removeTodolist(id)
  }

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id, title })
    },
    [id],
  )
  return (
    <h3>
      <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
      <IconButton onClick={removeTodolistHandler} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}
