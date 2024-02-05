import { Dispatch } from "redux"
import { appActions } from "app/app-reducer"
import { BaseResponseType } from "common/types/types"

/**
 * Данная функция обрабатывает ошибки, которые могут возникнуть при взаимодействии с сервером.
 * @param data  - ответ от сервера в формате ResponseType<D>
 * @param dispatch - функция для отправки сообщений в store Redux
 * @param showError - флаг, указывающий, нужно ли отображать ошибки в пользовательском интерфейсе
 * @returns void - Функция не возвращает значения.
 */

export const handleServerAppError = <D>(data: BaseResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    // if (data.messages.length) {
    //   dispatch(appActions.setAppError({ error: data.messages[0] }))
    // } else {
    //   dispatch(appActions.setAppError({ error: "Some error occurred" }))
    // }
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }))
  }
  dispatch(appActions.setAppStatus({ status: "failed" }))
}
