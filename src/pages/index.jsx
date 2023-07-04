import Head from "next/head";
import Todo from "./todos";
export default function PagesIndex(props) {
  const domain = process.env.DOMAIN_SEO;

  return (
    <>
      <Head>
        <title>Todo lists</title>
        <meta
          name="description"
          content="Show to you all action which are in your plan and you can check and modify them!"
        />
        <meta property="og:title" content="Add item to your site" />
        <meta property="og:description" content="The todo item include title" />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />
      </Head>
      <Todo />
    </>
  );
}
