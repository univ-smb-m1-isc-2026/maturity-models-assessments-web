import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import TeamService from "../services/team.service";
import AuthService from "../services/auth.service";

type Invitation = {
  id: string;
  teamId: string;
  inviterUserId: string;
  inviterFirstName?: string;
  inviterLastName?: string;
  inviterEmail?: string;
  inviteeEmail: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  createdAt: string;
  lastSentAt?: string;
  expiresAt?: string;
  acceptedAt?: string;
  revokedAt?: string;
  token: string;
};

const TeamInvitations = () => {
  const { id } = useParams();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();

  const loadInvitations = useCallback(() => {
    if (!id) return;
    TeamService.getInvitations(id).then(
      (response) => {
        setInvitations(response.data);
        setLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  }, [id]);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);
  
  const handleResend = (invitationId: string) => {
    if (!id) return;
    setMessage("");
    setLoading(true);
    TeamService.resendInvitation(id, invitationId).then(
      (response) => {
        setMessage(response.data.message || "Invitation resent.");
        loadInvitations();
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  };
  
  const handleRevoke = (invitationId: string) => {
    if (!id) return;
    setMessage("");
    setLoading(true);
    TeamService.revokeInvitation(id, invitationId).then(
      (response) => {
        setMessage(response.data.message || "Invitation revoked.");
        loadInvitations();
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    );
  };
  
  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };
  
  const inviterLabel = (inv: Invitation) => {
    const name = `${inv.inviterFirstName || ""} ${inv.inviterLastName || ""}`.trim();
    if (name) return inv.inviterEmail ? `${name} (${inv.inviterEmail})` : name;
    if (inv.inviterEmail) return inv.inviterEmail;
    return inv.inviterUserId;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-indigo-400">Team Invitations</h1>
        <Link to={`/teams/${id}`} className="text-sm text-slate-300 hover:text-white">Back to Team</Link>
      </div>

      {loading ? (
        <div className="rounded-md p-4 bg-blue-900/30 border border-blue-800">Loading invitations...</div>
      ) : message ? (
        <div className="rounded-md p-4 bg-red-900/30 border border-red-800">{message}</div>
      ) : (
        <div className="bg-slate-800 p-6 rounded-lg shadow-md border border-slate-700">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Invitee</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Inviter</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Created At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Last Sent</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Expires At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Accepted At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Revoked At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invitations.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-2 text-sm">{inv.inviteeEmail}</td>
                  <td className="px-4 py-2 text-sm">{inviterLabel(inv)}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      inv.status === "PENDING" ? "bg-yellow-900/50 text-yellow-300" :
                      inv.status === "ACCEPTED" ? "bg-green-900/50 text-green-300" :
                      inv.status === "REVOKED" ? "bg-red-900/50 text-red-300" :
                      "bg-slate-700/60 text-slate-200"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm">{formatDate(inv.createdAt)}</td>
                  <td className="px-4 py-2 text-sm">{formatDate(inv.lastSentAt)}</td>
                  <td className="px-4 py-2 text-sm">{formatDate(inv.expiresAt)}</td>
                  <td className="px-4 py-2 text-sm">{formatDate(inv.acceptedAt)}</td>
                  <td className="px-4 py-2 text-sm">{formatDate(inv.revokedAt)}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      {(inv.status === "PENDING" || inv.status === "EXPIRED") && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleResend(inv.id)}
                            className="text-xs text-indigo-300 hover:text-indigo-200"
                          >
                            Resend
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevoke(inv.id)}
                            className="text-xs text-red-300 hover:text-red-200"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                      {inv.status === "REVOKED" && <span className="text-xs text-slate-500">-</span>}
                      {inv.status === "ACCEPTED" && <span className="text-xs text-slate-500">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">No invitations yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-4 text-xs text-slate-400">
            Only Owner, PMO, or Team Leader can view this log.
          </div>
          {currentUser && (
            <div className="mt-2 text-xs text-slate-500">
              Logged as {currentUser.email}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamInvitations;
