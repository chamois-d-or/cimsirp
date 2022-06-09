import React from "react";
import Head from "next/head";
import Header from './Header';
import Footer from './Footer';
import type { FooterDocument } from "../types.generated";
import { MenuDocumentWithLinkedMenuTabs } from "../pages";

type Props = {
  children: JSX.Element[] | JSX.Element,
  menu: MenuDocumentWithLinkedMenuTabs | null,
  title: string | null,
  currentLocale: string | undefined,
  locales: string[] | undefined,
  footer: FooterDocument | null,
  alt_versions: Array<{
    id : string,
    type: string,
    lang : string
  }>
};

const Layout = ({ children, menu, title, footer, currentLocale, locales, alt_versions }: Props) => {
  return (
    <div>
      <Head>
        <title> {title ? title : "Prismic Ecommerce Demo"} </title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      { menu?.data ?
        <Header menu={menu} currentLocale={currentLocale} locales={locales} alt_versions={alt_versions}/>
        : <span/>
      }
      <main>{children}</main>
      { footer?.data ?
        <Footer footer={footer}/>
        : <span/>
      }
    </div>
  )
};

export default Layout;