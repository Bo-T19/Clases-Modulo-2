import { IProject, ProjectStatus, UserRole, Project } from "./class/Project"
import { ProjectManager, ICompleteProject } from "./class/ProjectsManager"
import { ToDo, IToDo, TaskStatus } from "./class/ToDo"



function toggleModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        modal.open ? modal.close() : modal.showModal()
    }
    else {
        console.warn("The provided modal wasn't found. ID: ", id)
    }
}



const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectManager(projectsListUI)
let toDoUIList: HTMLElement[] = []

projectsManager.defaultProject()

//This document object is privided by the browser, its main purpose is to help us interact
const newProjectBtn = document.getElementById("new-project")

if (newProjectBtn !== null) {
    newProjectBtn.addEventListener("click", () => toggleModal("new-project-modal"))
}
else {
    console.warn("New projects button was not found")
}

const projectForm = document.getElementById("new-project-form")


if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectForm)

        const projectData: IProject =
        {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("role") as UserRole,
            finishDate: new Date(formData.get("date") as string)
        }

        try {
            const myProject = projectsManager.newProject(projectData)
            projectForm.reset()
            toggleModal("new-project-modal")

        }
        catch (error) {
            alert(error)
        }

        
    })

    const cancelButton = document.getElementById("form-cancel-button")

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            projectForm.reset()
            toggleModal("new-project-modal")
        })
    }
    else {
        console.warn("Cancel button was not found")
    }

}
else {
    console.warn("The project form was not found. Check the ID!")
}




//This code is for updating the project from the datails page

const editProjectBtn = document.getElementById("edit-project")

if (editProjectBtn !== null) {

    editProjectBtn.addEventListener("click", () => {
        toggleModal("edit-project-modal")

    }
    )

}
else {
    console.warn("Edit projects button was not found")
}

const editProjectForm = document.getElementById("edit-project-form")


if (editProjectForm && editProjectForm instanceof HTMLFormElement) {


    editProjectForm.addEventListener("submit", (e) => {
        e.preventDefault()


        const projectToBeEditedContainer = document.querySelector("[data-project-info='name']")!
        const projectToBeEditedName: string = projectToBeEditedContainer.textContent!
        const projectToBeEdited: Project = projectsManager.getProjectByName(projectToBeEditedName)!

        const formData = new FormData(editProjectForm)

        const newProjectData: ICompleteProject =
        {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("role") as UserRole,
            finishDate: new Date(formData.get("date") as string),
            cost: formData.get("cost") as unknown as number,
            progress: formData.get("progress") as unknown as number
        }
        try {
            projectsManager.editProject(projectToBeEdited, newProjectData)
            editProjectForm.reset()
            toggleModal("edit-project-modal")

            
        }
        catch (error) {
            alert(error)
        }

    })

    const cancelButton = document.getElementById("edit-form-cancel-button")

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            editProjectForm.reset()
            toggleModal("edit-project-modal")
            
        })
    }
    else {
        console.warn("Cancel button was not found")
    }


}
else {
    console.warn("The project form was not found. Check the ID!")
}




//This code is for adding a new task

const newToDoBtn = document.getElementById("add-todo")

if (newToDoBtn !== null) {

    newToDoBtn.addEventListener("click", () => {
        toggleModal("new-todo-modal")

    }
    )

}
else {
    console.warn("New to do button was not found")
}


const newToDoForm = document.getElementById("new-todo-form")

if (newToDoForm && newToDoForm instanceof HTMLFormElement) {


    newToDoForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const projectToBeEditedContainer = document.querySelector("[data-project-info='name']")!
        const projectToBeEditedName: string = projectToBeEditedContainer.textContent!
        const projectToBeEdited: Project = projectsManager.getProjectByName(projectToBeEditedName)!

        const formData = new FormData(newToDoForm)

        const newToDoData: IToDo =
        {
            description: formData.get("description") as string,
            status: formData.get("status") as TaskStatus,
            date: new Date(formData.get("date") as string),

        }
        try {
            projectsManager.addToDo(projectToBeEdited, newToDoData)
            newToDoForm.reset()
            toggleModal("new-todo-modal")
            console.log(projectsManager.list)
        }
        catch (error) {
            alert(error)
        }

    })

    const cancelButton = document.getElementById("new-todo-cancel-button")

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            newToDoForm.reset()
            toggleModal("new-todo-modal")
        })
    }
    else {
        console.warn("Cancel button was not found")
    }


}
else {
    console.warn("The project form was not found. Check the ID!")
}




//This code is for the import projects option

const uploadBtn= document.getElementById("upload")

if (uploadBtn !== null) {
    uploadBtn.addEventListener("click", () => projectsManager.importFromJSON())
}
else {
    console.warn("Upload projects button not found")
}

//This code is for de export projects option

const downloadBtn= document.getElementById("download")

if (downloadBtn !== null) {
    downloadBtn.addEventListener("click", () => projectsManager.exportToJSON())
}
else {
    console.warn("Download projects button not found")
}


const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")
const homeButton = document.getElementById("home button")

if (homeButton && projectsPage && detailsPage) {
    homeButton.addEventListener("click", () => {
        projectsPage.style.display = "flex"
        detailsPage.style.display = "none"
    }
    )
}