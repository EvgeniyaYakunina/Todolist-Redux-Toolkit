import { Task } from "features/TodolistsList/ui/Todolist/Tasks/Task/Task"
import React from "react"
import { TaskStatuses } from "common/enum"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer"
import { TaskType } from "features/TodolistsList/api/tasks/tasks-api-types"

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
}

export const Tasks = ({ todolist, tasks }: PropsType) => {
  let tasksForTodolist = tasks

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return <>{tasksForTodolist?.map((t) => <Task key={t.id} task={t} todolistId={todolist.id} />)}</>
}
