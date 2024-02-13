import React, { useCallback, useEffect } from "react"
import { useAppSelector } from "app/store"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer"
import { Grid, Paper } from "@mui/material"
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { selectIsLoggedIn, selectTodolists } from "features/TodolistsList/model/todolists/todolistList-selectors"
import { AddItemForm } from "common/components"
import { selectTasks } from "features/TodolistsList/model/tasks/tasks-selectors"
import { useActions } from "common/hooks"

type PropsType = {
  demo?: boolean
}

export const TodolistsList = ({ demo = false }: PropsType) => {
  // const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists)
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()
  const { addTodolist, fetchTodolists } = useActions(todolistsThunks)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [])

  const addTodolistCallback = useCallback(
    (title: string) => {
      // dispatch(todolistsThunks.addTodolist(title))
      addTodolist(title)
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
