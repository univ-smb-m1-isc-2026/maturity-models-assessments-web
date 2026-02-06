import { useState, useEffect, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import TeamService from "../services/team.service";
import AssessmentService from "../services/assessment.service";
import MaturityModelService from "../services/maturity-model.service";
import { ITeam } from "../types/team.type";
import { IAssessment } from "../types/assessment.type";
import { IMaturityModel } from "../types/maturity-model.type";

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

    useEffect(() => {
        if (id) {
            loadTeam();
            loadAssessments();
            loadModels();
        }
    }, [id]);

    const loadTeam = () => {
        setLoading(true);
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
    };

    const loadAssessments = () => {
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
    };

    const loadModels = () => {
        MaturityModelService.getAllModels().then(
            (response) => {
                setAvailableModels(response.data);
                if (response.data.length > 0) {
                    setSelectedModelId(response.data[0].id);
                }
            },
            (error) => {
                console.error("Error loading models", error);
            }
        );
    };

    const handleInvite = (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (id && inviteEmail) {
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
                <p className="mt-2 text-slate-400">Led by: <span className="text-white font-medium">{team.owner.username}</span></p>
            </header>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2 bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Team Members ({team.members.length})</h2>
                    <ul className="divide-y divide-slate-700">
                        {team.members.map((member) => (
                            <li key={member.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
                                        {member.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{member.username}</p>
                                        <p className="text-xs text-slate-400">{member.email}</p>
                                    </div>
                                </div>
                                {member.id === team.owner.id && (
                                    <span className="inline-flex items-center rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-400/20">
                                        Owner
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 h-fit">
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

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 h-fit">
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
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
