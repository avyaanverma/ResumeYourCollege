import { ProfileSection } from "../../components/sections/ProfileSection";

/**
 * Profile page wrapper.
 * Delegates all form logic to ProfileSection for consistency
 * with the new production-grade form architecture.
 */
export default function Profile() {
  return <ProfileSection />;
}
