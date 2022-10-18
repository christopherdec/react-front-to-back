import { createContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import FeedbackData from "../data/FeedbackData";


const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {

    const [feedback, setFeedback] = useState(FeedbackData)

    const [feedbackEdit, setFeedbackEdit] = useState({
        selectedItem: {},
        onEditMode: false
    })

    const deleteFeedback = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    const updateFeedback = (id, newItem) => {
        setFeedback(feedback.map((item) => (
            item.id === id ? { ...item, ...newItem} : item
        )));
    }

    const addFeedback = (newFeedback) => {
        newFeedback.id = uuidv4()
        setFeedback([newFeedback, ...feedback])
    }

    const editFeedback = (selectedItem) => {
        setFeedbackEdit({
            selectedItem,
            onEditMode: true
        })
    }

    return <FeedbackContext.Provider value={{
        feedback, 
        feedbackEdit,
        deleteFeedback, 
        addFeedback, 
        editFeedback, 
        updateFeedback
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext;