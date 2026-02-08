import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import AssessmentService from "../services/assessment.service";
import AuthService from "../services/auth.service";
import { IAssessment, IAnswer, ISubmission } from "../types/assessment.type";

const AssessmentView = () => {
    const { id } = useParams();
    const [assessment, setAssessment] = useState<IAssessment | null>(null);
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const currentUser = AuthService.getCurrentUser();

    const loadAssessment = useCallback(() => {
        AssessmentService.getAssessment(id!).then(
            (response) => {
                const fetchedAssessment = response.data;
                setAssessment(fetchedAssessment);
                
                const questions = fetchedAssessment.maturityModel.questions;

                const mySubmission = fetchedAssessment.submissions?.find(
                    (s: ISubmission) => s.userId === currentUser.id
                );
                
                const existingAnswers = mySubmission?.answers || [];
                
                const initializedAnswers = questions.map(q => {
                    const found = existingAnswers.find(a => a.questionText === q.text);
                    return found || { questionText: q.text, selectedLevel: 0, comment: "" };
                });
                
                setAnswers(initializedAnswers);
                setLoading(false);
            },
            (error) => {
                console.error("Error loading assessment", error);
                setMessage("Error loading assessment.");
                setLoading(false);
            }
        );
    }, [id, currentUser.id]);

    useEffect(() => {
        if (id) {
            loadAssessment();
        }
    }, [id, loadAssessment]);

    const handleAnswerChange = (index: number, field: keyof IAnswer, value: string | number) => {
        const newAnswers = [...answers];
        newAnswers[index] = { ...newAnswers[index], [field]: value };
        setAnswers(newAnswers);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        
        if (assessment && id) {
            AssessmentService.submitAssessment(id, answers).then(
                () => {
                    setMessage("Assessment submitted successfully!");
                    loadAssessment();
                },
                (error) => {
                    console.error("Error saving assessment", error);
                    setMessage("Error saving assessment.");
                }
            );
        }
    };

    const chartData = assessment?.maturityModel.questions.map(q => {
        const submissions = assessment.submissions || [];
        const dataPoint: Record<string, string | number> = { subject: q.text, fullMark: 5 };
        
        let totalScore = 0;
        let count = 0;
        
        submissions.forEach(sub => {
            const ans = sub.answers.find(a => a.questionText === q.text);
            if (ans) {
                totalScore += ans.selectedLevel;
                count++;
                dataPoint[sub.userId] = ans.selectedLevel;
            }
        });
        
        const avg = count > 0 ? totalScore / count : 0;
        dataPoint["Average"] = parseFloat(avg.toFixed(1));
        return dataPoint;
    }) || [];

    const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"];

    if (loading) return <div className="text-white text-center mt-10">Loading assessment...</div>;
    if (message && !assessment) return <div className="text-center mt-10 text-red-400">{message}</div>;
    if (!assessment) return <div className="text-white text-center mt-10">Assessment not found.</div>;

    return (
        <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
            <div className="mb-6">
                <Link to={`/teams/${assessment.team.id}`} className="text-indigo-400 hover:text-indigo-300">
                    &larr; Back to Team
                </Link>
            </div>

            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    Assessment: {assessment.maturityModel.name}
                </h1>
                <p className="mt-2 text-slate-400">
                    Team: <span className="text-white font-medium">{assessment.team.name}</span>
                </p>
                <p className="text-slate-400">
                    Date: {new Date(assessment.date).toLocaleDateString()}
                </p>
            </header>


            <div className="mb-12 bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">Team Maturity Radar</h2>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#475569" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#e2e8f0', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                            {assessment.submissions?.map((sub, idx) => (
                                <Radar
                                    key={sub.userId}
                                    name={`Participant ${idx + 1}`}
                                    dataKey={sub.userId}
                                    stroke={colors[idx % colors.length]}
                                    fill={colors[idx % colors.length]}
                                    fillOpacity={0.1}
                                />
                            ))}
                            <Radar name="Team Average" dataKey="Average" stroke="#ffffff" fill="#ffffff" fillOpacity={0.0} strokeWidth={3} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {assessment.maturityModel.questions.map((question, index) => (
                    <div key={index} className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                        <h3 className="text-lg font-medium text-white mb-4">{question.text}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Maturity Level</label>
                                <div className="space-y-2">
                                    {question.levels.map((level) => (
                                        <div key={level.value} className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id={`q${index}-l${level.value}`}
                                                    name={`q${index}`}
                                                    type="radio"
                                                    checked={answers[index]?.selectedLevel === level.value}
                                                    onChange={() => handleAnswerChange(index, "selectedLevel", level.value)}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={`q${index}-l${level.value}`} className="font-medium text-white">
                                                    Level {level.value}
                                                </label>
                                                <p className="text-slate-400">{level.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor={`comment-${index}`} className="block text-sm font-medium text-slate-300">Comments</label>
                                <textarea
                                    id={`comment-${index}`}
                                    rows={3}
                                    value={answers[index]?.comment || ""}
                                    onChange={(e) => handleAnswerChange(index, "comment", e.target.value)}
                                    className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Add any observations or evidence..."
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-end gap-x-6">
                    <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-white hover:text-indigo-300"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                    <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                        Save Assessment
                    </button>
                </div>
                
                {message && (
                    <div className={`mt-4 p-4 rounded text-center ${message.includes("success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AssessmentView;
