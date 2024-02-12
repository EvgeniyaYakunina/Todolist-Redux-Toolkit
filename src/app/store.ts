import { tasksReducer } from "features/TodolistsList/model/tasks/tasks-reducer"
import { todolistsReducer } from "features/TodolistsList/model/todolists/todolists-reducer"
import { AnyAction, applyMiddleware, combineReducers, createStore } from "redux"
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk"
import { appReducer } from "./app-reducer"
import { authReducer } from "features/Login/model/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useSelector } from "react-redux"

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
// const rootReducer = combineReducers({
//   tasks: tasksReducer,
//   todolists: todolistsReducer,
//   app: appReducer,
//   auth: authReducer,
// })

// непосредственно создаём store
// export const _store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
// export const store = configureStore({ reducer: rootReducer })
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
  },
})

// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppRootStateType = ReturnType<typeof store.getState>

// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
// window.store = store
