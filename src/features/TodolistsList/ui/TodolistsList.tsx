import React, { useCallback, useEffect } from "react"
import { useAppSelector } from "app/store"
import {
  FilterValuesType,
  todolistsActions,
  todolistsThunks,
} from "features/TodolistsList/model/todolists/todolists-reducer"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer"
import { Grid, Paper } from "@mui/material"
import { Todolist } from "features/TodolistsList/ui/Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { selectIsLoggedIn, selectTodolists } from "features/TodolistsList/model/todolists/todolistList-selectors"
import { AddItemForm } from "common/components"
import { selectTasks } from "features/TodolistsList/model/tasks/tasks-selectors"

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  // const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists)
  const todolists = useAppSelector(selectTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    // dispatch(fetchTodolistsTC())
    dispatch(todolistsThunks.fetchTodolists())
  }, [])

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ title, todolistId }))
  }, [])

  const changeFilter = useCallback(function (filter: FilterValuesType, todolistId: string) {
    dispatch(todolistsActions.changeTodolistFilter({ id: todolistId, filter: filter }))
  }, [])

  const removeTodolist = useCallback(function (id: string) {
    dispatch(todolistsThunks.removeTodolist(id))
  }, [])

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistsThunks.changeTodolistTitle({ id, title }))
  }, [])

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title))
    },
    [dispatch],
  )

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  removeTodolist={removeTodolist}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
