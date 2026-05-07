import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-9xl flex-col gap-6">
        <Header />
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
