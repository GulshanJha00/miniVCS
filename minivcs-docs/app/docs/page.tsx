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

// ─── Icons ────────────────────────────────────────────────────────────────────

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function NpmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono text-sm font-semibold text-white">
            MiniVCS
          </span>
          <span className="font-mono text-xs text-zinc-600 border border-zinc-800 rounded-full px-2 py-0.5">
            v0.1.0
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <a
            href="https://www.npmjs.com/package/minivcs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-mono"
          >
            <NpmIcon className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden xs:inline">npm</span>
          </a>
          <a
            href="https://github.com/GulshanJha00/minivcs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-mono"
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Left */}
          <div>
            <p className="font-mono text-sm font-semibold text-white mb-1">
              MiniVCS
            </p>
            <p className="text-xs text-zinc-600">
              Built by{" "}
              <a
                href="https://github.com/GulshanJha00"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Gulshan Kumar
              </a>
              . MIT License.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.npmjs.com/package/minivcs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <NpmIcon className="w-3.5 h-3.5 text-red-500" />
              npm package
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
            <span className="text-zinc-800">·</span>
            <a
              href="https://github.com/GulshanJha00/minivcs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              Source code
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>

        <p className="text-xs text-zinc-700 mt-8">
          A lightweight snapshot-based distributed VCS written in modern C++.
        </p>
      </div>
    </footer>
  );
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
        className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-zinc-900 hover:bg-zinc-800/60 transition-colors text-left"
      >
        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 min-w-0 pr-3">
          <span className="font-mono text-sm font-medium text-white shrink-0">
            {name}
          </span>
          <span className="text-xs sm:text-sm text-zinc-500 truncate">{shortDesc}</span>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-600 transition-transform duration-200 shrink-0 ${
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
        <div className="px-4 sm:px-5 py-5 bg-zinc-950 border-t border-zinc-800 space-y-4">
          <Terminal>{usageStr}</Terminal>

          <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>

          {fsTree && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 overflow-x-auto">
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
                  <div key={i} className="flex items-start gap-3 sm:gap-4 px-3 sm:px-4 py-3">
                    <span className="font-mono text-xs text-zinc-600 w-5 shrink-0 pt-px">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-zinc-400">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {output && <Terminal>{output}</Terminal>}

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
  return <hr className="border-t border-zinc-800 my-12 sm:my-16" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Docs() {
  return (
    <>
      <Navbar />

      <div className="max-w-3xl px-4 sm:px-6 py-10 sm:py-16 mx-auto font-sans">

        {/* ── Hero ── */}
        <section id="intro" className="pb-10 sm:pb-12 border-b border-zinc-800 mb-10 sm:mb-16">
          <span className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 border border-zinc-800 rounded-full px-3 py-1 mb-5 sm:mb-6">
            v0.1.0 · C++ · Distributed VCS
          </span>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            MiniVCS
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl">
            A lightweight snapshot-based distributed version control system
            written in modern C++. Demonstrates staging, commit snapshots, remote
            syncing, and repository reconstruction.
          </p>

          <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
            {["C++17", "AWS S3", "Node CLI", "Snapshot Model"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-zinc-500 border border-zinc-800 rounded-md px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
            <a
              href="https://github.com/GulshanJha00/minivcs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              View on GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/minivcs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <NpmIcon className="w-4 h-4 text-red-500" />
              npm package
            </a>
          </div>
        </section>

        {/* ── TOC ── */}
        <nav className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-5 py-4 mb-10 sm:mb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-600 mb-3">
            On this page
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-col gap-1">
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
        <section id="install" className="mb-10 sm:mb-16">
          <SectionLabel>Installation</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">
            Get started
          </h2>

          <Terminal>{`npm install -g minivcs`}</Terminal>

          <p className="text-sm text-zinc-500 mt-3">
            Installs the global CLI wrapper that launches the compiled C++ binary.
            Requires Node.js and the AWS CLI configured with valid credentials.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="https://www.npmjs.com/package/minivcs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <NpmIcon className="w-3.5 h-3.5 text-red-500" />
              npmjs.com/package/minivcs
              <ExternalLinkIcon className="w-3 h-3" />
            </a>
          </div>
        </section>

        <Divider />

        {/* ── Commands ── */}
        <section id="commands" className="mb-10 sm:mb-16">
          <SectionLabel>Commands</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-5 sm:mb-6 tracking-tight">
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
        <section id="design" className="mb-10 sm:mb-16">
          <SectionLabel>Internals</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-5 sm:mb-6 tracking-tight">
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
              <div key={i} className="flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-4">
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
        <section id="architecture" className="mb-16 sm:mb-24">
          <SectionLabel>Architecture</SectionLabel>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 tracking-tight">
            How it fits together
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed mb-6 sm:mb-8">
            MiniVCS follows a lightweight distributed snapshot architecture. The
            CLI interacts with local filesystem metadata and synchronizes commit
            snapshots to AWS S3 for remote collaboration.
          </p>

          {/* Flow diagram — vertical stack on mobile, horizontal on desktop */}
          <div className="hidden sm:grid grid-cols-5 gap-0 items-center mb-3">
            {[
              { title: "User", sub: "Runs CLI commands" },
              null,
              { title: "miniVCS CLI", sub: "Node wrapper · C++ binary" },
              null,
              { title: "Local repo", sub: ".miniVCS metadata" },
            ].map((node, i) =>
              node === null ? (
                <div key={i} className="text-center text-zinc-700 text-lg">→</div>
              ) : (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white">{node.title}</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">{node.sub}</p>
                </div>
              )
            )}
          </div>

          {/* Mobile architecture diagram */}
          <div className="flex flex-col items-center gap-1 sm:hidden mb-3">
            {[
              { title: "User", sub: "Runs CLI commands" },
              { title: "miniVCS CLI", sub: "Node wrapper · C++ binary" },
              { title: "Local repo", sub: ".miniVCS metadata" },
            ].map((node, i, arr) => (
              <div key={i} className="w-full flex flex-col items-center">
                <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm font-medium text-white">{node.title}</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-snug">{node.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="text-zinc-700 text-lg py-1">↓</div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center text-zinc-700 text-lg my-3">↓</div>

          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center w-full sm:w-60">
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
              <div key={cmd} className="flex gap-3 sm:gap-4 text-sm text-zinc-400">
                <span className="font-mono text-xs bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 h-fit shrink-0 text-zinc-300 mt-0.5">
                  {cmd}
                </span>
                <span className="leading-relaxed">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Author card ── */}
        <div className="border border-zinc-800 rounded-xl px-4 sm:px-5 py-5 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-semibold text-zinc-300">
              GK
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Gulshan Kumar</p>
            <p className="text-xs text-zinc-500 mt-0.5">Author · MiniVCS</p>
          </div>
          <a
            href="https://github.com/GulshanJha00"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-800 rounded-lg px-3 py-1.5 hover:bg-zinc-800 transition-colors shrink-0"
          >
            <GitHubIcon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">GitHub</span>
          </a>
        </div>

      </div>

      <Footer />
    </>
  );
}