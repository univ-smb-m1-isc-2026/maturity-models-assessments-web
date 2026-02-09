import { useState, useEffect, FormEvent, useCallback } from "react";
import TeamService from "../services/team.service";
import { Link } from "react-router-dom";
import { ITeam } from "../types/team.type";

const TeamsDashboard = () => {
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [newTeamName, setNewTeamName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const loadTeams = useCallback(() => {
        TeamService.getUserTeams().then(
            (response) => {
                setTeams(response.data);
                setLoading(false);
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
    }, []);

    useEffect(() => {
        loadTeams();
    }, [loadTeams]);

    const handleCreateTeam = (e: FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        TeamService.createTeam(newTeamName).then(
            () => {
                setMessage("Team created successfully!");
                setNewTeamName("");
                loadTeams();
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
    };

    return (
        <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">My Teams</h1>
            </header>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Create New Team</h2>
                    <form onSubmit={handleCreateTeam} className="space-y-4">
                        <div>
                            <label htmlFor="teamName" className="block text-sm font-medium text-slate-300">Team Name</label>
                            <input
                                type="text"
                                id="teamName"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Create New Team
                        </button>
                    </form>
                    {message && (
                        <div className="mt-4 p-2 rounded bg-slate-700 text-sm">
                            {message}
                        </div>
                    )}
                </div>

                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">Your Teams</h2>
                    {loading ? (
                        <p className="text-slate-400">Loading teams...</p>
                    ) : (
                        <ul className="divide-y divide-slate-700">
                            {teams.length === 0 ? (
                                <p className="text-slate-400">You are not a member of any team yet.</p>
                            ) : (
                                teams.map((team) => (
                                    <li key={team.id} className="py-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-lg font-medium text-white">{team.name}</p>
                                            <p className="text-sm text-slate-400">Members: {team.members.length}</p>
                                        </div>
                                        <Link
                                            to={`/teams/${team.id}`}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsDashboard;
