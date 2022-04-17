import Head from 'next/head'

function Meta({ title, keywords, description }) {
  return (
    <Head>
        <meta name="description" content={description} />
        <meta name='keywords' content={keywords} />
        <meta charSet='utf-8' />
        <link rel="icon" href="/favicon.png" />
        <title>{title}</title>
    </Head>  
  )
}

Meta.defaultProps = { 
    title: 'Ecuries de Persévère', 
    keywords: 'équitation, chevaux, écurie, karine massot', 
    description: 'Les écuries de Persévère, gérées par Karine Massot'
}

export default Meta