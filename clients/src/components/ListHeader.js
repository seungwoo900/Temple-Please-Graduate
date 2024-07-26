import { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from 'react-modal'

const ListHeader = ({listName, completedCourses}) => {
  const [cookies, setCookies, removeCookies] = useCookies(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nextCoursesToTake, setNextCoursesToTake] = useState([]);

  const checkMajors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}`)
      const majors = await response.json()

      // Filter out courses that have already been completed
      const nextCoursesToTake = majors.filter(course => !completedCourses.some(completed => completed.subject === course.subject));
      console.log("Next Courses to Take:", nextCoursesToTake);

      setNextCoursesToTake(nextCoursesToTake)
      setModalIsOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const signOut = () => {
    console.log('signout')
    removeCookies('Email')
    removeCookies('AuthToken')
    window.location.reload()
  }

  return (
    <div className="list-header">
      <h1>{listName}</h1>
      <button className="signout" onClick={signOut}>SIGN OUT</button>
      <button className="check-button" onClick={checkMajors}>Check</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="Modal_content"
        overlayClassName="Modal_overlay"
        contentLabel='Next Courses to Take'
      >
        <div className="Modal_header">
          <h2 className="Modal_title">Next Courses to Take</h2>
          <button className="Modal_close" onClick={() => setModalIsOpen(false)}>×</button>
        </div>
        {nextCoursesToTake.length > 0 ? (
          <div className="list-item course-list">
            {nextCoursesToTake.map((course, index) => (
              <p key={index}>
                <span className="check-subject">{course.subject}</span>
                <span className="check-title">{course.title}</span>
                <span className="check-credits">{course.credits} Credits</span>
              </p>
            ))}
          </div>
        ) : (
          <p>You have completed all required courses.</p>
        )}
      </Modal>
    </div>
  )
}
  
export default ListHeader
  