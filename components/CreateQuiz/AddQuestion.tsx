"use client"
import React, { useState } from 'react';
import { PlusCircle, Trash2 } from "lucide-react";
import EditableTitle from "./EditableTitle";
import IconButton from "./Icon Button";
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button';

interface Props {
    id: string;
    text: string;
    onDelete: (id: string) => void;
    onTextChange: (id: string, newText: string) => void;
}

const Option = ({ id, text, onDelete, onTextChange }:Props) => {
    return (
        <div className="flex items-center gap-2 mb-2">
            <EditableTitle 
                initialText={text} 
                onTextChange={(newText :string) => onTextChange(id, newText)}
            />
            <IconButton 
                className="bg-red-300 hover:bg-rose-500 ml-2" 
                onClick={() => onDelete(id)}
            >
                <Trash2 className="h-4 w-4 stroke-white"/>
            </IconButton>
        </div>
    )
}

const AddQuestion = ({ onDone, qid }:{onDone:VoidFunction, qid:string}) => {
    const { token } = useAuth();
    const [questionText, setQuestionText] = useState("New Question");
    const [options, setOptions] = useState([
        { id: 1, text: "Option 1" },
        { id: 2, text: "Option 2" }
    ]);
    const [correctOption, setCorrectOption] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddOption = () => {
        const newId = Math.max(...options.map(opt => opt.id), 0) + 1;
        setOptions([...options, { id: newId, text: `Option ${newId}` }]);
    };

    const handleDeleteOption = (optionId:number) => {
        setOptions(options.filter(opt => opt.id !== optionId));
        if (correctOption === optionId) {
            setCorrectOption(null);
        }
    };

    const handleOptionTextChange = (optionId:number, newText:string) => {
        setOptions(options.map(opt => 
            opt.id === optionId ? { ...opt, text: newText } : opt
        ));
    };

    const handleQuestionTextChange = (newText:string) => {
        setQuestionText(newText);
    };

    const handleDone = async () => {
        if (!questionText.trim()) {
            alert("Please enter a question");
            return;
        }
        if (options.length < 2) {
            alert("Please add at least 2 options");
            return;
        }
        if (correctOption === null) {
            alert("Please select the correct option");
            return;
        }

        // Format options as required by the API
        const formattedOptions = options.reduce((acc, curr) => {
            acc[curr.id] = curr.text;
            return acc;
        }, {});

        const questionData = {
            quizid: qid,
            quesid: Date.now().toString(), // Generate a unique ID for the question
            ques: questionText,
            options: formattedOptions,
            correctOption: correctOption
        };

        try {
            setIsLoading(true);
            
            // Use axios instead of fetch
            const response = await axios.post('https://quizo-orpin.vercel.app/api/addQuestion', questionData, {
                headers: {
                    'Content-Type': 'application/json',
                    // If you're using authentication tokens, include them here
                    'Authorization': `${token}`,
                }
            });

            console.log('Question added successfully:', response.data);
            
            // Call the onDone callback with the server response if needed
            onDone?.(response.data.question);
        } catch (error) {
            console.error('Error adding question:', error);
            
            // Axios specific error handling
            const errorMessage = error.response?.data?.error || error.message || 'Failed to add question';
            alert(`Failed to add question: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
        onDone();
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            {/* <h2 className="text-xl font-bold mb-4">Add New Question</h2> */}
            
            <EditableTitle 
                initialText={questionText} 
                onTextChange={handleQuestionTextChange}
            />
            
            <div className="space-y-2">
                {options.map(option => (
                    <Option
                        key={option.id}
                        id={option.id}
                        text={option.text}
                        onDelete={handleDeleteOption}
                        onTextChange={handleOptionTextChange}
                    />
                ))}
            </div>
            <Button className='w-full' onClick={handleAddOption}>
                <PlusCircle/>
                Add Option
            </Button>

            <Select
                value={correctOption?.toString()}
                onValueChange={(value) => setCorrectOption(parseInt(value))}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Correct Option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                            {option.text.length > 20 
                                ? `${option.text.substring(0, 20)}...` 
                                : option.text}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                className='w-full'
                onClick={handleDone}
                disabled={isLoading}>
                {isLoading ? 'Creating Question...' : 'Create Question'}
            </Button>
        </div>
    )
}

export default AddQuestion;