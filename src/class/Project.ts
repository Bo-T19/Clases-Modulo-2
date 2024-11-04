export type ProjectStatus = "pending"|"active"|"finished"
export type UserRole = "architect"|"engineer"|"developer"
import {v4 as uuidv4} from 'uuid'
import { ToDo, IToDo } from './ToDo'  

export interface IProject{
    name : string
    description : string
    status: ProjectStatus
    userRole : UserRole
    finishDate: Date
 
}

export class Project implements IProject
{

    //To satisfy IPRoject
    name : string
    description : string
    status: ProjectStatus
    userRole : UserRole
    finishDate: Date

    //Class internals
    ui: HTMLDivElement
    cost : number = 0
    progress: number = 0
    id: string
    initials: string
    color: string
    colorArray: string[] = ["#FF6F61","#6A5ACD", "#FFB347", "#3498DB", "#27AE60", "#C0392B"]
    toDoList: ToDo[] = []

    constructor(data: IProject)
    {
      for (const key in data)
      {
        this[key] = data[key]
      }
        this.id = uuidv4()
        this.setUI()
        
    }

    setUI () 
    {   if(this.ui) {return}
        
        
        if(this.name.split(" ").length<2)
        {
          this.initials = (this.name.split(" ")[0][0]+ this.name.split(" ")[0][1]).toUpperCase()
        }
        else
        {
          this.initials = (this.name.split(" ")[0][0]+ this.name.split(" ")[1][0]).toUpperCase()
        }

        this.color = this.colorArray[Math.floor(Math.random() * (5 - 0))]


        this.ui = document.createElement("div")
        this.ui.className="project-card"
        this.ui.innerHTML = ` <div class="card-header">
            <p style="background-color: ${this.color}; padding: 10px; border-radius: 8px; aspect-ratio: 1;">${this.initials}</p>
            <div>
              <h5>${this.name}</h5>
              <p>${this.description}<</p>
            </div>
          </div>
          <div class="card-content">
            <div class="card-property">
              <p style="color: #969696;">Status</p>
              <p>${this.status}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Role</p>
              <p>${this.userRole}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Cost</p>
              <p>$${this.cost}</p>
            </div>
            <div class="card-property">
              <p style="color: #969696;">Estimated Progress</p>
              <p>${this.progress}</p>
            </div>
          </div>`
        }

}