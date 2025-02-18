"use client"
import { ScrollArea } from "../ui/scroll-area"
import { useState } from "react";
import Question from "./Question";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
const Questions = ({ques,qid})=>{
    const [questions, setQuestions] = useState(ques);
    const { token } = useAuth();
    const handleDelete = async (questionToDelete,qid) => {
        try {
            const response = await axios.delete('https://quizo-orpin.vercel.app/api/deleteQuestion', {
                data: {
                    quizid: qid,
                    questionid: questionToDelete.id,
                },
                headers: {
                    Authorization: token,
                },
            });
    
            if (response.status === 200) {
                setQuestions(questions.filter(q => q.id !== questionToDelete.id));
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const handleEdit = (updatedQuestion, originalQuestion) => {
        setQuestions(questions.map(q => 
            q === originalQuestion ? updatedQuestion : q
        ));
    };
    return (
        
        <ScrollArea className="w-full h-[calc(85vh)] px-4">
            {questions.map((question, index) => (
                <Question
                    key={index}
                    qid={qid}
                    question={question}
                    onDelete={handleDelete}
                    onEdit={(updatedQuestion) => handleEdit(updatedQuestion, question)}
                />
            ))}
        </ScrollArea>
    )
}

export default Questions;