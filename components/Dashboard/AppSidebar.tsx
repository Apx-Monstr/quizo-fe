"use client"
import { useState, useEffect } from "react";
import { Book,Home,LogOut } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';

interface Quiz {
  id: string; // Assuming qid is a string, change to number if needed
  title: string;
  url: string;
  icon: React.ElementType; // Book is likely an icon component
}


export function AppSidebar({activeQuizId}:{activeQuizId?:string}) {
  const [quizItems, setQuizItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, currentUser, logout } = useAuth();
  const router = useRouter();

  // Static menu items
  const handleLogout = () => {
    logout();
    router.push("/");
  };
  const staticItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
    },
  ];
  const defaultQuizData = {
    title: "Give a title",
    optionshuffleEnabled: false,
    questionshuffleEnabled: false,
    ques: [],
  };
  const fetchQuizTitles = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      axios.get("https://quizo-orpin.vercel.app/api/quizTitles", {
        headers: {
            Authorization: `${token}`
        }
      })
      .then(response => {
          // Transform the quiz items to include an icon
          const transformedQuizItems = response.data.map(quiz => ({
              id: quiz.qid,
              title: quiz.qtitle === "Give a title" ? "New Quiz" : quiz.qtitle,
              url: `/quiz/${quiz.qid}`,
              icon: Book 
          }));
          console.log(response.data);
          setQuizItems(transformedQuizItems);
          setLoading(false);
      })
    } catch (err) {
      console.error("Failed to fetch quiz titles:", err);
      setError("Failed to load quizzes. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuizTitles();
  }, [token]);
  const handleAddQuiz = async () => {
    try {
      const response = await axios.post(
        "https://quizo-orpin.vercel.app/api/quizes",
        defaultQuizData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      fetchQuizTitles();
  
      const newQuizId = response.data.id;
  
      router.push(`/quiz/${newQuizId}`);
  
    } catch (err) {
      console.error("Failed to add new quiz:", err);
      alert("Failed to add new quiz. Please try again later.");
    }
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staticItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Quizzes</SidebarGroupLabel>
          <SidebarGroupContent>
          {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 p-2 text-sm">{error}</div>
            ) : quizItems.length > 0 ? (
              <SidebarMenu className="gap-2">
              <Button onClick={handleAddQuiz}>
                Add Quiz
              </Button>
                {quizItems.map((quiz) => (
                  <SidebarMenuItem key={quiz.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={activeQuizId === quiz.id}
                    >
                      <a href={quiz.url}>
                        <quiz.icon />
                        <span>{quiz.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="text-gray-500 p-2 text-sm">No quizzes available</div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-4 border-t border-gray-200 flex flex-col items-center text-center">
          {currentUser && (
            <div className="mb-2 text-sm font-semibold">
              {currentUser.fname} {currentUser.lname}
            </div>
          )}
          <Button onClick={handleLogout} className="w-full flex items-center gap-2">
            <LogOut /> Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}