import { appActions } from "app/app-reducer"
import { createSlice } from "@reduxjs/toolkit"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { TaskPriorities, TaskStatuses } from "common/enum/enum"
import { thunkTryCatch } from "common/utils/thunkTryCatch"
import { tasksAPI } from "features/TodolistsList/api/tasks/tasks-api"
import { ArgUpdateTask, TaskType, UpdateTaskModelType } from "features/TodolistsList/api/tasks/tasks-api-types"

// const initialState: TasksStateType = {}

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    // removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
    //   const tasksForCurrentTodolist = state[action.payload.todolistId]
    //   const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId)
    //   if (index !== -1) tasksForCurrentTodolist.splice(index, 1)
    // },
    // addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
    //   const tasksForCurrentTodolist = state[action.payload.task.todoListId]
    //   tasksForCurrentTodolist.unshift(action.payload.task)
    // },
    // updateTask: (
    //   state,
    //   action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
    // ) => {
    //   const tasksForCurrentTodolist = state[action.payload.todolistId]
    //   const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId)
    //   if (index != -1) {
    //     tasksForCurrentTodolist[index] = { ...tasksForCurrentTodolist[index], ...action.payload.model }
    //   }
    // },
    // setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
    //   state[action.payload.todolistId] = action.payload.tasks
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.todolistId]
        const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) tasksForCurrentTodolist.splice(index, 1)
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.task.todoListId]
        tasksForCurrentTodolist.unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasksForCurrentTodolist = state[action.payload.todolistId]
        const index = tasksForCurrentTodolist.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasksForCurrentTodolist[index] = { ...tasksForCurrentTodolist[index], ...action.payload.domainModel }
        }
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists.type, () => {
        return {}
      })
  },
})

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksAPI.getTasks(todolistId)
      dispatch(appActions.setAppStatus({ status: "succeeded" }))
      return { tasks: res.data.items, todolistId }
    })
  },
)

// thunks
// const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
//   "tasks/fetchTasks",
//   async (todolistId, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       // dispatch(setAppStatusAC("loading"))
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await tasksAPI.getTasks(todolistId)
//       // dispatch(setAppStatusAC("succeeded"))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       // // const tasks = res.data.items
//       // dispatch(tasksActions.setTasks({ tasks: res.data.items, todolistId }))
//       return { tasks: res.data.items, todolistId }
//     } catch (error) {
//       handleServerNetworkError(error, dispatch)
//       return rejectWithValue(null)
//     }
//   },
// )

const removeTask = createAppAsyncThunk<{ taskId: string; todolistId: string }, { todolistId: string; taskId: string }>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksAPI.deleteTask(arg.todolistId, arg.taskId)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { taskId: arg.taskId, todolistId: arg.todolistId }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    })
  },
)

// const removeTask = createAppAsyncThunk<{ taskId: string; todolistId: string }, { todolistId: string; taskId: string }>(
//   "tasks/removeTask",
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//       const res = await tasksAPI.deleteTask(arg.todolistId, arg.taskId)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         // dispatch(tasksActions.removeTask({ taskId, todolistId }))
//         return { taskId: arg.taskId, todolistId: arg.todolistId }
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

export const ResultCode = {
  success: 0,
  error: 1,
  captcha: 10,
} as const

const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await tasksAPI.createTask(arg.todolistId, arg.title)
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue(res.data)
      }
    })
  },
)
// const addTask = createAppAsyncThunk<{ task: TaskType }, { todolistId: string; title: string }>(
//   "tasks/addTask",
//   async (arg, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       dispatch(appActions.setAppStatus({ status: "loading" }))
//
//       const res = await tasksAPI.createTask(arg.todolistId, arg.title)
//       if (res.data.resultCode === ResultCode.success) {
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         return { task: res.data.data.item }
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

const updateTask = createAppAsyncThunk<ArgUpdateTask, ArgUpdateTask>("tasks/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI
  return thunkTryCatch(thunkAPI, async () => {
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      return rejectWithValue(null)
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }
    const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
    if (res.data.resultCode === ResultCode.success) {
      return arg
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  })
})

// const updateTask = createAppAsyncThunk<ArgUpdateTask, ArgUpdateTask>("tasks/updateTask", async (arg, thunkAPI) => {
//   const { dispatch, rejectWithValue, getState } = thunkAPI
//   try {
//     const state = getState()
//     const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
//     if (!task) {
//       return rejectWithValue(null)
//     }
//     const apiModel: UpdateTaskModelType = {
//       deadline: task.deadline,
//       description: task.description,
//       priority: task.priority,
//       startDate: task.startDate,
//       title: task.title,
//       status: task.status,
//       ...arg.domainModel,
//     }
//     const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
//     if (res.data.resultCode === ResultCode.success) {
//       // dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
//       // return { taskId: arg.taskId, model: arg.domainModel, todolistId: arg.todolistId }
//       return arg
//     } else {
//       handleServerAppError(res.data, dispatch)
//       return rejectWithValue(null)
//     }
//   } catch (error) {
//     handleServerNetworkError(error, dispatch)
//     return rejectWithValue(null)
//   }
// })

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, removeTask, addTask, updateTask }

// export const _tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
//   switch (action.type) {
//     case "REMOVE-TASK":
//       return { ...state, [action.todolistId]: state[action.todolistId].filter((t) => t.id !== action.taskId) }
//     case "ADD-TASK":
//       return { ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]] }
//     case "UPDATE-TASK":
//       return {
//         ...state,
//         [action.todolistId]: state[action.todolistId].map((t) =>
//           t.id === action.taskId ? { ...t, ...action.model } : t,
//         ),
//       }
//     case "ADD-TODOLIST":
//       return { ...state, [action.todolist.id]: [] }
//     case "REMOVE-TODOLIST":
//       const copyState = { ...state }
//       delete copyState[action.id]
//       return copyState
//     case "SET-TODOLISTS": {
//       const copyState = { ...state }
//       action.todolists.forEach((tl: any) => {
//         copyState[tl.id] = []
//       })
//       return copyState
//     }
//     case "SET-TASKS":
//       return { ...state, [action.todolistId]: action.tasks }
//     default:
//       return state
//   }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//   ({ type: "REMOVE-TASK", taskId, todolistId }) as const
// export const addTaskAC = (task: TaskType) => ({ type: "ADD-TASK", task }) as const
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
//   ({ type: "UPDATE-TASK", model, todolistId, taskId }) as const
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//   ({ type: "SET-TASKS", tasks, todolistId }) as const

// export const _fetchTasksTC =
//   (todolistId: string): AppThunk =>
//   (dispatch) => {
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//
//     tasksAPI.getTasks(todolistId).then((res) => {
//       const tasks = res.data.items
//       dispatch(tasksActions.setTasks({ tasks, todolistId }))
//       // dispatch(setAppStatusAC("succeeded"))
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//     })
//   }

// export const _removeTaskTC =
//   (taskId: string, todolistId: string): AppThunk =>
//   (dispatch) => {
//     tasksAPI.deleteTask(todolistId, taskId).then((res) => {
//       // const action = removeTaskAC(taskId, todolistId)
//       // dispatch(action)
//       dispatch(tasksActions.removeTask({ taskId, todolistId }))
//     })
//   }

// const _addTaskTC =
//   (title: string, todolistId: string): AppThunk =>
//   (dispatch) => {
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//
//     tasksAPI
//       .createTask(todolistId, title)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           // const task = res.data.data.item
//           // const action = addTaskAC(task)
//           // dispatch(action)
//           dispatch(tasksActions.addTask({ task: res.data.data.item }))
//           // dispatch(setAppStatusAC("succeeded"))
//           dispatch(appActions.setAppStatus({ status: "succeeded" }))
//         } else {
//           handleServerAppError(res.data, dispatch)
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch)
//       })
//   }

// export const _updateTaskTC =
//   (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//   (dispatch, getState) => {
//     const state = getState()
//     const task = state.tasks[todolistId].find((t) => t.id === taskId)
//     if (!task) {
//       //throw new Error("task not found in the state");
//       console.warn("task not found in the state")
//       return
//     }
//
//     const apiModel: UpdateTaskModelType = {
//       deadline: task.deadline,
//       description: task.description,
//       priority: task.priority,
//       startDate: task.startDate,
//       title: task.title,
//       status: task.status,
//       ...domainModel,
//     }
//
//     tasksAPI
//       .updateTask(todolistId, taskId, apiModel)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           // const action = updateTaskAC(taskId, domainModel, todolistId)
//           // dispatch(action)
//           dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
//         } else {
//           handleServerAppError(res.data, dispatch)
//         }
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch)
//       })
//   }

// type ActionsType =
//   | ReturnType<typeof removeTaskAC>
//   | ReturnType<typeof addTaskAC>
//   | ReturnType<typeof updateTaskAC>
//   // | AddTodolistActionType
//   // | RemoveTodolistActionType
//   // | SetTodolistsActionType
//   | ReturnType<typeof setTasksAC>
//   | any
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
