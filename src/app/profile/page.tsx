import ProfileContent from "../../components/ProfileContent";

export type ProfilePageProps = {
  searchParams: Promise<{ guest?: string }>;
};

// Thin server shell: `searchParams` can only be read here (a Server
// Component), but the actual guest/logged-in decision also needs the
// client-side AuthProvider state (see ProfileContent's own comment) --
// so this just resolves the `?guest=1` override and hands it down.
export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const forceGuest = (await searchParams).guest === "1";
  return <ProfileContent forceGuest={forceGuest} />;
}
