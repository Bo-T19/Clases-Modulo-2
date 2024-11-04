
import { IProject, Project, ProjectStatus, UserRole } from "./Project"
import { ToDo, IToDo, TaskStatus } from './ToDo'


export interface ICompleteProject {
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    cost: number
    progress: number

}

export class ProjectManager {
    list: Project[] = []
    ui: HTMLElement
    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const projectNames = this.list.map((project) => {
            return project.name
        })

        const nameInUse = projectNames.includes(data.name)
        if (nameInUse) {
            throw new Error(`A project with name "${data.name}" already exists`)
        }

        if (data.name.length < 5) {
            throw new Error(`The name must have at least 5 characters`)
        }

        if (data.finishDate.toDateString() == "Invalid Date") {
            data.finishDate = new Date(2024, 1, 1)
        }

        const project = new Project(data)




        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) { return }
            {
                projectsPage.style.display = "none"
                detailsPage.style.display = "flex"
                this.setDetailsPage(project)
            }

        })

        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }


    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details")
        if (!detailsPage) { return }
        const name = detailsPage.querySelectorAll("[data-project-info='name']")
        if (name) {
            name.forEach(element => {
                element.textContent = project.name
            });
        }

        const description = detailsPage.querySelectorAll("[data-project-info='description']")
        if (description) {
            description.forEach(element => {
                element.textContent = project.description
            });
        }

        const status = detailsPage.querySelectorAll("[data-project-info='status']")
        if (status) {
            status.forEach(element => {
                element.textContent = project.status
            });
        }

        const role = detailsPage.querySelectorAll("[data-project-info='role']")
        if (role) {
            role.forEach(element => {
                element.textContent = project.userRole
            });
        }

        const cost = detailsPage.querySelectorAll("[data-project-info='cost']")
        if (cost) {
            cost.forEach(element => {
                element.textContent = project.cost as unknown as string
            });
        }

        const date = detailsPage.querySelectorAll("[data-project-info='finish-date']")
        if (date) {
            date.forEach(element => {
                element.textContent = project.finishDate.toLocaleDateString("es-ES")
            });
        }

        const initials = detailsPage.querySelectorAll("[data-project-info='name-initials']")
        if (initials) {
            initials.forEach(element => {
                element.textContent = project.initials
            });
        }

        const progress = detailsPage.querySelectorAll("[data-project-info='progress']")
        if (progress) {
            progress.forEach(element => {
                element.innerHTML = `<div data-project-info="progress" 
                                    style="width: ${project.progress.toString()}%; 
                                    background-color: green; 
                                    padding: 4px 0; 
                                    text-align: center;">${project.progress.toString()}%</div>`

            })
        }

    }

    editProject(project: Project, completeData: ICompleteProject) {

        const projectNames = this.list.map((project) => {
            return project.name
        })

        const nameInUse = projectNames.includes(completeData.name)
        if (nameInUse && completeData.name !==project.name) {
            throw new Error(`A project with name "${completeData.name}" already exists`)
        }

        if (completeData.name.length < 5) {
            throw new Error(`The name must have at least 5 characters`)
        }

        for (const key in completeData) {
            if (project.hasOwnProperty(key) && completeData[key]) {
                project[key] = completeData[key];
            }
        }


        this.setDetailsPage(project)
    }

    addToDo(project: Project, data: IToDo) {

        let color: string

        if (data.date.toDateString() == "Invalid Date") {
            data.date = new Date(2024, 1, 1)
        }

        const toDo = new ToDo(data)

        project.toDoList.push(toDo)
        const toDoList = document.getElementById("todo-list")
        if (toDoList) {
            toDoList.append(toDo.ui)
        }

        toDo.ui.addEventListener("click", (e) => {

            const editToDoModal = document.getElementById("edit-todo-modal") as HTMLDialogElement
            editToDoModal.showModal()
            const editToDoForm = document.getElementById("edit-todo-form")

            if (editToDoForm && editToDoForm instanceof HTMLFormElement) {
                editToDoForm.addEventListener("submit", (e) => {
                    e.preventDefault()
                    const formData = new FormData(editToDoForm)
                    const editToDoData =
                    {
                        status: formData.get("status") as TaskStatus,
                    }
                    toDo.status = editToDoData.status
                    toDo.setUIColor()
                    editToDoModal.close()
                }
                )
            }
        })


    }

    defaultProject() {
        const defaultData: IProject = {
            name: "Default project",
            description: "Default description",
            status: "pending",
            userRole: "architect",
            finishDate: new Date(2024, 10, 28)
        }

        this.newProject(defaultData)
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }


    getTaskByDescription(projectName: string, taskDescription: string) {
        const project = this.list.find((project) => {
            return project.name === projectName
        })

        if (project) {
            const task = project.toDoList.find((task) => {
                return task.description === taskDescription
            })
            return task
        }
        else { return }

    }

    editTaskStatus(projectName: string, taskDescription: string, newStatus: TaskStatus) {
        this.getTaskByDescription(projectName, taskDescription)!.status = newStatus

    }

    totalCostOfProjects() {
        const initialCost: number = 0
        const sumWithInitialCost: number = this.list.reduce(
            (accumulator, currentValue) => accumulator + currentValue.cost, initialCost
        )

        return sumWithInitialCost
    }

    deleteProject(id: string) {
        const project = this.getProject(id)
        if (!project) { return }
        project.ui.remove()
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })

        this.list = remaining
    }

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }
        })

        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])

        })
        input.click
    }
}