export type TaskStatus = "Pending"|"Overdue"|"Finished"

export interface IToDo
{
    description: string
    status: TaskStatus
    date: Date
}

export class ToDo
{
    description: string
    status: TaskStatus
    date: Date
    
    constructor(data: IToDo)
    {
      for (const key in data)
      {
        this[key] = data[key]
      }
    }

}