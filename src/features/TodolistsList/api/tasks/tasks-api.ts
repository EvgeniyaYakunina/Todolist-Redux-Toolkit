import { instance } from "common/api"
import { BaseResponseType } from "common/types"
import { UpdateDomainTaskModelType } from "features/TodolistsList/model/tasks/tasks-reducer"
import { TaskPriorities, TaskStatuses } from "common/enum"
import { GetTasksResponse, TaskType, UpdateTaskModelType } from "features/TodolistsList/api/tasks/tasks-api-types"

export const tasksAPI = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, taskTitile: string) {
    return instance.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title: taskTitile })
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
  },
}
