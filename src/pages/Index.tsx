
import { AuthPage } from "@/components/AuthPage";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Header />
      <main className="flex-1">
        <AuthPage />
      </main>
      <Footer />
    </>
  );
};

export default Index;
