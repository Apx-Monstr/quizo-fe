"use client"
import Header from "./Header";
import Questions from "./Questions";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have shadcn skeleton component

const Edit = ({ qid }) => {
    const { token } = useAuth();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchQuiz = useCallback(async () => {
        if (!token) {
            setError("Unauthorized. Please log in.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`https://quizo-orpin.vercel.app/api/quiz/${qid}`, {
                headers: {
                    Authorization: token,
                },
            });
            setQuiz(response.data);
            console.log("Quiz fetched:", response.data.ques);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch quiz.");
        } finally {
            setLoading(false);
        }
    }, [qid, token]);
    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);
    const handleRefresh = () => {
        fetchQuiz();
    };
    if (loading) {
        return (
            <div className="flex-1 flex flex-col p-4 space-y-4">
                <Skeleton className="h-10 w-1/2" /> {/* Skeleton for header title */}
                <Skeleton className="h-40 w-full" /> {/* Skeleton for question area */}
                <Skeleton className="h-8 w-1/4" /> {/* Skeleton for answer options */}
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-12 w-1/3 mt-4" /> {/* Skeleton for submit button */}
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex-1 flex flex-col ">
            <Header onAddQuestion={handleRefresh} title={quiz?.title} qid={qid} />
            <div className="flex-1 flex items-center justify-center">
                <Questions qid={qid} ques={quiz.ques} />
            </div>
        </div>
    );
};

export default Edit;