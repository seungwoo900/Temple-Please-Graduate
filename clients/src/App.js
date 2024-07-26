import ListHeader from "./components/ListHeader"
import Auth from "./components/Auth"
import ListItem from "./components/ListItem"
import AddCourse from "./components/AddCourse"
import {useEffect, useState} from "react"
import { useCookies } from "react-cookie"

const App = () => {
  const [cookies, setCookies, removeCookies] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  const [courses, setCourses] = useState(null)

  const getData = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${userEmail}`)
      const json = await response.json()
      console.log(json)
      setCourses(json)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteCourse = async (courseID) => {
    try {
      await fetch(`${process.env.REACT_APP_SERVERURL}/delete-course/${courseID}`, {
        method: 'DELETE',
      })
      getData()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(authToken) {
      getData()
    }
  }, [])

  console.log(courses)

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
      <ListHeader listName={'Check your Biology courses to take'} completedCourses={courses} />
      <AddCourse userEmail={userEmail} getData={getData} courses={courses}/>
      <h2 className="completed-courses">Completed Courses</h2>
      {courses?.map((course) => <ListItem key={course.id} course={course} onDelete={handleDeleteCourse}/>)}
        </>
      }
      <p className="copyright">Seungwoo Lee</p>
    </div>
  )
}

export default App
