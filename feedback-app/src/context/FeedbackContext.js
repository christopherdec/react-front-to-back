import { createContext, useState, useEffect } from "react";
//import { v4 as uuidv4 } from 'uuid';
//import FeedbackData from "../data/FeedbackData";


const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {

    const [loading, setLoading] = useState(true);

    const [feedback, setFeedback] = useState([])

    const [feedbackEdit, setFeedbackEdit] = useState({
        selectedItem: {},
        onEditMode: false
    })

    useEffect(() => {
        fetchFeedback();
    }, [])

    const fetchFeedback = async () => {
        const response = await fetch("/feedback?_sort=id&_order=desc");
        const data = await response.json();
        setFeedback(data);
        setLoading(false);
    }

    const deleteFeedback = async (id) => {
        if (window.confirm('Are you sure you want to delete?')) {

            await fetch(`/feedback/${id}`, { method: 'DELETE' })

            setFeedback(feedback.filter((item) => item.id !== id))
        } 
    }

    const updateFeedback = async (id, newItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem)
        })

        const data = await response.json()

        setFeedback(feedback.map((item) => (
            item.id === id ? { ...item, ...data} : item
        )));
    }

    const addFeedback = async (newFeedback) => {
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        })
        const data = await response.json();
        setFeedback([data, ...feedback])

        //newFeedback.id = uuidv4()
        //setFeedback([newFeedback, ...feedback])
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
        loading,
        deleteFeedback, 
        addFeedback, 
        editFeedback, 
        updateFeedback
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext;