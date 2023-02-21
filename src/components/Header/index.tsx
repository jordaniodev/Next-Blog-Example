import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SingInButton";
import styles from "./styles.module.scss";
export function Header() {
  return (
    <header className={styles.content}>
      <div className={styles.container}>
        <ActiveLink href="/" activeClassName={styles.logo}>
          <img src="/images/logo.svg" alt="Ig.news" />
        </ActiveLink>
        <ActiveLink href="/" activeClassName={styles['short-logo']}>
          <img src="/images/short-logo.svg" alt="Ig.news" />
        </ActiveLink>
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" prefetch activeClassName={styles.active}>
            <a >Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
