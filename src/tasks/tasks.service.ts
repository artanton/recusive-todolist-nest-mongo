import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PostTaskDto } from './dto/post-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ITask } from './task.model';
import groupTasksByParentId from './tasks.helper';

interface ISubTask extends ITask {
  id: string;
}

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

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    // if (!isValidObjectId(id)) {
    //   throw new HttpException('Invalid ID format', 400);
    // }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const result = await this.taskModel.findOneAndUpdate(
      { _id: id },
      updateTaskDto,
      {
        new: true,
      },
    );
    if (!result) {
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async removeTask(id: string) {
    // if (!isValidObjectId(id)) {
    //   throw new Error('invalid ID format');
    // }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    const allTask = await this.taskModel.find();
    const taskMap = groupTasksByParentId(allTask);

    const deleteTaskChain = async (id: string) => {
      if (taskMap[id]) {
        taskMap[id].forEach((subtask: ISubTask) => deleteTaskChain(subtask.id));
      }
      const result = await this.taskModel.findOneAndDelete({ _id: id });
      if (!result) {
        throw new NotFoundException('Task not found');
      }
      return result;
    };

    return deleteTaskChain(id);
  }
}
