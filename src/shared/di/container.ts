import { FirebaseAuthRepository }         from '../../infrastructure/firebase/FirebaseAuthRepository'
import { FirestorePreferencesRepository } from '../../infrastructure/firebase/FirestorePreferencesRepository'
import { FirestoreTaskRepository }        from '../../infrastructure/firebase/FirestoreTaskRepository'
import { ExpoNotificationRepository }     from '../../infrastructure/notifications/ExpoNotificationRepository'

import { SignInUseCase }             from '../../application/auth/SignInUseCase'
import { SignOutUseCase }            from '../../application/auth/SignOutUseCase'
import { GetCurrentUserUseCase }     from '../../application/auth/GetCurrentUserUseCase'
import { GetPreferencesUseCase }     from '../../application/dashboard/GetPreferencesUseCase'
import { UpdatePreferencesUseCase }  from '../../application/dashboard/UpdatePreferencesUseCase'
import { GetTasksUseCase }           from '../../application/activities/GetTasksUseCase'
import { CreateTaskUseCase }         from '../../application/activities/CreateTaskUseCase'
import { UpdateTaskUseCase }         from '../../application/activities/UpdateTaskUseCase'
import { DeleteTaskUseCase }         from '../../application/activities/DeleteTaskUseCase'
import { CompleteTaskUseCase }       from '../../application/activities/CompleteTaskUseCase'
import { GetTaskHistoryUseCase }     from '../../application/activities/GetTaskHistoryUseCase'
import { GetProfileUseCase }         from '../../application/profile/GetProfileUseCase'
import { SaveProfileUseCase }        from '../../application/profile/SaveProfileUseCase'

// Repositórios (singletons)
const authRepo         = new FirebaseAuthRepository()
const prefsRepo        = new FirestorePreferencesRepository()
const taskRepo         = new FirestoreTaskRepository()
const notificationRepo = new ExpoNotificationRepository()

// Casos de uso exportados
export const signInUseCase            = new SignInUseCase(authRepo)
export const signOutUseCase           = new SignOutUseCase(authRepo)
export const getCurrentUserUseCase    = new GetCurrentUserUseCase(authRepo)
export const getPreferencesUseCase    = new GetPreferencesUseCase(prefsRepo)
export const updatePreferencesUseCase = new UpdatePreferencesUseCase(prefsRepo)
export const getTasksUseCase          = new GetTasksUseCase(taskRepo)
export const createTaskUseCase        = new CreateTaskUseCase(taskRepo)
export const updateTaskUseCase        = new UpdateTaskUseCase(taskRepo)
export const deleteTaskUseCase        = new DeleteTaskUseCase(taskRepo)
export const completeTaskUseCase      = new CompleteTaskUseCase(taskRepo)
export const getTaskHistoryUseCase    = new GetTaskHistoryUseCase(taskRepo)
export const getProfileUseCase        = new GetProfileUseCase(authRepo, prefsRepo)
export const saveProfileUseCase       = new SaveProfileUseCase(prefsRepo)