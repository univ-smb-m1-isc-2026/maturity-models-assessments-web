import { useState, useEffect, FormEvent, useCallback } from "react";
import MaturityModelService from "../services/maturity-model.service";
import { IMaturityModel, IQuestion } from "../types/maturity-model.type";

const MaturityModelsAdmin = () => {
    const [models, setModels] = useState<IMaturityModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [view, setView] = useState<"list" | "form">("list");
    
    const [currentModel, setCurrentModel] = useState<IMaturityModel>({
        name: "",
        questions: []
    });

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
    }, [loadModels]);

    const handleCreateModel = () => {
        setCurrentModel({ name: "", questions: [] });
        setView("form");
        setMessage("");
    };

    const handleEditModel = (model: IMaturityModel) => {
        setCurrentModel(model);
        setView("form");
        setMessage("");
    };

    const handleDeleteModel = (id: string) => {
        if (window.confirm("Are you sure you want to delete this model?")) {
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

        setLoading(true);
        if (currentModel.id) {
            MaturityModelService.updateModel(currentModel.id, currentModel).then(
                () => {
                    setMessage("Model updated successfully!");
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
            MaturityModelService.createModel(currentModel).then(
                () => {
                    setMessage("Model created successfully!");
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
                { value: 1, description: "" },
                { value: 2, description: "" },
                { value: 3, description: "" },
                { value: 4, description: "" },
                { value: 5, description: "" },
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

    if (view === "list") {
        return (
            <div className="min-h-full py-10 px-4 sm:px-6 lg:px-8 text-white">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Maturity Models</h1>
                    <button
                        onClick={handleCreateModel}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Create New Model
                    </button>
                </header>

                {message && (
                    <div className={`mb-4 p-4 rounded-md ${message.includes("success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {message}
                    </div>
                )}

                {loading ? (
                    <p className="text-slate-400">Loading models...</p>
                ) : (
                    <div className="bg-slate-800 shadow overflow-hidden sm:rounded-md border border-slate-700">
                        <ul className="divide-y divide-slate-700">
                            {models.map((model) => (
                                <li key={model.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/50">
                                    <div>
                                        <p className="text-lg font-medium text-white">{model.name}</p>
                                        <p className="text-sm text-slate-400">{model.questions.length} Questions</p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleEditModel(model)}
                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => model.id && handleDeleteModel(model.id)}
                                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {models.length === 0 && (
                                <li className="px-6 py-4 text-center text-slate-400">No maturity models defined yet.</li>
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
                    &larr; Back to List
                </button>
            </div>
            
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                    {currentModel.id ? "Edit Maturity Model" : "Create Maturity Model"}
                </h1>
            </header>

            <form onSubmit={handleSaveModel} className="space-y-8">
                <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
                    <div className="mb-4">
                        <label htmlFor="modelName" className="block text-sm font-medium text-slate-300">Model Name</label>
                        <input
                            type="text"
                            id="modelName"
                            value={currentModel.name}
                            onChange={(e) => setCurrentModel({ ...currentModel, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-white">Questions</h2>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Add Question
                        </button>
                    </div>

                    {currentModel.questions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700 relative">
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-red-400 hover:text-red-300 text-sm"
                            >
                                Remove Question
                            </button>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-1">Question Text</label>
                                <input
                                    type="text"
                                    value={question.text}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                    placeholder="e.g. How do you handle deployments?"
                                    required
                                />
                            </div>

                            <div className="space-y-3 mt-4">
                                <p className="text-sm font-medium text-indigo-400">Maturity Levels (1 = Least Mature, 5 = Most Mature)</p>
                                {question.levels.map((level, lIndex) => (
                                    <div key={lIndex} className="flex items-center gap-4">
                                        <span className="text-slate-400 w-16 text-sm">Level {level.value}</span>
                                        <input
                                            type="text"
                                            value={level.description}
                                            onChange={(e) => handleLevelChange(qIndex, lIndex, e.target.value)}
                                            className="block w-full rounded-md border-0 bg-slate-900 py-1.5 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                                            placeholder={`Description for level ${level.value}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${message.includes("success") ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {message}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save Model
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MaturityModelsAdmin;
