"use client";

import { useRef, useState } from "react";
import { Check, FileUp, LoaderCircle, Plus, Trash2, X } from "lucide-react";
import { parseResume } from "../lib/resume/parse.mjs";

const fields = [["role", "Position / Role"], ["organization", "Organization"], ["location", "Location"], ["start", "Start Date"], ["end", "End Date"]];

export default function ResumeImport() {
  const input = useRef(null);
  const dialog = useRef(null);
  const [entries, setEntries] = useState([]);
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const selected = entries.filter(entry => entry.selected);

  async function upload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true); setError(""); setStatus("");
    try {
      const { readResume } = await import("../lib/resume/read.mjs");
      const text = await readResume(file);
      setSource(text); setName(file.name);
      setEntries(parseResume(text).map((entry, index) => ({ ...entry, id: index, selected: true })));
      dialog.current.showModal();
    } catch (failure) {
      setError(failure.name === "PasswordException" ? "This PDF is password-protected. Upload an unlocked copy." : failure.message || "Unable to read this file. Try a text-based PDF or DOCX.");
    } finally { setBusy(false); }
  }

  function update(id, key, value) {
    setEntries(items => items.map(item => item.id === id ? { ...item, [key]: value } : item));
  }

  function save() {
    setError("");
    if (!selected.length || selected.some(item => !item.role.trim() && !item.organization.trim())) {
      setError("Give each selected experience a position or organization before importing."); return;
    }
    let received = false;
    window.dispatchEvent(new CustomEvent("bestfit:import-experiences", {
      detail: { entries: selected, finish(result) {
        received = true;
        if (result.error) { setError(result.error); return; }
        setStatus(`${result.added} experience${result.added === 1 ? "" : "s"} imported.${result.skipped ? ` ${result.skipped} duplicate${result.skipped === 1 ? "" : "s"} skipped.` : ""}`);
        dialog.current.close(); setEntries([]); setSource("");
      } },
    }));
    if (!received) setError("The experience bank is still loading. Please try again in a moment.");
  }

  return <div className="resume-import">
    <input ref={input} type="file" accept=".pdf,.docx,.txt" hidden onChange={upload} aria-label="Resume file" />
    <button className="secondary-button" type="button" title="PDF, DOCX or TXT, up to 5 MB. Processed on your device." disabled={busy} onClick={() => input.current.click()}>{busy ? <LoaderCircle className="auth-spinner" size={16} /> : <FileUp size={16} />}{busy ? "Reading resume..." : "Upload Resume"}</button>
    {status && <p className="import-success" role="status">{status}</p>}
    {error && !dialog.current?.open && <p className="auth-error" role="alert">{error}</p>}
    <dialog ref={dialog} className="import-dialog" onClose={() => { setError(""); setSource(""); }}>
      <header className="import-header"><div><h2>Review experiences</h2><p>{name}</p></div><button type="button" className="tool-button" aria-label="Close import" title="Close" onClick={() => dialog.current.close()}><X size={19} /></button></header>
      <div className="import-body">
        <p className="import-note">Check the detected fields before saving. Existing experiences and resume edits will stay unchanged.</p>
        {!entries.length && <p role="status">No dated experiences were detected. Add an experience below and use the extracted text to complete it.</p>}
        {entries.map((entry, index) => <article className="import-entry" key={entry.id}>
          <div className="import-entry-heading"><label><input type="checkbox" checked={entry.selected} onChange={event => update(entry.id, "selected", event.target.checked)} />Experience {index + 1}</label><button type="button" className="tool-button" title="Remove from import" aria-label={`Remove imported experience ${index + 1}`} onClick={() => setEntries(items => items.filter(item => item.id !== entry.id))}><Trash2 size={16} /></button></div>
          <div className="import-fields">{fields.map(([key, label]) => <label key={key}><span>{label}</span><input value={entry[key]} onChange={event => update(entry.id, key, event.target.value)} /></label>)}<label className="import-description"><span>Experience Description</span><textarea rows={5} value={entry.description} onChange={event => update(entry.id, "description", event.target.value)} /></label></div>
          {entry.source && <details><summary>Original text</summary><pre>{entry.source}</pre></details>}
        </article>)}
        <button className="secondary-button" type="button" onClick={() => setEntries(items => [...items, { id: Math.max(-1, ...items.map(item => item.id)) + 1, selected: true, role: "", organization: "", location: "", start: "", end: "", description: "" }])}><Plus size={16} />Add another experience</button>
        <details className="import-source"><summary>Extracted resume text</summary><pre>{source}</pre></details>
        {error && <p className="auth-error" role="alert">{error}</p>}
      </div>
      <footer className="import-footer"><span>{selected.length} selected</span><button type="button" className="secondary-button" onClick={() => dialog.current.close()}>Cancel</button><button type="button" disabled={!selected.length} className="primary-button" onClick={save}><Check size={16} />Import {selected.length || ""} experience{selected.length === 1 ? "" : "s"}</button></footer>
    </dialog>
  </div>;
}
