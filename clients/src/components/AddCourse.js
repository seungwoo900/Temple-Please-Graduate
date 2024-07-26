import { useState } from "react"

const AddCourse = ({userEmail, getData, courses}) => {

    const [courseCode, setCourseCode] = useState('')
    const [searchResult, setSearchResult] = useState(null)

    const handleSearch = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/search/${courseCode}`)
            const result = await response.json()
            setSearchResult(result)
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddCourse = async (course) => {

      const isCourseInDatabase = courses.some(existingCourse => existingCourse.subject === course.subject)

       if (!isCourseInDatabase) {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/add-course`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userEmail,
                  subject: course.subject,
                  title: course.title,
                  credits: course.credits,
              }),
            })
            console.log(await response.json())
            setSearchResult(null)
            getData()
        } catch (error) {
            console.error(error)
        }
      } else {
           window.alert('This course has already been added')
      }

  }

    return (
        <div className="add-course">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="BIOL 1111"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
            />
            <button type="submit" className="searchButton">Search</button>
          </form>
          {searchResult && (
            <div className="search-results">
              {searchResult.length > 0 ? (
                searchResult.map((course) => (
                  <div key={course.id} className="course-container">
                    <div className="course-detail">
                        <span className="course-subject">{course.subject}</span>
                        <span className="course-title">{course.title}</span>
                        <span className="course-credits">{course.credits} Credits</span>
                    </div>
                    <button onClick={() => handleAddCourse(course)} className="addButton">Add Course</button>
                  </div>
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          )}
        </div>
    )
}
  
export default AddCourse
