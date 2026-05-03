"use client";
import { useState } from "react";
import { X, Star, Lock } from "lucide-react";
import { createIdea } from "@/lib/actions/ideas";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AddIdeaModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [rating, setRating] = useState(3);
  const [priority, setPriority] = useState("medium");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-[6px] flex items-center justify-center p-4">
      <div className="bg-surface border border-primary/30 rounded-[16px] w-full max-w-[600px] shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-2xl font-light tracking-tight text-on-surface">Capture New Inspiration</h2>
          <button onClick={onClose} className="text-primary hover:text-primary-fixed transition-colors p-2 -mr-2 rounded-full hover:bg-primary/10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form action={async (formData) => {
          await createIdea(formData);
          onClose();
        }} className="p-6 overflow-y-auto flex flex-col gap-6">
          <input type="hidden" name="rating" value={rating} />
          <input type="hidden" name="priority" value={priority} />

          {/* Title Field */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Title</label>
            <input 
              name="title"
              required
              className="w-full bg-surface-container-lowest border border-primary/60 rounded-lg px-4 py-3 text-sm text-on-surface placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 shadow-[0_0_15px_rgba(201,168,76,0.15)] transition-all caret-primary" 
              placeholder="Enter a concise title..." 
              type="text" 
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Category</label>
            <select 
              name="category"
              className="w-full appearance-none bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="Design">Design System</option>
              <option value="Architecture">Architecture</option>
              <option value="Research">Research</option>
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Priority Radio */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Priority</label>
              <div className="flex gap-2 bg-surface-container-lowest p-1 rounded-lg border border-primary/10">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-md text-[12px] transition-all",
                      priority === p ? "bg-surface text-primary shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Rating</label>
              <div className="flex items-center h-full gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={cn("w-5 h-5", s <= rating ? "text-primary fill-primary" : "text-zinc-600")} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-on-surface-variant uppercase tracking-widest">Notes</label>
            <textarea 
              name="notes"
              className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg px-4 py-3 text-sm text-on-surface placeholder-zinc-600 focus:outline-none focus:border-primary/50 transition-colors resize-y min-h-[120px]" 
              placeholder="Expand upon your thoughts here..."
            />
          </div>

          {/* Footer Actions */}
          <div className="mt-4 flex flex-col gap-3">
            <button 
              type="submit"
              className="w-full py-4 rounded-lg gold-gradient text-surface font-semibold tracking-wide hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Store in Vault
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-transparent border border-transparent text-zinc-400 hover:text-on-surface hover:bg-surface-container transition-colors active:scale-[0.98]"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
