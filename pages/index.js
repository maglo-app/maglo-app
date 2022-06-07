import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import Layout from "../components/layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>
          Front page
        </title>
      </Head>
      <div>
        <h1>Maglo-app</h1>
        <p>Hi from Tobias</p>
        <p>Hello Right back. Just testing gitpull</p>
      </div>
    </Layout>
  );
}
