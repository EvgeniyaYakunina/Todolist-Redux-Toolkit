import React, { useCallback, useEffect } from "react"
import { Task } from "features/TodolistsList/ui/Todolist/Task/Task"
import {
  TodolistDomainType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolists-reducer"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { Button, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer"
import { AddItemForm, EditableSpan } from "common/components"
import { TaskStatuses } from "common/enum/enum"
import { TaskType } from "features/TodolistsList/api/tasks/tasks-api-types"
import { useActions } from "common/hooks"
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/Task/FilterTasksButtons"

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const dispatch = useAppDispatch()
  const { fetchTasks, addTask } = useActions(tasksThunks)
  const { changeTodolistFilter } = useActions(todolistsActions)
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  useEffect(() => {
    fetchTasks(props.todolist.id)
  }, [])
  // useEffect(() => {
  //   if (demo) {
  //     return
  //   }
  //   dispatch(tasksThunks.fetchTasks(props.todolist.id))
  // }, [])

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id })
    },
    [props.todolist.id],
  )

  const removeTodolistHandler = () => {
    removeTodolist(props.todolist.id)
  }

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title })
    },
    [props.todolist.id],
  )

  let tasksForTodolist = props.tasks

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === "loading"} />
      <div>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={props.todolist.id} />)}</div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={props.todolist} />
      </div>
    </div>
  )
})
