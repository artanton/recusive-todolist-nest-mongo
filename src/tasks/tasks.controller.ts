import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Patch,

  // UseFilters,
} from '@nestjs/common';
import { PostTaskDto } from './dto/post-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
// import { isValidObjectId } from 'mongoose';
// import { HttpExceptionFilter } from 'src/exception.filter';

@Controller('tasks')
// @UseFilters(HttpExceptionFilter)
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Post()
  createTask(@Body() postTaskDto: PostTaskDto) {
    return this.taskService.createTask(postTaskDto);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    // if (!isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid ID format');
    // }
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  removeTask(@Param('id') id: string) {
    // if (!isValidObjectId(id)) {
    //   throw new BadRequestException('Invalid ID format');
    // }
    return this.taskService.removeTask(id);
  }
}
