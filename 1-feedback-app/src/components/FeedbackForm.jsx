import {useContext, useState, useEffect} from 'react'
import RatingSelect from './RatingSelect'
import Button from './shared/Button'
import Card from "./shared/Card"
import FeedbackContext from "../context/FeedbackContext";

function FeedbackForm() {

    const [text, setText] = useState('')
    const [rating, setRating] = useState(10)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [message, setMessage] = useState('')

    const {addFeedback, feedbackEdit, updateFeedback} = useContext(FeedbackContext);

    useEffect(() => {
        if (feedbackEdit.onEditMode) {
            setText(feedbackEdit.selectedItem.text)
            setRating(feedbackEdit.selectedItem.rating)
        }
    }, [feedbackEdit])

    const handleTextChange = (e) => {
        let newText = e.target.value
        if (newText === '') {
            setBtnDisabled(true)
            setMessage(null)
        } else if (newText !== '' && newText.trim().length < 10) {
            setBtnDisabled(true)
            setMessage('The review must contain at least 10 characters')
        } else {
            setBtnDisabled(false)
            setMessage(null)
        }
        setText(newText)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.trim().length >= 10) {
            const newFeedback = {
                text,
                rating
            }
            if (feedbackEdit.onEditMode === true) {
                updateFeedback(feedbackEdit.selectedItem.id, newFeedback)
            } else {
                addFeedback(newFeedback);
            }
            setText('');
            setBtnDisabled(true);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit}>
                <h2>How would you rate your service with us?</h2>
                <RatingSelect select={(rating) => setRating(rating)} selected={rating}/>
                <div className="input-group">
                    <input type="text" placeholder="Write a review" onChange={handleTextChange} value={text}/>
                    <Button type="submit" version='secondary' isDisabled={btnDisabled}>
                        Send
                    </Button>
                </div>
                {message && <div>{message}</div>}
            </form>
        </Card>
    )
}

export default FeedbackForm