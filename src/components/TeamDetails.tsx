import { useState, useEffect, FormEvent, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import TeamService from "../services/team.service";
import AssessmentService from "../services/assessment.service";
import MaturityModelService from "../services/maturity-model.service";
import AuthService from "../services/auth.service";
import { ITeam } from "../types/team.type.ts";
import { IAssessment } from "../types/assessment.type.ts";
import { IMaturityModel } from "../types/maturity-model.type.ts";
import { IUser } from "../types/user.type.ts";

const TeamDetails = () => {
    const { id } = useParams();
    const [team, setTeam] = useState<ITeam | null>(null);
    const [assessments, setAssessments] = useState<IAssessment[]>([]);
    const [availableModels, setAvailableModels] = useState<IMaturityModel[]>([]);
    const [selectedModelId, setSelectedModelId] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [message, setMessage] = useState("");
    const [assessmentMessage, setAssessmentMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser] = useState<IUser | undefined>(AuthService.getCurrentUser());
    const [editingMember, setEditingMember] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    
    
    const [isCreatingModel, setIsCreatingModel] = useState(false);
    const [newModelName, setNewModelName] = useState("");
    const [createModelMessage, setCreateModelMessage] = useState("");
    const [newQuestions, setNewQuestions] = useState<Array<{text: string, levels: Array<{value: number, description: string}>}>>([]);
    const [currentQuestionText, setCurrentQuestionText] = useState("");

    const loadTeam = useCallback(() => {
        TeamService.getUserTeams().then(
            (response) => {
                const foundTeam = response.data.find((t: ITeam) => t.id === id);
                setTeam(foundTeam || null);
                setLoading(false);
            },
            () => {
                setMessage("Error loading team.");
                setLoading(false);
            }
        );
    }, [id]);

    const loadAssessments = useCallback(() => {
        if (id) {
            AssessmentService.getTeamAssessments(id).then(
                (response) => {
                    setAssessments(response.data);
                },
                (error) => {
                    console.error("Error loading assessments", error);
                }
            );
        }
    }, [id]);

    const loadModels = useCallback(() => {
        if (id) {
            MaturityModelService.getModelsByTeam(id).then(
                (response) => {
                    setAvailableModels(response.data);
                    if (response.data.length > 0 && response.data[0].id) {
                        setSelectedModelId(response.data[0].id);
                    }
                },
                (error) => {
                    console.error("Error loading models", error);
                }
            );
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadTeam();
            loadAssessments();
            loadModels();
        }
    }, [id, loadTeam, loadAssessments, loadModels]);

    const handleInvite = (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (id && inviteEmail) {
            setLoading(true);
            TeamService.inviteMember(id, inviteEmail).then(
                (response) => {
                    setMessage(response.data.message);
                    setInviteEmail("");
                    loadTeam();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage(resMessage);
                    setLoading(false);
                }
            );
        }
    };

    const handleStartAssessment = (e: FormEvent) => {
        e.preventDefault();
        setAssessmentMessage("");
        if (id && selectedModelId) {
            AssessmentService.startAssessment(id, selectedModelId).then(
                () => {
                    setAssessmentMessage("Assessment started successfully!");
                    loadAssessments();
                },
                (error) => {
                     const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setAssessmentMessage(resMessage);
                }
            );
        }
    };

    const handleUpdateRoles = (memberId: string) => {
        if (id && memberId && selectedRoles.length > 0) {
            TeamService.updateMemberRoles(id, memberId, selectedRoles).then(
                (response) => {
                    setMessage(response.data.message);
                    setEditingMember(null);
                    setSelectedRoles([]);
                    loadTeam();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage(resMessage);
                }
            );
        }
    };

    const handleCreateModel = (e: FormEvent) => {
        e.preventDefault();
        setCreateModelMessage("");

        if (id && newModelName && newQuestions.length > 0) {
            const newModel: IMaturityModel = {
                name: newModelName,
                teamId: id,
                questions: newQuestions
            };

            MaturityModelService.createModel(newModel).then(
                () => {
                    setCreateModelMessage("Model created successfully!");
                    setNewModelName("");
                    setNewQuestions([]);
                    setIsCreatingModel(false);
                    loadModels();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setCreateModelMessage(resMessage);
                }
            );
        } else if (newQuestions.length === 0) {
            setCreateModelMessage("Please add at least one question.");
        }
    };

    const addQuestion = () => {
        if (currentQuestionText.trim()) {
            const levels = [
                { value: 1, description: "Initial" },
                { value: 2, description: "Managed" },
                { value: 3, description: "Defined" },
                { value: 4, description: "Quantitatively Managed" },
                { value: 5, description: "Optimizing" }
            ];
            setNewQuestions([...newQuestions, { text: currentQuestionText, levels }]);
            setCurrentQuestionText("");
        }
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = [...newQuestions];
        updatedQuestions.splice(index, 1);
        setNewQuestions(updatedQuestions);
    };

    const handleLevelChange = (qIndex: number, lIndex: number, description: string) => {
        const updatedQuestions = [...newQuestions];
        updatedQuestions[qIndex].levels[lIndex].description = description;
        setNewQuestions(updatedQuestions);
    };

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    if (loading) {
        return <div className="text-white text-center mt-10">Loading team details...</div>;
    }

    if (!team) {
        return <div className="text-white text-center mt-10">Team not found.</div>;
    }

    return (
        <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
             <div className="mb-6">
                <Link to="/teams" className="text-indigo-400 hover:text-indigo-300">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <header className="mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-white">{team.name}</h1>
                <p className="mt-2 text-slate-400">Led by: <span className="text-white font-medium">
                    {team.owner.firstName && team.owner.lastName 
                        ? `${team.owner.firstName} ${team.owner.lastName}` 
                        : (team.owner.email || "Unknown")}
                </span></p>
            </header>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Team Members ({team.members.length})</h2>
                    <ul className="divide-y divide-slate-700">
                        {team.members.map((member) => (
                            <li key={member.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                                        {(member.firstName || member.email || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {member.firstName && member.lastName 
                                                ? `${member.firstName} ${member.lastName}` 
                                                : member.email}
                                        </p>
                                        <p className="text-xs text-slate-400">{member.email}</p>
                                    <div className="flex gap-1 mt-1">
                                        {member.roles && member.roles.map(role => (
                                            <span key={role} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                                                {role.replace('ROLE_', '').replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                    {editingMember === member.id && (
                                        <div className="mt-2 p-2 bg-slate-900 rounded border border-slate-700">
                                            <p className="text-xs text-slate-400 mb-2">Select Roles:</p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {['pmo', 'leader', 'user'].map(role => (
                                                    <label key={role} className="flex items-center space-x-1 text-xs text-slate-300 cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedRoles.includes(role)} 
                                                            onChange={() => toggleRole(role)}
                                                            className="rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span>{role === 'user' ? 'Member' : role.toUpperCase()}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => member.id && handleUpdateRoles(member.id)}
                                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-500"
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={() => setEditingMember(null)}
                                                    className="px-2 py-1 text-xs bg-slate-600 text-white rounded hover:bg-slate-500"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {(currentUser?.roles?.includes("ROLE_PMO") || currentUser?.id === team.owner.id) && (
                                    <button 
                                        onClick={() => {
                                            setEditingMember(member.id || null);
                                            
                                            const currentRoles: string[] = [];
                                            if (member.roles?.includes("ROLE_PMO")) currentRoles.push("pmo");
                                            if (member.roles?.includes("ROLE_TEAM_LEADER")) currentRoles.push("leader");
                                            if (member.roles?.includes("ROLE_TEAM_MEMBER")) currentRoles.push("user");
                                            setSelectedRoles(currentRoles);
                                        }}
                                        className="text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                        Edit Roles
                                    </button>
                                )}
                                {member.id === team.owner.id && (
                                    <span className="inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20">
                                        Owner
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 h-fit">
                    {(currentUser?.roles?.includes("ROLE_TEAM_LEADER") || currentUser?.roles?.includes("ROLE_PMO") || currentUser?.id === team.owner.id) ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-indigo-400">Invite Member</h2>
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                        placeholder="colleague@example.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Send Invitation
                                </button>
                            </form>
                            {message && (
                                <div className={`mt-4 p-2 rounded text-sm ${message.includes("success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                    {message}
                                </div>
                            )}
                        </>
                    ) : (
                         <div className="text-slate-400 text-sm">
                            Only team leaders can invite new members.
                         </div>
                    )}
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                     <h2 className="text-xl font-semibold mb-4 text-indigo-400">Assessments</h2>
                     {assessments.length === 0 ? (
                        <p className="text-slate-400">No assessments yet.</p>
                     ) : (
                        <ul className="divide-y divide-slate-700">
                            {assessments.map((assessment) => (
                                <li key={assessment.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-white">{assessment.maturityModel.name}</p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(assessment.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Link 
                                        to={`/assessments/${assessment.id}`}
                                        className="text-sm text-indigo-400 hover:text-indigo-300"
                                    >
                                        View / Continue
                                    </Link>
                                </li>
                            ))}
                        </ul>
                     )}
                </div>


                {(currentUser?.roles?.includes("ROLE_PMO") || currentUser?.id === team.owner.id) && (
                    <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-indigo-400">Team Maturity Models</h2>
                            <button
                                onClick={() => setIsCreatingModel(!isCreatingModel)}
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-500"
                            >
                                {isCreatingModel ? "Cancel" : "Create Model"}
                            </button>
                        </div>
                        
                        {createModelMessage && (
                            <div className="mb-4 p-2 bg-blue-900/50 text-blue-300 text-sm rounded">
                                {createModelMessage}
                            </div>
                        )}

                        {isCreatingModel && (
                            <form onSubmit={handleCreateModel} className="mb-6 p-4 bg-slate-900 rounded border border-slate-700">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Model Name</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newModelName}
                                        onChange={(e) => setNewModelName(e.target.value)}
                                        className="flex-1 rounded-md border-0 bg-slate-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                        placeholder="e.g. DevOps Maturity Model"
                                        required
                                    />
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Questions</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={currentQuestionText}
                                            onChange={(e) => setCurrentQuestionText(e.target.value)}
                                            className="flex-1 rounded-md border-0 bg-slate-800 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                            placeholder="Enter question text..."
                                        />
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {newQuestions.length > 0 && (
                                        <ul className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                                            {newQuestions.map((q, idx) => (
                                                <li key={idx} className="flex flex-col bg-slate-800 p-2 rounded border border-slate-700">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-sm text-slate-300 font-medium">{q.text}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeQuestion(idx)}
                                                            className="text-red-400 hover:text-red-300 text-xs ml-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <div className="space-y-1 pl-2 border-l-2 border-slate-700">
                                                        {q.levels.map((level, lIdx) => (
                                                            <div key={lIdx} className="flex items-center gap-2">
                                                                <span className="text-xs text-slate-500 w-4">{level.value}</span>
                                                                <input
                                                                    type="text"
                                                                    value={level.description}
                                                                    onChange={(e) => handleLevelChange(idx, lIdx, e.target.value)}
                                                                    className="flex-1 text-xs bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                                                    placeholder={`Level ${level.value} description`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Create Model
                                </button>
                            </form>
                        )}

                        <ul className="divide-y divide-slate-700">
                            {availableModels.map(model => (
                                <li key={model.id} className="py-3 flex justify-between items-center">
                                    <span className="text-white">{model.name}</span>
                                    <span className="text-xs text-slate-400">
                                        {model.questions.length} questions
                                    </span>
                                </li>
                            ))}
                            {availableModels.length === 0 && (
                                <li className="py-3 text-slate-400 text-sm">No models defined for this team.</li>
                            )}
                        </ul>
                    </div>
                )}

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 h-fit">
                    {(currentUser?.roles?.includes("ROLE_TEAM_LEADER") || currentUser?.roles?.includes("ROLE_PMO") || currentUser?.id === team.owner.id) ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-indigo-400">Start New Assessment</h2>
                            <form onSubmit={handleStartAssessment} className="space-y-4">
                                <div>
                                    <label htmlFor="model" className="block text-sm font-medium text-slate-300">Maturity Model</label>
                                    <select
                                        id="model"
                                        value={selectedModelId}
                                        onChange={(e) => setSelectedModelId(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                    >
                                        {availableModels.map(model => (
                                            <option key={model.id} value={model.id}>{model.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                >
                                    Start Assessment
                                </button>
                            </form>
                            {assessmentMessage && (
                                <div className={`mt-4 p-2 rounded text-sm ${assessmentMessage.includes("success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                                    {assessmentMessage}
                                </div>
                            )}
                        </>
                    ) : (
                         <div className="text-slate-400 text-sm">
                            Only team leaders can start new assessments.
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
