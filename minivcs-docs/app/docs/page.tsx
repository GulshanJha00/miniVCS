"use client";

import { useState } from "react";
import Terminal from "@/components/Terminal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlowStep {
  text: string;
}

interface CommandCardProps {
  name: string;
  shortDesc: string;
  usage: string | string[];
  description: string;
  steps?: FlowStep[];
  output?: string;
  note?: string;
  fsTree?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CommandCard({
  name,
  shortDesc,
  usage,
  description,
  steps,
  output,
  note,
  fsTree,
}: CommandCardProps) {
  const [open, setOpen] = useState(false);
  const usageStr = Array.isArray(usage) ? usage.join("\n") : usage;

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden mb-3">
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-zinc-900 hover:bg-zinc-800/60 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-medium text-white">
            {name}
          </span>
          <span className="text-sm text-zinc-500">{shortDesc}</span>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 py-5 bg-zinc-950 border-t border-zinc-800 space-y-4">
          <Terminal>{usageStr}</Terminal>

          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>

          {fsTree && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
              <pre className="font-mono text-xs text-zinc-300 leading-7">
                {fsTree}
              </pre>
            </div>
          )}

          {steps && steps.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-3">
                Internal flow
              </p>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-lg overflow-hidden">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 px-4 py-3">
                    <span className="font-mono text-xs text-zinc-600 w-5 shrink-0 pt-px">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-zinc-400">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {output && (
            <Terminal>{output}</Terminal>
          )}

          {note && (
            <p className="text-xs text-zinc-600 italic border-l-2 border-zinc-800 pl-3">
              {note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <hr className="border-t border-zinc-800 my-16" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Docs() {
  return (
    <div className="max-w-3xl px-6 py-16 mx-auto font-sans">

      {/* ── Hero ── */}
      <section id="intro" className="pb-12 border-b border-zinc-800 mb-16">
        <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 mb-6">
          v0.1.0 · C++ · Distributed VCS
        </span>

        <h1 className="text-5xl font-semibold tracking-tight text-white mb-4 leading-tight">
          MiniVCS
        </h1>

        <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
          A lightweight snapshot-based distributed version control system
          written in modern C++. Demonstrates staging, commit snapshots, remote
          syncing, and repository reconstruction.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {["C++17", "AWS S3", "Node CLI", "Snapshot Model"].map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs text-zinc-500 border border-zinc-800 rounded-md px-2.5 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── TOC ── */}
      <nav className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 mb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-3">
          On this page
        </p>
        <div className="flex flex-col gap-1">
          {[
            { label: "Installation", href: "#install" },
            { label: "Commands", href: "#commands" },
            { label: "System design", href: "#design" },
            { label: "Architecture", href: "#architecture" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors py-0.5"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Install ── */}
      <section id="install" className="mb-16">
        <SectionLabel>Installation</SectionLabel>
        <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
          Get started
        </h2>

        <Terminal>{`npm install -g minivcs`}</Terminal>

        <p className="text-sm text-zinc-500 mt-3">
          Installs the global CLI wrapper that launches the compiled C++ binary.
          Requires Node.js and the AWS CLI configured with valid credentials.
        </p>
      </section>

      <Divider />

      {/* ── Commands ── */}
      <section id="commands" className="mb-16">
        <SectionLabel>Commands</SectionLabel>
        <h2 className="text-2xl font-semibold text-white mb-6 tracking-tight">
          Command reference
        </h2>

        <CommandCard
          name="minivcs init"
          shortDesc="Initialize a new repository"
          usage="minivcs init"
          description="Initializes repository metadata in the current directory. Creates the .miniVCS folder with all internal structure."
          fsTree={`.miniVCS/\n├── index/\n├── commits/\n├── object/\n└── config`}
          steps={[
            { text: "Check whether .miniVCS folder already exists" },
            { text: "Prompt user for username" },
            { text: "Create repository directory structure" },
            { text: "Write config file storing username" },
            { text: "Create ignore file template" },
          ]}
          note="Mirrors the structure of Git's .git directory which stores all repository metadata."
        />

        <CommandCard
          name="minivcs add"
          shortDesc="Stage files for commit"
          usage={["minivcs add file.cpp", "minivcs add src/", "minivcs add ."]}
          description="Stages files by copying them into the index directory. Uses a snapshot staging model — stores full file copies rather than hashes."
          steps={[
            { text: "Validate repository initialization" },
            { text: "Read ignore rules from .miniVCSignore" },
            { text: "If path is a directory, traverse recursively" },
            { text: "Skip .miniVCS internal directory" },
            { text: "Copy files preserving relative structure into .miniVCS/index" },
          ]}
          note="Behaves like Git's staging area but stores full file copies instead of content-addressed blobs."
        />

        <CommandCard
          name="minivcs commit"
          shortDesc="Create an immutable snapshot"
          usage={`minivcs commit "added auth module"`}
          description="Creates an immutable snapshot of all staged files and uploads it to AWS S3."
          steps={[
            { text: "Ensure staging index is not empty" },
            { text: "Generate timestamp-based commit ID" },
            { text: "Create commit folder and copy full snapshot from index" },
            { text: "Write metadata file with message and timestamp" },
            { text: "Upload commit to AWS S3" },
            { text: "Clear staging index" },
          ]}
          output={`Commit: commit_20260321_010203\nMessage: added auth module`}
          note="Currently uses full snapshot storage rather than delta compression."
        />

        <CommandCard
          name="minivcs checkout"
          shortDesc="Restore to a commit snapshot"
          usage="minivcs checkout commit_20260321_010203"
          description="Restores the working directory to a selected commit snapshot. Downloads history from S3 and reconstructs the workspace."
          steps={[
            { text: "Prevent checkout if staging area contains files" },
            { text: "Download commits from remote S3" },
            { text: "Delete current working files safely" },
            { text: "Recreate directory structure" },
            { text: "Copy snapshot files into working directory" },
          ]}
          note="Demonstrates repository reconstruction from remote history."
        />

        <CommandCard
          name="minivcs log"
          shortDesc="View commit history"
          usage="minivcs log"
          description="Syncs commit history from S3 and displays the timeline with messages and timestamps."
          steps={[
            { text: "Sync commits directory from S3" },
            { text: "Iterate through commit folders" },
            { text: "Read meta.txt files and extract messages" },
            { text: "Print commit timeline" },
          ]}
        />

        <CommandCard
          name="minivcs status"
          shortDesc="List staged files"
          usage="minivcs status"
          description="Traverses the index directory and prints relative paths of all currently staged files and snapshot candidates."
          steps={[
            { text: "Traverse index directory" },
            { text: "Print relative paths" },
            { text: "Show snapshot candidates" },
          ]}
        />

        <CommandCard
          name="minivcs clone"
          shortDesc="Clone a remote repository"
          usage="minivcs clone gulshan"
          description="Clones a remote repository by username into a new local folder, downloading all commits and checking out the latest snapshot."
          steps={[
            { text: "Create new project directory" },
            { text: "Initialize internal repository structure" },
            { text: "Download commits from S3" },
            { text: "Find latest commit lexicographically" },
            { text: "Perform automatic checkout" },
          ]}
        />
      </section>

      <Divider />

      {/* ── System Design ── */}
      <section id="design" className="mb-16">
        <SectionLabel>Internals</SectionLabel>
        <h2 className="text-2xl font-semibold text-white mb-6 tracking-tight">
          System design
        </h2>

        <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
          {[
            "Staging uses a full file copy snapshot model, not content-addressed hashing",
            "Commit IDs are timestamp-based, enabling lexicographic ordering",
            "Remote sync uses AWS CLI invocation from the C++ binary via shell",
            "Repository reconstruction deletes and restores workspace from commit snapshots",
            "Clone derives latest state from commit ordering without a branch pointer",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <span className="font-mono text-xs text-zinc-600 w-5 shrink-0 pt-px">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm text-zinc-400">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── Architecture ── */}
      <section id="architecture" className="mb-24">
        <SectionLabel>Architecture</SectionLabel>
        <h2 className="text-2xl font-semibold text-white mb-4 tracking-tight">
          How it fits together
        </h2>

        <p className="text-sm text-zinc-400 leading-relaxed mb-8">
          MiniVCS follows a lightweight distributed snapshot architecture. The
          CLI interacts with local filesystem metadata and synchronizes commit
          snapshots to AWS S3 for remote collaboration.
        </p>

        {/* Flow diagram */}
        <div className="grid grid-cols-5 gap-0 items-center mb-3">
          {[
            { title: "User", sub: "Runs CLI commands" },
            null,
            { title: "miniVCS CLI", sub: "Node wrapper · C++ binary" },
            null,
            { title: "Local repo", sub: ".miniVCS metadata" },
          ].map((node, i) =>
            node === null ? (
              <div key={i} className="text-center text-zinc-700 text-lg">
                →
              </div>
            ) : (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center"
              >
                <p className="text-sm font-medium text-white">{node.title}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-snug">
                  {node.sub}
                </p>
              </div>
            )
          )}
        </div>

        <div className="flex justify-center text-zinc-700 text-lg my-3">↓</div>

        <div className="flex justify-center mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center w-60">
            <p className="text-sm font-medium text-white">AWS S3 remote</p>
            <p className="text-xs text-zinc-500 mt-1">
              Stores commit snapshots for distribution
            </p>
          </div>
        </div>

        {/* Explanations */}
        <div className="space-y-4">
          {[
            {
              cmd: "commit",
              desc: "MiniVCS creates a full snapshot locally, then uploads it to S3 via the AWS CLI.",
            },
            {
              cmd: "checkout / log",
              desc: "Remote commit history is synced from S3 into the local commits directory, enabling reconstruction and timeline inspection.",
            },
            {
              cmd: "clone",
              desc: "A fresh local repository is created and the latest snapshot is restored by finding the most recent commit folder lexicographically.",
            },
          ].map(({ cmd, desc }) => (
            <div key={cmd} className="flex gap-4 text-sm text-zinc-400">
              <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 h-fit shrink-0 text-zinc-300 mt-0.5">
                {cmd}
              </span>
              <span className="leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}