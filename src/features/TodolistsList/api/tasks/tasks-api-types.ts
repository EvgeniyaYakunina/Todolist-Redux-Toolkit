import { UpdateDomainTaskModelType } from "features/TodolistsList/model/tasks/tasks-reducer"
import { TaskPriorities, TaskStatuses } from "common/enum"

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}
export type ArgUpdateTask = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}
export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
