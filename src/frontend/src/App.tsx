import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import BottomNav from "./components/BottomNav";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useTheme } from "./hooks/useTheme";
import AdvancedPage from "./pages/AdvancedPage";
import BookmarksPage from "./pages/BookmarksPage";
import DashboardPage from "./pages/DashboardPage";
import DictionaryPage from "./pages/DictionaryPage";
import GrammarDetailPage from "./pages/GrammarDetailPage";
import GrammarPage from "./pages/GrammarPage";
import LoginPage from "./pages/LoginPage";
import PronunciationPage from "./pages/PronunciationPage";
import QuizPage from "./pages/QuizPage";

function AuthLayout() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="mobile-container flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  return (
    <div className="mobile-container bg-background">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

function RootLayout() {
  useTheme();
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function LoginRouteComponent() {
    const { identity } = useInternetIdentity();
    if (identity) {
      throw redirect({ to: "/dashboard" });
    }
    return (
      <div className="mobile-container bg-background">
        <LoginPage />
      </div>
    );
  },
});

const authLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/dashboard",
  component: DashboardPage,
});

const dictionaryRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/dictionary",
  component: DictionaryPage,
});

const grammarRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/grammar",
  component: GrammarPage,
});

const grammarDetailRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/grammar/$id",
  component: GrammarDetailPage,
});

const pronunciationRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/pronunciation",
  component: PronunciationPage,
});

const quizRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/quiz",
  component: QuizPage,
});

const advancedRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/advanced",
  component: AdvancedPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/bookmarks",
  component: BookmarksPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authLayout.addChildren([
    dashboardRoute,
    dictionaryRoute,
    grammarRoute,
    grammarDetailRoute,
    pronunciationRoute,
    quizRoute,
    advancedRoute,
    bookmarksRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
