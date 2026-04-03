import { useState, useEffect, FormEvent, useCallback } from "react";
import MaturityModelService from "../services/maturity-model.service";
import { IMaturityModel, IQuestion } from "../types/maturity-model.type";
import TeamService from "../services/team.service";
import AuthService from "../services/auth.service";
import { ITeam } from "../types/team.type";

const MaturityModelsAdmin = () => {
    const [models, setModels] = useState<IMaturityModel[]>([]);
    const [manageableTeams, setManageableTeams] = useState<ITeam[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [view, setView] = useState<"list" | "form">("list");

    const [currentModel, setCurrentModel] = useState<IMaturityModel>({
        name: "",
        teamId: "",
        questions: []
    });

    const currentUser = AuthService.getCurrentUser();

    const loadManageableTeams = useCallback(() => {
        TeamService.getAllTeams().then(
            (response) => {
                const teams: ITeam[] = response.data || [];
                setManageableTeams(teams);
                if (!selectedTeamId && teams.length > 0) {
                    setSelectedTeamId(teams[0].id);
                }
            },
            () => {
                TeamService.getUserTeams().then(
                    (response) => {
                        const teams: ITeam[] = response.data || [];
                        setManageableTeams(teams);
                        if (!selectedTeamId && teams.length > 0) {
                            setSelectedTeamId(teams[0].id);
                        }
                    },
                    () => {
                        setManageableTeams([]);
                    }
                );
            }
        );
    }, [selectedTeamId]);

    const loadModels = useCallback(() => {
        MaturityModelService.getAllModels().then(
            (response) => {
                setModels(response.data);
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
        loadModels();
        loadManageableTeams();
    }, [loadModels, loadManageableTeams]);

    const handleCreateModel = () => {
        setCurrentModel({ name: "", teamId: selectedTeamId || "", questions: [] });
        setView("form");
        setMessage("");
    };

    const handleEditModel = (model: IMaturityModel) => {
        setCurrentModel(model);
        setSelectedTeamId(model.teamId || "");
        setView("form");
        setMessage("");
    };

    const handleDeleteModel = (id: string) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce modèle ?")) {
            setLoading(true);
            MaturityModelService.deleteModel(id).then(
                () => {
                    loadModels();
                },
                (error) => {
                    console.error(error);
                    setLoading(false);
                }
            );
        }
    };

    const handleSaveModel = (e: FormEvent) => {
        e.preventDefault();
        setMessage("");

        if (currentModel.questions.length === 0) {
            setMessage("Please add at least one question.");
            return;
        }

        const sanitizedQuestions = currentModel.questions.map((q, qIdx) => ({
            ...q,
            levels: q.levels.map((lvl, lIdx) => ({
                value: lvl.value,
                description: (lvl.description || "").trim() || `Level ${lIdx + 1}`
            })),
            text: (q.text || "").trim() || `Question ${qIdx + 1}`
        }));

        const payload: IMaturityModel = {
            ...currentModel,
            teamId: currentModel.teamId || selectedTeamId || undefined,
            questions: sanitizedQuestions
        };

        setLoading(true);
        if (currentModel.id) {
            MaturityModelService.updateModel(currentModel.id, payload).then(
                () => {
                    setMessage("Modèle mis à jour avec succès !");
                    loadModels();
                    setView("list");
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
        } else {
            MaturityModelService.createModel(payload).then(
                () => {
                    setMessage("Modèle créé avec succès !");
                    loadModels();
                    setView("list");
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

    const addQuestion = () => {
        const newQuestion: IQuestion = {
            text: "",
            levels: [
                { value: 1, description: "Initial" },
                { value: 2, description: "Managed" },
                { value: 3, description: "Defined" },
                { value: 4, description: "Quantitatively Managed" },
                { value: 5, description: "Optimizing" },
            ]
        };
        setCurrentModel({ ...currentModel, questions: [...currentModel.questions, newQuestion] });
    };

    const removeQuestion = (index: number) => {
        const updatedQuestions = [...currentModel.questions];
        updatedQuestions.splice(index, 1);
        setCurrentModel({ ...currentModel, questions: updatedQuestions });
    };

    const handleQuestionChange = (index: number, text: string) => {
        const updatedQuestions = [...currentModel.questions];
        updatedQuestions[index].text = text;
        setCurrentModel({ ...currentModel, questions: updatedQuestions });
    };

    const handleLevelChange = (qIndex: number, lIndex: number, description: string) => {
        const updatedQuestions = [...currentModel.questions];
        updatedQuestions[qIndex].levels[lIndex].description = description;
        setCurrentModel({ ...currentModel, questions: updatedQuestions });
    };

    const isSuccessMessage = message.toLowerCase().includes("succès") || message.toLowerCase().includes("réussi");

    if (view === "list") {
        return (
            <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Modèles de maturité</h1>
                    <button
                        onClick={handleCreateModel}
                        className="w-full sm:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Créer un modèle
                    </button>
                </header>

                {message && (
                    <div className={`mb-4 p-4 rounded-md ${isSuccessMessage ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <p className="text-slate-400">Chargement des modèles...</p>
                ) : (
                    <div className="bg-slate-800 shadow overflow-hidden sm:rounded-md border border-slate-700">
                        <ul className="divide-y divide-slate-700">
                            {models.map((model) => (
                                <li key={model.id} className="px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-700/50">
                                    <div>
                                        <p className="text-lg font-medium text-white">{model.name}</p>
                                        <p className="text-sm text-slate-400">{model.questions.length} questions</p>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => handleEditModel(model)}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => model.id && handleDeleteModel(model.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {models.length === 0 && (
                                <li className="px-6 py-4 text-center text-slate-400">Aucun modèle de maturité n'est encore défini.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
            <div className="mb-6">
                <button onClick={() => setView("list")} className="text-indigo-400 hover:text-indigo-300">
                    &larr; Retour à la liste
                </button>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {currentModel.id ? "Modifier le modèle de maturité" : "Créer un modèle de maturité"}
                </h1>
            </header>

            <form onSubmit={handleSaveModel} className="space-y-8">
                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="mb-4">
                        <label htmlFor="modelName" className="block text-sm font-medium text-slate-300">Nom du modèle</label>
                        <input
                            type="text"
                            id="modelName"
                            value={currentModel.name}
                            onChange={(e) => setCurrentModel({ ...currentModel, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="teamId" className="block text-sm font-medium text-slate-300">Team (optionnel)</label>
                        <select
                            id="teamId"
                            value={selectedTeamId}
                            onChange={(e) => {
                                setSelectedTeamId(e.target.value);
                                setCurrentModel({ ...currentModel, teamId: e.target.value });
                            }}
                            className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                            disabled={!!currentModel.id}
                        >
                            <option value="">Aucune team (modèle global)</option>
                            {manageableTeams.map((team) => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                        {currentModel.id && (
                            <p className="mt-1 text-xs text-slate-400">Team cannot be changed for an existing model.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-white">Questions</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full sm:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Ajouter une question
                        </button>
                    </div>

                    {currentModel.questions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 relative">
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
                            >
                                Supprimer la question
                            </button>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-1">Texte de la question</label>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Par exemple : comment gérez-vous les déploiements ?"
                                    required
                                />
                            </div>

                            <div className="space-y-3 mt-4">
                                <p className="text-sm font-medium text-indigo-400">Niveaux de maturité (1 = le moins mature, 5 = le plus mature)</p>
                                {question.levels.map((level, lIndex) => (
                                    <div key={lIndex} className="flex items-center gap-4">
                                        <span className="text-slate-400 w-16 text-sm">Niveau {level.value}</span>
                                        <input
                                            type="text"
                                            value={level.description}
                                            onChange={(e) => handleLevelChange(qIndex, lIndex, e.target.value)}
                                            className="block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                            placeholder={`Description du niveau ${level.value}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${isSuccessMessage ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {message}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Enregistrer le modèle
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaturityModelsAdmin;
