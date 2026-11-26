"use client";

import React, { useState } from "react";
import { GitBranch, Clock, User } from "lucide-react";
import { CopyButton } from "@/components/ui/copyButton";
import { sounds } from "@/lib/soundEffects";

interface TopologyNode {
  id: string;
  hash: string;
  branch: string;
  label: string;
  message: string;
  author: string;
  time: string;
  x: number;
  y: number;
  isHead?: boolean;
}

const topologyNodes: TopologyNode[] = [
  {
    id: "n1",
    hash: "a1a8d53",
    branch: "main",
    label: "INIT",
    message: "Initial commit with project scaffold",
    author: "Mantis <dev@gitlantern.dev>",
    time: "3 days ago",
    x: 245,
    y: 265,
  },
  {
    id: "n2",
    hash: "8f42e1a",
    branch: "main",
    label: "CORE",
    message: "feat: initialize git lantern core architecture",
    author: "Developer <dev@gitlantern.dev>",
    time: "1 day ago",
    x: 385,
    y: 128,
  },
  {
    id: "n3",
    hash: "3b91c0d",
    branch: "feature/payment-gate",
    label: "FEAT",
    message: "feat: add checkout webhook handler",
    author: "Developer <dev@gitlantern.dev>",
    time: "18 hours ago",
    x: 660,
    y: 242,
  },
  {
    id: "n4",
    hash: "d9ed7ec",
    branch: "feature/payment-gate",
    label: "FIX",
    message: "fix: validate session token null pointer",
    author: "Developer <dev@gitlantern.dev>",
    time: "4 hours ago",
    x: 505,
    y: 280,
  },
  {
    id: "n5",
    hash: "7f3b0ed",
    branch: "main",
    label: "GIT LANTERN",
    message: "feat: launch Git Lantern v1.0 public release",
    author: "Mantis <dev@gitlantern.dev>",
    time: "just now",
    x: 472,
    y: 235,
    isHead: true,
  },
  {
    id: "n6",
    hash: "c41b902",
    branch: "origin/main",
    label: "ORIGIN",
    message: "chore: sync remote production tag",
    author: "Mantis <dev@gitlantern.dev>",
    time: "2 hours ago",
    x: 838,
    y: 392,
  },
];

