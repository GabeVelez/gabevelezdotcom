# Khanban - Git-Based Kanban System

This directory contains a git-based kanban board that replaces the Trello workflow previously used for managing tasks on gabevelez.com.

## Directory Structure

Each directory represents a "list" or column in the kanban board:

- **Building/** - Tasks that are currently being built/implemented
- **Case Studies/** - Case study content that needs to be created
- **Designing/** - Tasks in the design phase
- **DONE - Design : Dev/** - Completed design and development tasks
- **DONE- Case Studies/** - Completed case studies
- **Editing/** - Content that is being edited
- **Page Templates and Misc/** - Page template work and miscellaneous tasks
- **Startup and Freelance/** - Startup and freelance project case studies
- **Writing Draft/** - Content in draft writing phase

## Task Structure

Each task is represented as a directory within its corresponding list directory. Inside each task directory, you'll find:

1. **README.md** - Contains:
   - Task title
   - Description
   - Links to relevant resources
   - Original Trello card details

2. **Attachments/** - Any files/attachments associated with the task (when applicable)

## Workflow

### Moving Tasks Between Lists

To move a task from one state to another (e.g., from "Writing Draft" to "Editing"):

1. Move the entire task directory from the source list to the destination list
2. Update the "Current List" information in the README.md

Example:
```bash
# Moving a task from Writing Draft to Editing
mv "khanban/Writing Draft/Task Name" "khanban/Editing/Task Name"
```

### Creating New Tasks

To create a new task:

1. Create a new directory in the appropriate list folder
2. Create a README.md file in the new directory with:
   - Task title
   - Description
   - Any relevant resources
   - Current list information

### Advantages Over Trello

- Complete version history of all tasks and their movement
- All project tasks stored directly in the git repository
- Offline access to all task information
- Better integration with development workflow
- Ability to link directly to task directories from code comments

This system maintains the visual organization of a kanban board while leveraging git's version control capabilities.
