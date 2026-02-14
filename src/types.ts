
// src/types.ts

export interface User {
    id: string;
    username: string;
    // password should not be sent to frontend
}

export interface ExerciseDefinition {
    id: string;
    userId: string;
    name: string;
    description: string;
}

export interface ExerciseSet {
    id: string;
    reps: number;
    weight: number;
}

export interface CompletedExercise {
    id: string;
    exerciseDefinitionId: string;
    exerciseName: string; // Denormalize for easier access
    sets: ExerciseSet[];
    // link to workout session, userId
}

export interface WorkoutSession {
    id: string;
    userId: string;
    date: string; // ISO date string
    completedExercises: CompletedExercise[];
}

export interface WorkoutTemplate {
    id: string;
    userId: string;
    name: string;
    exercises: ExerciseDefinition[]; // Array of exercise definitions
}
