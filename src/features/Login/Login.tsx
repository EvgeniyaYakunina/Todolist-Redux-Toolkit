import React from "react"
import { FormikHelpers, useFormik } from "formik"
import { useAppSelector } from "app/store"
import { Navigate } from "react-router-dom"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField } from "@mui/material"
import { selectIsLoggedIn } from "features/Login/auth-selectors"
import { authThunks } from "features/Login/auth-reducer"
import { BaseResponseType } from "common/types"
import { LoginParamsType } from "features/Login/auth-api"

type FormValues = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()

  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const formik = useFormik({
    validate: (values) => {
      // if (!values.email) {
      //   return {
      //     email: "Email is required",
      //   }
      // }
      // if (!values.password) {
      //   return {
      //     password: "Password is required",
      //   }
      // }
    },
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: (values, formikHelpers: FormikHelpers<FormValues>) => {
      dispatch(authThunks.login(values))
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

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={4}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered{" "}
                <a href={"https://social-network.samuraijs.com/"} target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p> Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
              {formik.errors.email ? <div style={{ color: "red" }}>{formik.errors.email}</div> : null}
              <TextField type="password" label="Password" margin="normal" {...formik.getFieldProps("password")} />
              {formik.errors.password ? <div style={{ color: "red" }}>{formik.errors.password}</div> : null}
              <FormControlLabel
                label={"Remember me"}
                control={<Checkbox {...formik.getFieldProps("rememberMe")} checked={formik.values.rememberMe} />}
              />
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
