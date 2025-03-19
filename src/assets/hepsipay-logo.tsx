import React from 'react';

export default function HepsipayLogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="60" rx="8" fill="#0066FF" />
      <path d="M40 15H50V45H40V15Z" fill="white" />
      <path d="M55 15H65V30H80V15H90V45H80V35H65V45H55V15Z" fill="white" />
      <path d="M95 15H120V20H105V25H115V30H105V40H120V45H95V15Z" fill="white" />
      <path d="M125 15H135V35H150V45H125V15Z" fill="white" />
      <path d="M155 15H165V45H155V15Z" fill="white" />
      <path d="M170 15H180V25L190 15H200L185 30L200 45H190L180 35V45H170V15Z" fill="white" />
    </svg>
  );
} 