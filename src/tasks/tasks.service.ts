import { Injectable } from '@nestjs/common';

import { PostTaskDto } from './dto/post-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask } from './task.model';
import groupTasksByParentId from './tasks.helper';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel('Task')
    private readonly taskModel: Model<ITask>,
  ) {}

  async getAllTasks() {
    const result = await this.taskModel.find();

    return result;
  }

  async createTask(postTaskDto: PostTaskDto) {
    const result = await this.taskModel.create(postTaskDto);

    return result;
  }

  async updateTask(filter: { _id: string }, updateTaskDto: UpdateTaskDto) {
    const result = await this.taskModel.findOneAndUpdate(
      filter,
      updateTaskDto,
      { new: true },
    );
    return result;
  }

  async removeTask(id: string) {
    const allTask = await this.taskModel.find();
    const taskMap = groupTasksByParentId(allTask);

    const deleteTaskChain = async (id: string) => {
      if (taskMap[id]) {
        taskMap[id].forEach((subtask) => deleteTaskChain(subtask.id));
      }
      const result = await this.taskModel.findOneAndDelete({ _id: id });
      return result;
    };

    return deleteTaskChain(id);
  }
}
