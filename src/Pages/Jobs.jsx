import { useEffect, useMemo, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api/axiosInstance";

export default function Jobs() {
  const params = useParams();
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const username = useMemo(
    () => params.username || localStorage.getItem("username") || "",
    [params.username]
  );

  const emptyJob = useMemo(
    () => ({
      company: "",
      role: "",
      status: "Applied",
      appliedOn: "",
      location: "",
      platform: "",
      resume: "",
      followUp: "",
      interviewDate: "",
      jobLink: "",
      feedback: "",
      contacts: [],
    }),
    []
  );

  const sanitizeJob = (j) => ({
    id: j.id ?? null,
    company: j.company ?? "",
    role: j.role ?? "",
    status: j.status ?? "Applied",
    appliedOn: j.appliedOn ?? "",
    location: j.location ?? "",
    platform: j.platform ?? "",
    resume: j.resume ?? "",
    followUp: j.followUp ?? "",
    interviewDate: j.interviewDate ?? "",
    jobLink: j.jobLink ?? "",
    feedback: j.feedback ?? "",
    contacts: Array.isArray(j.contacts)
      ? j.contacts.map((c) => ({
          id: c.id ?? null,
          name: c.name ?? "",
          role: c.role ?? "",
          email: c.email ?? "",
        }))
      : [],
  });

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setLoadError("No username found. Please log in again.");
      return;
    }
    setLoading(true);
    setLoadError("");
    api
      .get(`/api/jobs/${encodeURIComponent(username)}`)
      .then((res) => {
        const cleaned = Array.isArray(res.data) ? res.data.map(sanitizeJob) : [];
        setJobs(cleaned);
      })
      .catch((err) => {
        console.error("Error loading jobs:", err);
        setLoadError(err?.response?.data?.error || "Failed to load jobs.");
      })
      .finally(() => setLoading(false));
  }, [username]);

  const addJob = () => {
    api
      .post(`/api/jobs/${encodeURIComponent(username)}`, emptyJob)
      .then((res) => {
        const created = sanitizeJob(res.data);
        setJobs((prev) => [...prev, created]);
      })
      .catch((err) => {
        console.error("Error adding job:", err);
        alert(err?.response?.data?.error || "Error adding job");
      });
  };

  const updateJob = (index, field, value) => {
    setJobs((prev) => {
      const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      next[index][field] = value;
      return next;
    });

    const job = { ...jobs[index], [field]: value };
    if (!job.id) return;

    api.put(`/api/jobs/${job.id}`, job).catch((err) => {
      console.error("Error updating job:", err);
      alert(err?.response?.data?.error || "Error updating job");
    });
  };

  const deleteJob = (id) => {
    api
      .delete(`/api/jobs/${id}`)
      .then(() => setJobs((prev) => prev.filter((j) => j.id !== id)))
      .catch((err) => {
        console.error("Error deleting job:", err);
        alert(err?.response?.data?.error || "Error deleting job");
      });
  };

  const openContacts = (jobIdx) => setShowModal(jobIdx);

  const addContact = (jobIdx) => {
    const job = jobs[jobIdx];
    if (!job?.id) {
      alert("Please save the job first before adding contacts.");
      return;
    }

    const placeholder = { id: null, name: "", role: "", email: "" };
    setJobs((prev) => {
      const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      next[jobIdx].contacts.push(placeholder);
      return next;
    });

    api
      .post(`/api/jobs/${job.id}/contacts`, { name: "", role: "", email: "" })
      .then((res) => {
        const saved = {
          id: res.data.id,
          name: res.data.name ?? "",
          role: res.data.role ?? "",
          email: res.data.email ?? "",
        };
        setJobs((prev) => {
          const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
          next[jobIdx].contacts[next[jobIdx].contacts.length - 1] = saved;
          return next;
        });
      })
      .catch((err) => {
        console.error("Error adding contact:", err);
        alert(err?.response?.data?.error || "Error adding contact");
        setJobs((prev) => {
          const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
          next[jobIdx].contacts.pop();
          return next;
        });
      });
  };

  const updateContact = (jobIdx, cIdx, field, value) => {
    setJobs((prev) => {
      const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
      next[jobIdx].contacts[cIdx][field] = value;
      return next;
    });

    const contact = jobs[jobIdx]?.contacts?.[cIdx];
    if (!contact?.id) return;

    api.put(`/api/jobs/contacts/${contact.id}`, { ...contact, [field]: value }).catch((err) => {
      console.error("Error updating contact:", err);
      alert(err?.response?.data?.error || "Error updating contact");
    });
  };

  const deleteContact = (jobIdx, cId) => {
    api
      .delete(`/api/jobs/contacts/${cId}`)
      .then(() => {
        setJobs((prev) => {
          const next = structuredClone ? structuredClone(prev) : JSON.parse(JSON.stringify(prev));
          next[jobIdx].contacts = next[jobIdx].contacts.filter((c) => c.id !== cId);
          return next;
        });
      })
      .catch((err) => {
        console.error("Error deleting contact:", err);
        alert(err?.response?.data?.error || "Error deleting contact");
      });
  };

  if (!username) return <Navigate to="/login" replace />;

  return (
    <div className="p-6 font-[cursive]">
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-300">
          Loading jobs...
        </div>
      ) : loadError ? (
        <div className="flex items-center justify-center h-64 text-red-600">{loadError}</div>
      ) : jobs.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <button
            onClick={addJob}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-700 to-blue-800 text-white font-semibold 
                     shadow-lg shadow-indigo-700/30 hover:scale-[1.02] active:scale-95 transition"
          >
            <span className="mr-1">➕</span> Add Your First Job
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md shadow-2xl">
            <table className="min-w-full rounded-xl">
              <thead className="sticky top-0 z-10 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur shadow">
                <tr>
                  {[
                    "Company",
                    "Role",
                    "Status",
                    "Applied On",
                    "Location",
                    "Platform",
                    "Resume",
                    "Follow-up",
                    "Interview Date",
                    "Hiring Team",
                    "Job Link",
                    "Feedback",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left font-bold text-gray-800 dark:text-gray-100 text-xs uppercase tracking-wide"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-sm divide-y divide-gray-200/70 dark:divide-gray-700/60">
                {jobs.map((job, idx) => (
                  <tr
                    key={job.id ?? `row-${idx}`}
                    className="odd:bg-gray-50/40 dark:odd:bg-white/5 hover:bg-indigo-600/10 dark:hover:bg-indigo-600/20
                               transition-all duration-200 hover:shadow-md hover:shadow-indigo-700/30 hover:scale-[1.005]"
                  >
                    <td className="px-3 py-2">
                      <input
                        value={job.company}
                        onChange={(e) => updateJob(idx, "company", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={job.role}
                        onChange={(e) => updateJob(idx, "role", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    {/* Status with darker pill colors */}
                    <td className="px-3 py-2">
                      <select
                        value={job.status}
                        onChange={(e) => updateJob(idx, "status", e.target.value)}
                        className={`w-full rounded-full px-3 py-1.5 text-xs font-bold font-[cursive] transition
                          border border-transparent focus:outline-none focus:ring-2
                          ${
                            job.status === "Applied"
                              ? "bg-blue-800/80 text-blue-200 ring-blue-500/40"
                              : job.status === "Interviewing"
                              ? "bg-amber-800/80 text-amber-200 ring-amber-500/40"
                              : job.status === "Offer"
                              ? "bg-green-800/80 text-green-200 ring-green-500/40"
                              : "bg-red-800/80 text-rose-200 ring-rose-500/40"
                          }`}
                      >
                        <option>Applied</option>
                        <option>Interviewing</option>
                        <option>Offer</option>
                        <option>Rejected</option>
                      </select>
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={job.appliedOn || ""}
                        onChange={(e) => updateJob(idx, "appliedOn", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={job.location}
                        onChange={(e) => updateJob(idx, "location", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={job.platform}
                        onChange={(e) => updateJob(idx, "platform", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={job.resume}
                        onChange={(e) => updateJob(idx, "resume", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={job.followUp || ""}
                        onChange={(e) => updateJob(idx, "followUp", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={job.interviewDate || ""}
                        onChange={(e) => updateJob(idx, "interviewDate", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => openContacts(idx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                   bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-700 transition font-[cursive]"
                      >
                        👥 Manage
                      </button>
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={job.jobLink}
                        onChange={(e) => updateJob(idx, "jobLink", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <textarea
                        value={job.feedback}
                        onChange={(e) => updateJob(idx, "feedback", e.target.value)}
                        className="w-full rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700
                                   text-gray-900 dark:text-gray-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 font-[cursive]"
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="px-2.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold
                                   hover:bg-rose-700 shadow-sm transition font-[cursive]"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Floating FAB */}
          <button
            onClick={addJob}
            className="fixed bottom-6 right-6 px-5 py-3 rounded-full
                       bg-gradient-to-r from-indigo-700 to-blue-800 text-white font-bold
                       shadow-xl shadow-indigo-700/30 hover:scale-105 active:scale-95 transition font-[cursive]"
          >
            ➕ Add Job
          </button>
        </div>
      )}

      {/* CONTACTS MODAL */}
{showModal !== null && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
    <div
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl 
                 w-full max-w-3xl max-h-[80vh] overflow-y-auto
                 border border-gray-200 dark:border-gray-700 
                 animate-[fadeIn_.2s_ease] font-[cursive]"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
        COMPANY CONTACTS
      </h2>

      <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-2 py-1 text-left">Name</th>
            <th className="px-2 py-1 text-left">Role</th>
            <th className="px-2 py-1 text-left">Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(jobs[showModal]?.contacts || []).map((c, cIdx) => (
            <tr
              key={c.id ?? `c-${cIdx}`}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="px-2 py-1">
                <input
                  value={c.name}
                  onChange={(e) =>
                    updateContact(showModal, cIdx, "name", e.target.value)
                  }
                  className="w-full px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 
                             border border-gray-300 dark:border-gray-700
                             text-gray-900 dark:text-gray-100 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                />
              </td>
              <td className="px-2 py-1">
                <input
                  value={c.role}
                  onChange={(e) =>
                    updateContact(showModal, cIdx, "role", e.target.value)
                  }
                  className="w-full px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 
                             border border-gray-300 dark:border-gray-700
                             text-gray-900 dark:text-gray-100 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                />
              </td>
              <td className="px-2 py-1">
                <input
                  value={c.email}
                  onChange={(e) =>
                    updateContact(showModal, cIdx, "email", e.target.value)
                  }
                  className="w-full px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 
                             border border-gray-300 dark:border-gray-700
                             text-gray-900 dark:text-gray-100 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                />
              </td>
              <td className="px-2 py-1 text-right">
                <button
                  onClick={() => deleteContact(showModal, c.id)}
                  className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => addContact(showModal)}
          className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition"
        >
          + Add Contact
        </button>
        <button
          onClick={() => setShowModal(null)}
          className="px-3 py-1.5 rounded-md bg-gray-200 dark:bg-gray-700 
                     text-gray-800 dark:text-gray-100 text-sm font-bold 
                     hover:opacity-90 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
