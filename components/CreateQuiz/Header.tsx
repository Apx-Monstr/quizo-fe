"use client"
import { useState } from 'react';
import EditableTitle from "./EditableTitle"
import { ExternalLink, Shuffle, ArrowDownUp, CirclePlus, Trash2 } from 'lucide-react';
import AddQuestion from './AddQuestion';
import IconButton from './Icon Button';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'; // Import axios
import { useAuth } from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
interface Props {
    qid: string;
    title: string;
    onAddQuestion:VoidFunction// Function that takes an ID and new text
  }
const Header = ({title, qid, onAddQuestion}:Props) => {
    const router = useRouter();
    const [isQuestionShuffleActive, setIsQuestionShuffleActive] = useState(false);
    const [isOptionShuffleActive, setIsOptionShuffleActive] = useState(false);
    const quizTitle = title;
    const {token} = useAuth()
    const handleTitleChange = async (newTitle:string) => {
        try {
            const response = await axios.put(`https://quizo-orpin.vercel.app/api/editTitle/${qid}`, {
                title: newTitle,
                headers: {
                    Authorization: token,
                },
            });

            console.log('Title updated:', response.data.title);
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };
    const handleDeleteQuiz = async (quizId:string) => {
        try {
          await axios.delete(`https://quizo-orpin.vercel.app/api/delete/${quizId}`, {
            headers: {
              Authorization: token,
            },
          });
          router.push("/dashboard");
          alert("Quiz deleted successfully!");
      
        } catch (err) {
          console.error("Failed to delete quiz:", err);
          alert("Failed to delete quiz. Please try again later.");
        }
      };
    return (
        <div className="flex gap-4 pb-4">
            <EditableTitle initialText={quizTitle} onTextChange={handleTitleChange} />
            <IconButton 
                isToggleable
                isActive={isQuestionShuffleActive}
                onClick={() => setIsQuestionShuffleActive(!isQuestionShuffleActive)}
                tooltip='Question Shuffle'
            >
                <Shuffle className="stroke-white"/>
            </IconButton>
            <IconButton 
                isToggleable
                isActive={isOptionShuffleActive}
                onClick={() => setIsOptionShuffleActive(!isOptionShuffleActive)}
                tooltip='Option Shuffle'
            >
                <ArrowDownUp className="stroke-white"/>
            </IconButton>
            <IconButton
                tooltip='Preview Quiz'
            >
                <ExternalLink className="stroke-white"/>
            </IconButton>

            <Dialog>
                <DialogTrigger>
                    <IconButton
                        // tooltip='Add Question'
                    >
                        <CirclePlus className="stroke-white"/>
                    </IconButton>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add Question
                        </DialogTitle>
                    </DialogHeader>
                    <AddQuestion onDone={onAddQuestion} qid={qid}/>
                </DialogContent>
            </Dialog>
            <IconButton onClick={() => handleDeleteQuiz(qid)}>
                <Trash2 className='stroke-white'/>
            </IconButton>
            {/* <IconButton
                tooltip='Save Quiz'
            >
                <Save className="stroke-white"/>
            </IconButton> */}
        </div>
    );
};

export default Header;
