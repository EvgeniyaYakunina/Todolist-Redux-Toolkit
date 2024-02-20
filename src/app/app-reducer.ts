import { createSlice, isAnyOf, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { AnyAction } from "redux"
import { todolistsThunks } from "features/TodolistsList/model/todolists/todolists-reducer"
import { authThunks } from "features/Login/model/auth-reducer"
import { tasksThunks } from "features/TodolistsList/model/tasks/tasks-reducer"

// const initialState: InitialStateType = {
//   status: "idle",
//   error: null,
//   isInitialized: false,
// }

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
  },
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status
    },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        // (action: AnyAction) => {
        //   return action.type.endsWith("/pending")
        // },
        // (state, action) => {
        //   state.status = "loading"
        // },
        isPending,
        (state, action) => {
          state.status = "loading"
        },
      )
      .addMatcher(
        // (action: AnyAction) => {
        //   return action.type.endsWith("/rejected")
        // },
        // (state, action) => {
        //   state.status = "failed"
        // },
        isRejected,
        (state, action: AnyAction) => {
          state.status = "failed"
          if (action.payload) {
            // if (
            //   action.type.includes("addTodolist") ||
            //   action.type.includes("addTask") ||
            //   action.type.includes("isInitializeApp"))
            if (
              action.type === todolistsThunks.addTodolist.rejected.type ||
              action.type === tasksThunks.addTask.rejected.type ||
              action.type === authThunks.initializeApp.rejected.type
            )
              return
            state.error = action.payload.messages[0]
          } else {
            state.error = action.error.message ? action.error.message : "Some error occurred"
          }
        },
      )
      .addMatcher(
        // (action: AnyAction) => {
        //   return action.type.endsWith("/fulfilled")
        // },
        // (state, action) => {
        //   state.status = "succeeded"
        // },
        isFulfilled,
        (state) => {
          state.status = "succeeded"
        },
      )
      .addMatcher(isAnyOf(authThunks.initializeApp.fulfilled, authThunks.initializeApp.rejected), (state, action) => {
        state.isInitialized = true
      })
  },
})

export const appReducer = slice.reducer
export const appActions = slice.actions

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"
export type InitialStateType = ReturnType<typeof slice.getInitialState>

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     // case "APP/SET-STATUS":
//     //   return { ...state, status: action.status }
//     // case "APP/SET-ERROR":
//     //   return { ...state, error: action.error }
//     case "APP/SET-IS-INITIALIED":
//       return { ...state, isInitialized: action.value }
//     default:
//       return { ...state }
//   }
// }

// export const setAppErrorAC = (error: string | null) => ({ type: "APP/SET-ERROR", error }) as const
// export const setAppStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status }) as const
// export const setAppInitializedAC = (value: boolean) => ({ type: "APP/SET-IS-INITIALIED", value }) as const

// thunks
// export const _initializeAppTC = () => (dispatch: Dispatch) => {
//   authAPI.me().then((res) => {
//     if (res.data.resultCode === 0) {
//       // dispatch(setIsLoggedInAC(true))
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
//     } else {
//     }
//     // dispatch(setAppInitializedAC(true))
//     dispatch(appActions.setAppInitialized({ isInitialized: true }))
//   })
// }

// types

// export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
// export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>

// export type InitialStateType = {
//   // происходит ли сейчас взаимодействие с сервером
//   status: RequestStatusType
//   // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
//   error: string | null
//   // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
//   isInitialized: boolean
// }

// type ActionsType = SetAppErrorActionType | SetAppStatusActionType | ReturnType<typeof setAppInitializedAC>
