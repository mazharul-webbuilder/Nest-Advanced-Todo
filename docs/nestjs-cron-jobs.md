# NestJS Cron Jobs - How They Work

This document explains how cron jobs work in NestJS using this project as a practical example.

## Overview

NestJS cron jobs allow you to schedule code to run at specific intervals. They run automatically in the background without requiring HTTP requests.

---

## The Connection Chain

Here is how all the pieces connect together:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  1. PACKAGE DEPENDENCY                                                  │
│  Package: @nestjs/schedule (wrapper around node-cron library)            │
│  File: package.json                                                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  2. ROOT MODULE REGISTRATION                                            │
│  File: src/app.module.ts                                                │
│  Import: ScheduleModule.forRoot()                                         │
│  This initializes the scheduler when the app starts                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  3. SERVICE WITH @Cron DECORATOR                                        │
│  File: src/modules/todos/services/todo-reminder.service.ts              │
│  When the module loads:                                                  │
│    - Nest instantiates TodoReminderService                              │
│    - Nest scans the class for decorators                                │
│    - Finds @Cron() on handleOverdueTodoReminders()                      │
│    - Registers the cron job with the scheduler                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  4. AUTOMATIC EXECUTION                                                 │
│  The cron job runs automatically at the scheduled interval              │
│  No HTTP request or manual trigger needed!                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Implementation

### Step 1: Install the Package

```bash
npm install @nestjs/schedule
```

The `@nestjs/schedule` package wraps the `node-cron` library and provides decorators for scheduling.

> **Important:** Make sure the package is saved to `package.json`. Check that `"@nestjs/schedule"` appears in your dependencies. If not, reinstall with:
> ```bash
> npm install @nestjs/schedule --save
> ```

---

### Step 2: Register the Schedule Module

**File:** `src/app.module.ts`

```typescript
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // Other imports...
    ScheduleModule.forRoot(),  // ← This initializes the scheduler
    TodosModule,
    // Other modules...
  ],
})
export class AppModule {}
```

**Important:** `ScheduleModule.forRoot()` must be called once in your root module (AppModule). This sets up the scheduler that will manage all cron jobs across your application.

---

### Step 3: Create a Service with @Cron Decorator

**File:** `src/modules/todos/services/todo-reminder.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);

  /**
   * Runs every 15 seconds to check for overdue todos
   * Cron syntax: second minute hour day month dayOfWeek
   * '*/15 * * * * *' = every 15 seconds
   */
  @Cron('*/15 * * * * *')
  async handleOverdueTodoReminders(): Promise<void> {
    this.logger.log('=== CRON JOB STARTED ===');
    
    // Your scheduled logic here
    // e.g., send emails, clean up data, generate reports
    
    this.logger.log('=== CRON JOB COMPLETED ===');
  }
}
```

---

### Step 4: Register the Service in Module Providers

**File:** `src/modules/todos/todos.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TodoReminderService } from './services/todo-reminder.service';

@Module({
  imports: [
    // Other imports...
  ],
  controllers: [TodosController],
  providers: [
    // Other providers...
    TodoReminderService,  // ← Add your service here
  ],
})
export class TodosModule {}
```

**Key Point:** When `TodosModule` is imported in `AppModule`, NestJS:
1. Instantiates `TodoReminderService`
2. Scans the class for decorators
3. Discovers `@Cron('*/15 * * * * *')`
4. Registers the job with the scheduler

---

## Cron Expression Syntax

The `@Cron()` decorator uses standard cron syntax with 6 fields:

```
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └─── Day of week (0-7, where 0 and 7 are Sunday)
│ │ │ │ └───── Month (1-12)
│ │ │ └─────── Day of month (1-31)
│ │ └───────── Hour (0-23)
│ └─────────── Minute (0-59)
└───────────── Second (0-59)  ← Optional in some cron implementations
```

### Common Examples

| Expression | Description |
|------------|-------------|
| `*/15 * * * * *` | Every 15 seconds |
| `0 */5 * * * *` | Every 5 minutes (at minute 0) |
| `0 0 * * * *` | Every hour (at the start of hour) |
| `0 0 9 * * *` | Every day at 9:00 AM |
| `0 0 0 * * 1` | Every Monday at midnight |
| `0 0 1 * * *` | First day of every month at midnight |

### Special Strings

```typescript
@Cron(CronExpression.EVERY_10_SECONDS)
@Cron(CronExpression.EVERY_30_SECONDS)
@Cron(CronExpression.EVERY_MINUTE)
@Cron(CronExpression.EVERY_5_MINUTES)
@Cron(CronExpression.EVERY_HOUR)
@Cron(CronExpression.EVERY_DAY_AT_1AM)
```

---

## Alternative Scheduling Decorators

NestJS also provides simpler decorators for common use cases:

### @Interval()

Runs at a fixed interval (in milliseconds):

```typescript
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  
  @Interval(60000)  // Run every 60 seconds (1 minute)
  async cleanOldLogs() {
    // Cleanup logic
  }
}
```

### @Timeout()

Runs once after a delay (in milliseconds):

```typescript
import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class StartupService {
  
  @Timeout(5000)  // Run once after 5 seconds
  async sendStartupNotification() {
    // Runs once on startup after 5 seconds
  }
}
```

---

## How It Works Behind the Scenes

### The Bootstrap Process

**File:** `src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

When your app starts:

1. `NestFactory.create(AppModule)` instantiates all modules
2. `ScheduleModule.forRoot()` initializes the cron scheduler
3. Each module's providers are instantiated
4. Services with `@Cron` are discovered and registered
5. Jobs begin running automatically

### The Scheduler Lifecycle

```
Application Start
        ↓
ScheduleModule.forRoot() initializes
        ↓
Scheduler starts running in background
        ↓
Every 15 seconds → Job triggers
        ↓
Method executes → async/await handled
        ↓
Next tick → Loop continues
```

**Important:** The scheduler runs in the same Node.js process as your HTTP server. It doesn't require a separate process or thread.

---

## Practical Example from This Project

### Todo Reminder Service

**File:** `src/modules/todos/services/todo-reminder.service.ts`

```typescript
@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);

  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  @Cron('*/15 * * * * *')
  async handleOverdueTodoReminders(): Promise<void> {
    const now = new Date();

    // Find overdue todos that haven't been notified
    const query = {
      dueDate: { $lt: now },
      status: { $ne: TodoStatus.COMPLETED },
      $or: [{ isNotified: false }, { isNotified: { $exists: false } }],
    };

    const overdueTodos = await this.todoModel.find(query).populate('user');

    for (const todo of overdueTodos) {
      await this.sendReminder(todo);
    }
  }

  private async sendReminder(todo: TodoDocument): Promise<void> {
    // Send email reminder logic
  }
}
```

### What This Job Does

1. **Every 15 seconds**, checks the database for overdue todos
2. Finds todos where:
   - `dueDate` is past the current time
   - Status is not `COMPLETED`
   - Has not been notified yet (`isNotified: false`)
3. Sends email reminders to users
4. Marks todos as notified to prevent duplicate emails

---

## Key Takeaways

1. **`ScheduleModule.forRoot()`** - Initialize once in AppModule
2. **`@Cron()` decorator** - Mark methods to run on schedule
3. **Service in providers[]** - Register the service in a module
4. **Automatic discovery** - Nest finds and registers jobs automatically
5. **Same process** - Cron jobs run in the same Node.js process as your server
6. **No manual trigger** - Jobs run automatically without HTTP requests

---

## Common Pitfalls

### 1. Forgetting to add service to providers

```typescript
// ❌ WRONG - Service not in providers
@Module({
  providers: [],  // TodoReminderService missing!
})

// ✅ CORRECT - Service added to providers
@Module({
  providers: [TodoReminderService],
})
```

### 2. Not importing the module

```typescript
// ❌ WRONG - TodosModule not imported in AppModule
@Module({
  imports: [ScheduleModule.forRoot()],  // Missing TodosModule
})

// ✅ CORRECT - Module imported
@Module({
  imports: [ScheduleModule.forRoot(), TodosModule],
})
```

### 3. Multiple cron jobs with same timing

If you have multiple `@Cron('*/15 * * * * *')` decorators, they will all run simultaneously. Be mindful of database connection limits and resource usage.

### 4. Long-running jobs

If a job takes longer than its interval, it may overlap with the next execution. Consider using job queues (like Bull) for long-running tasks.

---

## Testing Cron Jobs

When testing, you may want to disable cron jobs:

```typescript
// In your test setup
const module = await Test.createTestingModule({
  imports: [
    // Don't import ScheduleModule.forRoot() in tests
    // Or mock it
  ],
}).compile();
```

---

## Summary

Cron jobs in NestJS follow a simple pattern:

1. **Install** `@nestjs/schedule`
2. **Register** `ScheduleModule.forRoot()` in AppModule
3. **Create** a service with `@Cron()` decorator
4. **Add** the service to module providers
5. **Run** your app - jobs execute automatically!

The "invisible connection" is NestJS's **decorator-based discovery system**. When the app starts, Nest scans all providers, finds methods with `@Cron()`, and registers them with the scheduler automatically.
