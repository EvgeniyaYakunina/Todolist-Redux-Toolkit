import { AppRootStateType } from "app/store"

export const selectTodolists = (state: AppRootStateType) => state.todolists
export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
