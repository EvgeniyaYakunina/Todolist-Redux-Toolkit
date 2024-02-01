import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"
import { ResponseType } from "common/types/types"

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
