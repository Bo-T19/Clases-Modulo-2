export type TaskStatus = "Pending" | "Overdue" | "Finished"

export interface IToDo {
  description: string
  status: TaskStatus
  date: Date
}

export class ToDo {

  //To satisfy IToDo
  description: string
  status: TaskStatus
  date: Date

  //Class internals
  ui: HTMLElement
  toDoColorList: string[] = ["#008000", "#8B4513", "#FF0000"]
  color: string

  constructor(data: IToDo) {
    for (const key in data) {
      this[key] = data[key]
    }

    this.setUI()

  }

  setUI() {



    if (this.ui) {return;}

    this.ui = document.createElement("div")
    this.ui.className = "todo-item"
    this.ui.innerHTML = ` <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; column-gap: 15px; align-items: center;">
      <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
      <p data-project-info="todo-description">${this.description}</p>
    </div>
    <p style="text-wrap: nowrap; margin-left: 10px;">${this.date.toLocaleDateString("es-ES")}</p>
  </div>`
    this.setUIColor()


  }




  setUIColor() {
    switch (this.status) {
      case "Finished":
        this.color = this.toDoColorList[0]
        break;
      case "Pending":
        this.color = this.toDoColorList[1]
        break;
      case "Overdue":
        this.color = this.toDoColorList[2]
        break;
      default:
        this.color
        break;

    }
    this.ui.style.backgroundColor = `${this.color}`
  }

}