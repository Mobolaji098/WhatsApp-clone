import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold text-blue-500 mb-1"> Flow Chat </h1>
      <p className="mb-10"> Cool Chat App</p>
      <Button as={Link} href = '/chat'> Start chatting </Button>
    </div>
  );
}
