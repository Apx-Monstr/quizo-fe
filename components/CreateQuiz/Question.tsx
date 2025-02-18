"use client"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import IconButton from './Icon Button';
import { Edit, Trash2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EditQuestion from './EditQuestion';
const Question = ({ 
    question, 
    onDelete, 
    onEdit,
    qid
}) => {
    const getCorrectOptionText = () => {
        const correctOpt = question.options[question.correctOption];
        return correctOpt || "Not selected";
    };
    console.log(question.quesid)
    return (
        <Card className="mb-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{question.ques}</h3>
                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger>
                                <IconButton className='bg-gray-200'>
                                    <Edit className="h-4 w-4 stroke-[#292137]"/>
                                </IconButton>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Edit Question   
                                    </DialogTitle>
                                </DialogHeader>
                                <EditQuestion 
                                    qid={qid}
                                    questionData={question}
                                    onDone={(updatedQuestion:string) => {
                                        onEdit?.(updatedQuestion);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                        <IconButton 
                            className="bg-red-300 hover:bg-rose-500"
                            onClick={() => onDelete?.(question,qid)}
                        >
                            <Trash2 className="h-4 w-4 stroke-white"/>
                        </IconButton>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {Object.entries(question.options).map(([key, value]) => (
                    <div 
                        key={key}
                        className={`p-3 rounded-lg ${
                            parseInt(key) === question.correctOption 
                                ? 'bg-green-100 border border-green-300' 
                                : 'bg-gray-100'
                        }`}
                    >
                        {value as string}
                    </div>
                ))}
                <div className="text-sm font-medium text-gray-600">
                    Correct Answer: {getCorrectOptionText()}
                </div>
            </CardContent>
        </Card>
    );
};

export default Question;