import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TeamService from "../services/team.service";
import AuthService from "../services/auth.service";

const InvitationAccept = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const currentUser = AuthService.getCurrentUser();
  const [message, setMessage] = useState(() => {
    if (!currentUser) return "Please login or register to accept the invitation.";
    if (!token) return "Invalid invitation link.";
    return "";
  });
  const [status, setStatus] = useState<"idle" | "success" | "error" | "need_auth">(() => {
    if (!currentUser) return "need_auth";
    if (!token) return "error";
    return "idle";
  });

  useEffect(() => {
    if (!currentUser || !token || status !== "idle") return;
    TeamService.acceptInvitation(token).then(
      (response) => {
        setStatus("success");
        setMessage(response.data.message || "Invitation accepted.");
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        if (error.response?.status === 401 || error.response?.status === 403) {
          setStatus("need_auth");
          setMessage("Please login or register to accept the invitation.");
        } else {
          setStatus("error");
          setMessage(resMessage);
        }
      }
    );
  }, [currentUser, token, status]);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold text-indigo-400 mb-4">Invitation</h1>
      <div className={`rounded-md p-4 ${status === "success" ? "bg-green-900/30 border border-green-800" : status === "error" ? "bg-red-900/30 border border-red-800" : "bg-blue-900/30 border border-blue-800"}`}>
        <p className="text-sm">{message || "Processing..."}</p>
      </div>
      {status === "need_auth" && (
        <div className="mt-4 flex space-x-3">
          <Link to={`/login`} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            Login
          </Link>
          <Link to={`/register`} className="rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-600">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default InvitationAccept;
