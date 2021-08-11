export default async function getStaticProps({ params }: { params: { user: string } }) {
  return {
    props: JSON.parse(JSON.stringify({ user: params.user })),
    revalidate: 300,
    notFound: !params.user,
  };
}
