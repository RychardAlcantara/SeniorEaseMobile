import { FirebaseAuthRepository } from "../../infrastructure/firebase/FirebaseAuthRepository";
import { FirestorePreferencesRepository } from "../../infrastructure/firebase/FirestorePreferencesRepository";
import { FirestoreTaskRepository } from "../../infrastructure/firebase/FirestoreTaskRepository";
import { ExpoNotificationRepository } from "../../infrastructure/notifications/ExpoNotificationRepository";

import { SignInUseCase } from "../../application/auth/SignInUseCase";
import { SignOutUseCase } from "../../application/auth/SignOutUseCase";
import { GetCurrentUserUseCase } from "../../application/auth/GetCurrentUserUseCase";
import { GetPreferencesUseCase } from "../../application/dashboard/GetPreferencesUseCase";
import { UpdatePreferencesUseCase } from "../../application/dashboard/UpdatePreferencesUseCase";
import { GetProfileUseCase } from "../../application/profile/GetProfileUseCase";
import { SaveProfileUseCase } from "../../application/profile/SaveProfileUseCase";
import { CreateTask } from "../../application/activities/CreateTask";
import { DeleteTask } from "../../application/activities/DeleteTask";
import { GetAllTasks } from "../../application/activities/GetAllTasks";
import { GetTasksByUser } from "../../application/activities/GetTasksByUser";
import { UpdateTask } from "../../application/activities/UpdateTask";
import { SignUpUseCase } from '../../application/auth/SignUpUseCase'
import { UpdateProfileUseCase } from '../../application/auth/UpdateProfileUseCase'
import { UpdatePasswordUseCase } from '../../application/auth/UpdatePasswordUseCase'
import { ForgotPasswordUseCase } from '../../application/auth/ForgotPasswordUseCase'

// Repositórios (singletons)
const authRepo = new FirebaseAuthRepository();
const prefsRepo = new FirestorePreferencesRepository();
const taskRepo = new FirestoreTaskRepository();
const notificationRepo = new ExpoNotificationRepository();

// Casos de uso exportados
export const signInUseCase = new SignInUseCase(authRepo);
export const signOutUseCase = new SignOutUseCase(authRepo);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepo);
export const getPreferencesUseCase = new GetPreferencesUseCase(prefsRepo);
export const updatePreferencesUseCase = new UpdatePreferencesUseCase(prefsRepo);
export const createTaskUseCase = new CreateTask(taskRepo);
export const updateTaskUseCase = new UpdateTask(taskRepo);
export const deleteTaskUseCase = new DeleteTask(taskRepo);
export const getTasksByUserUseCase = new GetTasksByUser(taskRepo);
export const getAllTasksUseCase = new GetAllTasks(taskRepo);
export const getProfileUseCase = new GetProfileUseCase(authRepo, prefsRepo);
export const saveProfileUseCase = new SaveProfileUseCase(prefsRepo);
export const signUpUseCase = new SignUpUseCase(authRepo)
export const updateProfileUseCase = new UpdateProfileUseCase(authRepo)
export const updatePasswordUseCase = new UpdatePasswordUseCase(authRepo)
export const forgotPasswordUseCase = new ForgotPasswordUseCase(authRepo)
