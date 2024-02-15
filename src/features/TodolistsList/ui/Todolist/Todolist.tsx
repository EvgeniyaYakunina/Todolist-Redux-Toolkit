import React, { memo, useCallback, useEffect } from "react"
import { TodolistDomainType } from "features/TodolistsList/model/todolists/todolists-reducer"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer"
import { AddItemForm } from "common/components"
import { TaskType } from "features/TodolistsList/api/tasks/tasks-api-types"
import { useActions } from "common/hooks"
import { FilterTasksButtons } from "features/TodolistsList/ui/Todolist/Tasks/Task/FilterTasksButtons"
import { Tasks } from "features/TodolistsList/ui/Todolist/Tasks/Tasks"
import { TodolistTitle } from "features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle"

type PropsType = {
  todolist: TodolistDomainType
  tasks: Array<TaskType>
  demo?: boolean
}

export const Todolist = memo(function ({ demo = false, todolist, tasks }: PropsType) {
  // const dispatch = useAppDispatch()
  const { fetchTasks, addTask } = useActions(tasksThunks)

  useEffect(() => {
    fetchTasks(todolist.id)
  }, [])
  // useEffect(() => {
  //   if (demo) {
  //     return
  //   }
  //   dispatch(tasksThunks.fetchTasks(props.todolist.id))
  // }, [])

  const addTaskCallback = useCallback(
    (title: string) => {
      return addTask({ title, todolistId: todolist.id }).unwrap()
    },
    [todolist.id],
  )

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks todolist={todolist} tasks={tasks} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  )
})
