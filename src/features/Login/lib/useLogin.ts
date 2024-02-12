import { FormikHelpers, useFormik } from "formik"
import { authThunks } from "features/Login/model/auth-reducer"
import { BaseResponseType } from "common/types"
import { useActions } from "common/hooks"
import { useAppSelector } from "app/store"
import { selectIsLoggedIn } from "features/Login/model/auth-selectors"
import { LoginParamsType } from "features/Login/api/auth-types"

type FormikErrorType = Partial<Omit<LoginParamsType, "captcha">>

export const useLogin = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const { login } = useActions(authThunks)

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }
      if (!values.password) {
        errors.password = "Required"
      } else if (values.password.length < 3) {
        errors.password = "Must be 3 characters or more"
      }
      return errors
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
      // dispatch(authThunks.login(values))
      login(values)
        // обработка ошибок
        // т.к. thunk в createAsyncThunk всегда возвр.
        // зарезолвленный промис,использ unwrap, кот. выявляет resolved
        // или rejected промис и дает возможность попасть в catch
        .unwrap()
        // .then((res) => {
        //   debugger
        // })
        .catch((err: BaseResponseType) => {
          //проверка на наличие d err 'fieldError'
          err.fieldsErrors?.forEach((fieldError) => {
            formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
    },
  })
  return { formik, isLoggedIn }
}
