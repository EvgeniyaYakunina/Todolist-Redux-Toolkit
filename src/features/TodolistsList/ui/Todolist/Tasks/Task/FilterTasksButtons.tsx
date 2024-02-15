import { Button } from "@mui/material"
import React from "react"
import { useActions } from "common/hooks"
import {
  FilterValuesType,
  TodolistDomainType,
  todolistsActions,
} from "features/TodolistsList/model/todolists/todolists-reducer"

type PropsType = {
  todolist: TodolistDomainType
}

export const FilterTasksButtons = ({ todolist }: PropsType) => {
  const { changeTodolistFilter } = useActions(todolistsActions)

  const changeFilterHandler = (filter: FilterValuesType) => {
    changeTodolistFilter({ filter, id: todolist.id })
  }

  return (
    <div>
      <Button
        variant={todolist.filter === "all" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === "active" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === "completed" ? "outlined" : "text"}
        onClick={() => changeFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </div>
  )
}
