"use client";

import React, { useState } from "react";
import {
  Heart,
  Download,
  Sparkles,
  Send,
  Copy,
  Check,
  ExternalLink,
  Mic,
  MessageSquare,
  Clock,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import VoiceRecorder from "@/components/ui/VoiceRecorder";
import { REACTIONS } from "@/lib/reactions";

interface RecapCardProps {
  name: string;
  sender: string;
  wishId?: string;
  expiresAt?: string | number | Date;
  onDownloadVault?: () => void;
}

export default function RecapCard({
  name,
  sender,
  wishId,
  expiresAt,
  onDownloadVault,
}: RecapCardProps) {
  const [composing, setComposing] = useState<"idle" | "text" | "voice">("idle");
  const [note, setNote] = useState("");
  const [voiceNote, setVoiceNote] = useState("");
  const [sending, setSending] = useState(false);
  const [replyLink, setReplyLink] = useState("");
  const [copied, setCopied] = useState(false);

  const expiryDate = expiresAt ? new Date(expiresAt) : null;
  const expiryLabel =
    expiryDate && !Number.isNaN(expiryDate.getTime())
      ? expiryDate.toLocaleDateString(undefined, { day: "numeric", month: "long" })
      : null;

  const postReply = async (payload: Record<string, unknown>) => {
    if (!wishId) return;
    setSending(true);
    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: wishId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not send that reply.");
      }
      setReplyLink(`${window.location.origin}/wish/${data.id}`);
      setComposing("idle");
      toast.success(`Your reply is ready for ${sender}!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send that reply.");
    } finally {
      setSending(false);
    }
  };

  const copyReply = async () => {
    if (!replyLink) return;
    await navigator.clipboard.writeText(replyLink);
    setCopied(true);
    toast.success("Reply link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full max-w-md mx-auto paper-deckle p-6 sm:p-8 text-center rounded-sm relative overflow-hidden"
      style={{
        background: "#F8F5EE",
        border: "1px solid rgba(227, 212, 184, 0.8)",
        boxShadow: "0 20px 45px -12px rgba(59, 39, 30, 0.18)",
      }}
    >
      {/* Keepsake Header */}
      <div className="mb-6">
        <div className="w-12 h-12 rounded-full mx-auto mb-3 bg-[#8B2635]/10 flex items-center justify-center">
          <Heart className="w-6 h-6 text-[#8B2635] fill-current" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8B2635] block mb-1">
          A Moment Sealed in Time
        </span>
        <h3 className="font-serif italic text-2xl sm:text-3xl text-[#2A231F]">
          Happy Birthday, {name}! ✨
        </h3>
        <p className="text-xs text-[#7A6F62] font-serif mt-1.5">
          A personal keepsake crafted with love by {sender}.
        </p>
      </div>

      {/* Save before the link disappears */}
      {onDownloadVault && (
        <div className="mb-4">
          <p className="text-[11px] text-[#6F655E] font-serif leading-relaxed mb-2.5">
            This link disappears in 7 days{expiryLabel ? ` (on ${expiryLabel})` : ""}. Save your
            copy now and it&apos;s yours forever — works offline, on any phone.
          </p>
          <button
            type="button"
            onClick={onDownloadVault}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-[#C5A059] bg-[#FAF6F0] text-sm font-serif font-semibold text-[#3B271E] hover:bg-[#F4EFE6] transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Save my keepsake to this device</span>
          </button>
        </div>
      )}

      {/* Reply chapter */}
      {wishId && (
        <div className="mt-3 text-left">
          {replyLink ? (
            <div className="rounded-xl border border-[#C5A059] bg-white p-3.5 space-y-2">
              <p className="text-xs font-serif italic text-[#7A6F62]">
                Send this back to {sender} — it opens as a keepsake from you.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copyReply}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#8B2635] text-white text-xs font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy reply link"}
                </button>
                <Link
                  href={replyLink}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3D4B8] text-[#3B271E] text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </Link>
              </div>
            </div>
          ) : composing === "text" ? (
            <div className="rounded-xl border border-[#E3D4B8] bg-white p-3.5 space-y-2.5">
              <label htmlFor="reply-note" className="block text-xs font-serif italic text-[#7A6F62]">
                What do you want to say back to {sender}?
              </label>
              <textarea
                id="reply-note"
                rows={3}
                maxLength={2000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`${sender}, this meant more than you know…`}
                className="input-saas text-xs leading-relaxed resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => postReply({ message: note.trim() })}
                  disabled={sending || !note.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#8B2635] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sealing…" : "Create my reply"}
                </button>
                <button
                  type="button"
                  onClick={() => setComposing("idle")}
                  className="px-3 py-2 rounded-lg border border-[#E3D4B8] text-xs font-semibold text-[#7A6F62] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : composing === "voice" ? (
            <div className="rounded-xl border border-[#E3D4B8] bg-white p-3.5 space-y-2.5">
              <p className="text-xs font-serif italic text-[#7A6F62]">
                Say it out loud instead — {sender} will hear your actual voice.
              </p>
              <VoiceRecorder
                compact
                maxDuration={45}
                onRecordingComplete={setVoiceNote}
                onClear={() => setVoiceNote("")}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => postReply({ voiceNoteUrl: voiceNote })}
                  disabled={sending || !voiceNote}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#8B2635] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? "Sealing…" : "Send voice reply"}
                </button>
                <button
                  type="button"
                  onClick={() => setComposing("idle")}
                  className="px-3 py-2 rounded-lg border border-[#E3D4B8] text-xs font-semibold text-[#7A6F62] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E3D4B8] bg-white p-3.5 space-y-2.5">
              <p className="text-xs font-serif italic text-[#7A6F62]">
                Say something back — one tap is enough.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {REACTIONS.map((reaction) => (
                  <button
                    key={reaction.kind}
                    type="button"
                    disabled={sending}
                    onClick={() => postReply({ reaction: reaction.kind })}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#E3D4B8] bg-[#FAF6F0] text-[11px] font-semibold text-[#4A3E37] hover:border-[#8B2635]/50 hover:text-[#8B2635] disabled:opacity-50 cursor-pointer"
                  >
                    <span aria-hidden>{reaction.emoji}</span>
                    {reaction.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setComposing("text")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3D4B8] text-[#3B271E] text-xs font-semibold cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Write a note
                </button>
                <button
                  type="button"
                  onClick={() => setComposing("voice")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#E3D4B8] text-[#3B271E] text-xs font-semibold cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" /> Voice note
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Make a Keepsake CTA */}
      <div className="mt-5 pt-5 border-t border-[#E3D4B8] text-center space-y-3">
        <p className="text-xs font-serif italic text-[#7A6F62] flex items-center justify-center gap-1.5">
          <Clock className="w-3 h-3" />
          Keep this link safe — it stays open for a week.
        </p>

        <Link
          href="/create"
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold text-white cursor-pointer shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #8B2635 0%, #721C28 100%)",
            boxShadow: "0 4px 16px rgba(139, 38, 53, 0.35)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Create a Birthday Surprise</span>
        </Link>
      </div>
    </div>
  );
}
