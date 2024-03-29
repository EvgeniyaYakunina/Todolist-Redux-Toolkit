import { RequestStatusType } from "app/app-reducer"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils"
import { todolistsAPI } from "features/TodolistsList/api/todolists/todolists-api"
import { ResultCode } from "features/TodolistsList/model/tasks/tasks-reducer"
import { TodolistType } from "features/TodolistsList/api/todolists/todolists-api-types"

// const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    // removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
    //   const index = state.findIndex((todo) => todo.id === action.payload.id)
    //   if (index !== -1) state.splice(index, 1)
    // },

    // addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
    //   // 1вариант
    //   // const newTodo: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" }
    //   // state.unshift(newTodo)
    //
    //   // 2 вариант
    //   // state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    // },
    // changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
    //   // 1вариант
    //   // const index = state.findIndex((todo)=> todo.id === action.payload.title)
    //   // if(index != -1) state[index].title = action.payload.title
    //
    //   // 2вариант
    //   const todolist = state.find((todo) => todo.id === action.payload.id)
    //   if (todolist) {
    //     todolist.title = action.payload.title
    //   }
    // },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todolist = state.find((todo) => todo.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    },
    // setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
    //   //  1вариант
    //   //   return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
    //   // 2вариант
    //   action.payload.todolists.forEach((tl) => {
    //     state.push({ ...tl, filter: "all", entityStatus: "idle" })
    //   })
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" })
        })
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id)
        if (index !== -1) state.splice(index, 1)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todolist = state.find((todo) => todo.id === action.payload.id)
        if (todolist) {
          todolist.title = action.payload.title
        }
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return []
      })
  },
})

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>("todolists/fetchTodolists", async () => {
  const res = await todolistsAPI.getTodolists()
  return { todolists: res.data }
})

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todolists/removeTodolists",
  async (id, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }))
    const res = await todolistsAPI.deleteTodolist(id).finally(() => {
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "idle" }))
    })
    if (res.data.resultCode === ResultCode.success) {
      return { id }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsAPI.createTodolist(title)
    if (res.data.resultCode === ResultCode.success) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  "todolists/changeTodolistTitle",
  async (arg, { rejectWithValue }) => {
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
    if (res.data.resultCode === ResultCode.success) {
      return { id: arg.id, title: arg.title }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
// type ThunkDispatch = any

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }

// const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }>(
//   "todolists/fetchTodolists",
//   async (todolists, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await todolistsAPI.getTodolists()
//       // dispatch(setAppStatusAC("succeeded"))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       // dispatch(setTodolistsAC(res.data))
//       // dispatch(todolistsActions.setTodolists({ todolists: res.data }))
//       return { todolists: res.data }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

// const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
//   "todolists/removeTodolists",
//   async (todolistId, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
//       const res = await todolistsAPI.deleteTodolist(todolistId)
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       return { id: todolistId }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

// const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
//   "todolists/addTodolist",
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await todolistsAPI.createTodolist(arg.title)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         return { todolist: res.data.data.item }
//       } else {
//         handleServerAppError(res.data, dispatch)
//         return rejectWithValue(null)
//       }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

// const changeTodolistTitle = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
//   "todolists/changeTodolistTitle",
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       const res = await todolistsAPI.updateTodolist(arg.id, arg.title)
//       return { id: arg.id, title: arg.title }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

// export const _todolistsReducer = (
//   state: Array<TodolistDomainType> = initialState,
//   action: ActionsType,
// ): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case "REMOVE-TODOLIST":
//       return state.filter((tl) => tl.id !== action.id)
//     case "ADD-TODOLIST":
//       return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state]
//     case "CHANGE-TODOLIST-TITLE":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl))
//     case "CHANGE-TODOLIST-FILTER":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, filter: action.filter } : tl))
//     case "CHANGE-TODOLIST-ENTITY-STATUS":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, entityStatus: action.status } : tl))
//     case "SET-TODOLISTS":
//       return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
//     default:
//       return state
//   }
// }

// actions
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists }) as const
// export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", id }) as const
// export const addTodolistAC = (todolist: TodolistType) => ({ type: "ADD-TODOLIST", todolist }) as const
// export const changeTodolistTitleAC = (id: string, title: string) =>
//   ({
//     type: "CHANGE-TODOLIST-TITLE",
//     id,
//     title,
//   }) as const
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
//   ({
//     type: "CHANGE-TODOLIST-FILTER",
//     id,
//     filter,
//   }) as const
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
//   ({
//     type: "CHANGE-TODOLIST-ENTITY-STATUS",
//     id,
//     status,
//   }) as const

// thunks
// export const _fetchTodolistsTC = (): AppThunk => {
//   return (dispatch) => {
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//
//     todolistsAPI
//       .getTodolists()
//       .then((res) => {
//         // dispatch(setTodolistsAC(res.data))
//         dispatch(todolistsActions.setTodolists({ todolists: res.data }))
//         // dispatch(setAppStatusAC("succeeded"))
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch)
//       })
//   }
// }

// export const _removeTodolistTC = (todolistId: string): AppThunk => {
//   return (dispatch) => {
//     //изменим глобальный статус приложения, чтобы вверху полоса побежала
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//
//     //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//     // dispatch(changeTodolistEntityStatusAC(todolistId, "loading"))
//     dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
//     todolistsAPI.deleteTodolist(todolistId).then((res) => {
//       // dispatch(removeTodolistAC(todolistId))
//       dispatch(todolistsActions.removeTodolist({ id: todolistId }))
//       //скажем глобально приложению, что асинхронная операция завершена
//       // dispatch(setAppStatusAC("succeeded"))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     })
//   }
// }

// export const _addTodolistTC = (title: string): AppThunk => {
//   return (dispatch) => {
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//
//     todolistsAPI.createTodolist(title).then((res) => {
//       // dispatch(addTodolistAC(res.data.data.item))
//       dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
//       // dispatch(setAppStatusAC("succeeded"))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     })
//   }
// }

// export const _changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//   return (dispatch) => {
//     todolistsAPI.updateTodolist(id, title).then((res) => {
//       // dispatch(changeTodolistTitleAC(id, title))
//       dispatch(todolistsActions.changeTodolistTitle({ id, title }))
//     })
//   }
// }

// types
// export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
// type ActionsType =
//   | RemoveTodolistActionType
//   | AddTodolistActionType
//   | ReturnType<typeof changeTodolistTitleAC>
//   | ReturnType<typeof changeTodolistFilterAC>
//   | SetTodolistsActionType
//   | ReturnType<typeof changeTodolistEntityStatusAC>
