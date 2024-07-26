const ListItem = ({ course, onDelete }) => {

    const handleDeleteClick = () => {
      const confirmed = window.confirm(`Are you sure you want to delete ${course.subject}?`)
      if(confirmed) {
        onDelete(course.id)
      }
    }

    return (
      <div className="list-item">
        <div className="course-detail">
          <span className="course-subject">{course.subject}</span>
          <span className="course-title">{course.title}</span>
          <span className="course-credits">{course.credits} Credits</span>
        </div>
        <button className="deleteButton" onClick={handleDeleteClick}>Delete</button>
      </div>
    )
}
  
export default ListItem
  