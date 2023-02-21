import { signIn, signOut, useSession } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";


export function SignInButton() {
  const {data} = useSession();
  return data ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub color="#84d361" />
      <span className={styles.textLabel}>{data.user.name}</span>
      <FiX color="#737388" className={styles.closeIcon} onClick={() => signOut()} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
      <FaGithub color="#eba417" />
      <span className={styles.textLabel}>Sign in with github</span> 
    </button>
  );
}
