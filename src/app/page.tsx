import dynamic from "next/dynamic";

const Notifications = dynamic(() => import("@/app/_components/Notification"), {
  ssr: false, // Make sure to render component client side to access window and Notification APIs
});

export default function Home() {
  return (
    <main className="flex-col w-full flex items-center min-h-screen p-20">
      <Notifications />
    </main>
  );
}
