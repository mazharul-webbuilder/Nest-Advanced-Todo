import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from '../../../database/mongoose/schemas/todo.schema';
import { TodoStatus } from '../../../common/enums/todo.status';
import { MailService } from '../../mail/services/mail/mail.service';
import { User, UserDocument } from '../../../database/mongoose/schemas/user.schema';

@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);

  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  /**
   * Runs every 15 seconds to check for overdue todos and send reminders
   */
  @Cron('*/15 * * * * *')
  async handleOverdueTodoReminders(): Promise<void> {
    this.logger.log('=== CRON JOB STARTED ===');
    console.log('=== CRON JOB STARTED ===');

    const now = new Date();
    this.logger.log(`Current time: ${now.toISOString()}`);

    // First, let's see ALL todos (for debugging)
    const allTodos = await this.todoModel.find().lean();
    this.logger.log(`Total todos in DB: ${allTodos.length}`);
    console.log(`Total todos in DB: ${allTodos.length}`);

    // Check each todo's status
    for (const todo of allTodos) {
      this.logger.log(
        `Todo: "${todo.title}" | dueDate: ${todo.dueDate} | status: ${todo.status} | isNotified: ${todo.isNotified} | overdue: ${todo.dueDate < now}`,
      );
    }

    // Find overdue todos that haven't been notified yet
    const query = {
      dueDate: { $lt: now },
      status: { $ne: TodoStatus.COMPLETED },
      $or: [{ isNotified: false }, { isNotified: { $exists: false } }],
    };

    this.logger.log(`Query: ${JSON.stringify(query)}`);
    console.log(`Query: ${JSON.stringify(query)}`);

    const overdueTodos = await this.todoModel.find(query).populate('user');

    this.logger.log(`Found ${overdueTodos.length} overdue unnotified todos`);
    console.log(`Found ${overdueTodos.length} overdue unnotified todos`);

    if (overdueTodos.length === 0) {
      this.logger.log('No overdue todos to process.');
      console.log('No overdue todos to process.');
      return;
    }

    for (const todo of overdueTodos) {
      this.logger.log(`Processing todo: "${todo.title}"`);
      console.log(`Processing todo: "${todo.title}"`);
      await this.sendReminder(todo);
    }

    this.logger.log('=== CRON JOB COMPLETED ===');
    console.log('=== CRON JOB COMPLETED ===');
  }

  private async sendReminder(todo: TodoDocument): Promise<void> {
    try {
      const user = await this.userModel.findById(todo.user);

      this.logger.log(`Looking up user: ${todo.user} -> found: ${!!user}`);
      console.log(`Looking up user: ${todo.user} -> found: ${!!user}`);

      if (!user || !user.email) {
        this.logger.warn(`User not found or no email for todo ${todo._id}`);
        console.log(`User not found or no email for todo ${todo._id}`);
        return;
      }

      this.logger.log(`Sending email to: ${user.email}`);
      console.log(`Sending email to: ${user.email}`);

      await this.mailService.sendMail({
        to: user.email,
        subject: `Reminder: Your todo "${todo.title}" is overdue`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
            <h2 style="color: #e74c3c;">Todo Overdue Reminder</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Your todo is now overdue:</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin: 0 0 10px 0;">${todo.title}</h3>
              <p style="margin: 0;"><strong>Description:</strong> ${todo.description}</p>
              <p style="margin: 10px 0 0 0;"><strong>Due Date:</strong> ${todo.dueDate.toLocaleDateString()}</p>
              <p style="margin: 5px 0 0 0;"><strong>Priority:</strong> ${todo.priority}</p>
            </div>
            <p>Please complete this task as soon as possible.</p>
            <p>Best regards,<br/>Your Todo App Team</p>
          </div>
        `,
      });

      // Mark todo as notified
      todo.isNotified = true;
      await todo.save();

      this.logger.log(`SUCCESS: Reminder sent to ${user.email} for todo "${todo.title}"`);
      console.log(`SUCCESS: Reminder sent to ${user.email} for todo "${todo.title}"`);
    } catch (error) {
      this.logger.error(`FAILED to send reminder for todo ${todo._id}:`, error);
      console.log(`FAILED to send reminder for todo ${todo._id}:`, error);
    }
  }
}
