import { motion, AnimatePresence } from 'framer-motion'
import { useContext } from "react";
import FeedbackItem from "./FeedbackItem"
import PropTypes from 'prop-types'
import FeedbackContext from "../context/FeedbackContext";
import Spinner from './shared/Spinner';

function FeedbackList() {

  const { feedback, loading } = useContext(FeedbackContext);

  if (loading) {
    return <Spinner/>
  } else if (!feedback || feedback.length === 0) {
    return <p>No Feedback yet</p>
  }

  return (
    <div className="feedback-list">
      <AnimatePresence>
        {feedback.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <FeedbackItem
                key={item.id}
                item={item}
                />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default FeedbackList