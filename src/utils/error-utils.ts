import { ResponseType } from "api/todolists-api"
import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"
import { AppDispatch } from "app/store"
import axios from "axios"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    // dispatch(setAppErrorAC(data.messages[0]))
    dispatch(appActions.setAppError({ error: data.messages[0] }))
  } else {
    // dispatch(setAppErrorAC("Some error occurred"))
    dispatch(appActions.setAppError({ error: "Some error occurred" }))
  }
  // dispatch(setAppStatusAC("failed"))
  dispatch(appActions.setAppStatus({ status: "failed" }))
}

export const handleServerNetworkError = (error: unknown, dispatch: AppDispatch): void => {
  let errorMessage = "Some error occured"
  //   проверка на наличие axios ошибки
  if (axios.isAxiosError(error)) {
    // error.response?.data?.message - например получение тасок с невалидной todolistId
    // error?.message - при создании таски в offline режиме
    errorMessage = error.response?.data?.message || error?.message || errorMessage
    //  Проверка на наличие нативной ошибки
  } else if (error instanceof Error) {
    errorMessage = `Native error: ${error.message}`
    //   Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(error)
  }
}

// export const _handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
//   // dispatch(setAppErrorAC(error.message ? error.message : "Some error occurred"))
//   dispatch(appActions.setAppError({ error: error.message ? error.message : "Some error occurred" }))
//   // dispatch(setAppStatusAC("failed"))
//   dispatch(appActions.setAppStatus({ status: "failed" }))
// }
