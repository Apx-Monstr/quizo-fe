"use client"
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from "lucide-react";
import EditableTitle from "./EditableTitle";
import IconButton from "./Icon Button";
import { useRouter } from 'next/router'; // Import useRouter
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '../ui/button';

const Option = ({ id, text, onDelete, onTextChange }) => {
    return (
        <div className="flex items-center gap-2 mb-2">
            <EditableTitle 
                initialText={text} 
                onTextChange={(newText) => onTextChange(id, newText)}
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

const EditQuestion = ({ questionData, onDone,qid }) => {
    const {token} = useAuth(); // Extract quizid from URL
    const [questionText, setQuestionText] = useState(questionData.ques);
    const [options, setOptions] = useState(
        Object.entries(questionData.options).map(([id, text]) => ({
            id: parseInt(id),
            text
        }))
    );
    const [correctOption, setCorrectOption] = useState(questionData.correctOption);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddOption = () => {
        const newId = Math.max(...options.map(opt => opt.id), 0) + 1;
        setOptions([...options, { id: newId, text: `Option ${newId}` }]);
    };

    const handleDeleteOption = (optionId) => {
        if (options.length <= 2) {
            alert("A question must have at least 2 options");
            return;
        }
        setOptions(options.filter(opt => opt.id !== optionId));
        if (correctOption === optionId) {
            setCorrectOption(null);
        }
    };

    const handleOptionTextChange = (optionId, newText) => {
        setOptions(options.map(opt => 
            opt.id === optionId ? { ...opt, text: newText } : opt
        ));
    };

    const handleQuestionTextChange = (newText) => {
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

        const formattedOptions = options.reduce((acc, curr) => {
            acc[curr.id] = curr.text;
            return acc;
        }, {});

        questionData = {
            quizid: qid, // Use quizid from the URL
            quesid: questionData.quesid, // Assuming questionData contains an `id` field
            ques: questionText,
            options: formattedOptions,
            correctOption: correctOption
        };

        try {
            setIsLoading(true);

            const response = await axios.put('https://quizo-orpin.vercel.app/api/editQuestion', questionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`, // Adjust token handling as needed
                }
            });

            console.log('Question updated successfully:', response.data);
            onDone?.(response.data.question);
        } catch (error) {
            console.error('Error updating question:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update question';
            alert(`Failed to update question: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            {/* <h2 className="text-xl font-bold mb-4">Edit Question</h2> */}
            
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
            {/* <button 
                className="bg-blue-500 w-full rounded p-3 text-white hover:bg-blue-600 transition-colors"
                onClick={handleAddOption}
            >
                Add Option
            </button> */}

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

            <div className="flex gap-2">
                <Button variant={'secondary'} className='flex-1' onClick={() => onDone?.(questionData)}>
                    Cancel
                </Button>
                <Button className='flex-1' 
                    onClick={handleDone}
                    disabled={isLoading}>
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
                {/* <button 
                    className="flex-1 bg-gray-500 text-white rounded p-3 hover:bg-gray-600 transition-colors"
                    
                >
                    Cancel
                </button> */}
                {/* <button 
                    className={`flex-1 ${isLoading ? 'bg-gray-400' : 'bg-green-500'} text-white rounded p-3 hover:bg-green-600 transition-colors`}
                    
                >
                    
                </button> */}
            </div>
        </div>
    )
}

export default EditQuestion;
