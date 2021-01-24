import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksModule } from './tasks.module';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';


@Injectable()
export class TasksService {

//salvez taskurile in memorie (array) momentan:
//arrayul va fi o proprietate a clasei
private tasks: Task[] = [];

//give the controller acces trough this method:
getAllTasks(): Task[]{
    return this.tasks;
}

// localhost:3000/tasks?status=OPEN&search=textInDescription
getTasksWithFilters(filterDto: GetTasksFilterDto):Task[]{
    const {status, search} = filterDto;
    let tasks = this.getAllTasks();

    if(status){
        tasks = tasks.filter(t => t.status === status );
    }  

    if ( search ){
        tasks = tasks.filter(t => 
            t.title.includes(search) ||
            t.description.includes(search),
            )
    }
    return tasks;
}

getTaskById(id: string): Task {
    return this.tasks.find( task => task.id === id );
}

deleteTask(id: string): void {
    const deleted = this.tasks.filter(t => t.id === id)
    console.log("deleted", deleted);
    // a new array containing only the remaining tasks:
    this.tasks = this.tasks.filter( task => task.id != id);
}

createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description} = createTaskDto;

    const task: Task = {
        id: uuidv4(),
        title,
        description,
        status: TaskStatus.OPEN, //default value
    }
this.tasks.push(task);
return task;
}

updateTaskStatus(id: string, status: TaskStatus): Task{
   const task = this.getTaskById(id);
   task.status = status;
    return task;
}

}
