import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { createClient } from "../../services/prismic/prismic";
import styles from "./styles.module.scss";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsPros {
  posts: Post[]
}

interface Page {
  results: []
}

export default function Posts({ posts }: PostsPros) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();
  const pages = await client.getAllByType("post");

  const posts: Post[] = pages.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });
  return {
    props: {
      posts
    },
  };
};
