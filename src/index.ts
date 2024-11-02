import { IProject, ProjectStatus, UserRole } from "./class/Project"
import { ProjectManager } from "./class/ProjectsManager"



function toggleModal(id: string)
{
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement)
    {
        modal.open ? modal.close() : modal.showModal()
    }
    else
    {
        console.warn("The provided modal wasn't found. ID: ", id)
    }   
}



const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectManager(projectsListUI)
projectsManager.defaultProject()

//This document object is privided by the browser, its main purpose is to help us interact
const newProjectBtn = document.getElementById("new-project")

if(newProjectBtn !== null) 
{
    newProjectBtn.addEventListener("click", () => toggleModal("new-project-modal"))    
}
else
{
    console.warn("New projects button was not found")   
}

const projectForm = document.getElementById("new-project-form")


if(projectForm && projectForm instanceof HTMLFormElement)
{
    projectForm.addEventListener("submit", (e) => 
        {
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

            try
            {
                const myProject = projectsManager.newProject(projectData)
                projectForm.reset()
                toggleModal("new-project-modal")
            }
            catch(error)
            {
                alert(error)
            }

        })

    const cancelButton = document.getElementById("form-cancel-button")
  
    if(cancelButton) 
        {
            cancelButton.addEventListener("click", ()=>
                {
                    projectForm.reset()
                    toggleModal("new-project-modal")
                }) 
        }
    else
        {
            console.warn("Cancel button was not found")   
        }





}
else
{
    console.warn("The project form was not found. Check the ID!")
}


const projectsPage = document.getElementById("projects-page")
const detailsPage = document.getElementById("project-details")


const homeButton = document.getElementById("home button")
if(homeButton && projectsPage && detailsPage){
homeButton.addEventListener("click", ()=>
{   projectsPage.style.display = "flex"
    detailsPage.style.display = "none"
}
)}