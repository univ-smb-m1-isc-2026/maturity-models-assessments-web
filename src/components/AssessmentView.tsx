import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AssessmentService from "../services/assessment.service";
import { IAssessment, IAnswer } from "../types/assessment.type";

const AssessmentView = () => {
    const { id } = useParams();
    const [assessment, setAssessment] = useState<IAssessment | null>(null);
    const [answers, setAnswers] = useState<IAnswer[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (id) {
            loadAssessment();
        }
    }, [id]);

    const loadAssessment = () => {
        setLoading(true);
        AssessmentService.getAssessment(id!).then(
            (response) => {
                const fetchedAssessment = response.data;
                setAssessment(fetchedAssessment);
                
                const questions = fetchedAssessment.maturityModel.questions;
                const existingAnswers = fetchedAssessment.answers || [];
                
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
    };

    const handleAnswerChange = (index: number, field: keyof IAnswer, value: any) => {
        const newAnswers = [...answers];
        newAnswers[index] = { ...newAnswers[index], [field]: value };
        setAnswers(newAnswers);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        
        if (assessment && id) {
            const updatedAssessment = { ...assessment, answers: answers };
            AssessmentService.updateAssessment(id, updatedAssessment).then(
                (response) => {
                    setMessage("Assessment saved successfully!");
                    setAssessment(response.data);
                },
                (error) => {
                    console.error("Error saving assessment", error);
                    setMessage("Error saving assessment.");
                }
            );
        }
    };

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
