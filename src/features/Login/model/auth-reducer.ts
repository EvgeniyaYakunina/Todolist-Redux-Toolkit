import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import { clearTasksAndTodolists } from "common/actions/common.actions"
import { createAppAsyncThunk } from "common/utils"
import { authAPI } from "features/Login/api/auth-api"
import { ResultCode } from "features/TodolistsList/model/tasks/tasks-reducer"
import { LoginParamsType } from "features/Login/api/auth-types"

// const initialState: InitialStateType = {isLoggedIn: false}

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {
    // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
    //   state.isLoggedIn = action.payload.isLoggedIn
    // },
  },
  extraReducers: (builder) => {
    // builder
    // .addCase(login.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedIn
    // })
    // .addCase(logout.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedI n
    // })
    // .addCase(initializeApp.fulfilled, (state, action) => {
    //   state.isLoggedIn = action.payload.isLoggedIn
    // })
    builder.addMatcher(
      isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      },
    )
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  const res = await authAPI.login(arg)
  if (res.data.resultCode === ResultCode.success) {
    return { isLoggedIn: true }
  } else {
    return rejectWithValue(res.data)
  }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const res = await authAPI.logout()
  if (res.data.resultCode === ResultCode.success) {
    dispatch(clearTasksAndTodolists())
    return { isLoggedIn: false }
  } else {
    return rejectWithValue(res.data)
  }
})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await authAPI.me()
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

export const authReducer = slice.reducer
export const authThunks = { login, logout, initializeApp }

// const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI
//   try {
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//     const res = await authAPI.login(arg)
//     if (res.data.resultCode === ResultCode.success) {
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       return { isLoggedIn: true }
//     } else {
//       // Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
//       // в конкретном поле в компоненте
//       // Если у нас fieldsErrors нету значит отобразим ошибку глобально
//       const isShowAppError = !res.data.fieldsErrors.length
//       handleServerAppError(res.data, dispatch, isShowAppError)
//       return rejectWithValue(res.data)
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch)
//     return rejectWithValue(null)
//   }
// })

// const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>("auth/logout", async (_, thunkAPI) => {
//   const { dispatch, rejectWithValue } = thunkAPI
//   try {
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//     const res = await authAPI.logout()
//     if (res.data.resultCode === ResultCode.success) {
//       dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       dispatch(clearTasksAndTodolists())
//       return { isLoggedIn: false }
//     } else {
//       handleServerAppError(res.data, dispatch)
//       return rejectWithValue(null)
//     }
//   } catch (e) {
//     handleServerNetworkError(e, dispatch)
//     return rejectWithValue(null)
//   }
// })

// const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
//   `${slice.name}/initializeApp`,
//   async (_, thunkAPI) => {
//     const { dispatch, rejectWithValue } = thunkAPI
//     try {
//       const res = await authAPI.me()
//       if (res.data.resultCode === ResultCode.success) {
//         return { isLoggedIn: true }
//       } else {
//         return rejectWithValue(null)
//       }
//     } catch (e) {
//       handleServerNetworkError(e, dispatch)
//       return rejectWithValue(null)
//     } finally {
//       dispatch(appActions.setAppInitialized({ isInitialized: true }))
//     }
//   },
// )

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "login/SET-IS-LOGGED-IN":
//       return { ...state, isLoggedIn: action.value }
//     default:
//       return state
//   }
// }

// actions

// export const setIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const

// thunks
// export const _loginTC =
//   (data: LoginParamsType): AppThunk =>
//   (dispatch) => {
//     // dispatch(setAppStatusAC("loading"))
//     dispatch(appActions.setAppStatus({ status: "loading" }))
//     authAPI
//       .login(data)
//       .then((res) => {
//         if (res.data.resultCode === 0) {
//           // dispatch(setIsLoggedInAC(true))
//           dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
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

// export const _logoutTC = (): AppThunk => (dispatch) => {
//   // dispatch(setAppStatusAC("loading"))
//   dispatch(appActions.setAppStatus({ status: "loading" }))
//
//   authAPI
//     .logout()
//     .then((res) => {
//       if (res.data.resultCode === 0) {
//         // dispatch(setIsLoggedInAC(false))
//         dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
//         dispatch(clearTasksAndTodolists())
//         // dispatch(setAppStatusAC("succeeded"))
//         dispatch(appActions.setAppStatus({ status: "succeeded" }))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
// }

// types

// type ActionsType = ReturnType<typeof setIsLoggedInAC>
// type InitialStateType = {isLoggedIn: boolean}
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
