import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import AuthService from "../services/auth.service";
import { IUser } from "../types/user.type";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(AuthService.getCurrentUser());
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [is2FASetup, setIs2FASetup] = useState(false);

  const handleInitiate2FA = () => {
    AuthService.generate2FA().then((response) => {
      setSecret(response.data.secret);
      setQrCodeUrl(response.data.otpAuthUrl);
      setIs2FASetup(true);
      setMessage("");
    });
  };

  const handleVerify2FA = () => {
    if (!currentUser) return;

    AuthService.enable2FA(secret, verificationCode).then(
      () => {
        const updatedUser = { ...currentUser, using2FA: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIs2FASetup(false);
        setMessage("2FA activée avec succès !");
      },
      () => {
        setMessage("Code invalide. Veuillez réessayer.");
      }
    );
  };

  const handleDisable2FA = () => {
    if (!currentUser) return;

    AuthService.disable2FA().then(() => {
      const updatedUser = { ...currentUser, using2FA: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setMessage("2FA désactivée.");
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {currentUser ? (
        <div className="bg-slate-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-white">Profil</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">Détails de l'utilisateur.</p>
          </div>
          <div className="border-t border-slate-700">
            <dl>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Prénom</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.firstName}</dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Nom</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.lastName}</dd>
              </div>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">E-mail</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">{currentUser.email}</dd>
              </div>
              <div className="bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Profile Role</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {(currentUser.roles?.length ? currentUser.roles : ["ROLE_TEAM_MEMBER"]).map((role) => (
                      <span key={role} className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                        {role.replace("ROLE_", "").replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div className="bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-slate-400">Authentification à deux facteurs</dt>
                <dd className="mt-1 text-sm text-white sm:mt-0 sm:col-span-2">
                  {currentUser.using2FA ? (
                    <div>
                      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 mr-4">
                        Activée
                      </span>
                      <button
                        onClick={handleDisable2FA}
                        className="rounded-md bg-red-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                      >
                        Désactiver la 2FA
                      </button>
                    </div>
                  ) : (
                    <div>
                      {!is2FASetup ? (
                        <button
                          onClick={handleInitiate2FA}
                          className="w-full sm:w-auto rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400"
                        >
                          Activer la 2FA
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-white p-2 inline-block rounded">
                            <QRCodeSVG value={qrCodeUrl} size={128} />
                          </div>
                          <p className="text-xs text-slate-400">
                            Scannez ce code QR avec votre application d'authentification (Google Authenticator, Authy, etc.)
                          </p>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="block rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-3"
                              placeholder="Saisissez le code"
                            />
                            <button
                              onClick={handleVerify2FA}
                              className="w-full sm:w-auto rounded-md bg-green-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400"
                            >
                              Vérifier et activer
                            </button>
                            <button
                              onClick={() => setIs2FASetup(false)}
                              className="w-full sm:w-auto rounded-md bg-slate-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-400"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {message && <p className="mt-2 text-sm text-yellow-400">{message}</p>}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div>Veuillez vous connecter.</div>
      )}
    </div>
  );
};

export default Profile;
